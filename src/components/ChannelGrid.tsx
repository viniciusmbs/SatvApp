import React from 'react';
import { Star } from 'lucide-react';
import { Channel, GroupedChannels, UiDensity } from '../types';
import ChannelCard, { getCardWidthClass } from './ChannelCard';

interface ChannelGridProps {
  groupedChannels: GroupedChannels;
  favorites?: string[];
  onToggleFavorite?: (channelName: string) => void;
  onSelectChannel: (channel: Channel) => void;
  onClearFilters: () => void;
  density?: UiDensity;
}

const CATEGORY_ORDER: Record<string, number> = {
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

const ChannelGrid: React.FC<ChannelGridProps> = ({
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

  // Card dimensions matching exactly ChannelRows for seamless, proportional rendering
  const cardWidthClass = getCardWidthClass(density);

  if (sortedGroupNames.length === 0) {
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

  // Calculate continuous sequential index across all visible channels
  let globalIndex = 0;

  return (
    <div className="tv-safe-container py-3 sm:py-4 space-y-4 sm:space-y-5">
      {sortedGroupNames.map((groupName) => {
        const channels = groupedChannels[groupName];
        if (!channels || channels.length === 0) return null;

        return (
          <section key={groupName} className="space-y-2">
            {/* Category Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block shadow-sm shadow-red-500/50" />
                <h2 className="text-xs sm:text-sm font-bold text-gray-100 tracking-wide uppercase">
                  {groupName}
                </h2>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium px-2 py-0.2 rounded-full bg-[#171a23] border border-white/5">
                  {channels.length} canais
                </span>
              </div>
            </div>

            {/* Channels Grid: exact same proportion and size as ChannelRows */}
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