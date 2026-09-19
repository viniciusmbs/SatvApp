import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Channel, GroupedChannels, UiDensity } from '../types';
import ChannelCard, { getCardWidthClass } from './ChannelCard';
import { sortCategories } from '../services/categoryUtils';

interface ChannelRowsProps {
  groupedChannels: GroupedChannels;
  favorites: string[];
  onToggleFavorite: (channelName: string) => void;
  onSelectChannel: (channel: Channel) => void;
  onClearFilters: () => void;
  density?: UiDensity;
}

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
    <section className="space-y-1.5">
      {/* Category Header - Limpo, sem contadores numéricos */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1">
        <div className="flex items-center space-x-2">
          <span
            className={`w-1.5 h-1.5 rounded-full inline-block shadow-sm ${
              isFavRow ? 'bg-amber-400 shadow-amber-400/50' : 'bg-emerald-500 shadow-emerald-500/50'
            }`}
          />
          <h2 className="text-xs sm:text-sm font-semibold text-zinc-200 tracking-wider uppercase">
            {title}
          </h2>
        </div>

        {/* Scroll arrow buttons for desktop / mouse users */}
        <div className="hidden sm:flex items-center space-x-1">
          <button
            onClick={() => scroll('left')}
            className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer border border-white/5"
            title="Rolar para esquerda"
            tabIndex={-1}
            aria-label="Rolar para esquerda"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer border border-white/5"
            title="Rolar para direita"
            tabIndex={-1}
            aria-label="Rolar para direita"
          >
            <ChevronRight className="w-3.5 h-3.5" />
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
  // Ordenação de categorias: ABERTOS sempre em primeiro, demais em ordem alfabética estrita
  const sortedGroupNames = sortCategories(Object.keys(groupedChannels));

  const totalChannels = Object.values(groupedChannels).reduce(
    (acc, list) => acc + (list ? list.length : 0),
    0
  );

  if (sortedGroupNames.length === 0 || totalChannels === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 bg-zinc-800/80 rounded-2xl flex items-center justify-center mx-auto mb-3 text-zinc-500 border border-zinc-700/60">
          <Star className="w-7 h-7 text-amber-400" />
        </div>
        <h3 className="text-base font-semibold text-zinc-200 mb-1">
          Nenhum canal encontrado
        </h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto mb-4">
          Para favoritar um canal, use a estrelinha ou a tecla Play/Pause no controle.
        </p>
        <button
          onClick={onClearFilters}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-md cursor-pointer"
        >
          Limpar Filtros e Ver Todos
        </button>
      </div>
    );
  }

  // Calculate continuous sequential index across rows for smooth D-pad tracking
  let globalIndex = 0;

  return (
    <div className="tv-safe-container py-2 sm:py-3 space-y-3 sm:space-y-4">
      {sortedGroupNames.map((groupName) => {
        const channels = groupedChannels[groupName];
        if (!channels || channels.length === 0) return null;

        const startIndex = globalIndex;
        globalIndex += channels.length;
        const isFavRow = groupName.toUpperCase() === 'FAVORITOS';

        return (
          <RowSection
            key={groupName}
            title={groupName}
            isFavRow={isFavRow}
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
