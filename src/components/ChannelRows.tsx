import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Channel, GroupedChannels, UiDensity } from '../types';
import ChannelCard, { getCardWidthClass } from './ChannelCard';

interface ChannelRowsProps {
  groupedChannels: GroupedChannels;
  favorites: string[];
  onToggleFavorite: (channelName: string) => void;
  onSelectChannel: (channel: Channel) => void;
  onClearFilters: () => void;
  density?: UiDensity;
}

const CATEGORY_ORDER: Record<string, number> = {
  'FAVORITOS': 0,
  'CANAL': 1,
  'ESPORTES': 2,
  'FILMES E SÉRIES': 3,
  'FILMES & SÉRIES': 3,
  'NOTÍCIAS': 4,
  'INFANTIS': 5,
  'DOCUMENTÁRIOS': 6,
  'VARIEDADES': 7,
  'RELIGIOSOS': 8,
};

const RowSection: React.FC<{
  title: string;
  isFavRow?: boolean;
  channels: Channel[];
  favorites: string[];
  startIndex: number;
  onToggleFavorite: (channelName: string) => void;
  onSelectChannel: (channel: Channel) => void;
  density: UiDensity;
}> = ({
  title,
  isFavRow = false,
  channels,
  favorites,
  startIndex,
  onToggleFavorite,
  onSelectChannel,
  density,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardWidthClass = getCardWidthClass(density);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-2">
      {/* Category Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
        <div className="flex items-center space-x-2">
          <span
            className={`w-2 h-2 rounded-full inline-block shadow-sm ${
              isFavRow ? 'bg-amber-400 shadow-amber-400/50' : 'bg-red-500 shadow-red-500/50'
            }`}
          />
          <h2 className="text-xs sm:text-sm font-bold text-gray-100 tracking-wide uppercase">
            {title}
          </h2>
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium px-2 py-0.5 rounded-full bg-[#171a23] border border-white/5">
            {channels.length} canais
          </span>
        </div>

        {/* Scroll arrow buttons for desktop / mouse users */}
        <div className="hidden sm:flex items-center space-x-1">
          <button
            onClick={() => scroll('left')}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer border border-white/5"
            title="Rolar para esquerda"
            tabIndex={-1}
            aria-label="Rolar para esquerda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer border border-white/5"
            title="Rolar para direita"
            tabIndex={-1}
            aria-label="Rolar para direita"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto gap-1.5 sm:gap-2 py-1 px-0.5 scrollbar-none scroll-smooth"
      >
        {channels.map((channel, idx) => {
          const currentIndex = startIndex + idx;
          return (
            <div
              key={`${channel.name}-${channel.url}`}
              className={cardWidthClass}
            >
              <ChannelCard
                channel={channel}
                index={currentIndex}
                isFavorite={favorites.includes(channel.name)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectChannel}
                density={density}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

const ChannelRows: React.FC<ChannelRowsProps> = ({
  groupedChannels,
  favorites = [],
  onToggleFavorite,
  onSelectChannel,
  onClearFilters,
  density = 'compact',
}) => {
  const sortedGroupNames = Object.keys(groupedChannels).sort((a, b) => {
    const upperA = a.toUpperCase();
    const upperB = b.toUpperCase();

    const orderA = CATEGORY_ORDER[upperA] ?? 50;
    const orderB = CATEGORY_ORDER[upperB] ?? 50;

    if (orderA !== orderB) return orderA - orderB;
    return a.localeCompare(b, 'pt-BR');
  });

  const totalChannels = Object.values(groupedChannels).reduce(
    (acc, list) => acc + (list ? list.length : 0),
    0
  );

  if (sortedGroupNames.length === 0 || totalChannels === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-500 border border-slate-700/60">
          <Star className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-200 mb-1">
          Nenhum canal encontrado
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-5">
          Para favoritar um canal, clique na estrelinha no canto superior de qualquer canal.
        </p>
        <button
          onClick={onClearFilters}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition shadow-md cursor-pointer"
        >
          Limpar Filtros e Ver Todos
        </button>
      </div>
    );
  }

  let runningIndex = 0;

  return (
    <div className="tv-safe-container py-3 sm:py-4 space-y-4 sm:space-y-5">
      {sortedGroupNames.map((groupName) => {
        const channels = groupedChannels[groupName];
        if (!channels || channels.length === 0) return null;

        const startIndex = runningIndex;
        runningIndex += channels.length;

        return (
          <RowSection
            key={groupName}
            title={groupName}
            isFavRow={groupName.toUpperCase() === 'FAVORITOS'}
            channels={channels}
            favorites={favorites}
            startIndex={startIndex}
            onToggleFavorite={onToggleFavorite}
            onSelectChannel={onSelectChannel}
            density={density}
          />
        );
      })}
    </div>
  );
};

export default ChannelRows;
