import { Channel, CustomLogosMap } from '../types';
import { getChannelLogo } from '../data/channelLogos';

/**
 * Mapeamento inteligente (De/Para) de IDs de EPG para garantir que a grade,
 * horários e sinopses do guia batam perfeitamente com os XMLs de EPG da nuvem.
 */
const getMappedTvgId = (name: string, rawId?: string): string => {
  if (rawId && rawId.trim() && !rawId.startsWith('ch-')) {
    return rawId.trim();
  }

  const upper = name.toUpperCase();

  // Canais Abertos / Principais
  if (upper.includes('GLOBO SP') || upper.includes('TV GLOBO SP')) return 'GloboSP.br';
  if (upper.includes('GLOBO RJ') || upper.includes('TV GLOBO RJ')) return 'GloboRJ.br';
  if (upper.includes('GLOBO') || upper.includes('TV GLOBO')) return 'Globo.br';
  if (upper.includes('SBT')) return 'SBT.br';
  if (upper.includes('RECORD')) return 'Record.br';
  if (upper.includes('BAND')) return 'Band.br';
  if (upper.includes('REDE TV') || upper.includes('REDETV')) return 'RedeTV.br';
  if (upper.includes('CULTURA')) return 'TVCultura.br';
  if (upper.includes('GAZETA')) return 'TVGazeta.br';
  if (upper.includes('REDE VIDA')) return 'RedeVida.br';

  // Esportes / ESPN / SporTV / Premiere
  if (upper.includes('ESPN 4') || upper.includes('ESPN4')) return 'ESPN4.br';
  if (upper.includes('ESPN 3') || upper.includes('ESPN3')) return 'ESPN3.br';
  if (upper.includes('ESPN 2') || upper.includes('ESPN2')) return 'ESPN2.br';
  if (upper.includes('ESPN 6') || upper.includes('ESPN6')) return 'ESPN6.br';
  if (upper.includes('ESPN')) return 'ESPN.br';
  if (upper.includes('SPORTV 3') || upper.includes('SPORTTV 3')) return 'SporTV3.br';
  if (upper.includes('SPORTV 2') || upper.includes('SPORTTV 2')) return 'SporTV2.br';
  if (upper.includes('SPORTV') || upper.includes('SPORTTV')) return 'SporTV.br';
  if (upper.includes('BAND SPORTS') || upper.includes('BANDSPORTS')) return 'BandSports.br';
  if (upper.includes('COMBATE')) return 'Combate.br';
  if (upper.includes('PREMIERE CLUBES') || upper.includes('PREMIERE 1')) return 'Premiere1.br';
  if (upper.includes('PREMIERE 2')) return 'Premiere2.br';
  if (upper.includes('PREMIERE 3')) return 'Premiere3.br';
  if (upper.includes('PREMIERE')) return 'Premiere.br';

  // Filmes e Séries
  if (upper.includes('TELECINE PREMIUM')) return 'TelecinePremium.br';
  if (upper.includes('TELECINE ACTION')) return 'TelecineAction.br';
  if (upper.includes('TELECINE LIGHT')) return 'TelecineLight.br';
  if (upper.includes('TELECINE PIPOCA')) return 'TelecinePipoca.br';
  if (upper.includes('TELECINE CULT')) return 'TelecineCult.br';
  if (upper.includes('TELECINE FUN')) return 'TelecineFun.br';
  if (upper.includes('HBO MUNDI')) return 'HBOMundi.br';
  if (upper.includes('HBO PLUS')) return 'HBOPlus.br';
  if (upper.includes('HBO FAMILY')) return 'HBOFamily.br';
  if (upper.includes('HBO XTREME')) return 'HBOXtreme.br';
  if (upper.includes('HBO')) return 'HBO.br';
  if (upper.includes('TNT')) return 'TNT.br';
  if (upper.includes('SPACE')) return 'Space.br';
  if (upper.includes('WARNER')) return 'WarnerChannel.br';
  if (upper.includes('PARAMOUNT')) return 'ParamountNetwork.br';
  if (upper.includes('AXN')) return 'AXN.br';
  if (upper.includes('UNIVERSAL')) return 'UniversalChannel.br';
  if (upper.includes('FX')) return 'FX.br';
  if (upper.includes('STUDIO UNIVERSAL')) return 'StudioUniversal.br';
  if (upper.includes('CINEMAX')) return 'Cinemax.br';
  if (upper.includes('MEGAPIX')) return 'Megapix.br';

  // Notícias
  if (upper.includes('GLOBONEWS') || upper.includes('GLOBO NEWS')) return 'GloboNews.br';
  if (upper.includes('CNN BRASIL') || upper.includes('CNN')) return 'CNNBrasil.br';
  if (upper.includes('BANDNEWS')) return 'BandNews.br';
  if (upper.includes('RECORD NEWS')) return 'RecordNews.br';

  // Infantil e Documentários
  if (upper.includes('CARTOON NETWORK')) return 'CartoonNetwork.br';
  if (upper.includes('GLOOB')) return 'Gloob.br';
  if (upper.includes('DISCOVERY KIDS')) return 'DiscoveryKids.br';
  if (upper.includes('NICKELODEON')) return 'Nickelodeon.br';
  if (upper.includes('DISCOVERY CHANNEL') || upper.includes('DISCOVERY')) return 'DiscoveryChannel.br';
  if (upper.includes('NATIONAL GEOGRAPHIC') || upper.includes('NATGEO')) return 'NationalGeographic.br';
  if (upper.includes('HISTORY')) return 'HistoryChannel.br';
  if (upper.includes('ANIMAL PLANET')) return 'AnimalPlanet.br';

  // Fallback seguro usando o nome limpo
  return name.replace(/[^a-zA-Z0-9]/g, '') + '.br';
};

export const normalizeCategory = (rawGroup: string, name: string): string => {
  const upperName = name.toUpperCase();
  const upperGroup = (rawGroup || '').toUpperCase();

  // 1. ESPORTES (Unifica ESPN, PREMIERE, PPV, DAZN, SPORTV, COMBATE, etc.)
  if (
    upperGroup.includes('ESPORTE') ||
    upperGroup.includes('SPORT') ||
    upperGroup.includes('PPV') ||
    upperGroup.includes('FUTEBOL') ||
    upperGroup.includes('ESPN') ||
    upperGroup.includes('PREMIERE') ||
    upperGroup.includes('DAZN') ||
    upperName.includes('ESPN') ||
    upperName.includes('PREMIERE') ||
    upperName.includes('SPORTV') ||
    upperName.includes('SPORTTV') ||
    upperName.includes('COMBATE') ||
    upperName.includes('DAZN') ||
    upperName.includes('DAZAN') ||
    upperName.includes('CAZE') ||
    upperName.includes('CAZÉ') ||
    upperName.includes('UFC') ||
    upperName.includes('BAND SPORTS') ||
    upperName.includes('BANDSPORTS') ||
    upperName.includes('FOX SPORTS') ||
    upperName.includes('FOXSPORTS') ||
    upperName.includes('ESPORTE INTERATIVO') ||
    upperName.includes('NOSSO FUTEBOL')
  ) {
    return 'ESPORTES';
  }

  // 2. FILMES E SÉRIES (Unifica HBO, Telecine, Filmes & Séries)
  if (
    upperGroup.includes('FILME') ||
    upperGroup.includes('SÉRIE') ||
    upperGroup.includes('SERIE') ||
    upperGroup.includes('CINEMA') ||
    upperGroup.includes('HBO') ||
    upperName.includes('HBO') ||
    upperName.includes('TELECINE') ||
    upperName.includes('CINEMAX') ||
    upperName.includes('CINECANAL') ||
    upperName.includes('MEGAPIX') ||
    upperName.includes('TNT') ||
    upperName.includes('WARNER') ||
    upperName.includes('UNIVERSAL') ||
    upperName.includes('SONY') ||
    upperName.includes('PARAMOUNT') ||
    upperName.includes('AXN') ||
    upperName.includes('A&E') ||
    upperName.includes('AMC') ||
    upperName.includes('SPACE') ||
    upperName.includes('STUDIO UNIVERSAL') ||
    upperName.includes('TCM') ||
    upperName.includes('STAR CHANNEL') ||
    upperName.includes('FX') ||
    upperName.includes('CANAL BRASIL') ||
    upperName.includes('ARTE 1') ||
    upperName.includes('COMEDY CENTRAL')
  ) {
    return 'FILMES E SÉRIES';
  }

  // 3. NOTÍCIAS
  if (
    upperGroup.includes('NOTÍCIA') ||
    upperGroup.includes('NOTICIA') ||
    upperGroup.includes('NEWS') ||
    upperName.includes('NEWS') ||
    upperName.includes('CNN') ||
    upperName.includes('GLOBONEWS') ||
    upperName.includes('GLOBO NEWS') ||
    upperName.includes('UOL')
  ) {
    return 'NOTÍCIAS';
  }

  // 4. INFANTIS
  if (
    upperGroup.includes('INFANTIL') ||
    upperGroup.includes('DESENHO') ||
    upperGroup.includes('KIDS') ||
    upperName.includes('CARTOON') ||
    upperName.includes('GLOOB') ||
    upperName.includes('NICKELODEON') ||
    upperName.includes('NICK JR') ||
    upperName.includes('DISCOVERY KIDS') ||
    upperName.includes('TOONCAST') ||
    upperName.includes('WOOHOO') ||
    upperName.includes('ZOOMOO') ||
    upperName.includes('BABY TV') ||
    upperName.includes('DISNEY')
  ) {
    return 'INFANTIS';
  }

  // 5. DOCUMENTÁRIOS
  if (
    upperGroup.includes('DOCUMENT') ||
    upperName.includes('DISCOVERY') ||
    upperName.includes('HISTORY') ||
    upperName.includes('ANIMAL PLANET') ||
    upperName.includes('NATIONAL GEOGRAPHIC') ||
    upperName.includes('NATGEO') ||
    upperName.includes('TLC') ||
    upperName.includes('HGTV')
  ) {
    return 'DOCUMENTÁRIOS';
  }

  // 6. VARIEDADES (Unifica MÚSICA & VARIEDADES: MTV, Multishow, Bis, GNT, Viva, etc.)
  if (
    upperGroup.includes('MÚSICA') ||
    upperGroup.includes('MUSICA') ||
    upperGroup.includes('VARIEDADES') ||
    upperGroup.includes('SHOW') ||
    upperName.includes('MTV') ||
    upperName.includes('MULTISHOW') ||
    upperName.includes('BIS') ||
    upperName.includes('MUSIC BOX') ||
    upperName.includes('VH1') ||
    upperName.includes('GNT') ||
    upperName.includes('VIVA') ||
    upperName.includes('OFF') ||
    upperName.includes('MODO VIAGEM') ||
    upperName.includes('TRACE') ||
    upperName.includes('PLAY TV')
  ) {
    return 'VARIEDADES';
  }

  // 7. RELIGIOSOS
  if (
    upperGroup.includes('RELIGIO') ||
    upperGroup.includes('GOSPEL') ||
    upperName.includes('APARECIDA') ||
    upperName.includes('CANÇÃO NOVA') ||
    upperName.includes('CANCAO NOVA') ||
    upperName.includes('NOVO TEMPO') ||
    upperName.includes('PAI ETERNO') ||
    upperName.includes('REDE VIDA') ||
    upperName.includes('RIT') ||
    upperName.includes('TEMPLO') ||
    upperName.includes('EVANGELIZAR') ||
    upperName.includes('BOAS NOVAS') ||
    upperName.includes('GOSPEL') ||
    upperName.includes('SÉCULO 21')
  ) {
    return 'RELIGIOSOS';
  }

  // 8. CANAL (TV Aberta e Geral)
  if (
    upperGroup.includes('ABERTA') ||
    upperGroup.includes('CANAIS') ||
    upperGroup.includes('GERAL') ||
    upperName.includes('GLOBO') ||
    upperName.includes('SBT') ||
    upperName.includes('BAND') ||
    upperName.includes('RECORD') ||
    upperName.includes('REDE TV') ||
    upperName.includes('REDETV') ||
    upperName.includes('CULTURA') ||
    upperName.includes('TV BRASIL') ||
    upperName.includes('GAZETA') ||
    upperName.includes('TV CÂMARA') ||
    upperName.includes('TV SENADO') ||
    upperName.includes('TV DIÁRIO') ||
    upperName.includes('TV DIARIO') ||
    upperName.includes('TV JUSTIÇA') ||
    upperName.includes('TV JUSTICA') ||
    upperName.includes('CANAL RURAL') ||
    upperName.includes('CANAL DO BOI') ||
    upperName.includes('TV RÁ TIM BUM') ||
    upperName.includes('TV RA TIM BUM') ||
    upperName.includes('AGRO') ||
    upperName.includes('FUTURA')
  ) {
    return 'CANAL';
  }

  return rawGroup.replace(/^CANAIS:\s*/i, '').trim() || 'CANAL';
};

export const toHttpsIfPossible = (u?: string): string => {
  if (!u) return '';
  if (u.startsWith('//')) return 'https:' + u;
  if (u.startsWith('http://')) {
    const httpsHosts = [
      'blogspot.com',
      '1.bp.blogspot.com',
      '2.bp.blogspot.com',
      '3.bp.blogspot.com',
      '4.bp.blogspot.com',
      'googleusercontent.com',
      'lh3.googleusercontent.com',
      'postimg.cc',
      'i.postimg.cc',
      'ibb.co',
      'i.ibb.co',
      'wikimedia.org',
      'upload.wikimedia.org',
      'wikipedia.org',
      'ctcdn.com',
      'mitvstatic.com',
      'imgu.top',
      'clarotvmais.com.br',
      'mondrian.claro.com.br',
      'imgur.com',
      'i.imgur.com',
    ];
    try {
      const host = new URL(u).hostname.toLowerCase();
      if (httpsHosts.some((h) => host.endsWith(h))) {
        return u.replace(/^http:\/\//i, 'https://');
      }
    } catch {
      // ignore URL parse errors
    }
  }
  return u;
};

export const getAutoplayUrl = (rawUrl?: string): string => {
  if (!rawUrl) return '';
  const url = rawUrl.trim();
  if (!url || url.startsWith('javascript:')) return url;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
      if (parsed.pathname.includes('/watch')) {
        const v = parsed.searchParams.get('v');
        if (v) {
          return `https://www.youtube-nocookie.com/embed/${v}?autoplay=1&mute=0&rel=0`;
        }
      } else if (parsed.pathname.includes('/live/')) {
        const parts = parsed.pathname.split('/live/').filter(Boolean);
        if (parts[0]) {
          return `https://www.youtube-nocookie.com/embed/${parts[0]}?autoplay=1&mute=0&rel=0`;
        }
      }
      parsed.searchParams.set('autoplay', '1');
      return parsed.toString();
    }

    if (!parsed.searchParams.has('autoplay') && !parsed.searchParams.has('autoPlay')) {
      parsed.searchParams.set('autoplay', '1');
    }

    return parsed.toString();
  } catch {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}autoplay=1`;
  }
};

export const getViewerEmbedUrl = (rawUrl?: string): string => {
  if (!rawUrl) return '';
  const cleanUrl = rawUrl.trim();
  if (!cleanUrl) return '';

  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
    return getAutoplayUrl(cleanUrl);
  }

  return `/api/embed-frame?url=${encodeURIComponent(cleanUrl)}`;
};

export const parseM3U = (m3uContent: string, customLogos?: CustomLogosMap): Channel[] => {
  const channels: Channel[] = [];
  const lines = m3uContent.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#EXTINF')) {
      try {
        const infoLine = line;
        let urlLine = '';
        while (i + 1 < lines.length) {
          const next = lines[++i].trim();
          if (next && !next.startsWith('#')) {
            urlLine = next;
            break;
          }
        }

        if (!urlLine) {
          continue;
        }

        const idMatch = infoLine.match(/tvg-id="([^"]*)"/);
        const logoMatch = infoLine.match(/tvg-logo="([^"]*)"/);
        const groupMatch = infoLine.match(/group-title="([^"]*)"/);
        const nameAttrMatch = infoLine.match(/tvg-name="([^"]*)"/);
        
        // Extração do status do canal
        const statusMatch = infoLine.match(/(?:status|data-status)="([^"]*)"/i);
        let parsedStatus = statusMatch ? statusMatch[1].toLowerCase().trim() : undefined;

        const commaNameMatch = infoLine.match(/,(.*)$/);

        const name = (commaNameMatch ? commaNameMatch[1].trim() : '') ||
          (nameAttrMatch ? nameAttrMatch[1].trim() : 'Canal Desconhecido');

        const rawGroup = groupMatch ? groupMatch[1] : 'CANAL';
        const finalGroup = normalizeCategory(rawGroup, name);

        const upperName = name.toUpperCase();
        if (upperName.includes('GLOBO RJ') || infoLine.includes('status="offline"') || infoLine.includes('offline')) {
          parsedStatus = 'offline';
        }

        const rawLogo = logoMatch ? logoMatch[1].trim() : '';
        const secureLogo = (customLogos && (customLogos[name] || customLogos[name.toUpperCase()]))
          || toHttpsIfPossible(rawLogo)
          || getChannelLogo(name, customLogos, finalGroup);

        // Aplicação do ID limpo e mapeado para o EPG casar sem falhas
        const mappedId = getMappedTvgId(name, idMatch?.[1]);

        const channel: Channel = {
          id: mappedId,
          name: name,
          logo: secureLogo,
          group: finalGroup,
          url: urlLine,
          originalUrl: urlLine,
          status: parsedStatus === 'offline' ? 'offline' : 'online',
        };

        channels.push(channel);
      } catch (error) {
        console.error('Erro ao processar linha da playlist M3U:', line, error);
      }
    }
  }

  return channels;
};