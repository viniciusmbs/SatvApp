import React from 'react';
import { Star } from 'lucide-react';
import { Channel, GroupedChannels, UiDensity } from '../types';
import ChannelCard, { getCardWidthClass } from './ChannelCard';
import { sortCategories } from '../services/categoryUtils';

interface ChannelGridProps {
  groupedChannels: GroupedChannels;
  favorites?: string[];
  onToggleFavorite?: (channelName: string) => void;
  onSelectChannel: (channel: Channel) => void;
  onClearFilters: () => void;
  density?: UiDensity;
}

const ChannelGrid: React.FC<ChannelGridProps> = ({
  groupedChannels,
  favorites = [],
  onToggleFavorite,
  onSelectChannel,
  onClearFilters,
  density = 'compact',
}) => {
  // Ordenação de categorias: ABERTOS sempre primeiro, demais em rigorosa ordem alfabética
  const sortedGroupNames = sortCategories(Object.keys(groupedChannels));

  const cardWidthClass = getCardWidthClass(density);

  if (sortedGroupNames.length === 0) {
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

  let globalIndex = 0;

  return (
    <div className="tv-safe-container py-2 sm:py-3 space-y-3 sm:space-y-4">
      {sortedGroupNames.map((groupName) => {
        const channels = groupedChannels[groupName];
        if (!channels || channels.length === 0) return null;
        const isFavGroup = groupName.toUpperCase() === 'FAVORITOS';

        return (
          <section key={groupName} className="space-y-1.5">
            {/* Category Header - Limpo, sem contadores numéricos */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1">
              <div className="flex items-center space-x-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full inline-block shadow-sm ${
                    isFavGroup ? 'bg-amber-400 shadow-amber-400/50' : 'bg-emerald-500 shadow-emerald-500/50'
                  }`}
                />
                <h2 className="text-xs sm:text-sm font-semibold text-zinc-200 tracking-wider uppercase">
                  {groupName}
                </h2>
              </div>
            </div>

            {/* Channels Grid: proporções idênticas ao ChannelRows */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 py-1 px-0.5">
              {channels.map((channel) => {
                const currentIndex = globalIndex++;
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
      })}
    </div>
  );
};

export default ChannelGrid;
