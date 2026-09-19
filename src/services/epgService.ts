/**
 * EPG (Electronic Program Guide) Parser & Service
 * Integrates with BrazilTVEPG (claro.xml / epg.xml)
 * Parses XMLTV format into live programs with current progress and upcoming schedule.
 */

import { ChannelEpg, EpgProgram } from '../types';

// Normalized channel aliases mapping playlist names to BrazilTVEPG XML IDs
const EPG_CHANNEL_ALIASES: Record<string, string[]> = {
  // DOCUMENTÁRIOS
  'ANIMAL PLANET': ['ANIMAL PLANET HD', 'Animal Planet', 'ANIMAL PLANET'],
  'AGRO+': ['AGROMAIS', 'AgroMais', 'Agro+', 'AGRO+'],
  'ARTE 1': ['ARTE 1 HD', 'Arte 1', 'ARTE 1', 'ARTE.1.BR'],
  'CANAL RURAL': ['CANAL RURAL', 'Canal Rural'],
  'CANAL DO BOI': ['CANAL DO BOI', 'Canal do Boi'],
  'CURTA!': ['CURTA! HD', 'CURTA!', 'CURTA HD', 'CURTA', 'Curta'],
  'CURTA': ['CURTA! HD', 'CURTA!', 'CURTA HD', 'CURTA', 'Curta'],
  'DISCOVERY CHANNEL': ['DISCOVERY HD', 'Discovery Channel', 'Discovery', 'DISCOVERY.CHANNEL.HD.BR'],
  'DISCOVERY': ['DISCOVERY HD', 'Discovery Channel', 'DISCOVERY'],
  'DISCOVERY H&H': ['DISCOVERY HOME & HEALTH', 'DISCOVERY HOME&HEALTH HD', 'Discovery Home & Health', 'Discovery H&H', 'DISCOVERY.HOME.&AMP;.HEALTH.BR'],
  'DISCOVERY SCIENCE': ['DISCOVERY SCIENCE HD', 'Discovery Science', 'DISCOVERY.SCIENCE.BR'],
  'DISCOVERY THEATER': ['DISCOVERY THEATER HD', 'Discovery Theater'],
  'DISCOVERY TURBO': ['DISCOVERY TURBO HD', 'Discovery Turbo', 'DISCOVERY.TURBO.HD.BR'],
  'DISCOVERY WORLD': ['DISCOVERY WORLD HD', 'Discovery World'],
  'DOG TV': ['DOG TV', 'Dog TV', 'DOGTV'],
  'FISH TV': ['FISH TV', 'Fish TV', 'FISHTV'],
  'FOOD NETWORK': ['FOOD NETWORK HD', 'Food Network', 'FOOD.NETWORK.HD.BR'],
  'HGTV': ['HGTV HD', 'HGTV', 'HGTV.HD.BR'],
  'HISTORY 2': ['HISTORY 2 HD', 'History 2', 'HISTORY 2', 'HISTORY2'],
  'HISTORY CHANNEL': ['HISTORY HD', 'History', 'History Channel', 'HISTORY.CHANNEL.HD.BR'],
  'INVESTIGAÇÃO DISCOVERY': ['INVESTIGACAO DISCOVERY HD', 'INVESTIGAÇÃO DISCOVERY HD', 'Investigacao Discovery', 'INVESTIGACAO DISCOVERY', 'DISCOVERY TURBO HD', 'DISCOVERY HD', 'AXN'],
  'LOVE NATURE': ['LOVE NATURE HD', 'Love Nature'],
  'NATGEO WILD': ['NAT GEO WILD HD', 'NatGeo Wild', 'NATIONAL GEOGRAPHIC', 'NATGEO'],
  'NATIONAL GEOGRAPHIC': ['NATIONAL GEOGRAPHIC HD', 'NatGeo', 'National Geographic', 'NAT GEO'],
  'NHK': ['NHK World-Japan', 'NHK'],
  'RED BULL TV': ['RED BULL TV', 'Red Bull TV'],
  'TLC': ['TLC HD', 'TLC', 'TLC.HD.³.BR'],
  'TRAVEL BOX BRASIL': ['TRAVEL BOX BRASIL HD', 'Travel Box Brasil', 'TRAVEL.BOX.BRAZIL.HD.BR'],

  // ESPORTES
  'BAND SPORTS': ['BAND SPORTS HD', 'BandSports', 'Band Sports', 'BAND.SPORTS.BR', 'BANDSPORTS HD'],
  'COMBATE': ['COMBATE HD', 'Combate', 'COMBATE.HD.BR'],
  'DAZN': ['BAND SPORTS HD', 'ESPN', 'SPORTV', 'DAZN', 'DAZN 1'],
  'DAZN 2': ['BAND SPORTS HD', 'ESPN 2', 'SPORTV 2', 'DAZN 2'],
  'DAZN 3': ['ESPN 3', 'SPORTV 3', 'BAND SPORTS HD', 'DAZN 3'],
  'DAZN 4': ['ESPN 4', 'SPORTV', 'BAND SPORTS HD', 'DAZN 4'],
  'ESPN': ['ESPN', 'ESPN HD', 'ESPN Brasil', 'ESPN.BR'],
  'ESPN 2': ['ESPN 2', 'ESPN 2 HD', 'ESPN.2.BR'],
  'ESPN 3': ['ESPN 3', 'ESPN 3 HD', 'ESPN.3.BR'],
  'ESPN 4': ['ESPN 4', 'ESPN 4 HD', 'ESPN Extra', 'ESPN.4.BR', 'FOX SPORTS'],
  'ESPN 5': ['ESPN 5', 'ESPN 5 HD', 'ESPN.5.BR'],
  'ESPN 6': ['ESPN 6', 'ESPN 6 HD', 'ESPN.6.BR'],
  'ESPN BR': ['ESPN', 'ESPN HD', 'ESPN Brasil'],
  'FOX SPORTS': ['ESPN 4', 'ESPN 4 HD', 'ESPN 2', 'BAND SPORTS HD'],
  'FOX SPORTS 2': ['ESPN 5', 'ESPN 5 HD', 'ESPN 3', 'SPORTV 2'],
  'PREMIERE': ['PREMIERE CLUBES HD', 'PREMIERE HD', 'Premiere', 'premiere', 'PREMIERE.CLUBES.HD.BR'],
  'PREMIERE 2': ['PREMIERE 2 HD', 'Premiere 2', 'PREMIERE.2.HD.BR', 'PREMIERE 2'],
  'PREMIERE 3': ['PREMIERE 3 HD', 'Premiere 3', 'PREMIERE.3.HD.BR', 'PREMIERE 3'],
  'PREMIERE 4': ['PREMIERE 4 HD', 'Premiere 4', 'PREMIERE.4.HD.BR', 'PREMIERE 4'],
  'PREMIERE 5': ['PREMIERE 5 HD', 'Premiere 5', 'PREMIERE.5.HD.BR', 'PREMIERE 5'],
  'PREMIERE 6': ['PREMIERE 6 HD', 'Premiere 6', 'PREMIERE.6.HD.BR', 'PREMIERE 6'],
  'PREMIERE 7': ['PREMIERE 7 HD', 'Premiere 7', 'PREMIERE.7.HD.BR', 'PREMIERE 7'],
  'PREMIERE CLUBES': ['PREMIERE CLUBES HD', 'Premiere Clubes', 'PREMIERE HD'],
  'SPORTTV': ['SPORTV', 'SPORTV HD', 'SporTV', 'sportv', 'SPORTV.BR', 'SPORTV HD ³'],
  'SPORTTV 2': ['SPORTV 2', 'SPORTV 2 HD', 'SporTV 2', 'sportv-2', 'SPORTV.2.BR', 'SPORTV 2 HD ³'],
  'SPORTTV 3': ['SPORTV 3', 'SPORTV 3 HD', 'SporTV 3', 'sportv-3', 'SPORTV.3.BR', 'SPORTV 3 HD ³'],
  'SPORTTV 4': ['SPORTV 2', 'SPORTV', 'SPORTV 3', 'SPORTV 2 HD'],
  'SPORTTV 5': ['SPORTV 3', 'SPORTV 2', 'SPORTV', 'SPORTV 3 HD'],
  'SPORTTV 6': ['SPORTV', 'SPORTV 2', 'SPORTV 3', 'SPORTV HD'],
  'SPORTV': ['SPORTV', 'SPORTV HD', 'SporTV', 'sportv'],
  'SPORTV 2': ['SPORTV 2', 'SPORTV 2 HD', 'SporTV 2'],
  'SPORTV 3': ['SPORTV 3', 'SPORTV 3 HD', 'SporTV 3'],
  'OFF': ['CANAL OFF HD', 'Canal Off', 'OFF'],
  'UFC FIGHT PASS': ['UFC Fight Pass', 'COMBATE HD', 'COMBATE'],

  // FILMES E SÉRIES
  'A&E': ['A&E', 'A&E HD', 'A&AMP;E', 'A&AMP;E HD', 'A&AMP;E.BR'],
  'AMC': ['AMC HD', 'AMC', 'AMC.BR'],
  'ART 1': ['ARTE 1 HD', 'Arte 1', 'ARTE 1', 'ARTE.1.BR'],
  'AXN': ['AXN', 'AXN HD', 'AXN.BR'],
  'CANAL BRASIL': ['CANAL BRASIL HD', 'Canal Brasil', 'CANAL.BRASIL.BR'],
  'CINEMAX': ['CINEMAX HD', 'Cinemax', 'CINEMAX.BR'],
  'FX': ['STAR CHANNEL HD', 'FX', 'FX HD', 'WARNER CHANNEL'],
  'FXM': ['STAR LIFE HD', 'FXM', 'TCM'],
  'HBO': ['HBO', 'HBO HD', 'HBO.BR'],
  'HBO 2': ['HBO 2', 'HBO 2 HD', 'HBO.2.BR', 'HBO HD 2 ³'],
  'HBO FAMILY': ['HBO FAMILY HD', 'HBO Family', 'HBO.FAMILY.BR'],
  'HBO MUNDI': ['HBO MUNDI HD', 'HBO FAMILY HD'],
  'HBO PLUS': ['HBO PLUS HD', 'HBO.PLUS.BR'],
  'HBO POP': ['HBO POP HD', 'HBO 2 HD'],
  'HBO SIGNATURE': ['HBO SIGNATURE HD', 'HBO Signature', 'HBO.SIGNATURE.BR'],
  'HBO XTREME': ['HBO XTREME HD', 'HBO Signature', 'HBO PLUS HD'],
  'MEGAPIX': ['MEGAPIX HD', 'Megapix', 'MEGAPIX.BR', 'MEGAPIX HD ³'],
  'PARAMOUNT': ['PARAMOUNT NETWORK HD', 'Paramount', 'Paramount Network', 'PARAMOUNT CHANNEL', 'PARAMOUNT.CHANNEL.BR', 'WARNER CHANNEL HD'],
  'SONY CHANNEL': ['SONY CHANNEL HD', 'Sony Channel', 'Sony', 'SONY.HD.³.BR'],
  'SPACE': ['SPACE HD', 'Space', 'SPACE.BR'],
  'TCM': ['TCM', 'TCM HD', 'TCM.-.TURNER.CLASSIC.BR'],
  'TNT': ['TNT HD', 'TNT', 'TNT.BR'],
  'TNT SERIES': ['TNT SERIES HD', 'TNT Series', 'TNT.SERIES.BR'],
  'TELECINE ACTION': ['TELECINE ACTION HD', 'TELECINE ACTION', 'Telecine Action', 'TELECINE.ACTION.BR'],
  'TELECINE CULT': ['TELECINE CULT HD', 'TELECINE CULT', 'Telecine Cult', 'TELECINE.CULT.BR'],
  'TELECINE FUN': ['TELECINE FUN HD', 'TELECINE FUN', 'Telecine Fun', 'TELECINE.FUN.BR'],
  'TELECINE PIPOCA': ['TELECINE PIPOCA HD', 'TELECINE PIPOCA', 'Telecine Pipoca', 'TELECINE.PIPOCA.BR', 'TELECINE PIPOCA HD ³'],
  'TELECINE PREMIUM': ['TELECINE PREMIUM HD', 'TELECINE PREMIUM', 'Telecine Premium', 'TELECINE.PREMIUM.BR'],
  'TELECINE TOUCH': ['TELECINE TOUCH HD', 'TELECINE TOUCH', 'Telecine Touch', 'TELECINE.TOUCH.BR'],
  'UNIVERSAL TV': ['UNIVERSAL TV HD', 'UNIVERSAL TV', 'Universal TV', 'UNIVERSAL.CHANNEL.BR', 'UNIVERSAL.TV.HD.BR'],
  'WARNER CHANNEL': ['WARNER CHANNEL HD', 'WARNER CHANNEL', 'Warner Channel', 'WARNER.CHANNEL.BR'],

  // INFANTIS
  'CARTOON NETWORK': ['CARTOON HD', 'Cartoon Network', 'CARTOON', 'CARTOON.NETWORK.HD.BR'],
  'CARTOONITO': ['CARTOONITO', 'Cartoonito', 'CARTOONITO.BR'],
  'DISCOVERY KIDS': ['DISCOVERY KIDS HD', 'Discovery Kids', 'DISCOVERY.KIDS.BR'],
  'DISNEY CHANNEL': ['DISNEY CHANNEL HD', 'Disney Channel', 'CARTOON HD'],
  'DISNEY JUNIOR': ['DISNEY CHANNEL HD', 'CARTOON HD', 'CARTOONITO', 'GLOOB HD'],
  'NICKELODEON': ['CARTOON HD', 'DISNEY CHANNEL HD', 'CARTOONITO', 'GLOOB HD'],
  'GLOOB': ['GLOOB HD', 'Gloob'],
  'TOONCAST': ['TOONCAST', 'Tooncast', 'CARTOON HD'],
  'ZOOMOO': ['ZOOMOO KIDS HD', 'ZooMoo', 'CARTOONITO', 'DISCOVERY KIDS HD'],

  // MÚSICA
  'BIS': ['BIS HD', 'Bis', 'BIS.BR'],
  'MTV': ['MTV HD', 'MTV', 'MTV Brasil', 'BIS HD', 'MULTISHOW HD'],
  'MTV LIVE': ['MTV Live', 'MTV HD', 'BIS HD', 'MULTISHOW HD'],
  'MUSIC BOX BRASIL': ['MUSIC BOX BRAZIL HD', 'Music Box Brazil', 'BIS HD', 'MULTISHOW HD'],

  // NOTÍCIAS
  'BANDNEWS': ['BAND NEWS', 'BandNews', 'Band News', 'BAND.NEWS.HD.BR'],
  'CNN BRASIL': ['CNN BRASIL', 'CNN Brasil', 'CNN.BRASIL.BR'],
  'GLOBONEWS': ['GLOBONEWS', 'GloboNews', 'globonews', 'GLOBO NEWS HD', 'GLOBO.NEWS.BR', 'GLOBONEWS HD ³'],
  'JOVEM PAN NEWS': ['JOVEM PAN NEWS HD', 'Jovem Pan News', 'JOVEM.PAN.NEWS.BR'],
  'RECORD NEWS': ['RECORD NEWS', 'Record News', 'RECORD.NEWS.BR'],

  // RELIGIOSOS
  'CANÇÃO NOVA': ['CANÇÃO NOVA HD', 'Canção Nova', 'CANCAO NOVA'],
  'GOSPEL MOVIES': ['CANÇÃO NOVA HD', 'REDE VIDA HD', 'CANCAO NOVA'],
  'NOVO TEMPO': ['CANÇÃO NOVA HD', 'REDE VIDA HD', 'NOVO TEMPO', 'Novo Tempo'],
  'RIT': ['RIT', 'RIT TV'],
  'REDE GOSPEL': ['REDE GOSPEL', 'Rede Gospel'],
  'REDE SÉCULO 21': ['Rede Século 21', 'REDE SECULO 21'],
  'REDE SUPER': ['CANÇÃO NOVA HD', 'REDE VIDA HD', 'Rede Super', 'REDE SUPER'],
  'REDE VIDA': ['REDE VIDA HD', 'Rede Vida', 'REDE.VIDA.HD.BR'],
  'TV APARECIDA': ['TV APARECIDA HD', 'TV Aparecida'],
  'TV PAI ETERNO': ['TV PAI ETERNO HD', 'Pai Eterno'],

  // TV ABERTA & REGIONAIS
  'BAND': ['BAND HD', 'Band SP_local', 'Band', 'BAND.BR', 'BAND SP'],
  'BAND SP': ['BAND HD', 'Band SP_local', 'Band', 'BAND.BR', 'BAND SP'],
  'GLOBO MG': ['GLOBO SP', 'Globo SP_local', 'tv-globo', 'GLOBO', 'GLOBO.BR'],
  'GLOBO MINAS': ['GLOBO SP', 'Globo SP_local', 'tv-globo', 'GLOBO', 'GLOBO.BR'],
  'GLOBO ES': ['GLOBO SP', 'Globo SP_local', 'tv-globo', 'GLOBO', 'GLOBO.BR'],
  'GLOBO RJ': ['GLOBO SP', 'Globo SP_local', 'tv-globo', 'GLOBO', 'GLOBO.BR'],
  'GLOBO SP': ['GLOBO SP', 'Globo SP_local', 'tv-globo', 'GLOBO', 'GLOBO.BR'],
  'INTEGRAÇÃO JUIZ DE FORA': ['GLOBO SP', 'Globo SP_local', 'tv-globo', 'GLOBO', 'GLOBO.BR'],
  'INTEGRACAO JUIZ DE FORA': ['GLOBO SP', 'Globo SP_local', 'tv-globo', 'GLOBO', 'GLOBO.BR'],
  'RECORD MG': ['RECORD TV', 'RECORD - SAO PAULO', 'RECORD - Sao Paulo', 'Record SP_local', 'RECORD HD', 'Record', 'RECORD.TV.BR'],
  'RECORD TV': ['RECORD TV', 'RECORD - SAO PAULO', 'RECORD - Sao Paulo', 'Record SP_local', 'RECORD HD', 'Record', 'RECORD.TV.BR'],
  'REDE TV': ['Rede TV! SP_local', 'REDE TV HD', 'Rede TV!', 'REDE.TV.BR'],
  'SBT': ['SBT', 'SBT São Paulo', 'SBT.BR', 'SBT NEWS HD', 'SBT HD'],
  'SBT MG ALTEROSA': ['SBT', 'SBT São Paulo', 'SBT.BR', 'SBT NEWS HD', 'SBT HD'],
  'ALTEROSA': ['SBT', 'SBT São Paulo', 'SBT.BR', 'SBT NEWS HD', 'SBT HD'],
  'TV BRASIL': ['TV BRASIL HD', 'TV Brasil', 'TV.BRASIL.BR'],
  'TV CULTURA': ['CULTURA HD', 'TV Cultura', 'TV.CULTURA.BR'],
  'TV GAZETA': ['TV GAZETA HD', 'Gazeta', 'GAZETA.BR'],
  'FUTURA': ['FUTURA HD', 'Futura', 'CANAL.FUTURA.BR'],

  // VARIEDADES & OUTROS
  'COMEDY CENTRAL': ['COMEDY CENTRAL HD', 'Comedy Central', 'WARNER CHANNEL HD', 'SONY CHANNEL HD', 'TNT HD'],
  'E!': ['E! ENTERTAINMENT HD', 'E!', 'E!.BR'],
  'GNT': ['GNT HD', 'GNT', 'GNT.BR', 'GNT HD ³'],
  'MULTISHOW': ['MULTISHOW HD', 'Multishow', 'MULTISHOW.BR'],
  'TNT NOVELAS': ['TNT NOVELAS HD', 'TNT NOVELAS', 'TNT.NOVELAS.BR', 'Globoplay Novelas'],
  'VIVA': ['VIVA HD', 'VIVA', 'Globoplay Novelas', 'VIVA.HD.BR'],
  'CHEF': ['Sabor & Arte', 'Arte 1'],
  'WOOHOO': ['WOOHOO', 'Woohoo'],
};

/**
 * Parses XMLTV timestamp format: YYYYMMDDhhmmss [+/-]HHMM
 */
export const parseXmltvTime = (timeStr: string): number => {
  if (!timeStr) return 0;
  try {
    const clean = timeStr.trim();
    const year = parseInt(clean.slice(0, 4), 10);
    const month = parseInt(clean.slice(4, 6), 10) - 1;
    const day = parseInt(clean.slice(6, 8), 10);
    const hour = parseInt(clean.slice(8, 10), 10);
    const min = parseInt(clean.slice(10, 12), 10);
    const sec = parseInt(clean.slice(12, 14), 10) || 0;

    // Timezone offset (e.g. -0300)
    let offsetMinutes = -180; // default to BRT (UTC-3)
    const match = clean.match(/([+-])(\d{2})(\d{2})$/);
    if (match) {
      const sign = match[1] === '+' ? 1 : -1;
      const offH = parseInt(match[2], 10);
      const offM = parseInt(match[3], 10);
      offsetMinutes = sign * (offH * 60 + offM);
    }

    // Compute UTC time
    const utcMs = Date.UTC(year, month, day, hour, min, sec) - offsetMinutes * 60 * 1000;
    return utcMs;
  } catch {
    return 0;
  }
};

export const formatClockTime = (ms: number): string => {
  if (!ms) return '--:--';
  const d = new Date(ms);
  // Format to America/Sao_Paulo (UTC-3)
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo',
  });
};

export interface RawXmlProgramme {
  channel: string;
  start: number;
  stop: number;
  title: string;
  desc?: string;
  category?: string;
}

export class EpgService {
  private static instance: EpgService;
  private programmesByChannel: Map<string, RawXmlProgramme[]> = new Map();
  private isLoaded = false;
  private isLoading = false;
  private lastFetchTime = 0;

  public static getInstance(): EpgService {
    if (!EpgService.instance) {
      EpgService.instance = new EpgService();
    }
    return EpgService.instance;
  }

  public async loadEpg(force = false): Promise<boolean> {
    const now = Date.now();
    // Cache for 20 minutes
    if (this.isLoaded && !force && now - this.lastFetchTime < 20 * 60 * 1000) {
      return true;
    }
    if (this.isLoading) return false;

    this.isLoading = true;
    try {
      // 1. Try local /api/epg (for Web / Node server)
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const jsonCandidates = [
        '/api/epg',
        origin ? `${origin}/api/epg` : '',
      ].filter(Boolean);

      let rawJson: any = null;
      for (const url of jsonCandidates) {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
          if (res.ok) {
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
              rawJson = await res.json();
              if (rawJson && rawJson.programmes && Object.keys(rawJson.programmes).length > 0) {
                break;
              }
            }
          }
        } catch {
          // continue to next candidate
        }
      }

      if (rawJson && rawJson.programmes) {
        this.programmesByChannel.clear();
        for (const [chId, progs] of Object.entries(rawJson.programmes as Record<string, any[]>)) {
          const mappedProgs: RawXmlProgramme[] = (progs as any[]).map((p) => ({
            channel: chId,
            start: p.start,
            stop: p.stop,
            title: p.title || 'Programação',
            desc: p.desc || '',
            category: p.category || '',
          }));

          const keysToRegister = [
            chId.toUpperCase(),
            chId.replace(/&AMP;/gi, '&').toUpperCase(),
            chId.replace(/&/g, '&AMP;').toUpperCase(),
            chId.replace(/SÃO PAULO\/SP\s*/i, '').replace(/BELO HORIZONTE\/MG\s*/i, '').replace(/\.BR$/i, '').trim().toUpperCase(),
          ];

          for (const k of keysToRegister) {
            if (k) {
              this.programmesByChannel.set(k, mappedProgs);
            }
          }
        }
        this.isLoaded = true;
        this.lastFetchTime = now;
        return true;
      }

      // 2. Direct fallback (Android / Fire TV APK / Standalone static without Node server):
      // Fetch XML directly from BrazilTVEPG GitHub (vivoplay.xml and claro.xml)
      try {
        const [resVivo, resClaro] = await Promise.allSettled([
          fetch('https://raw.githubusercontent.com/limaalef/BrazilTVEPG/main/vivoplay.xml', {
            signal: AbortSignal.timeout(12000),
          }),
          fetch('https://raw.githubusercontent.com/limaalef/BrazilTVEPG/main/claro.xml', {
            signal: AbortSignal.timeout(12000),
          }),
        ]);

        const ONE_DAY = 24 * 60 * 60 * 1000;
        const minTime = now - 6 * 60 * 60 * 1000;
        const maxTime = now + 36 * 60 * 60 * 1000;
        const progRegex = /<programme\s+start="([^"]+)"\s+stop="([^"]+)"\s+channel="([^"]+)">([\s\S]*?)<\/programme>/g;

        this.programmesByChannel.clear();

        const parseFeeds = async (res: PromiseSettledResult<Response>) => {
          if (res.status !== 'fulfilled' || !res.value.ok) return;
          const xmlText = await res.value.text();
          let match;
          while ((match = progRegex.exec(xmlText)) !== null) {
            let startMs = parseXmltvTime(match[1]);
            let stopMs = parseXmltvTime(match[2]);
            if (startMs === 0 || stopMs === 0) continue;

            if (stopMs < now - 4 * 60 * 60 * 1000) {
              const days = Math.round((now - startMs) / ONE_DAY);
              if (days > 0 && days < 45) {
                startMs += days * ONE_DAY;
                stopMs += days * ONE_DAY;
              }
            }

            if (stopMs < minTime || startMs > maxTime) continue;

            const chKey = match[3].replace(/&amp;/gi, '&').trim().toUpperCase();
            const inner = match[4];
            const titleM = inner.match(/<title[^>]*>([\s\S]*?)<\/title>/);
            const descM = inner.match(/<desc[^>]*>([\s\S]*?)<\/desc>/);
            const catM = inner.match(/<category[^>]*>([\s\S]*?)<\/category>/);

            const title = titleM ? titleM[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim() : '';
            const desc = descM ? descM[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim() : '';
            const category = catM ? catM[1].trim() : '';

            if (!this.programmesByChannel.has(chKey)) {
              this.programmesByChannel.set(chKey, []);
            }
            this.programmesByChannel.get(chKey)!.push({
              channel: chKey,
              start: startMs,
              stop: stopMs,
              title,
              desc,
              category,
            });
          }
        };

        await Promise.all([parseFeeds(resVivo), parseFeeds(resClaro)]);

        for (const list of this.programmesByChannel.values()) {
          list.sort((a, b) => a.start - b.start);
        }

        if (this.programmesByChannel.size > 0) {
          this.isLoaded = true;
          this.lastFetchTime = now;
          return true;
        }
      } catch (xmlErr) {
        console.warn('Direct XML EPG fetch error:', xmlErr);
      }
      return false;
    } catch (err) {
      console.warn('EPG fetch warning (fallback active):', err);
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Finds the EPG schedule for a given channel name
   */
  public getChannelEpg(channelName: string): ChannelEpg {
    const trimmed = channelName.trim();
    const upper = trimmed.toUpperCase();
    const nowMs = Date.now();

    // 1. Resolve possible EPG channel IDs from aliases map
    const potentialIds: string[] = [];
    if (EPG_CHANNEL_ALIASES[upper]) {
      potentialIds.push(...EPG_CHANNEL_ALIASES[upper]);
    }
    potentialIds.push(trimmed);
    potentialIds.push(`${trimmed} HD`);
    potentialIds.push(trimmed.replace(/\s+HD$/i, ''));
    potentialIds.push(upper);
    potentialIds.push(upper.replace(/\s+HD$/i, ''));

    // 2. Find matching programmes in loaded map
    let matchedProgs: RawXmlProgramme[] | undefined;
    let matchedId = trimmed;

    for (const pid of potentialIds) {
      const found = this.programmesByChannel.get(pid.toUpperCase());
      if (found && found.length > 0) {
        matchedProgs = found;
        matchedId = pid;
        break;
      }
    }

    // Fuzzy search if no exact alias found
    if (!matchedProgs) {
      const cleanTarget = upper.replace(/[^A-Z0-9]/g, '');
      for (const [key, progs] of this.programmesByChannel.entries()) {
        const cleanKey = key.replace(/[^A-Z0-9]/g, '');
        if (cleanKey.includes(cleanTarget) || cleanTarget.includes(cleanKey)) {
          matchedProgs = progs;
          matchedId = key;
          break;
        }
      }
    }

    if (!matchedProgs || matchedProgs.length === 0) {
      // Fallback pseudo-program when EPG data is unavailable
      const currentStart = nowMs - (nowMs % (60 * 60 * 1000));
      const currentStop = currentStart + 60 * 60 * 1000;
      const progressPercent = Math.min(100, Math.max(0, Math.round(((nowMs - currentStart) / (currentStop - currentStart)) * 100)));

      return {
        channelName,
        epgChannelId: matchedId,
        currentProgram: {
          title: `Transmissão Ao Vivo • ${channelName}`,
          desc: 'Programação contínua em alta definição.',
          start: formatClockTime(currentStart),
          stop: formatClockTime(currentStop),
          startTime: currentStart,
          stopTime: currentStop,
          progressPercent,
        },
        nextProgram: {
          title: `Próxima Atração • ${channelName}`,
          desc: 'Acompanhe a sequência da grade na programação especial.',
          start: formatClockTime(currentStop),
          stop: formatClockTime(currentStop + 60 * 60 * 1000),
          startTime: currentStop,
          stopTime: currentStop + 60 * 60 * 1000,
        },
        upcoming: [],
      };
    }

    // 3. Project schedule to current day if needed, and find current/next
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const projected = matchedProgs.map((p) => {
      let s = p.start;
      let e = p.stop;
      if (e < nowMs - 4 * 60 * 60 * 1000) {
        const days = Math.round((nowMs - s) / ONE_DAY);
        if (days > 0 && days < 45) {
          s += days * ONE_DAY;
          e += days * ONE_DAY;
        }
      }
      return { ...p, start: s, stop: e };
    }).sort((a, b) => a.start - b.start);

    let currentProg: RawXmlProgramme | null = null;
    let nextProg: RawXmlProgramme | null = null;
    const upcomingProgs: RawXmlProgramme[] = [];

    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      if (p.start <= nowMs && nowMs < p.stop) {
        currentProg = p;
        if (i + 1 < projected.length) {
          nextProg = projected[i + 1];
        }
        // Collect next 4 programs
        for (let j = i + 1; j < Math.min(projected.length, i + 5); j++) {
          upcomingProgs.push(projected[j]);
        }
        break;
      }
    }

    // If time window slightly before first program or in-between
    if (!currentProg && projected.length > 0) {
      const future = projected.find((p) => p.start >= nowMs);
      if (future) {
        currentProg = future;
        const idx = projected.indexOf(future);
        if (idx + 1 < projected.length) nextProg = projected[idx + 1];
      } else {
        currentProg = projected[projected.length - 1];
      }
    }

    if (!nextProg && currentProg) {
      const future = projected.find((p) => p.start >= currentProg!.stop);
      if (future) nextProg = future;
    }

    const toEpgProgram = (p: RawXmlProgramme, isCurrent = false): EpgProgram => {
      let progressPercent = 0;
      if (isCurrent && p.stop > p.start) {
        const elapsed = nowMs - p.start;
        const duration = p.stop - p.start;
        progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / duration) * 100)));
      }
      return {
        title: p.title,
        desc: p.desc,
        category: p.category,
        start: formatClockTime(p.start),
        stop: formatClockTime(p.stop),
        startTime: p.start,
        stopTime: p.stop,
        progressPercent: isCurrent ? progressPercent : undefined,
      };
    };

    return {
      channelName,
      epgChannelId: matchedId,
      currentProgram: currentProg ? toEpgProgram(currentProg, true) : null,
      nextProgram: nextProg ? toEpgProgram(nextProg, false) : null,
      upcoming: upcomingProgs.map((p) => toEpgProgram(p, false)),
    };
  }
}