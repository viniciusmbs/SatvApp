import express from 'express';
import path from 'path';
import zlib from 'zlib';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Anti-cache headers so preview always reflects the latest code immediately
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  // Basic health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Proxy & de-sandbox endpoint for Web Embed players (e.g. EmbedTV, RDSE, RDCanais)
  app.get('/api/embed-frame', async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
      res.status(400).send('Missing "url" query parameter');
      return;
    }

    try {
      // 1. Fetch initial upstream page
      const upstream = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept':
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Referer': targetUrl,
        },
      });

      if (!upstream.ok) {
        res.status(upstream.status).send(`Failed to fetch upstream embed: ${upstream.statusText}`);
        return;
      }

      let html = await upstream.text();
      let currentOrigin = new URL(targetUrl).origin;

      // 2. If the page is a container iframe wrapper (like in rdcanais or v1.rdse.buzz),
      // resolve directly to the real player frame so we have direct access to <video> and player controls
      const iframeMatch = html.match(/<iframe[^>]*src="([^"]+)"/i);
      if (iframeMatch && iframeMatch[1] && !iframeMatch[1].startsWith('about:')) {
        const rawInner = iframeMatch[1].replace(/&amp;/g, '&');
        try {
          const innerUrl = new URL(rawInner, targetUrl).toString();
          const innerUpstream = await fetch(innerUrl, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              'Referer': targetUrl,
            },
          });
          if (innerUpstream.ok) {
            const innerHtml = await innerUpstream.text();
            if (
              innerHtml.includes('<video') ||
              innerHtml.includes('Clappr') ||
              innerHtml.includes('player') ||
              innerHtml.includes('jwplayer')
            ) {
              html = innerHtml;
              currentOrigin = new URL(innerUrl).origin;
            }
          }
        } catch {
          // fallback to base html
        }
      }

      // 3. Strip ad popups, popunders (aclib, runPop) that cause white screens
      html = html.replace(/<script[^>]*src="[^"]*acscdn\.com[^"]*"[^>]*><\/script>/gi, '');
      html = html.replace(/<script[^>]*src="[^"]*adcash[^"]*"[^>]*><\/script>/gi, '');
      html = html.replace(/<script[^>]*src="[^"]*popads[^"]*"[^>]*><\/script>/gi, '');
      html = html.replace(/aclib\s*\.\s*runPop\s*\([^)]*\);?/gi, '');

      // 4. Neutralize all sandbox checking routines in upstream scripts
      html = html.replace(
        /function\s+detectSandbox\s*\([^)]*\{[\s\S]*?\}/gi,
        'function detectSandbox() { return false; }'
      );
      html = html.replace(/if\s*\(\s*detectSandbox\s*\(\s*\)\s*\)/gi, 'if (false)');
      html = html.replace(
        /function\s+sbChecker\s*\([^)]*\{[\s\S]*?\}/gi,
        'function sbChecker() { return false; }'
      );
      html = html.replace(/if\s*\(\s*sbChecker\s*\(\s*\)\s*\)/gi, 'if (false)');

      // 5. Inject auto-play enforcer, black background & hardware acceleration
      const injectedTags = `
        <base href="${currentOrigin}/">
        <style>
          html, body {
            background-color: #000000 !important;
            color: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            overflow: hidden !important;
          }
          video, .player_screen, #video, .player, [class*="player"] {
            background-color: #000000 !important;
            transform: translateZ(0) !important;
            -webkit-transform: translateZ(0) !important;
            -webkit-backface-visibility: hidden !important;
            backface-visibility: hidden !important;
          }
          #sandbox_detect, .sandbox-banner, [id*="sandbox"], #sb-message, div[class*="popup"], div[id*="popup"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            width: 0 !important;
            height: 0 !important;
          }
        </style>
        <script>
          // Neutralize sandbox check globals
          window.detectSandbox = function() { return false; };
          window.sbChecker = function() { return false; };
          window.open = function() { return null; }; // block ad popunders
          try {
            Object.defineProperty(window, 'detectSandbox', { value: function() { return false; }, writable: false });
            Object.defineProperty(window, 'sbChecker', { value: function() { return false; }, writable: false });
          } catch (e) {}

          // Auto-play trigger: continuously monitor and start video playback
          (function() {
            var attemptCount = 0;
            var maxAttempts = 60; // Try for up to 30 seconds
            var playInterval = setInterval(function() {
              attemptCount++;
              if (attemptCount > maxAttempts) {
                clearInterval(playInterval);
                return;
              }

              // 1. Click center play button or play-pause button if present
              var playSelectors = [
                '#center-play-btn',
                '.center-play-btn',
                '[aria-label="Play"]',
                '.play-btn',
                '.vjs-big-play-button',
                '.jw-display-icon-container',
                '.jw-icon-playback',
                '.jw-preview',
                '.player-poster',
                '#play-button',
                '#play',
                '.btn-play',
                '.vjs-play-control'
              ];
              for (var s = 0; s < playSelectors.length; s++) {
                var btn = document.querySelector(playSelectors[s]);
                if (btn && btn.offsetParent !== null) {
                  try { btn.click(); } catch(e) {}
                }
              }

              // 2. Trigger Clappr / JWPlayer if available
              if (window.jwplayer && typeof window.jwplayer === 'function') {
                try {
                  var jwp = window.jwplayer();
                  if (jwp && typeof jwp.play === 'function' && jwp.getState && jwp.getState() !== 'playing') {
                    jwp.play();
                  }
                } catch(e) {}
              }
              if (window.player && typeof window.player.play === 'function') {
                try { window.player.play(); } catch(e) {}
              }

              // 3. Play all video elements directly with hardware acceleration
              var videos = document.querySelectorAll('video');
              var anyPlaying = false;
              for (var i = 0; i < videos.length; i++) {
                var v = videos[i];
                v.style.backgroundColor = '#000000';
                v.style.transform = 'translateZ(0)';
                if (!v.paused && v.currentTime > 0) {
                  anyPlaying = true;
                  continue;
                }
                try {
                  v.muted = false; // prioritize sound
                  var p = v.play();
                  if (p && typeof p.catch === 'function') {
                    p.catch(function() {
                      // If browser requires user interaction for unmuted autoplay, play muted first then unmute
                      v.muted = true;
                      v.play().then(function() {
                        setTimeout(function() { v.muted = false; }, 300);
                      }).catch(function(){});
                    });
                  }
                } catch(e) {}
              }

              if (anyPlaying) {
                // Keep polling at slower interval to catch video pausing
              }
            }, 500);

            // Also trigger play on the very first user interaction anywhere in the window
            ['click', 'keydown', 'touchstart'].forEach(function(evt) {
              window.addEventListener(evt, function() {
                var videos = document.querySelectorAll('video');
                for (var i = 0; i < videos.length; i++) {
                  videos[i].muted = false;
                  videos[i].play().catch(function(){});
                }
              }, { once: true });
            });
          })();
        </script>
      `;

      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>${injectedTags}`);
      } else {
        html = injectedTags + html;
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.removeHeader('X-Frame-Options');
      res.removeHeader('Content-Security-Policy');
      res.send(html);
    } catch (err: any) {
      res.status(502).send('Error loading embed frame: ' + (err.message || String(err)));
    }
  });

  // Stream proxy endpoint to bypass CORS and mixed-content restrictions
  app.get('/api/stream', async (req, res) => {
    const streamUrl = req.query.url as string;
    if (!streamUrl) {
      res.status(400).json({ error: 'Missing "url" query parameter' });
      return;
    }

    try {
      const response = await fetch(streamUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
        },
      });

      if (!response.ok) {
        res.status(response.status).json({ error: `Upstream error: ${response.statusText}` });
        return;
      }

      // Forward relevant headers
      response.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(lowerKey)) {
          res.setHeader(key, value);
        }
      });

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');

      if (!response.body) {
        res.end();
        return;
      }

      const reader = response.body.getReader();
      req.on('close', () => {
        reader.cancel().catch(() => {});
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } catch (err: any) {
      if (!res.headersSent) {
        res.status(502).json({ error: err.message || 'Error connecting to upstream stream' });
      }
    }
  });

  // Proxy for M3U playlists
  app.get('/api/proxy-playlist', async (req, res) => {
    const playlistUrl = req.query.url as string;
    if (!playlistUrl) {
      res.status(400).json({ error: 'Missing "url" query parameter' });
      return;
    }

    try {
      const response = await fetch(playlistUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
        },
      });

      if (!response.ok) {
        res.status(response.status).json({ error: `Upstream error: ${response.statusText}` });
        return;
      }

      const content = await response.text();
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(content);
    } catch (err: any) {
      res.status(502).json({ error: err.message || 'Error fetching playlist' });
    }
  });

  // Aggregated High-Performance EPG Cache & Endpoint
  interface EpgProgrammeItem {
    start: number;
    stop: number;
    title: string;
    desc: string;
    category: string;
  }
  let epgCacheData: { programmes: Record<string, EpgProgrammeItem[]>; timestamp: number; count: number } | null = null;
  let isFetchingEpg = false;

  const parseXmltvTime = (str: string): number => {
    try {
      const clean = str.trim();
      const year = parseInt(clean.slice(0, 4), 10);
      const month = parseInt(clean.slice(4, 6), 10) - 1;
      const day = parseInt(clean.slice(6, 8), 10);
      const hour = parseInt(clean.slice(8, 10), 10);
      const min = parseInt(clean.slice(10, 12), 10);
      const sec = parseInt(clean.slice(12, 14), 10) || 0;
      let offsetMinutes = -180; // default UTC-3 for Brazil
      const match = clean.match(/([+-])(\d{2})(\d{2})$/);
      if (match) {
        const sign = match[1] === '+' ? 1 : -1;
        offsetMinutes = sign * (parseInt(match[2], 10) * 60 + parseInt(match[3], 10));
      }
      return Date.UTC(year, month, day, hour, min, sec) - offsetMinutes * 60 * 1000;
    } catch {
      return 0;
    }
  };

  const fetchAndParseEpgXml = async (customUrl?: string) => {
    const now = Date.now();
    const minTime = now - 6 * 60 * 60 * 1000;
    const maxTime = now + 36 * 60 * 60 * 1000;
    const programmes: Record<string, EpgProgrammeItem[]> = {};
    let totalCount = 0;

    const sources = customUrl
      ? [customUrl]
      : [
          'https://epgshare01.online/epgshare01/epg_ripper_BR1.xml.gz',
          'https://epgshare01.online/epgshare01/epg_ripper_BR2.xml.gz',
          'https://epg.lat/files/br.xml.gz',
          'https://www.open-epg.com/files/brazil1.xml.gz',
        ];

    const normalizeKey = (name: string): string[] => {
      if (!name) return [];
      const keys = new Set<string>();
      const upper = name.toUpperCase().trim();
      keys.add(upper);

      const cleaned = upper
        .replace(/^(SÃO[\. ]*PAULO\/SP|BELO[\. ]*HORIZONTE\/MG|RIO[\. ]*DE[\. ]*JANEIRO\/RJ)[\. ]*/i, '')
        .replace(/[\. ]+BR$/i, '')
        .replace(/\.BR$/i, '')
        .replace(/[\. ]+/g, ' ')
        .trim();

      if (cleaned) {
        keys.add(cleaned);
        const withoutHd = cleaned
          .replace(/\s+(HD|FHD|4K|SD|\u00B2|\u00B3|\u00B9|[0-9]\s*\u00B3)\s*$/i, '')
          .trim();
        if (withoutHd) keys.add(withoutHd);
      }
      return Array.from(keys);
    };

    for (const sourceUrl of sources) {
      try {
        const res = await fetch(sourceUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          signal: AbortSignal.timeout(16000),
        });
        if (!res.ok) continue;

        let xmlText = '';
        const rawBuf = Buffer.from(await res.arrayBuffer());

        // Check gzip magic bytes: 0x1f 0x8b
        if (rawBuf.length >= 2 && rawBuf[0] === 0x1f && rawBuf[1] === 0x8b) {
          try {
            xmlText = zlib.gunzipSync(rawBuf).toString('utf8');
          } catch {
            try {
              xmlText = zlib.inflateSync(rawBuf).toString('utf8');
            } catch {
              xmlText = rawBuf.toString('utf8');
            }
          }
        } else {
          // Stream was already uncompressed by fetch (due to content-encoding: gzip) or is plain XML
          xmlText = rawBuf.toString('utf8');
        }

        // Map channel IDs to display names if present
        const chDisplayMap = new Map<string, string>();
        const chRegex = /<channel id="([^"]+)">([\s\S]*?)<\/channel>/g;
        let cm;
        while ((cm = chRegex.exec(xmlText)) !== null) {
          const chId = cm[1];
          const chBody = cm[2];
          const dnMatch = chBody.match(/<display-name[^>]*>([^<]+)<\/display-name>/);
          if (dnMatch) {
            chDisplayMap.set(chId, dnMatch[1].trim());
          }
        }

        const progRegex = /<programme\s+([^>]+)>([\s\S]*?)<\/programme>/g;
        let m;
        while ((m = progRegex.exec(xmlText)) !== null) {
          const attrs = m[1];
          const inner = m[2];
          const chM = attrs.match(/channel="([^"]+)"/);
          const startM = attrs.match(/start="([^"]+)"/);
          const stopM = attrs.match(/stop="([^"]+)"/);
          if (!chM || !startM || !stopM) continue;

          let startMs = parseXmltvTime(startM[1]);
          let stopMs = parseXmltvTime(stopM[1]);
          if (startMs === 0 || stopMs === 0) continue;

          // Only keep schedules within the active window (no fake past projections)
          if (stopMs < minTime || startMs > maxTime) continue;

          const rawChId = chM[1];
          const dispName = chDisplayMap.get(rawChId) || rawChId;

          const titleM = inner.match(/<title[^>]*>([\s\S]*?)<\/title>/);
          const descM = inner.match(/<desc[^>]*>([\s\S]*?)<\/desc>/);
          const catM = inner.match(/<category[^>]*>([\s\S]*?)<\/category>/);

          const title = titleM
            ? titleM[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()
            : '';
          const desc = descM
            ? descM[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()
            : '';
          const category = catM ? catM[1].trim() : '';

          const progItem: EpgProgrammeItem = {
            start: startMs,
            stop: stopMs,
            title,
            desc,
            category,
          };

          const keyVariants = new Set<string>();
          for (const k of normalizeKey(rawChId)) keyVariants.add(k);
          for (const k of normalizeKey(dispName)) keyVariants.add(k);

          // Regional channel aliases for playlist.ts
          if (keyVariants.has('GLOBO') || keyVariants.has('GLOBO HD')) {
            keyVariants.add('GLOBO SP');
            keyVariants.add('GLOBO RJ');
            keyVariants.add('GLOBO MG');
            keyVariants.add('GLOBO ES');
            keyVariants.add('INTEGRAÇÃO JUIZ DE FORA');
            keyVariants.add('TV INTEGRAÇÃO');
          }
          if (keyVariants.has('RECORD') || keyVariants.has('RECORD TV') || keyVariants.has('RECORD HD')) {
            keyVariants.add('RECORD MG');
            keyVariants.add('RECORD TV');
            keyVariants.add('RECORD');
          }
          if (keyVariants.has('SBT') || keyVariants.has('SBT HD')) {
            keyVariants.add('SBT MG ALTEROSA');
            keyVariants.add('SBT ALTEROSA');
            keyVariants.add('SBT');
          }
          if (keyVariants.has('BAND') || keyVariants.has('BAND HD')) {
            keyVariants.add('BAND SP');
            keyVariants.add('BAND');
          }
          if (keyVariants.has('AGROMAIS') || keyVariants.has('AGRO MAIS')) {
            keyVariants.add('AGRO+');
          }
          if (keyVariants.has('ARTE 1') || keyVariants.has('ARTE 1 HD')) {
            keyVariants.add('ART 1');
          }
          if (keyVariants.has('SPORTV') || keyVariants.has('SPORTV HD')) {
            keyVariants.add('SPORTTV');
          }
          if (Array.from(keyVariants).some((k) => k.includes('PARAMOUNT'))) {
            keyVariants.add('PARAMOUNT');
            keyVariants.add('PARAMOUNT NETWORK');
          }

          for (const k of keyVariants) {
            if (!k) continue;
            if (!programmes[k]) programmes[k] = [];
            programmes[k].push(progItem);
          }
          totalCount++;
        }
      } catch (err: any) {
        console.warn(`[EPG] Error processing source ${sourceUrl}:`, err.message);
      }
    }

    // Deduplicate, prefer entries with rich descriptions, and sort chronologically
    for (const k of Object.keys(programmes)) {
      const unique = new Map<string, EpgProgrammeItem>();
      for (const p of programmes[k]) {
        const key = `${p.start}-${p.stop}-${p.title}`;
        if (!unique.has(key)) {
          unique.set(key, p);
        } else {
          // If existing entry had empty or short description, and new entry has rich description, keep the rich one
          const existing = unique.get(key)!;
          if ((!existing.desc || existing.desc.length < 15) && (p.desc && p.desc.length >= 15)) {
            unique.set(key, p);
          }
        }
      }
      programmes[k] = Array.from(unique.values()).sort((a, b) => a.start - b.start);
    }

    return { programmes, timestamp: now, count: totalCount };
  };

  app.get('/api/epg', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    const customUrl = req.query.url as string | undefined;

    if (customUrl) {
      try {
        const result = await fetchAndParseEpgXml(customUrl);
        res.json(result);
        return;
      } catch (err: any) {
        res.status(502).json({ error: err.message || 'Failed to fetch custom EPG URL' });
        return;
      }
    }

    const now = Date.now();
    if (epgCacheData && epgCacheData.count > 0 && now - epgCacheData.timestamp < 30 * 60 * 1000) {
      res.setHeader('Cache-Control', 'public, max-age=1800');
      res.json(epgCacheData);
      return;
    }

    if (isFetchingEpg && epgCacheData) {
      res.json(epgCacheData);
      return;
    }

    isFetchingEpg = true;
    try {
      const fresh = await fetchAndParseEpgXml();
      if (fresh.count > 0 || !epgCacheData) {
        epgCacheData = fresh;
      }
      res.setHeader('Cache-Control', 'public, max-age=1800');
      res.json(epgCacheData);
    } catch (err: any) {
      if (epgCacheData) {
        res.json(epgCacheData);
      } else {
        res.status(500).json({ error: err.message || 'Failed to generate EPG' });
      }
    } finally {
      isFetchingEpg = false;
    }
  });

  // Serve static assets from public directory (e.g. clicksan.mp3, BotaoRadio.mp3)
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Vite middleware for development vs static for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();