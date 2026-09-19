import React, { useState, useEffect } from 'react';
import { Play, Clock, ChevronRight, Tv, Radio, Star } from 'lucide-react';
import { Channel, GroupedChannels } from '../types';
import { getChannelLogo, createChannelFallbackBadge } from '../data/channelLogos';
import { EpgService } from '../services/epgService';
import { soundService } from '../services/soundService';
import { sortCategories } from '../services/categoryUtils';

interface EpgGridProps {
  groupedChannels: GroupedChannels;
  favorites?: string[];
  onToggleFavorite?: (channelName: string) => void;
  onSelectChannel: (channel: Channel) => void;
  onClearFilters: () => void;
  onlineCount?: number;
  offlineCount?: number;
  statusFilter?: 'all' | 'online' | 'offline';
  onStatusFilterChange?: (status: 'all' | 'online' | 'offline') => void;
}

const EpgGrid: React.FC<EpgGridProps> = ({
  groupedChannels,
  favorites = [],
  onToggleFavorite,
  onSelectChannel,
  onClearFilters,
  onlineCount,
  offlineCount,
  statusFilter = 'all',
  onStatusFilterChange,
}) => {
  const [epgLoaded, setEpgLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [, setTick] = useState(0);

  // Load EPG data on mount
  useEffect(() => {
    let isMounted = true;
    const epgService = EpgService.getInstance();

    epgService.loadEpg().then((success) => {
      if (isMounted) {
        setEpgLoaded(success);
        setIsLoading(false);
      }
    });

    // Update progress bar every 30 seconds
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Categorias em ordem alfabética estrita, com ABERTOS sempre em primeiro lugar
  const sortedGroupNames = sortCategories(Object.keys(groupedChannels));

  const totalChannelsCount = Object.values(groupedChannels).reduce(
    (acc, list) => acc + list.length,
    0
  );

  const displayOnlineCount = onlineCount !== undefined ? onlineCount : totalChannelsCount;
  const displayOfflineCount = offlineCount !== undefined ? offlineCount : 0;

  if (sortedGroupNames.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-500 border border-slate-700/60">
          <Tv className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-200 mb-1">
          Nenhum canal encontrado
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-5">
          Tente buscar com outro nome de canal ou limpe os filtros de categoria.
        </p>
        <button
          onClick={onClearFilters}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition shadow-md cursor-pointer"
          style={{ backgroundColor: '#3d0606' }}
        >
          Limpar Filtros e Ver Todos
        </button>
      </div>
    );
  }

  const epgService = EpgService.getInstance();
  let globalEpgIndex = 0;

  return (
    <div className="tv-safe-container py-4 sm:py-6 space-y-6 sm:space-y-8">
      {/* Guia status header banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-[#131620] border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-300 shadow-md">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-bold text-gray-200 uppercase tracking-wider">
            Guia de Programação Ao Vivo (EPG)
          </span>
          <span className="text-slate-400 hidden md:inline">&bull;</span>
          <span className="text-slate-400 hidden md:inline">
            Clique em qualquer canal ou programa para assistir imediatamente
          </span>
        </div>

        {/* Lado Direito: Sincronização em Tempo Real + Indicadores Discretos Online e Offline */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
          {/* Indicador Discreto Online com sinalzinho Radio verde piscando e texto branco */}
          <button
            type="button"
            onClick={() => onStatusFilterChange?.(statusFilter === 'online' ? 'all' : 'online')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition text-[11px] font-bold cursor-pointer outline-none ${
              statusFilter === 'online'
                ? 'bg-emerald-950/80 border-emerald-500 text-white ring-1 ring-emerald-400/40'
                : 'bg-black/30 hover:bg-black/50 border-white/10 text-white'
            }`}
            title="Filtrar canais online"
          >
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse shrink-0" />
            <span className="text-white font-bold">{displayOnlineCount} Online</span>
          </button>

          {/* Indicador Discreto Offline com sinalzinho Radio vermelho e texto branco */}
          {displayOfflineCount > 0 && (
            <button
              type="button"
              onClick={() => onStatusFilterChange?.(statusFilter === 'offline' ? 'all' : 'offline')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition text-[11px] font-bold cursor-pointer outline-none ${
                statusFilter === 'offline'
                  ? 'bg-red-950/80 border-red-500 text-white ring-1 ring-red-400/40'
                  : 'bg-black/30 hover:bg-black/50 border-white/10 text-white'
              }`}
              title="Filtrar canais offline"
            >
              <Radio className="w-3 h-3 text-red-500 shrink-0" />
              <span className="text-white font-bold">{displayOfflineCount} Offline</span>
            </button>
          )}

          <span className="hidden sm:inline text-white/20">|</span>

          {isLoading ? (
            <span className="text-amber-400 font-medium animate-pulse flex items-center gap-1">
              Carregando grade do EPG ao vivo...
            </span>
          ) : (
            <span className="text-slate-300 font-semibold flex items-center gap-1.5 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Sincronizado em tempo real
            </span>
          )}
        </div>
      </div>

      {/* Categories & Channel Guide Rows */}
      {sortedGroupNames.map((groupName) => {
        const channels = groupedChannels[groupName];
        if (!channels || channels.length === 0) return null;

        return (
          <section key={`epg-group-${groupName}`} className="space-y-3">
            {/* Category title - Limpo sem contadores */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full inline-block bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                <h2 className="text-xs sm:text-sm font-semibold text-zinc-200 tracking-wider uppercase">
                  {groupName}
                </h2>
              </div>
            </div>

            {/* List of Channel EPG Rows */}
            <div className="space-y-2.5">
              {channels.map((channel) => {
                const currentIndex = globalEpgIndex++;
                const channelEpg = epgService.getChannelEpg(channel.name);
                const current = channelEpg.currentProgram;
                const next = channelEpg.nextProgram;
                const logoSrc = channel.logo || getChannelLogo(channel.name, undefined, channel.group);

                const handleRowClick = () => {
                  soundService.playSelect();
                  onSelectChannel(channel);
                };

                const handleKeyDown = (e: React.KeyboardEvent) => {
                  if (
                    (e.key === '0' ||
                      e.code === 'Digit0' ||
                      e.code === 'Numpad0' ||
                      e.keyCode === 48 ||
                      e.keyCode === 96 ||
                      e.key === 'f' ||
                      e.key === 'F' ||
                      e.keyCode === 85 ||
                      e.key === 'MediaPlayPause') &&
                    onToggleFavorite
                  ) {
                    e.preventDefault();
                    e.stopPropagation();
                    soundService.playFavorite();
                    onToggleFavorite(channel.name);
                    return;
                  }

                  if (
                    e.key === 'Enter' ||
                    e.key === ' ' ||
                    e.keyCode === 13 ||
                    e.keyCode === 23 ||
                    e.keyCode === 66
                  ) {
                    e.preventDefault();
                    handleRowClick();
                  }
                };

                const isFav = favorites.includes(channel.name);

                return (
                  <div
                    key={`epg-row-${channel.name}-${channel.url}`}
                    id={`epg-card-${channel.id || encodeURIComponent(channel.name)}`}
                    tabIndex={0}
                    role="button"
                    aria-label={`Canal ${channel.name} - ${current?.title || 'Assistir'}`}
                    data-tv-card="true"
                    data-channel-name={channel.name}
                    data-channel-index={currentIndex}
                    onClick={handleRowClick}
                    onKeyDown={handleKeyDown}
                    className={`group tv-card-focus relative bg-[#131620] hover:bg-[#1b1f2c] focus:bg-[#1b1f2c] border rounded-xl p-3 sm:p-3.5 flex flex-col md:flex-row items-stretch md:items-center gap-3.5 transition-all duration-150 cursor-pointer outline-none select-none shadow-md ${
                      isFav ? 'border-amber-400/40' : 'border-white/10 hover:border-[#3d0606] focus:border-[#3d0606]'
                    }`}
                  >
                    {/* Favorite indicator or button */}
                    {onToggleFavorite && (
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          soundService.playFavorite();
                          onToggleFavorite(channel.name);
                        }}
                        className={`absolute top-2.5 right-2.5 z-10 p-1 rounded-md transition ${
                          isFav
                            ? 'text-amber-400 bg-black/60 shadow-sm opacity-100'
                            : 'text-white/30 hover:text-amber-300 opacity-0 group-hover:opacity-100 group-focus:opacity-100'
                        }`}
                        title={isFav ? 'Remover dos favoritos (Tecla 0)' : 'Favoritar canal (Tecla 0)'}
                      >
                        <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>
                    )}

                    {/* Channel Column (Logo & Name) */}
                    <div className="flex items-center gap-3 w-full md:w-56 shrink-0">
                      <div className="w-14 h-12 sm:w-16 sm:h-14 channel-logo-cradle rounded-xl p-1.5 flex items-center justify-center shrink-0">
                        <img
                          src={logoSrc}
                          alt={`${channel.name} logo`}
                          className="max-w-full max-h-full object-contain channel-logo-img"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const fallback = createChannelFallbackBadge(channel.name, channel.group);
                            if (target.src !== fallback) {
                              target.src = fallback;
                            }
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-100 group-hover:text-red-400 group-focus:text-red-400 truncate transition-colors">
                          {channel.name}
                        </p>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {channel.group}
                        </span>
                      </div>
                    </div>

                    {/* Current Program Box (Ao Vivo Agora com Sinopse `current.desc`) */}
                    <div className="flex-1 bg-slate-900/70 border border-slate-800 rounded-lg p-2.5 flex flex-col justify-between relative overflow-hidden group-hover:border-slate-700 transition">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black text-white tracking-wider uppercase flex items-center gap-1 bg-black/60 border border-emerald-500/40 shadow-sm">
                            <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400 shrink-0" />
                            <span className="text-white font-bold">Ao Vivo</span>
                          </span>
                          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {current ? `${current.start} - ${current.stop}` : 'Agora'}
                          </span>
                        </div>

                        {current?.category && (
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50 truncate max-w-[120px]">
                            {current.category}
                          </span>
                        )}
                      </div>

                      {/* Program Title */}
                      <h4 className="text-sm font-bold text-white group-hover:text-red-300 group-focus:text-red-300 line-clamp-1">
                        {current?.title || `Programação Ao Vivo • ${channel.name}`}
                      </h4>

                      {/* Program Description / Sinopse Real */}
                      {current?.desc && (
                        <p className="text-xs text-slate-300/90 line-clamp-2 sm:line-clamp-3 mt-1 font-normal leading-relaxed">
                          {current.desc}
                        </p>
                      )}

                      {/* Time Progress Bar */}
                      <div className="w-full bg-slate-800 rounded-full h-1 mt-2 overflow-hidden">
                        <div
                          className="bg-red-600 h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${current?.progressPercent ?? 50}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Next Program Box (A Seguir) */}
                    <div className="w-full md:w-64 shrink-0 bg-slate-900/40 border border-slate-800/80 rounded-lg p-2.5 flex flex-col justify-center">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5 flex items-center gap-1">
                        <span>A Seguir</span>
                        {next && <span className="text-slate-400 font-mono">({next.start})</span>}
                      </div>
                      <p className="text-xs font-semibold text-slate-300 truncate">
                        {next?.title || 'Próximo programa'}
                      </p>
                      <span className="text-[11px] text-slate-400 truncate">
                        {next ? `${next.start} às ${next.stop}` : 'Em breve'}
                      </span>
                    </div>

                    {/* Open Button Action (TV Click Indicator) */}
                    <div className="hidden md:flex items-center justify-center pl-1">
                      <div className="w-8 h-8 rounded-full bg-slate-800/80 group-hover:bg-red-600 group-focus:bg-red-600 text-slate-400 group-hover:text-white group-focus:text-white flex items-center justify-center transition-all shadow-sm">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default EpgGrid;