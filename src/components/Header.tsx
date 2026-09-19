import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutGrid,
  Menu,
  Rows3,
  Clock,
  MoreVertical,
  Volume2,
  VolumeX,
  Search,
  X,
  Radio,
} from 'lucide-react';
import { ViewMode } from '../types';
import { soundService } from '../services/soundService';

export interface HeaderProps {
  totalChannels: number;
  onlineChannels?: number;
  offlineChannels?: number;
  channelCount?: number;
  onlineCount?: number;
  offlineCount?: number;
  statusFilter?: 'all' | 'online' | 'offline';
  setStatusFilter?: (status: 'all' | 'online' | 'offline') => void;
  onStatusFilterChange?: (status: 'all' | 'online' | 'offline') => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onViewModeChange?: (mode: ViewMode) => void;
  favoritesCount?: number;
  onOpenFavorites?: () => void;
  onOpenMenu?: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onSearchChange?: (query: string) => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalChannels,
  onlineChannels,
  offlineChannels,
  channelCount,
  onlineCount,
  offlineCount,
  statusFilter = 'all',
  setStatusFilter,
  onStatusFilterChange,
  viewMode,
  setViewMode,
  onViewModeChange,
  onOpenMenu,
  searchQuery = '',
  setSearchQuery,
  onSearchChange,
  soundEnabled,
  onToggleSound,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const displayTotal = totalChannels ?? channelCount ?? 0;
  const displayOnline = onlineChannels ?? onlineCount ?? 0;
  const displayOffline = offlineChannels ?? offlineCount ?? 0;

  const handleToggleStatusFilter = (status: 'online' | 'offline') => {
    soundService.playSelect();
    const nextStatus = statusFilter === status ? 'all' : status;
    if (setStatusFilter) setStatusFilter(nextStatus);
    if (onStatusFilterChange) onStatusFilterChange(nextStatus);
  };

  const handleSearchChange = (val: string) => {
    if (setSearchQuery) setSearchQuery(val);
    if (onSearchChange) onSearchChange(val);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    soundService.playSelect();
    setViewMode(mode);
    if (onViewModeChange) onViewModeChange(mode);
  };

  // Atualização do relógio
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  // Atalho do controle remoto (Avançar / Play / F12) aciona a Guia EPG
  useEffect(() => {
    const handleRemoteGuideKey = (e: KeyboardEvent) => {
      const isGuideKey =
        e.key === 'MediaFastForward' ||
        e.key === 'MediaPlayPause' ||
        e.key === 'F12' ||
        e.keyCode === 415 ||
        e.keyCode === 417;

      if (isGuideKey) {
        e.preventDefault();
        handleViewModeChange('epg');
      }
    };

    window.addEventListener('keydown', handleRemoteGuideKey);
    return () => {
      window.removeEventListener('keydown', handleRemoteGuideKey);
    };
  }, []);

  // Event listener para abrir busca ao pressionar tecla S ou /
  useEffect(() => {
    const handleOpenSearchEvent = () => {
      setShowSearchInput(true);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || e.key === 's' || e.key === 'S') && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        handleOpenSearchEvent();
      }
    };

    window.addEventListener('open-header-search', handleOpenSearchEvent);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-header-search', handleOpenSearchEvent);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Auto-focar no input de busca ao abrir
  useEffect(() => {
    if (showSearchInput) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 60);
    }
  }, [showSearchInput]);

  const toggleSound = () => {
    if (onToggleSound) {
      onToggleSound();
    } else {
      soundService.toggle();
    }
    setIsMuted((prev) => !prev);
    document.querySelectorAll('video, audio').forEach((el) => {
      (el as HTMLMediaElement).muted = !isMuted;
    });
  };

  const handleToggleSearch = () => {
    soundService.playSelect();
    if (showSearchInput && !searchQuery) {
      setShowSearchInput(false);
    } else {
      setShowSearchInput(true);
    }
  };

  const handleCloseSearch = () => {
    handleSearchChange('');
    setShowSearchInput(false);
  };

  return (
    <div className="w-full select-none">
      <header className="w-full bg-gradient-to-r from-[#5f0d0d] via-[#540b0b] to-[#4e0909] text-white shadow-lg border-b border-black/30">
        <div className="tv-safe-container">
          <div className="flex items-center justify-between h-13 sm:h-14 gap-2">
            
            {/* Logo, Slogan e Indicador Online */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="relative flex items-center justify-center shrink-0">
                <img
                  src="https://i.imgur.com/VWtF2t5.jpeg"
                  alt="SATV Logo"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white/90 shadow-md object-cover bg-black"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="sr-only">SATV</span>
              </div>

              <div className="flex items-center gap-2.5 min-w-0">
                <h1
                  style={{ fontFamily: "'Alex Brush', 'Great Vibes', cursive" }}
                  className="text-xl sm:text-2xl text-white font-normal tracking-wide drop-shadow-md truncate py-0.5"
                >
                  Aqui você é a nossa atração
                </h1>

                {/* Status de Canais Online no Topo com Sinalzinho Radio verde piscando e texto branco */}
                <div className="hidden sm:flex items-center gap-1.5 shrink-0 ml-1">
                  {/* Botão Online: Sinalzinho Radio verde piscando e texto branco */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatusFilter('online')}
                    className={`tv-nav-focus flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] font-bold transition shadow-inner cursor-pointer outline-none border ${
                      statusFilter === 'online'
                        ? 'bg-emerald-950/90 text-white border-emerald-400 ring-2 ring-emerald-400/40 font-extrabold'
                        : 'bg-black/40 hover:bg-black/60 border-emerald-500/40 text-white'
                    }`}
                    title="Filtrar canais Online"
                  >
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
                    <span className="text-white font-bold">{displayOnline} Online</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Controles da Direita: Busca, Modos de Exibição, Som, Relógio e Menu */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              
              {/* Botão / Campo de Busca no Topo */}
              <div className="relative flex items-center">
                {/* Em telas médias/grandes: input expansível elegante no próprio Header */}
                {showSearchInput ? (
                  <div className="hidden sm:flex items-center gap-1 bg-black/50 border border-white/20 focus-within:border-red-500/80 rounded-full pl-2.5 pr-1 py-1 shadow-inner transition-all duration-200">
                    <Search className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    <input
                      ref={searchInputRef}
                      id="channel-search-input"
                      type="text"
                      tabIndex={1}
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="Buscar canal..."
                      className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-32 sm:w-44 md:w-52 pr-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          handleCloseSearch();
                        }
                      }}
                      onBlur={() => {
                        if (!searchQuery) {
                          setShowSearchInput(false);
                        }
                      }}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => handleSearchChange('')}
                        className="p-0.5 text-slate-400 hover:text-white cursor-pointer"
                        title="Limpar busca"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleCloseSearch}
                      className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                      title="Fechar busca"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : null}

                {/* Botão da Lupazinha (Sempre visível em mobile, ou quando a busca está fechada em desktop) */}
                {(!showSearchInput || typeof window !== 'undefined') && (
                  <button
                    id="btn-header-search"
                    data-tv-nav="tab"
                    tabIndex={0}
                    type="button"
                    onClick={handleToggleSearch}
                    className={`tv-nav-focus flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition cursor-pointer outline-none shadow-inner ${
                      showSearchInput || searchQuery
                        ? 'bg-red-950/90 text-white border border-red-500/60 ring-1 ring-red-500/40'
                        : 'bg-black/40 hover:bg-black/60 text-gray-200 hover:text-white border border-white/15'
                    }`}
                    title="Buscar canais [S]"
                    aria-label="Buscar canais"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Alternador de Modo de Visualização (Fileiras / Mosaico / Guia EPG) */}
              <div className="flex items-center p-0.5 sm:p-1 bg-black/50 rounded-full border border-white/15 shadow-inner">
                <button
                  id="tab-btn-fileiras"
                  type="button"
                  data-tv-nav="tab"
                  tabIndex={0}
                  onClick={() => handleViewModeChange('rows')}
                  className={`tv-nav-focus flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.2 rounded-full text-xs font-bold transition-all cursor-pointer outline-none ${
                    viewMode === 'rows'
                      ? 'bg-white text-[#851616] shadow-md font-extrabold'
                      : 'text-gray-200 hover:text-white hover:bg-white/10'
                  }`}
                  title="Modo TV: fileiras horizontais"
                >
                  <Rows3 className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Fileiras</span>
                </button>

                <button
                  id="tab-btn-canais"
                  type="button"
                  data-tv-nav="tab"
                  tabIndex={0}
                  onClick={() => handleViewModeChange('grid')}
                  className={`tv-nav-focus flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.2 rounded-full text-xs font-bold transition-all cursor-pointer outline-none ${
                    viewMode === 'grid'
                      ? 'bg-white text-[#851616] shadow-md font-extrabold'
                      : 'text-gray-200 hover:text-white hover:bg-white/10'
                  }`}
                  title="Modo Mosaico"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Mosaico</span>
                </button>

                <button
                  id="tab-btn-guia-epg"
                  type="button"
                  data-tv-nav="tab"
                  tabIndex={0}
                  onClick={() => handleViewModeChange('epg')}
                  className={`tv-nav-focus flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.2 rounded-full text-xs font-bold transition-all cursor-pointer outline-none ${
                    viewMode === 'epg'
                      ? 'bg-white text-[#851616] shadow-md font-extrabold'
                      : 'text-gray-200 hover:text-white hover:bg-white/10'
                  }`}
                  title="Guia EPG de canais e programação ao vivo"
                >
                  <Menu className={`w-3.5 h-3.5 ${viewMode === 'epg' ? 'text-amber-500' : 'text-gray-200'}`} />
                  <span>Guia</span>
                </button>
              </div>

              {/* Botão de Som / Áudio */}
              <button
                id="btn-header-volume"
                type="button"
                data-tv-nav="tab"
                tabIndex={0}
                onClick={toggleSound}
                className="tv-nav-focus flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/60 text-gray-200 hover:text-white border border-white/15 shadow-inner transition cursor-pointer outline-none"
                title={isMuted ? 'Ativar Som' : 'Desativar Som (Mudo)'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-gray-200" />}
              </button>

              {/* Relógio em Tempo Real */}
              {timeStr && (
                <div className="hidden xl:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-black/40 border border-white/15 text-xs font-mono font-bold text-white shadow-inner">
                  <Clock className="w-3.5 h-3.5 text-gray-300" />
                  <span>{timeStr}</span>
                </div>
              )}

              {/* Botão do Menu Principal (três pontinhos) */}
              {onOpenMenu && (
                <button
                  id="btn-three-dots-menu"
                  type="button"
                  data-tv-nav="tab"
                  tabIndex={0}
                  onClick={onOpenMenu}
                  className="tv-nav-focus flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#540b0b] hover:bg-[#6b0f0f] active:bg-[#430808] text-white transition cursor-pointer outline-none border-0 shadow-inner"
                  title="Abrir Menu Principal"
                  aria-label="Menu Principal"
                >
                  <MoreVertical className="w-5 h-5 text-white stroke-[2.5]" />
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Sub-barra de busca retrátil (desce para baixo no celular ou quando acionada) */}
      {showSearchInput && (
        <div className="sm:hidden w-full bg-[#3d0606] border-b border-white/10 px-3 py-2 flex items-center gap-2 shadow-2xl animate-in slide-in-from-top-2 duration-150">
          <div className="relative flex-1 flex items-center">
            <Search className="w-3.5 h-3.5 text-red-200/80 absolute left-2.5 pointer-events-none" />
            <input
              id="channel-search-input-mobile"
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar canal, grupo..."
              className="w-full bg-black/50 text-white placeholder-red-200/50 text-xs rounded-lg pl-8 pr-7 py-1.5 border border-white/20 focus:outline-none focus:ring-1 focus:ring-red-400 shadow-inner"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleCloseSearch();
                }
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-2 text-red-200/70 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleCloseSearch}
            className="px-2.5 py-1 text-xs font-semibold text-white bg-black/40 hover:bg-black/60 rounded-lg border border-white/10 transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
