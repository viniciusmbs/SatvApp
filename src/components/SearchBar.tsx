import React from 'react';
import { soundService } from '../services/soundService';

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

const CATEGORY_PRIORITY: Record<string, number> = {
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

export const SearchBar: React.FC<SearchBarProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const sortedCategories = [...categories].sort((a, b) => {
    const pA = CATEGORY_PRIORITY[a.toUpperCase()] ?? 50;
    const pB = CATEGORY_PRIORITY[b.toUpperCase()] ?? 50;
    if (pA !== pB) return pA - pB;
    return a.localeCompare(b, 'pt-BR');
  });

  const handleSelectCategory = (cat: string) => {
    soundService.playSelect();
    setSelectedCategory(cat);
  };

  return (
    <div className="w-full bg-[#10121a] border-b border-white/5 py-1 sm:py-1.5 shadow-md select-none overflow-hidden">
      <div className="tv-safe-container min-w-0">
        {/* Linha Única Compacta: Apenas Categorias */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 no-scrollbar w-full min-w-0 scroll-smooth touch-pan-x">
          
          {/* Botão Todos */}
          <button
            data-tv-nav="category"
            data-category-index={0}
            tabIndex={0}
            onClick={() => handleSelectCategory('TODOS')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 outline-none ${
              selectedCategory === 'TODOS'
                ? 'bg-[#3d0606] text-white border border-[#3d0606] shadow-sm font-bold'
                : 'bg-[#171a23] hover:bg-[#252b3b] text-slate-300 hover:text-white border border-white/10 focus:ring-2 focus:ring-[#3d0606]'
            }`}
          >
            Todos
          </button>

          {/* Categorias de Canais */}
          {sortedCategories.map((category, idx) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                data-tv-nav="category"
                data-category-index={idx + 1}
                tabIndex={0}
                onClick={() => handleSelectCategory(category)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 outline-none ${
                  isSelected
                    ? 'bg-[#3d0606] text-white border border-[#3d0606] shadow-sm font-bold'
                    : 'bg-[#171a23] hover:bg-[#252b3b] text-slate-300 hover:text-white border border-white/10 focus:ring-2 focus:ring-[#3d0606]'
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
