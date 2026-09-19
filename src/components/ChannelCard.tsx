import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Channel, UiDensity } from '../types';
import { getChannelLogo, createChannelFallbackBadge } from '../data/channelLogos';
import { soundService } from '../services/soundService';

interface ChannelCardProps {
  channel: Channel;
  index: number;
  isFavorite?: boolean;
  onToggleFavorite?: (channelName: string) => void;
  onSelect?: (channel: Channel) => void;
  density?: UiDensity;
}

// Normalização de títulos de canais para caberem nítidos no rodapé do card
export function formatChannelDisplayName(name: string): string {
  if (!name) return '';
  const trimmed = name.trim();
  const upper = trimmed.toUpperCase();

  if (upper.includes('INTEGRAÇÃO') || upper.includes('INTEGRACAO')) {
    return 'TV Integração';
  }

  if (upper.includes('ALTEROSA')) {
    return 'SBT Alterosa';
  }

  if (upper === 'RECORD' || upper === 'RECORD TV') {
    return 'Record TV';
  }

  return trimmed
    .replace(/\s*\[(FHD|HD|SD|4K|HEVC|H\.265)\]/gi, '')
    .replace(/\s*\((FHD|HD|SD|4K|HEVC|H\.265)\)/gi, '')
    .replace(/\s*-\s*(FHD|HD|SD|4K)/gi, '')
    .replace(/\s+(FHD|HD|SD|4K)$/gi, '')
    .trim();
}

export const getCardWidthClass = (density: UiDensity | string = 'compact'): string => {
  if (density === 'large') {
    return 'w-[100px] min-[360px]:w-[108px] sm:w-[118px] md:w-[126px] lg:w-[134px] shrink-0';
  }
  if (density === 'normal') {
    return 'w-[90px] min-[360px]:w-[98px] sm:w-[106px] md:w-[114px] lg:w-[122px] shrink-0';
  }
  return 'w-[82px] min-[360px]:w-[88px] sm:w-[98px] md:w-[106px] lg:w-[114px] shrink-0';
};

const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  index,
  isFavorite = false,
  onToggleFavorite,
  onSelect,
}) => {
  const [imgError, setImgError] = useState(false);
  const displayName = formatChannelDisplayName(channel.name);

  // Logo oficial de alta fidelidade
  const officialLogo = getChannelLogo(channel.name, undefined, channel.group);
  const genericBadge = createChannelFallbackBadge(channel.name, channel.group);
  const logoSrc = imgError ? genericBadge : (channel.logo || officialLogo);

  // Ação imediata: Abrir o canal diretamente no player em tela cheia
  const handleOpenChannel = () => {
    soundService.playSelect();
    try {
      const channelId = channel.id || encodeURIComponent(channel.name);
      localStorage.setItem('satv_last_focused_channel_name', channel.name);
      localStorage.setItem('satv_last_focused_channel_id', channelId);
      localStorage.setItem('satv_last_scroll_y', String(window.scrollY));
      localStorage.setItem('satv_should_restore_channel', 'true');
      sessionStorage.setItem('satv_last_focused_channel_name', channel.name);
      sessionStorage.setItem('satv_last_focused_channel_id', channelId);
      sessionStorage.setItem('satv_last_scroll_y', String(window.scrollY));
      sessionStorage.setItem('satv_should_restore_channel', 'true');
    } catch {
      // ignore
    }
    if (onSelect) {
      onSelect(channel);
    }
  };

  // Ação: Alternar Favorito
  const handleToggleFavoriteAction = () => {
    soundService.playSelect();
    if (onToggleFavorite) {
      onToggleFavorite(channel.name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const code = e.keyCode || e.which;
    const key = e.key;

    // 1. Tecla Play / Pause do controle do Fire TV / Android TV
    const isPlayPauseKey =
      code === 85 ||
      code === 126 ||
      code === 127 ||
      key === 'MediaPlayPause' ||
      e.code === 'MediaPlayPause' ||
      key === 'Play' ||
      key === 'Pause' ||
      key === 'p' ||
      key === 'P';

    if (isPlayPauseKey) {
      e.preventDefault();
      e.stopPropagation();
      handleToggleFavoriteAction();
      return;
    }

    // 2. Tecla OK / ENTER no meio do D-Pad do controle: Abre o canal IMEDIATAMENTE
    const isOkEnterKey =
      key === 'Enter' ||
      key === ' ' ||
      code === 13 ||
      code === 23 || // KEYCODE_DPAD_CENTER
      code === 66;   // KEYCODE_ENTER

    if (isOkEnterKey) {
      e.preventDefault();
      e.stopPropagation();
      handleOpenChannel();
      return;
    }

    // 3. Tecla 'f' / '0' para alternar favorito pelo teclado físico
    if (key === 'f' || key === 'F' || key === '0' || code === 48 || code === 96) {
      e.preventDefault();
      e.stopPropagation();
      handleToggleFavoriteAction();
      return;
    }
  };

  return (
    <a
      id={`channel-card-${channel.id || encodeURIComponent(channel.name)}`}
      href={channel.url}
      tabIndex={0}
      role="button"
      aria-label={`Canal ${channel.name}`}
      data-tv-card="true"
      data-channel-name={channel.name}
      data-channel-index={index}
      onClick={(e) => {
        e.preventDefault();
        handleOpenChannel();
      }}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        try {
          const channelId = channel.id || encodeURIComponent(channel.name);
          localStorage.setItem('satv_last_focused_channel_name', channel.name);
          localStorage.setItem('satv_last_focused_channel_id', channelId);
          localStorage.setItem('satv_last_scroll_y', String(window.scrollY));
          sessionStorage.setItem('satv_last_focused_channel_name', channel.name);
          sessionStorage.setItem('satv_last_focused_channel_id', channelId);
          sessionStorage.setItem('satv_last_scroll_y', String(window.scrollY));
        } catch {
          // ignore
        }
      }}
      className={`group tv-card-focus relative aspect-[16/11] bg-[#18181b] hover:bg-[#222227] focus:bg-[#222227] border border-[#27272a] rounded-lg p-1.5 flex flex-col items-center justify-between text-center transition-all duration-150 cursor-pointer outline-none select-none shadow-sm shrink-0 focus:scale-[1.04] hover:scale-[1.04] focus:z-20 hover:z-10 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/50 hover:border-[#10b981]/80 ${
        isFavorite ? 'border-amber-400/40 ring-1 ring-amber-400/30' : ''
      }`}
    >
      {/* 1. Sinal de transmissão sutil no topo esquerdo (verde esmeralda #10b981) */}
      <div className="absolute top-1.5 left-1.5 z-10 flex items-center justify-center pointer-events-none">
        <span
          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#10b981] shadow-sm shadow-[#10b981]/80 ring-1 ring-black/40"
          title="Online"
        />
      </div>

      {/* Indicador discreto de favorito no topo direito */}
      {onToggleFavorite && (
        <button
          type="button"
          tabIndex={-1}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleToggleFavoriteAction();
          }}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          title={isFavorite ? 'Favorito' : 'Favoritar'}
          className={`absolute top-1 right-1 z-10 p-0.5 rounded transition-all ${
            isFavorite
              ? 'text-amber-400 opacity-100'
              : 'text-zinc-600 hover:text-amber-400 opacity-0 group-hover:opacity-100 group-focus:opacity-100'
          }`}
        >
          <Star className={`w-3 h-3 ${isFavorite ? 'fill-amber-400' : ''}`} />
        </button>
      )}

      {/* 2. Logotipo oficial do canal centralizado e redimensionado harmonicamente */}
      <div className="relative w-full flex-1 min-h-0 flex items-center justify-center p-1 overflow-hidden pointer-events-none">
        <img
          src={logoSrc}
          alt={`${channel.name} logo`}
          className="max-w-[85%] max-h-[70%] object-contain drop-shadow-sm transition-transform duration-150 group-hover:scale-105 group-focus:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* 3. Nome do canal no rodapé do card em fonte nítida, texto truncado */}
      <div className="w-full px-1 pb-0.5 pt-0 shrink-0 pointer-events-none">
        <p
          className={`w-full text-center font-medium truncate tracking-tight text-[11px] sm:text-xs transition-colors ${
            isFavorite ? 'text-amber-200' : 'text-zinc-300 group-hover:text-white group-focus:text-white'
          }`}
          title={channel.name}
        >
          {displayName}
        </p>
      </div>
    </a>
  );
};

export default ChannelCard;
