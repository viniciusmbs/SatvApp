import { CustomLogosMap } from '../types';

const TV_LOGO_BR = 'https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/brazil/';
const TV_LOGO_US = 'https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/united-states/';
const TV_LOGO_CA = 'https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/canada/';
const TV_LOGO_LAM = 'https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/world-latin-america/';
const TV_LOGO_AR = 'https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/';
const TV_LOGO_INT = 'https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/international/';

// ==========================================
// ÍCONES VETORIAIS SVG PREMIUM (ALTA FIDELIDADE)
// ==========================================

const CAZE_TV_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80" width="100%" height="100%"><rect width="160" height="80" rx="14" fill="%230f172a"/><rect x="8" y="8" width="144" height="64" rx="10" fill="%231e293b" stroke="%2338bdf8" stroke-width="2.5"/><text x="80" y="47" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="28" fill="%23ffffff" text-anchor="middle" letter-spacing="-0.5">CAZÉ<tspan fill="%2338bdf8">TV</tspan></text><circle cx="132" cy="24" r="4" fill="%23ef4444"/></svg>`;

const COMBATE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 70" width="100%" height="100%"><rect width="180" height="70" rx="12" fill="%23000000"/><text x="90" y="47" font-family="Impact, Arial Black, sans-serif" font-style="italic" font-weight="900" font-size="30" fill="%23ffffff" text-anchor="middle" letter-spacing="2">COMBATE</text><circle cx="160" cy="22" r="4.5" fill="%23ef4444"/></svg>`;

const UOL_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 70" width="100%" height="100%"><rect width="160" height="70" rx="12" fill="%23101827"/><circle cx="50" cy="35" r="18" fill="none" stroke="%23ff6600" stroke-width="7"/><text x="105" y="45" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="%23ffffff" text-anchor="middle">uol</text></svg>`;

const CANAL_DO_BOI_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="100%" height="100%"><rect width="180" height="80" rx="12" fill="%23111827"/><circle cx="46" cy="40" r="20" fill="none" stroke="%2322c55e" stroke-width="4"/><path d="M38 34 Q46 24 54 34 Q50 50 38 34" fill="%2322c55e"/><text x="118" y="36" font-family="system-ui, sans-serif" font-weight="bold" font-size="14" fill="%23ffffff">CANAL</text><text x="118" y="54" font-family="system-ui, sans-serif" font-weight="900" font-size="15" fill="%2322c55e">DO BOI</text></svg>`;

const TV_DIARIO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80" width="100%" height="100%"><rect width="160" height="80" rx="12" fill="%230f172a"/><polygon points="35,22 65,40 35,58" fill="%2338bdf8"/><text x="110" y="38" font-family="system-ui, sans-serif" font-weight="bold" font-size="15" fill="%23ffffff">TV</text><text x="110" y="56" font-family="system-ui, sans-serif" font-weight="bold" font-size="15" fill="%2338bdf8">DIÁRIO</text></svg>`;

const TV_JUSTICA_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80" width="100%" height="100%"><rect width="160" height="80" rx="12" fill="%230f172a"/><circle cx="45" cy="40" r="18" fill="none" stroke="%23ffffff" stroke-width="4"/><line x1="45" y1="28" x2="45" y2="52" stroke="%23ffffff" stroke-width="3"/><text x="105" y="38" font-family="system-ui, sans-serif" font-weight="bold" font-size="13" fill="%23ffffff">TV</text><text x="105" y="55" font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="%23f59e0b">JUSTIÇA</text></svg>`;

const CURTA_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80" width="100%" height="100%"><rect width="160" height="80" rx="14" fill="%23ffd200"/><text x="80" y="53" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="34" fill="%2318181b" text-anchor="middle" letter-spacing="-0.5">curta!</text></svg>`;

const RED_BULL_TV_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="100%" height="100%"><rect width="180" height="80" rx="12" fill="%230b1329"/><circle cx="46" cy="40" r="22" fill="%23ffd100"/><circle cx="46" cy="40" r="11" fill="%23dc2626"/><text x="116" y="36" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="15" fill="%23ffffff" text-anchor="middle">RED BULL</text><text x="116" y="56" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="15" fill="%23dc2626" text-anchor="middle" letter-spacing="1">TV</text></svg>`;

const NHK_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80" width="100%" height="100%"><rect width="160" height="80" rx="12" fill="%230f172a"/><g transform="translate(14, 20)"><rect x="0" y="0" width="38" height="40" rx="8" fill="%23ffffff"/><text x="19" y="29" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="%230f172a" text-anchor="middle">N</text><rect x="47" y="0" width="38" height="40" rx="8" fill="%23ffffff"/><text x="66" y="29" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="%230f172a" text-anchor="middle">H</text><rect x="94" y="0" width="38" height="40" rx="8" fill="%23ffffff"/><text x="113" y="29" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="%230f172a" text-anchor="middle">K</text></g></svg>`;

const PLUTO_TV_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="100%" height="100%"><rect width="180" height="80" rx="12" fill="%2309090b"/><circle cx="42" cy="40" r="20" fill="none" stroke="%23fbbf24" stroke-width="5"/><circle cx="42" cy="40" r="11" fill="none" stroke="%23ec4899" stroke-width="4"/><text x="115" y="38" font-family="system-ui, sans-serif" font-weight="900" font-size="22" fill="%23ffffff" text-anchor="middle">pluto<tspan fill="%2338bdf8">tv</tspan></text><text x="115" y="58" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="%23ef4444" text-anchor="middle" letter-spacing="2">ESPORTES</text></svg>`;

const TRAVEL_BOX_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="100%" height="100%"><rect width="180" height="80" rx="12" fill="%230f172a"/><rect x="16" y="18" width="40" height="44" rx="8" fill="%23f97316"/><text x="36" y="46" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="%23ffffff" text-anchor="middle">TB</text><text x="116" y="37" font-family="system-ui, sans-serif" font-weight="900" font-size="15" fill="%23ffffff">TRAVEL</text><text x="116" y="54" font-family="system-ui, sans-serif" font-weight="900" font-size="12" fill="%23f97316">BOX BRASIL</text></svg>`;

const E_ENTERTAINMENT_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80" width="100%" height="100%"><rect width="160" height="80" rx="12" fill="%23000000"/><circle cx="80" cy="40" r="28" fill="none" stroke="%23ffffff" stroke-width="5"/><text x="76" y="51" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="34" fill="%23ffffff" text-anchor="middle">E!</text></svg>`;

const GOSPEL_MOVIES_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="100%" height="100%"><rect width="180" height="80" rx="12" fill="%2318181b"/><path d="M34,20 L34,60 M22,34 L46,34" stroke="%2338bdf8" stroke-width="5" stroke-linecap="round"/><text x="112" y="38" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="%23ffffff">GOSPEL</text><text x="112" y="56" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="%2338bdf8" letter-spacing="1">MOVIES</text></svg>`;

const REDE_SUPER_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="100%" height="100%"><rect width="180" height="80" rx="12" fill="%230f172a"/><polygon points="45,18 64,40 45,62 26,40" fill="%23ef4444"/><text x="45" y="47" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="20" fill="%23ffffff" text-anchor="middle">S</text><text x="118" y="37" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="%2394a3b8">REDE</text><text x="118" y="56" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="%23ef4444">SUPER</text></svg>`;

const VIVA_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80" width="100%" height="100%"><rect width="160" height="80" rx="14" fill="%23e11d48"/><text x="80" y="53" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" fill="%23ffffff" text-anchor="middle" letter-spacing="2">viva</text></svg>`;

// Ícone Reformulado: TNT Novelas (Círculo Magenta + Pill Novelas)
const TNT_NOVELAS_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="100%" height="100%"><rect width="180" height="80" rx="14" fill="%2316041c"/><circle cx="52" cy="40" r="26" fill="%23e11d48"/><text x="52" y="48.5" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="20" fill="%23ffffff" text-anchor="middle" letter-spacing="-0.5">TNT</text><rect x="90" y="27" width="80" height="26" rx="6" fill="%2306b6d4" fill-opacity="0.18" stroke="%2306b6d4" stroke-width="1.8"/><text x="130" y="44.5" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="11.5" fill="%2322d3ee" text-anchor="middle" letter-spacing="1.5">NOVELAS</text></svg>`;

// Ícone Reformulado: Music Box Brasil (Equalizador Neon + Tipografia)
const MUSIC_BOX_BRASIL_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="100%" height="100%"><rect width="180" height="80" rx="14" fill="%23090d16"/><rect x="18" y="32" width="5" height="24" rx="2" fill="%2306b6d4"/><rect x="26" y="20" width="5" height="36" rx="2" fill="%23f97316"/><rect x="34" y="26" width="5" height="30" rx="2" fill="%2306b6d4"/><rect x="42" y="16" width="5" height="40" rx="2" fill="%23a855f7"/><rect x="50" y="34" width="5" height="22" rx="2" fill="%23f97316"/><text x="116" y="36" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="14" fill="%23ffffff" text-anchor="middle">MUSIC BOX</text><rect x="85" y="44" width="62" height="17" rx="4" fill="%2306b6d4" fill-opacity="0.25"/><text x="116" y="56.5" font-family="system-ui, sans-serif" font-weight="900" font-size="10.5" fill="%2338bdf8" text-anchor="middle" letter-spacing="2">BRASIL</text></svg>`;

// Ícone Reformulado: Rá Tim Bum (Cores Lúdicas, Estrela e Emblema)
const RA_TIM_BUM_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="100%" height="100%"><rect width="180" height="80" rx="14" fill="%230c1527"/><rect x="6" y="6" width="168" height="68" rx="10" fill="%23172554" stroke="%23f59e0b" stroke-width="1.8" stroke-opacity="0.6"/><circle cx="38" cy="40" r="22" fill="%23f59e0b"/><polygon points="38,24 42,35 53,35 44,42 48,53 38,46 28,53 32,42 23,35 34,35" fill="%23dc2626"/><text x="112" y="34" font-family="system-ui, sans-serif" font-weight="900" font-size="11" fill="%2338bdf8" text-anchor="middle" letter-spacing="1">TV CULTURA</text><text x="112" y="55" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16.5" fill="%23fbbf24" text-anchor="middle" letter-spacing="-0.5">RÁ TIM BUM</text></svg>`;

// Ícone Oficial: SBT Alterosa (usa o logotipo oficial do SBT)
const SBT_ALTEROSA_SVG = `${TV_LOGO_BR}sbt-br.png`;

// Geradores de badges numerados oficiais para canais com múltiplas transmissões
// SporTV 4, 5 e 6 utilizam a imagem oficial do sportv com o número correspondente transparente no estilo SporTV 3
const makeSporTvBadge = (num: number): string =>
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 65" width="100%" height="100%"><image href="${TV_LOGO_BR}sportv-br.png" x="2" y="2" width="144" height="60" preserveAspectRatio="xMidYMid meet"/><rect x="150" y="8" width="46" height="48" rx="10" fill="%2322c55e"/><text x="173" y="43" font-family="-apple-system, BlinkMacSystemFont, Arial, sans-serif" font-weight="900" font-style="italic" font-size="32" fill="%23052e16" text-anchor="middle">${num}</text></svg>`;

const makeDaznBadge = (num: number): string =>
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="100%" height="100%"><rect width="180" height="80" rx="14" fill="%230d1117"/><rect x="18" y="22" width="76" height="36" rx="6" fill="%23f8fafc"/><text x="56" y="48" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="26" fill="%230a0a0a" text-anchor="middle" letter-spacing="-0.5">DAZN</text><circle cx="128" cy="40" r="18" fill="%23facc15"/><text x="128" y="47.5" font-family="system-ui, sans-serif" font-weight="900" font-size="22" fill="%23000000" text-anchor="middle">${num}</text></svg>`;

const makePremiereBadge = (num: number): string =>
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 80" width="100%" height="100%"><rect width="180" height="80" rx="14" fill="%23042f2e"/><rect x="6" y="6" width="168" height="68" rx="10" fill="%23064e3b" stroke="%2310b981" stroke-width="1.5" stroke-opacity="0.4"/><text x="75" y="47" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="18" fill="%23ffffff" text-anchor="middle" letter-spacing="1">PREMIERE</text><rect x="128" y="24" width="30" height="32" rx="7" fill="%23f59e0b"/><text x="143" y="48" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="%23000000" text-anchor="middle">${num}</text></svg>`;

// ==========================================
// FALLBACK BADGE GENERATOR VETORIAL REFORMULADO
// ==========================================

/**
 * Gera um emblema vetorial SVG de alta definição específico para a categoria e o nome do canal.
 * Utilizado sempre que um canal não possui arquivo de imagem disponível ou quando a URL remota falha.
 */
export function createChannelFallbackBadge(channelName: string, category?: string): string {
  const cleanName = (channelName || 'CANAL').trim();
  const upper = cleanName.toUpperCase();
  const catUpper = (category || '').toUpperCase();

  // Cores personalizadas e categorização automática
  let bgGrad1 = '%23182234';
  let bgGrad2 = '%230a0f1d';
  let accent = '%2338bdf8';
  let tag = 'CANAL';

  if (
    catUpper.includes('ESPORTE') ||
    upper.includes('SPORT') ||
    upper.includes('FUTEBOL') ||
    upper.includes('ESPN') ||
    upper.includes('DAZN') ||
    upper.includes('DAZAN') ||
    upper.includes('PREMIERE') ||
    upper.includes('COMBATE')
  ) {
    bgGrad1 = '%23064e3b';
    bgGrad2 = '%23022c22';
    accent = '%2310b981';
    tag = 'ESPORTES';
  } else if (
    catUpper.includes('FILME') ||
    catUpper.includes('SÉRIE') ||
    catUpper.includes('SERIE') ||
    upper.includes('CINEMA') ||
    upper.includes('HBO') ||
    upper.includes('TELECINE') ||
    upper.includes('PARAMOUNT') ||
    upper.includes('TNT')
  ) {
    bgGrad1 = '%234c0519';
    bgGrad2 = '%231f0208';
    accent = '%23f43f5e';
    tag = 'FILMES';
  } else if (
    catUpper.includes('INFANT') ||
    catUpper.includes('KID') ||
    upper.includes('CARTOON') ||
    upper.includes('DISNEY') ||
    upper.includes('GLOOB') ||
    upper.includes('NICK') ||
    upper.includes('BUM') ||
    upper.includes('ZOOMOO')
  ) {
    bgGrad1 = '%233b0764';
    bgGrad2 = '%231e1b4b';
    accent = '%23fbbf24';
    tag = 'INFANTIL';
  } else if (
    catUpper.includes('NOTÍCIA') ||
    catUpper.includes('NOTICIA') ||
    upper.includes('NEWS') ||
    upper.includes('CNN') ||
    upper.includes('PAN')
  ) {
    bgGrad1 = '%237f1d1d';
    bgGrad2 = '%23450a0a';
    accent = '%23ef4444';
    tag = 'NOTÍCIAS';
  } else if (
    catUpper.includes('VARIEDADE') ||
    catUpper.includes('MÚSIC') ||
    catUpper.includes('MUSIC') ||
    upper.includes('MTV') ||
    upper.includes('BIS') ||
    upper.includes('SOM') ||
    upper.includes('VIVA') ||
    upper.includes('GNT')
  ) {
    bgGrad1 = '%23581c87';
    bgGrad2 = '%231e1b4b';
    accent = '%23d946ef';
    tag = 'VARIEDADES';
  } else if (
    catUpper.includes('RELIGIO') ||
    upper.includes('GOSPEL') ||
    upper.includes('VIDA') ||
    upper.includes('APARECIDA') ||
    upper.includes('CANÇÃO') ||
    upper.includes('CANCAO')
  ) {
    bgGrad1 = '%231e3a5f';
    bgGrad2 = '%230c1e33';
    accent = '%23fbbf24';
    tag = 'RELIGIÃO';
  } else if (
    catUpper.includes('DOC') ||
    upper.includes('DISCOVERY') ||
    upper.includes('GEO') ||
    upper.includes('HISTORY') ||
    upper.includes('ANIMAL')
  ) {
    bgGrad1 = '%23134e4a';
    bgGrad2 = '%23042f2e';
    accent = '%232dd4bf';
    tag = 'DOCS';
  } else if (
    catUpper.includes('ABERTA') ||
    upper.includes('GLOBO') ||
    upper.includes('SBT') ||
    upper.includes('BAND') ||
    upper.includes('RECORD') ||
    upper.includes('CULTURA')
  ) {
    bgGrad1 = '%231e293b';
    bgGrad2 = '%230f172a';
    accent = '%2338bdf8';
    tag = 'TV ABERTA';
  }

  // Quebra elegante em 1 ou 2 linhas para que o nome nunca fique cortado
  const words = cleanName.split(/\s+/);
  let line1 = cleanName;
  let line2 = '';
  if (cleanName.length > 10 && words.length > 1) {
    const mid = Math.ceil(words.length / 2);
    line1 = words.slice(0, mid).join(' ');
    line2 = words.slice(mid).join(' ');
  }

  const safeLine1 = line1.slice(0, 16);
  const safeLine2 = line2.slice(0, 16);

  // Hash único para evitar conflito de IDs de gradientes SVG no DOM
  const gradId = 'fb_' + Math.abs(cleanName.split('').reduce((acc, c) => ((acc << 5) - acc) + c.charCodeAt(0), 0)).toString(36);

  const textSvg = line2
    ? `<text x="80" y="47" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="13" fill="%23ffffff" text-anchor="middle" letter-spacing="0.5">${encodeURIComponent(safeLine1)}</text><text x="80" y="65" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="12" fill="${accent}" text-anchor="middle" letter-spacing="0.5">${encodeURIComponent(safeLine2)}</text>`
    : `<text x="80" y="54" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="15" fill="%23ffffff" text-anchor="middle" letter-spacing="0.5">${encodeURIComponent(safeLine1)}</text>`;

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90" width="100%" height="100%"><defs><linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${bgGrad1}"/><stop offset="100%" stop-color="${bgGrad2}"/></linearGradient></defs><rect width="160" height="90" rx="14" fill="url(%23${gradId})"/><rect x="4" y="4" width="152" height="82" rx="11" fill="none" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.35"/><rect x="8" y="8" width="56" height="15" rx="4" fill="%23000000" fill-opacity="0.55"/><text x="36" y="19" font-family="system-ui, sans-serif" font-weight="800" font-size="7.5" fill="${accent}" text-anchor="middle" letter-spacing="1">${encodeURIComponent(tag)}</text>${textSvg}</svg>`.replace(/\s+/g, ' ');
}

// ==========================================
// MAPA DE LOGOS OFICIAIS REFORMULADOS
// ==========================================

export const DEFAULT_LOGOS_MAP: Record<string, string> = {
  // TV ABERTA / REGIONAIS
  'GLOBO': `${TV_LOGO_BR}globo-br.png`,
  'GLOBO SP': `${TV_LOGO_BR}globo-br.png`,
  'GLOBO RJ': `${TV_LOGO_BR}globo-br.png`,
  'GLOBO MG': `${TV_LOGO_BR}globo-br.png`,
  'GLOBO ES': `${TV_LOGO_BR}globo-br.png`,
  'GLOBO RS': `${TV_LOGO_BR}globo-br.png`,
  'GLOBO PR': `${TV_LOGO_BR}globo-br.png`,
  'GLOBO SC': `${TV_LOGO_BR}globo-br.png`,
  'GLOBO BA': `${TV_LOGO_BR}globo-br.png`,
  'GLOBO PE': `${TV_LOGO_BR}globo-br.png`,
  'GLOBO CE': `${TV_LOGO_BR}globo-br.png`,
  'GLOBO DF': `${TV_LOGO_BR}globo-br.png`,
  'GLOBO GAZETA': `${TV_LOGO_BR}globo-br.png`,
  'GLOBO INTEGRAÇÃO': `${TV_LOGO_BR}globo-br.png`,
  'GLOBO ES TV GAZETA VITÓRIA': `${TV_LOGO_BR}globo-br.png`,
  'GLOBO MG TV INTEGRAÇÃO JUIZ DE FORA': `${TV_LOGO_BR}globo-br.png`,
  'INTEGRAÇÃO JUIZ DE FORA': `${TV_LOGO_BR}globo-br.png`,
  'INTEGRACAO JUIZ DE FORA': `${TV_LOGO_BR}globo-br.png`,
  'INTEGRAÇÃO': `${TV_LOGO_BR}globo-br.png`,
  'INTEGRACAO': `${TV_LOGO_BR}globo-br.png`,
  'TV INTEGRAÇÃO': `${TV_LOGO_BR}globo-br.png`,
  'TV INTEGRACAO': `${TV_LOGO_BR}globo-br.png`,
  'TV INTEGRAÇÃO JUIZ DE FORA': `${TV_LOGO_BR}globo-br.png`,
  'SBT': `${TV_LOGO_BR}sbt-br.png`,
  'SBT SP': `${TV_LOGO_BR}sbt-br.png`,
  'SBT RJ': `${TV_LOGO_BR}sbt-br.png`,
  'SBT MG ALTEROSA': SBT_ALTEROSA_SVG,
  'SBT MG ALTEROSA ': SBT_ALTEROSA_SVG,
  'SBT ALTEROSA': SBT_ALTEROSA_SVG,
  'ALTEROSA': SBT_ALTEROSA_SVG,
  'ALTEROSA TV': SBT_ALTEROSA_SVG,
  'TV ALTEROSA': SBT_ALTEROSA_SVG,
  'BAND': `${TV_LOGO_BR}band-br.png`,
  'BAND SP': `${TV_LOGO_BR}band-br.png`,
  'BAND RJ': `${TV_LOGO_BR}band-br.png`,
  'RECORD': `${TV_LOGO_BR}record-br.png`,
  'RECORD SP': `${TV_LOGO_BR}record-br.png`,
  'RECORD RJ': `${TV_LOGO_BR}record-br.png`,
  'RECORD MG': `${TV_LOGO_BR}record-br.png`,
  'RECORD MINAS': `${TV_LOGO_BR}record-br.png`,
  'RECORD TV': `${TV_LOGO_BR}record-br.png`,
  'RECORD TV MINAS': `${TV_LOGO_BR}record-br.png`,
  'REDE TV': `${TV_LOGO_BR}rede-tv-br.png`,
  'REDETV': `${TV_LOGO_BR}rede-tv-br.png`,
  'TV CULTURA': `${TV_LOGO_BR}tv-cultura-br.png`,
  'CULTURA': `${TV_LOGO_BR}tv-cultura-br.png`,
  'TV BRASIL': `${TV_LOGO_BR}tv-brasil-br.png`,
  'TV GAZETA': `${TV_LOGO_BR}tv-gazeta-br.png`,
  'GAZETA': `${TV_LOGO_BR}tv-gazeta-br.png`,
  'FUTURA': `${TV_LOGO_BR}futura-br.png`,
  'TV CÂMARA': `${TV_LOGO_BR}tv-camara-br.png`,
  'TV CAMARA': `${TV_LOGO_BR}tv-camara-br.png`,
  'TV SENADO': `${TV_LOGO_BR}tv-senado-br.png`,
  'TV RÁ TIM BUM': `${TV_LOGO_BR}tv-ra-tim-bum-br.png`,
  'TV RA TIM BUM': `${TV_LOGO_BR}tv-ra-tim-bum-br.png`,
  'RA TIM BUM': `${TV_LOGO_BR}tv-ra-tim-bum-br.png`,
  'RÁ TIM BUM': `${TV_LOGO_BR}tv-ra-tim-bum-br.png`,
  'RATIMBUM': `${TV_LOGO_BR}tv-ra-tim-bum-br.png`,
  'CANAL DO BOI': CANAL_DO_BOI_SVG,
  'CANAL RURAL': `${TV_LOGO_BR}canal-rural-br.png`,
  'AGRO+': `${TV_LOGO_BR}agro-mais-br.png`,
  'AGRO MAIS': `${TV_LOGO_BR}agro-mais-br.png`,
  'TV DIÁRIO': TV_DIARIO_SVG,
  'TV DIARIO': TV_DIARIO_SVG,
  'TV JUSTIÇA': TV_JUSTICA_SVG,
  'TV JUSTICA': TV_JUSTICA_SVG,
  'TV BAHIA': `${TV_LOGO_BR}tv-bahia-br.png`,
  'TV ESCOLA': `${TV_LOGO_BR}tv-escola-br.png`,
  'TV MEIO': `${TV_LOGO_BR}tv-meio-br.png`,
  'CANAL GOV': `${TV_LOGO_BR}canal-gov-br.png`,
  'CANAL EMPREENDER': `${TV_LOGO_BR}canal-empreender-br.png`,
  'SABOR & ARTE': `${TV_LOGO_BR}sabor-and-arte-br.png`,
  'SABOR E ARTE': `${TV_LOGO_BR}sabor-and-arte-br.png`,
  'TERRAVIVA': `${TV_LOGO_BR}terraviva-br.png`,
  'TERRA VIVA': `${TV_LOGO_BR}terraviva-br.png`,
  'IDEAL TV': `${TV_LOGO_BR}ideal-tv-br.png`,
  'RBI': `${TV_LOGO_BR}rbi-br.png`,
  'REDE CNT': `${TV_LOGO_BR}rede-cnt-br.png`,

  // ESPORTES & PPV
  'SPORTV': `${TV_LOGO_BR}sportv-br.png`,
  'SPORTTV': `${TV_LOGO_BR}sportv-br.png`,
  'SPORTV 2': `${TV_LOGO_BR}sportv2-br.png`,
  'SPORTTV 2': `${TV_LOGO_BR}sportv2-br.png`,
  'SPORTV 3': `${TV_LOGO_BR}sportv3-br.png`,
  'SPORTTV 3': `${TV_LOGO_BR}sportv3-br.png`,
  'SPORTV 4': makeSporTvBadge(4),
  'SPORTTV 4': makeSporTvBadge(4),
  'SPORTV 5': makeSporTvBadge(5),
  'SPORTTV 5': makeSporTvBadge(5),
  'SPORTV 6': makeSporTvBadge(6),
  'SPORTTV 6': makeSporTvBadge(6),
  'BAND SPORTS': `${TV_LOGO_BR}band-sports-br.png`,
  'BANDSPORTS': `${TV_LOGO_BR}band-sports-br.png`,
  'ESPN': `${TV_LOGO_US}espn-us.png`,
  'ESPN 2': `${TV_LOGO_US}espn-2-us.png`,
  'ESPN 3': `${TV_LOGO_US}espn-3-us.png`,
  'ESPN 4': `${TV_LOGO_BR}espn-4-br.png`,
  'ESPN 5': `${TV_LOGO_BR}espn-5-br.png`,
  'ESPN 6': `${TV_LOGO_BR}espn-extra-br.png`,
  'ESPN EXTRA': `${TV_LOGO_BR}espn-extra-br.png`,
  'FOX SPORTS': `${TV_LOGO_US}fox-sports-us.png`,
  'FOX SPORTS 2': `${TV_LOGO_BR}fox-sports-2-br.png`,
  'COMBATE': COMBATE_SVG,
  'PREMIERE': `${TV_LOGO_BR}premiere-br.png`,
  'PREMIERE CLUBES': `${TV_LOGO_BR}premiere-br.png`,
  'PREMIERE 1': `${TV_LOGO_BR}premiere-br.png`,
  'PREMIERE 2': `${TV_LOGO_BR}premiere-br.png`,
  'PREMIERE 3': `${TV_LOGO_BR}premiere-br.png`,
  'PREMIERE 4': `${TV_LOGO_BR}premiere-br.png`,
  'PREMIERE 5': `${TV_LOGO_BR}premiere-br.png`,
  'PREMIERE 6': `${TV_LOGO_BR}premiere-br.png`,
  'PREMIERE 7': `${TV_LOGO_BR}premiere-br.png`,
  'PREMIERE 8': `${TV_LOGO_BR}premiere-br.png`,
  'PREMIERE 8 MOSAICO': `${TV_LOGO_BR}premiere-br.png`,
  'DAZN': `${TV_LOGO_US}dazn-us.png`,
  'DAZAN': `${TV_LOGO_US}dazn-us.png`,
  'DAZN 1': `${TV_LOGO_US}dazn-us.png`,
  'DAZN 2': `${TV_LOGO_US}dazn-us.png`,
  'DAZN 3': `${TV_LOGO_US}dazn-us.png`,
  'DAZN 4': `${TV_LOGO_US}dazn-us.png`,
  'DAZN 5': `${TV_LOGO_US}dazn-us.png`,
  'DAZN 6': `${TV_LOGO_US}dazn-us.png`,
  'DAZN 7': `${TV_LOGO_US}dazn-us.png`,
  'DAZN 8': `${TV_LOGO_US}dazn-us.png`,
  'DAZN 9': `${TV_LOGO_US}dazn-us.png`,
  'DAZN 10': `${TV_LOGO_US}dazn-us.png`,
  'DAZAN 1': `${TV_LOGO_US}dazn-us.png`,
  'DAZAN 2': `${TV_LOGO_US}dazn-us.png`,
  'DAZAN 3': `${TV_LOGO_US}dazn-us.png`,
  'DAZAN 4': `${TV_LOGO_US}dazn-us.png`,
  'DAZAN 5': `${TV_LOGO_US}dazn-us.png`,
  'DAZAN 6': `${TV_LOGO_US}dazn-us.png`,
  'CAZÉ TV': CAZE_TV_SVG,
  'CAZE TV': CAZE_TV_SVG,
  'CAZETV': CAZE_TV_SVG,
  'UFC FIGHT PASS': `${TV_LOGO_US}ufc-fight-pass-us.png`,
  'UFC': `${TV_LOGO_US}ufc-fight-pass-us.png`,
  'PLUTO TV ESPORTES': PLUTO_TV_SVG,
  'PLUTO TV': PLUTO_TV_SVG,
  'GE TV': `${TV_LOGO_BR}ge-tv-br.png`,

  // FILMES & SÉRIES
  'TELECINE ACTION': `${TV_LOGO_BR}tele-cine-action-br.png`,
  'TELECINE CULT': `${TV_LOGO_BR}tele-cine-cult-br.png`,
  'TELECINE FUN': `${TV_LOGO_BR}tele-cine-fun-br.png`,
  'TELECINE PIPOCA': `${TV_LOGO_BR}tele-cine-pipoca-br.png`,
  'TELECINE PREMIUM': `${TV_LOGO_BR}tele-cine-premium-br.png`,
  'TELECINE TOUCH': `${TV_LOGO_BR}tele-cine-touch-br.png`,
  'HBO': `${TV_LOGO_BR}hbo-br.png`,
  'HBO 2': `${TV_LOGO_BR}hbo-2-br.png`,
  'HBO FAMILY': `${TV_LOGO_BR}hbo-family-br.png`,
  'HBO MUNDI': `${TV_LOGO_BR}hbo-mundi-br.png`,
  'HBO PLUS': `${TV_LOGO_BR}hbo-plus-br.png`,
  'HBO POP': `${TV_LOGO_BR}hbo-pop-br.png`,
  'HBO SIGNATURE': `${TV_LOGO_BR}hbo-signature-br.png`,
  'HBO XTREME': `${TV_LOGO_BR}hbo-xtreme-br.png`,
  'HBO MAX': `${TV_LOGO_BR}hbo-br.png`,
  'HBO MAX 2': `${TV_LOGO_BR}hbo-2-br.png`,
  'HBO MAX 3': `${TV_LOGO_BR}hbo-plus-br.png`,
  'HBO MAX 4': `${TV_LOGO_BR}hbo-signature-br.png`,
  'HBO MAX 5': `${TV_LOGO_BR}hbo-family-br.png`,
  'MEGAPIX': `${TV_LOGO_BR}megapix-br.png`,
  'SPACE': `${TV_LOGO_BR}space-br.png`,
  'TNT': `${TV_LOGO_BR}tnt-br.png`,
  'TNT SERIES': `${TV_LOGO_BR}tnt-series-br.png`,
  'TNT SÉRIES': `${TV_LOGO_BR}tnt-series-br.png`,
  'TNT NOVELAS': TNT_NOVELAS_SVG,
  'TNT NOVELA': TNT_NOVELAS_SVG,
  'WARNER': `${TV_LOGO_BR}warner-channel-br.png`,
  'WARNER CHANNEL': `${TV_LOGO_BR}warner-channel-br.png`,
  'UNIVERSAL': `${TV_LOGO_BR}universal-tv-br.png`,
  'UNIVERSAL TV': `${TV_LOGO_BR}universal-tv-br.png`,
  'UNIVERSAL CHANNEL': `${TV_LOGO_BR}universal-tv-br.png`,
  'STUDIO UNIVERSAL': `${TV_LOGO_BR}studio-universal-br.png`,
  'USA NETWORK': `${TV_LOGO_BR}usa-br.png`,
  'USA': `${TV_LOGO_BR}usa-br.png`,
  'SONY': `${TV_LOGO_BR}sony-channel-br.png`,
  'SONY CHANNEL': `${TV_LOGO_BR}sony-channel-br.png`,
  'SONY MOVIES': `${TV_LOGO_BR}sony-movies-br.png`,
  'AXN': `${TV_LOGO_BR}axn-br.png`,
  'A&E': `${TV_LOGO_BR}a-and-e-br.png`,
  'AMC': `${TV_LOGO_US}amc-us.png`,
  'CINEMAX': `${TV_LOGO_BR}cinemax-br.png`,
  'CINECANAL': `${TV_LOGO_BR}cine-canal-br.png`,
  'TCM': `${TV_LOGO_BR}tcm-br.png`,
  'STAR CHANNEL': `${TV_LOGO_BR}star-channel-br.png`,
  'STAR HITS': `${TV_LOGO_BR}star-channel-br.png`,
  'STAR LIFE': `${TV_LOGO_BR}star-channel-br.png`,
  'PARAMOUNT': `${TV_LOGO_BR}paramount-network-br.png`,
  'PARAMOUNT NETWORK': `${TV_LOGO_BR}paramount-network-br.png`,
  'PARAMOUNT CHANNEL': `${TV_LOGO_BR}paramount-network-br.png`,
  'CANAL BRASIL': `${TV_LOGO_BR}canal-brasil-br.png`,
  'ARTE 1': `${TV_LOGO_BR}arte1-br.png`,
  'ART 1': `${TV_LOGO_BR}arte1-br.png`,
  'FX': `${TV_LOGO_BR}star-channel-br.png`,
  'FXM': `${TV_LOGO_BR}star-channel-br.png`,
  'SYFY': `${TV_LOGO_US}syfy-us.png`,
  'COMEDY CENTRAL': `${TV_LOGO_US}comedy-central-us.png`,
  'PRIME BOX BRAZIL': `${TV_LOGO_BR}prime-box-brazil-br.png`,

  // INFANTIS
  'CARTOON NETWORK': `${TV_LOGO_BR}cartoon-network-br.png`,
  'CARTOONITO': `${TV_LOGO_BR}cartoonito-br.png`,
  'DISCOVERY KIDS': `${TV_LOGO_BR}discovery-kids-br.png`,
  'GLOOB': `${TV_LOGO_BR}gloob-br.png`,
  'GLOOBINHO': `${TV_LOGO_BR}gloobinho-br.png`,
  'NICKELODEON': `${TV_LOGO_US}nickelodeon-us.png`,
  'NICK JR': `${TV_LOGO_US}nick-jr-us.png`,
  'DISNEY CHANNEL': `${TV_LOGO_US}disney-channel-us.png`,
  'DISNEY JUNIOR': `${TV_LOGO_US}disney-jr-us.png`,
  'DISNEY JR': `${TV_LOGO_US}disney-jr-us.png`,
  'TOONCAST': `${TV_LOGO_BR}tooncast-br.png`,
  'WOOHOO': `${TV_LOGO_BR}woohoo-br.png`,
  'ZOOMOO': `${TV_LOGO_BR}zoomoo-br.png`,
  'ZOOMOO KIDS': `${TV_LOGO_BR}zoomoo-br.png`,
  'BABY TV': `${TV_LOGO_BR}box-kids-tv-br.png`,
  'DREAMWORKS': `${TV_LOGO_BR}dreamworks-channel-br.png`,

  // NOTÍCIAS
  'GLOBONEWS': `${TV_LOGO_BR}globo-news-br.png`,
  'GLOBO NEWS': `${TV_LOGO_BR}globo-news-br.png`,
  'CNN BRASIL': `${TV_LOGO_BR}cnn-brasil-br.png`,
  'CNN BRASIL MONEY': `${TV_LOGO_BR}cnn-brasil-money-br.png`,
  'CNN MONEY': `${TV_LOGO_BR}cnn-brasil-money-br.png`,
  'BAND NEWS': `${TV_LOGO_BR}band-news-br.png`,
  'BANDNEWS': `${TV_LOGO_BR}band-news-br.png`,
  'JOVEM PAN NEWS': `${TV_LOGO_BR}jovem-pan-news-br.png`,
  'RECORD NEWS': `${TV_LOGO_BR}record-news-br.png`,
  'SBT NEWS': `${TV_LOGO_BR}sbt-news-br.png`,
  'TIMES BRASIL CNBC': `${TV_LOGO_BR}times-brasil-cnbc-br.png`,
  'CNBC BRASIL': `${TV_LOGO_BR}times-brasil-cnbc-br.png`,
  'UOL': UOL_SVG,

  // DOCUMENTÁRIOS
  'DISCOVERY CHANNEL': `${TV_LOGO_US}discovery-channel-us.png`,
  'DISCOVERY': `${TV_LOGO_US}discovery-channel-us.png`,
  'DISCOVERY TURBO': `${TV_LOGO_BR}discovery-turbo-br.png`,
  'DISCOVERY SCIENCE': `${TV_LOGO_US}discovery-science-us.png`,
  'DISCOVERY THEATER': `${TV_LOGO_LAM}discovery-theater-hd-lam.png`,
  'DISCOVERY WORLD': `${TV_LOGO_AR}discovery-world-hd-ar.png`,
  'DISCOVERY H&H': `${TV_LOGO_LAM}discovery-home-and-health-lam.png`,
  'DISCOVERY HOME & HEALTH': `${TV_LOGO_LAM}discovery-home-and-health-lam.png`,
  'ANIMAL PLANET': `${TV_LOGO_US}animal-planet-us.png`,
  'ANIMAL PLANE': `${TV_LOGO_US}animal-planet-us.png`,
  'HISTORY': `${TV_LOGO_US}history-channel-us.png`,
  'HISTORY CHANNEL': `${TV_LOGO_US}history-channel-us.png`,
  'HISTORY 2': `${TV_LOGO_US}history-channel-2-us.png`,
  'HISTORY CHANNEL 2': `${TV_LOGO_US}history-channel-2-us.png`,
  'H2': `${TV_LOGO_US}history-channel-2-us.png`,
  'NATIONAL GEOGRAPHIC': `${TV_LOGO_US}national-geographic-us.png`,
  'NATGEO': `${TV_LOGO_US}national-geographic-us.png`,
  'NATGEO WILD': `${TV_LOGO_US}nat-geo-wild-us.png`,
  'NAT GEO WILD': `${TV_LOGO_US}nat-geo-wild-us.png`,
  'TLC': `${TV_LOGO_US}tlc-us.png`,
  'HGTV': `${TV_LOGO_US}hgtv-us.png`,
  'INVESTIGAÇÃO DISCOVERY': `${TV_LOGO_US}investigation-discovery-us.png`,
  'INVESTIGACAO DISCOVERY': `${TV_LOGO_US}investigation-discovery-us.png`,
  'DISCOVERY ID': `${TV_LOGO_US}investigation-discovery-us.png`,
  'CURTA!': CURTA_SVG,
  'CURTA': CURTA_SVG,
  'DOG TV': `${TV_LOGO_US}dog-tv-us.png`,
  'FISH TV': `${TV_LOGO_BR}fish-tv-br.png`,
  'FOOD NETWORK': `${TV_LOGO_US}food-network-us.png`,
  'LOVE NATURE': `${TV_LOGO_CA}love-nature-ca.png`,
  'NHK': NHK_SVG,
  'RED BULL TV': `${TV_LOGO_INT}red-bull-tv-int.png`,
  'RED BULL': `${TV_LOGO_INT}red-bull-tv-int.png`,
  'TRAVEL BOX BRASIL': TRAVEL_BOX_SVG,

  // MÚSICA & VARIEDADES
  'MULTISHOW': `${TV_LOGO_BR}multishow-br.png`,
  'GNT': `${TV_LOGO_BR}gnt-br.png`,
  'BIS': `${TV_LOGO_BR}bis-br.png`,
  'OFF': `${TV_LOGO_BR}canal-off-br.png`,
  'CANAL OFF': `${TV_LOGO_BR}canal-off-br.png`,
  'VIVA': VIVA_SVG,
  'GLOBOPLAY NOVELAS': `${TV_LOGO_BR}globoplay-novelas-br.png`,
  'MTV': `${TV_LOGO_US}mtv-us.png`,
  'MTV LIVE': `${TV_LOGO_US}mtv-live-us.png`,
  'VH1': `${TV_LOGO_US}vh1-us.png`,
  'MUSIC BOX BRASIL': MUSIC_BOX_BRASIL_SVG,
  'MUSIC BOX': MUSIC_BOX_BRASIL_SVG,
  'E!': `${TV_LOGO_US}e-entertainment-us.png`,
  'E! ENTERTAINMENT': `${TV_LOGO_US}e-entertainment-us.png`,
  'MODO VIAGEM': `${TV_LOGO_BR}modo-viagem-br.png`,
  'TRACE BRASIL': `${TV_LOGO_BR}trace-brasil-br.png`,
  'PLAY TV': `${TV_LOGO_BR}play-tv-br.png`,

  // RELIGIOSOS
  'TV APARECIDA': `${TV_LOGO_BR}tv-aparecida-br.png`,
  'APARECIDA': `${TV_LOGO_BR}tv-aparecida-br.png`,
  'CANÇÃO NOVA': `${TV_LOGO_BR}cancao-nova-tv-br.png`,
  'CANCAO NOVA': `${TV_LOGO_BR}cancao-nova-tv-br.png`,
  'NOVO TEMPO': `${TV_LOGO_BR}novo-tempo-br.png`,
  'TV PAI ETERNO': `${TV_LOGO_BR}tv-pai-eterno-br.png`,
  'PAI ETERNO': `${TV_LOGO_BR}tv-pai-eterno-br.png`,
  'REDE VIDA': `${TV_LOGO_BR}rede-vida-br.png`,
  'RIT': `${TV_LOGO_BR}rit-br.png`,
  'REDE GOSPEL': `${TV_LOGO_BR}rede-gospel-br.png`,
  'REDE SÉCULO 21': `${TV_LOGO_BR}rede-21-br.png`,
  'REDE SECULO 21': `${TV_LOGO_BR}rede-21-br.png`,
  'REDE SUPER': REDE_SUPER_SVG,
  'GOSPEL MOVIES': GOSPEL_MOVIES_SVG,
  'BOAS NOVAS': `${TV_LOGO_BR}rede-vida-br.png`,
  'EVANGELIZAR': `${TV_LOGO_BR}tv-aparecida-br.png`,
  'TV EVANGELIZAR': `${TV_LOGO_BR}tv-aparecida-br.png`,
};

/**
 * Retorna o logo correspondente ao canal.
 * 1. Verifica se o usuário salvou uma URL personalizada
 * 2. Procura no dicionário padrão exato
 * 3. Procura por correspondência parcial inteligente
 * 4. Gera fallback estilizado e temático para qualquer canal não cadastrado
 */
export const getChannelLogo = (
  channelName: string,
  customLogos?: CustomLogosMap,
  category?: string
): string => {
  const trimmed = (channelName || '').trim();
  const upper = trimmed.toUpperCase();

  // 1. Personalizado
  if (customLogos && customLogos[trimmed]) {
    return customLogos[trimmed];
  }
  if (customLogos && customLogos[upper]) {
    return customLogos[upper];
  }

  // 2. Dicionário exato
  if (DEFAULT_LOGOS_MAP[upper]) {
    return DEFAULT_LOGOS_MAP[upper];
  }

  // 3. Correspondências parciais inteligentes

  // Kids & Rá Tim Bum
  if (upper.includes('RA TIM BUM') || upper.includes('RÁ TIM BUM') || upper.includes('RATIMBUM')) {
    return `${TV_LOGO_BR}tv-ra-tim-bum-br.png`;
  }
  if (upper.includes('CARTOONITO')) return `${TV_LOGO_BR}cartoonito-br.png`;
  if (upper.includes('CARTOON NETWORK')) return `${TV_LOGO_BR}cartoon-network-br.png`;
  if (upper.includes('TOONCAST')) return `${TV_LOGO_BR}tooncast-br.png`;
  if (upper.includes('ZOOMOO')) return `${TV_LOGO_BR}zoomoo-br.png`;
  if (upper.includes('GLOOBINHO')) return `${TV_LOGO_BR}gloobinho-br.png`;
  if (upper.includes('GLOOB')) return `${TV_LOGO_BR}gloob-br.png`;
  if (upper.includes('NICKELODEON') || upper.includes('NICK')) return `${TV_LOGO_US}nickelodeon-us.png`;

  // TNT Novelas & Séries
  if (upper.includes('TNT NOVELA')) return TNT_NOVELAS_SVG;
  if (upper.includes('TNT SERIES') || upper.includes('TNT SÉRIES')) return `${TV_LOGO_BR}tnt-series-br.png`;
  if (upper.includes('TNT')) return `${TV_LOGO_BR}tnt-br.png`;

  // Music Box Brasil
  if (upper.includes('MUSIC BOX')) return MUSIC_BOX_BRASIL_SVG;

  // SporTV (canais 1 a 6)
  if (upper.includes('SPORTV 6') || upper.includes('SPORTTV 6')) return makeSporTvBadge(6);
  if (upper.includes('SPORTV 5') || upper.includes('SPORTTV 5')) return makeSporTvBadge(5);
  if (upper.includes('SPORTV 4') || upper.includes('SPORTTV 4')) return makeSporTvBadge(4);
  if (upper.includes('SPORTV 3') || upper.includes('SPORTTV 3')) return `${TV_LOGO_BR}sportv3-br.png`;
  if (upper.includes('SPORTV 2') || upper.includes('SPORTTV 2')) return `${TV_LOGO_BR}sportv2-br.png`;
  if (upper.includes('SPORTV') || upper.includes('SPORTTV')) return `${TV_LOGO_BR}sportv-br.png`;

  // DAZN / DAZAN (todos usam o logo oficial DAZN com DA e ZN empilhados)
  if (upper.includes('DAZN') || upper.includes('DAZAN')) {
    return `${TV_LOGO_US}dazn-us.png`;
  }

  // Premiere (todos usam o logo oficial Premiere padrão)
  if (upper.includes('PREMIERE')) {
    return `${TV_LOGO_BR}premiere-br.png`;
  }

  // Fox Sports
  if (upper.includes('FOX SPORTS 2')) return `${TV_LOGO_BR}fox-sports-2-br.png`;
  if (upper.includes('FOX SPORTS') || upper.includes('FOXSPORTS')) return `${TV_LOGO_US}fox-sports-us.png`;

  // ESPN
  if (upper.startsWith('ESPN 2')) return `${TV_LOGO_US}espn-2-us.png`;
  if (upper.startsWith('ESPN 3')) return `${TV_LOGO_US}espn-3-us.png`;
  if (upper.startsWith('ESPN 4')) return `${TV_LOGO_BR}espn-4-br.png`;
  if (upper.startsWith('ESPN 5')) return `${TV_LOGO_BR}espn-5-br.png`;
  if (upper.startsWith('ESPN 6') || upper.includes('EXTRA')) return `${TV_LOGO_BR}espn-extra-br.png`;
  if (upper.startsWith('ESPN')) return `${TV_LOGO_US}espn-us.png`;

  // Outros esportes
  if (upper.includes('CURTA')) return CURTA_SVG;
  if (upper.includes('RED BULL')) return `${TV_LOGO_INT}red-bull-tv-int.png`;
  if (upper.includes('NHK')) return NHK_SVG;
  if (upper.includes('PLUTO')) return PLUTO_TV_SVG;
  if (upper.includes('TRAVEL BOX')) return TRAVEL_BOX_SVG;
  if (upper.includes('E!') || upper === 'E' || upper.includes('ENTERTAINMENT')) return `${TV_LOGO_US}e-entertainment-us.png`;
  if (upper.includes('GOSPEL MOVIES')) return GOSPEL_MOVIES_SVG;
  if (upper.includes('SUPER') && upper.includes('REDE')) return REDE_SUPER_SVG;
  if (upper.includes('DOG')) return `${TV_LOGO_US}dog-tv-us.png`;
  if (upper.includes('FISH')) return `${TV_LOGO_BR}fish-tv-br.png`;
  if (upper.includes('FOOD NETWORK')) return `${TV_LOGO_US}food-network-us.png`;
  if (upper.includes('LOVE NATURE')) return `${TV_LOGO_CA}love-nature-ca.png`;
  if (upper.includes('ANIMAL PLAN')) return `${TV_LOGO_US}animal-planet-us.png`;
  if (upper === 'ART 1' || upper === 'ARTE 1') return `${TV_LOGO_BR}arte1-br.png`;
  if (upper === 'VIVA') return VIVA_SVG;

  // History & NatGeo
  if (upper.includes('HISTORY 2') || upper.includes('HISTORY CHANNEL 2') || upper === 'H2') {
    return `${TV_LOGO_US}history-channel-2-us.png`;
  }
  if (upper.includes('HISTORY')) return `${TV_LOGO_US}history-channel-us.png`;
  if (upper.includes('WILD') && (upper.includes('GEO') || upper.includes('NAT'))) {
    return `${TV_LOGO_US}nat-geo-wild-us.png`;
  }
  if (upper.includes('NATGEO') || upper.includes('NATIONAL GEOGRAPHIC')) {
    return `${TV_LOGO_US}national-geographic-us.png`;
  }

  // Discovery (família completa)
  if (upper.includes('DISCOVERY')) {
    if (upper.includes('THEATER')) return `${TV_LOGO_LAM}discovery-theater-hd-lam.png`;
    if (upper.includes('WORLD')) return `${TV_LOGO_AR}discovery-world-hd-ar.png`;
    if (upper.includes('H&H') || upper.includes('HOME') || upper.includes('HEALTH')) {
      return `${TV_LOGO_LAM}discovery-home-and-health-lam.png`;
    }
    if (upper.includes('SCIENCE')) return `${TV_LOGO_US}discovery-science-us.png`;
    if (upper.includes('TURBO')) return `${TV_LOGO_BR}discovery-turbo-br.png`;
    if (upper.includes('KIDS')) return `${TV_LOGO_BR}discovery-kids-br.png`;
    if (upper.includes('ID') || upper.includes('INVESTIG')) return `${TV_LOGO_US}investigation-discovery-us.png`;
    return `${TV_LOGO_US}discovery-channel-us.png`;
  }

  // Disney
  if (upper.includes('DISNEY')) {
    if (upper.includes('JR') || upper.includes('JUNIOR')) return `${TV_LOGO_US}disney-jr-us.png`;
    return `${TV_LOGO_US}disney-channel-us.png`;
  }

  // Cazé TV & Combate
  if (upper.includes('CAZE') || upper.includes('CAZÉ')) return CAZE_TV_SVG;
  if (upper.includes('COMBATE')) return COMBATE_SVG;

  // HBO
  if (upper.includes('HBO 2')) return `${TV_LOGO_BR}hbo-2-br.png`;
  if (upper.includes('FAMILY')) return `${TV_LOGO_BR}hbo-family-br.png`;
  if (upper.includes('MUNDI')) return `${TV_LOGO_BR}hbo-mundi-br.png`;
  if (upper.includes('PLUS')) return `${TV_LOGO_BR}hbo-plus-br.png`;
  if (upper.includes('POP')) return `${TV_LOGO_BR}hbo-pop-br.png`;
  if (upper.includes('SIGNATURE')) return `${TV_LOGO_BR}hbo-signature-br.png`;
  if (upper.includes('XTREME')) return `${TV_LOGO_BR}hbo-xtreme-br.png`;
  if (upper.includes('HBO')) return `${TV_LOGO_BR}hbo-br.png`;

  // Telecine
  if (upper.includes('ACTION')) return `${TV_LOGO_BR}tele-cine-action-br.png`;
  if (upper.includes('CULT')) return `${TV_LOGO_BR}tele-cine-cult-br.png`;
  if (upper.includes('FUN') || upper.includes('FUM')) return `${TV_LOGO_BR}tele-cine-fun-br.png`;
  if (upper.includes('PIPOCA')) return `${TV_LOGO_BR}tele-cine-pipoca-br.png`;
  if (upper.includes('PREMIUM')) return `${TV_LOGO_BR}tele-cine-premium-br.png`;
  if (upper.includes('TOUCH')) return `${TV_LOGO_BR}tele-cine-touch-br.png`;

  // Universal & Warner
  if (upper.includes('STUDIO UNIVERSAL')) return `${TV_LOGO_BR}studio-universal-br.png`;
  if (upper.includes('UNIVERSAL')) return `${TV_LOGO_BR}universal-tv-br.png`;
  if (upper.includes('WARNER')) return `${TV_LOGO_BR}warner-channel-br.png`;
  if (upper.includes('PARAMOUNT')) return `${TV_LOGO_BR}paramount-network-br.png`;
  if (upper.includes('SONY')) return `${TV_LOGO_BR}sony-channel-br.png`;
  if (upper.includes('AXN')) return `${TV_LOGO_BR}axn-br.png`;
  if (upper.includes('SPACE')) return `${TV_LOGO_BR}space-br.png`;
  if (upper.includes('MEGAPIX')) return `${TV_LOGO_BR}megapix-br.png`;
  if (upper.includes('CINEMAX')) return `${TV_LOGO_BR}cinemax-br.png`;
  if (upper.includes('CINECANAL')) return `${TV_LOGO_BR}cine-canal-br.png`;
  if (upper.includes('TCM')) return `${TV_LOGO_BR}tcm-br.png`;

  // TV Aberta & Regionais
  if (
    (upper.includes('GLOBO') && !upper.includes('NEWS') && !upper.includes('GLOOB')) ||
    upper.includes('INTEGRA')
  ) {
    return `${TV_LOGO_BR}globo-br.png`;
  }
  if (upper.includes('ALTEROSA')) return SBT_ALTEROSA_SVG;
  if (upper.includes('SBT')) return `${TV_LOGO_BR}sbt-br.png`;
  if (upper.includes('BAND') && !upper.includes('NEWS') && !upper.includes('SPORTS')) return `${TV_LOGO_BR}band-br.png`;
  if (upper.includes('RECORD') && !upper.includes('NEWS')) return `${TV_LOGO_BR}record-br.png`;
  if (upper.includes('REDE TV') || upper.includes('REDETV')) return `${TV_LOGO_BR}rede-tv-br.png`;
  if (upper.includes('CULTURA')) return `${TV_LOGO_BR}tv-cultura-br.png`;
  if (upper.includes('FUTURA')) return `${TV_LOGO_BR}futura-br.png`;
  if (upper.includes('TV BRASIL')) return `${TV_LOGO_BR}tv-brasil-br.png`;

  // Outros
  if (upper.includes('UOL')) return UOL_SVG;

  // 4. Fallback visual refinado, temático e de alta fidelidade
  return createChannelFallbackBadge(trimmed, category);
};

// ==========================================
// BUSCA DINÂMICA DE LOGOS (IPTV-ORG)
// ==========================================

let iptvOrgChannelsCache: Array<{ id: string; name: string; logo?: string }> | null = null;
let iptvOrgLoadingPromise: Promise<Array<{ id: string; name: string; logo?: string }>> | null = null;
const dynamicLogoCache = new Map<string, string>();

/**
 * Carrega e memoriza a lista de canais do repositório iptv-org
 */
export async function fetchIptvOrgChannels(): Promise<Array<{ id: string; name: string; logo?: string }>> {
  if (iptvOrgChannelsCache) return iptvOrgChannelsCache;
  if (iptvOrgLoadingPromise) return iptvOrgLoadingPromise;

  iptvOrgLoadingPromise = (async () => {
    try {
      const res = await fetch('https://iptv-org.github.io/api/channels.json');
      if (!res.ok) throw new Error('HTTP status ' + res.status);
      const data = await res.json();
      iptvOrgChannelsCache = Array.isArray(data)
        ? data.filter((c: any) => c && c.logo && c.name)
        : [];
      return iptvOrgChannelsCache;
    } catch (err) {
      console.warn('Não foi possível carregar o banco de logos do iptv-org:', err);
      iptvOrgChannelsCache = [];
      return [];
    } finally {
      iptvOrgLoadingPromise = null;
    }
  })();

  return iptvOrgLoadingPromise;
}

/**
 * Busca dinamicamente o logo de um canal a partir do repositório iptv-org
 * Retorna a URL do logo em alta qualidade ou null se não encontrado
 */
export async function fetchIptvOrgLogo(channelName: string): Promise<string | null> {
  const clean = (channelName || '').trim();
  if (!clean) return null;
  const lower = clean.toLowerCase();

  if (dynamicLogoCache.has(lower)) {
    return dynamicLogoCache.get(lower) || null;
  }

  // Se já tivermos mapeamento oficial estático de alta fidelidade no TV-Logos
  const staticLogo = getChannelLogo(channelName);
  if (staticLogo && !staticLogo.startsWith('data:image/svg+xml')) {
    dynamicLogoCache.set(lower, staticLogo);
    return staticLogo;
  }

  const channels = await fetchIptvOrgChannels();
  if (!channels || channels.length === 0) return null;

  const normalizeStr = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]/g, '');

  const normTarget = normalizeStr(clean);

  const exactMatch = channels.find(c => normalizeStr(c.name) === normTarget);
  if (exactMatch && exactMatch.logo) {
    dynamicLogoCache.set(lower, exactMatch.logo);
    return exactMatch.logo;
  }

  const partialMatch = channels.find(c => {
    const cNorm = normalizeStr(c.name);
    return cNorm.includes(normTarget) || normTarget.includes(cNorm);
  });

  if (partialMatch && partialMatch.logo) {
    dynamicLogoCache.set(lower, partialMatch.logo);
    return partialMatch.logo;
  }

  return null;
}
