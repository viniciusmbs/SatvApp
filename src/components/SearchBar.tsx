import React from 'react';
import { soundService } from '../services/soundService';
import { sortCategories } from '../services/categoryUtils';

export interface SearchBarProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  filteredCount?: number;
  statusFilter?: 'all' | 'online' | 'offline';
  setStatusFilter?: (status: 'all' | 'online' | 'offline') => void;
  statuses?: Record<string, string>;
  onlineCount?: number;
  offlineCount?: number;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  // Ordenação: ABERTOS sempre primeiro, demais em ordem alfabética estrita
  const sortedCategories = sortCategories(categories);

  const handleSelectCategory = (cat: string) => {
    soundService.playSelect();
    setSelectedCategory(cat);
  };

  return (
    <div className="w-full bg-[#121215] border-b border-[#27272a] py-1.5 shadow-sm select-none overflow-hidden">
      <div className="tv-safe-container min-w-0">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 no-scrollbar w-full min-w-0 scroll-smooth touch-pan-x">
          
          {/* Botão Todos */}
          <button
            data-tv-nav="category"
            data-category-index={0}
            tabIndex={0}
            onClick={() => handleSelectCategory('TODOS')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 outline-none ${
              selectedCategory === 'TODOS'
                ? 'bg-emerald-600 text-white border border-emerald-500 shadow-sm'
                : 'bg-[#18181b] hover:bg-[#27272a] text-zinc-300 hover:text-white border border-[#27272a] focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500'
            }`}
          >
            Todos
          </button>

          {/* Categorias em ordem alfabética obrigatória (ABERTOS primeiro) */}
          {sortedCategories.map((category, idx) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                data-tv-nav="category"
                data-category-index={idx + 1}
                tabIndex={0}
                onClick={() => handleSelectCategory(category)}
                className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 outline-none ${
                  isSelected
                    ? 'bg-emerald-600 text-white border border-emerald-500 shadow-sm'
                    : 'bg-[#18181b] hover:bg-[#27272a] text-zinc-300 hover:text-white border border-[#27272a] focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500'
                }`}
              >
                {category}
              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default SearchBar;
