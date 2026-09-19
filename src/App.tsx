import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Channel, GroupedChannels, ViewMode } from './types';
import { parseM3U } from './services/m3uParser';
import { m3uPlaylist } from './data/playlist';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ChannelRows from './components/ChannelRows';
import ChannelGrid from './components/ChannelGrid';
import EpgGrid from './components/EpgGrid';
import FullscreenViewer from './components/FullscreenViewer';
import { MenuModal } from './components/MenuModal';
import { ExitConfirmModal } from './components/ExitConfirmModal';
import { soundService } from './services/soundService';
import { useTvNavigation } from './services/useTvNavigation';

export default function App() {
  const [channels, setChannels] = useState<Channel[]>(() => {
    try {
      return parseM3U(m3uPlaylist);
    } catch (err) {
      console.error('Erro ao processar canais:', err);
      return [];
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  
  // Estado para o filtro de status (all, online, offline)
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');

  // Estado do Canal em Reprodução no FullscreenViewer
  const [activePlayingChannel, setActivePlayingChannel] = useState<Channel | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('rows');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Estado para controlar a trava de segurança de saída
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('satv_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 2800);
  };

  // Toggle favorite channel
  const handleToggleFavorite = (channelName: string) => {
    setFavorites((prev) => {
      const isAlready = prev.includes(channelName);
      const next = isAlready
        ? prev.filter((name) => name !== channelName)
        : [...prev, channelName];
      try {
        localStorage.setItem('satv_favorites', JSON.stringify(next));
      } catch {
        // ignore localStorage errors
      }
      showToast(
        isAlready
          ? `Removido dos Favoritos: ${channelName}`
          : `⭐ ${channelName} adicionado aos Meus Favoritos!`
      );
      return next;
    });
  };

  // Load initial playlist
  useEffect(() => {
    try {
      const parsed = parseM3U(m3uPlaylist);
      setChannels(parsed);
    } catch (err) {
      console.error('Falha ao carregar playlist inicial:', err);
    }
  }, []);

  // Distinct categories from channels
  const categories = useMemo(() => {
    const cats = new Set<string>();
    channels.forEach((c) => {
      if (c.group) cats.add(c.group);
    });
    return Array.from(cats);
  }, [channels]);

  // Cálculo das contagens globais com fallback para canais sem status explícito
  const onlineCount = useMemo(() => {
    return channels.filter((c) => c.status === 'online' || !c.status).length;
  }, [channels]);

  const offlineCount = useMemo(() => {
    return channels.filter((c) => c.status === 'offline').length;
  }, [channels]);

  // Filter channels based on search, category, and status filter
  const filteredChannels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return channels.filter((channel) => {
      // 1. Category filter (handles FAVORITOS filter explicitly)
      if (selectedCategory === 'FAVORITOS') {
        if (!favorites.includes(channel.name)) {
          return false;
        }
      } else if (selectedCategory !== 'TODOS' && channel.group !== selectedCategory) {
        return false;
      }

      // 2. Status filter (online / offline) com tratamento de fallback
      if (statusFilter === 'online') {
        if (channel.status && channel.status !== 'online') return false;
      }
      if (statusFilter === 'offline') {
        if (channel.status !== 'offline') return false;
      }

      // 3. Search query filter (matches channel name or group)
      if (q) {
        const nameMatch = channel.name.toLowerCase().includes(q);
        const groupMatch = channel.group.toLowerCase().includes(q);
        return nameMatch || groupMatch;
      }

      return true;
    });
  }, [channels, searchQuery, selectedCategory, favorites, statusFilter]);

  // Group filtered channels by group title
  const groupedChannels = useMemo(() => {
    const grouped: GroupedChannels = {};
    filteredChannels.forEach((ch) => {
      const g = ch.group || 'GERAL';
      if (!grouped[g]) grouped[g] = [];
      grouped[g].push(ch);
    });
    return grouped;
  }, [filteredChannels]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('TODOS');
    setStatusFilter('all');
  };

  // Active TV tabulation navigation hook (disabled while menu modal, exit modal or player is open)
  const { lastFocusedCardRef } = useTvNavigation({
    enabled: !isMenuOpen && !showExitConfirm && !activePlayingChannel,
  });

  const handleSelectChannel = (ch: Channel) => {
    const cardEl =
      document.getElementById(`channel-card-${ch.id || encodeURIComponent(ch.name)}`) ||
      document.getElementById(`epg-card-${ch.id || encodeURIComponent(ch.name)}`);
    if (cardEl) {
      lastFocusedCardRef.current = cardEl;
    }
    setActivePlayingChannel(ch);
  };

  const handlePrevChannel = () => {
    if (!activePlayingChannel || filteredChannels.length === 0) return;
    const currentIndex = filteredChannels.findIndex(
      (c) => c.name === activePlayingChannel.name || c.url === activePlayingChannel.url
    );
    const prevIndex = currentIndex <= 0 ? filteredChannels.length - 1 : currentIndex - 1;
    setActivePlayingChannel(filteredChannels[prevIndex]);
  };

  const handleNextChannel = () => {
    if (!activePlayingChannel || filteredChannels.length === 0) return;
    const currentIndex = filteredChannels.findIndex(
      (c) => c.name === activePlayingChannel.name || c.url === activePlayingChannel.url
    );
    const nextIndex = currentIndex >= filteredChannels.length - 1 ? 0 : currentIndex + 1;
    setActivePlayingChannel(filteredChannels[nextIndex]);
  };

  // Referência de estado em tempo real para evitar problemas de stale closure
  const stateRef = useRef({
    isMenuOpen,
    showExitConfirm,
    searchQuery,
    selectedCategory,
    statusFilter,
  });

  useEffect(() => {
    stateRef.current = {
      isMenuOpen,
      showExitConfirm,
      searchQuery,
      selectedCategory,
      statusFilter,
    };
  }, [isMenuOpen, showExitConfirm, searchQuery, selectedCategory, statusFilter]);

  const lastBackTimestampRef = useRef<number>(0);
  const isExitingRef = useRef<boolean>(false);

  // Despachante unificado da ação Voltar
  const executeBackStep = () => {
    if (isExitingRef.current) return;
    const now = Date.now();
    if (now - lastBackTimestampRef.current < 300) {
      return;
    }
    lastBackTimestampRef.current = now;

    const current = stateRef.current;

    if (current.isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }

    if (current.showExitConfirm) {
      soundService.playSelect();
      setShowExitConfirm(false);
      return;
    }

    if (current.statusFilter !== 'all') {
      setStatusFilter('all');
      return;
    }

    if (current.searchQuery) {
      setSearchQuery('');
      const firstCard = document.querySelector<HTMLElement>('[data-channel-name]');
      firstCard?.focus();
      return;
    }

    if (current.selectedCategory !== 'TODOS') {
      setSelectedCategory('TODOS');
      return;
    }

    setShowExitConfirm(true);
  };

  // Trava de segurança no histórico do navegador e WebView
  useEffect(() => {
    const ensureHistoryGuard = () => {
      try {
        if (window.location.hash !== '#app') {
          window.history.replaceState({ satv: 'root' }, '', window.location.pathname + window.location.search + '#root');
          window.history.pushState({ satv: 'app' }, '', window.location.pathname + window.location.search + '#app');
        }
      } catch {
        // ignore
      }
    };

    ensureHistoryGuard();

    const primeUserGesture = () => {
      if (isExitingRef.current) return;
      try {
        if (window.location.hash !== '#app') {
          window.history.pushState({ satv: 'app' }, '', window.location.pathname + window.location.search + '#app');
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('click', primeUserGesture, { capture: true, passive: true });
    window.addEventListener('keydown', primeUserGesture, { capture: true, passive: true });
    window.addEventListener('touchstart', primeUserGesture, { capture: true, passive: true });

    const handlePopState = () => {
      if (isExitingRef.current) return;
      try {
        window.history.pushState({ satv: 'app' }, '', window.location.pathname + window.location.search + '#app');
      } catch {
        // ignore
      }
      executeBackStep();
    };

    const handleHashChange = () => {
      if (isExitingRef.current) return;
      if (window.location.hash !== '#app') {
        try {
          window.history.pushState({ satv: 'app' }, '', window.location.pathname + window.location.search + '#app');
        } catch {
          // ignore
        }
        executeBackStep();
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);

    const handleCordovaBack = (e: Event) => {
      if (isExitingRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      executeBackStep();
    };
    document.addEventListener('backbutton', handleCordovaBack, false);

    (window as unknown as { onBackPressed?: () => boolean }).onBackPressed = () => {
      if (isExitingRef.current) return false;
      executeBackStep();
      return true;
    };
    (window as unknown as { onBack?: () => boolean }).onBack = () => {
      if (isExitingRef.current) return false;
      executeBackStep();
      return true;
    };
    (window as unknown as { handleAndroidBack?: () => boolean }).handleAndroidBack = () => {
      if (isExitingRef.current) return false;
      executeBackStep();
      return true;
    };

    return () => {
      window.removeEventListener('click', primeUserGesture, { capture: true });
      window.removeEventListener('keydown', primeUserGesture, { capture: true });
      window.removeEventListener('touchstart', primeUserGesture, { capture: true });
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
      document.removeEventListener('backbutton', handleCordovaBack, false);
      delete (window as unknown as { onBackPressed?: () => boolean }).onBackPressed;
      delete (window as unknown as { onBack?: () => boolean }).onBack;
      delete (window as unknown as { handleAndroidBack?: () => boolean }).handleAndroidBack;
    };
  }, []);

  // Interceptação pelo controle remoto do Fire TV Stick, Android TV e Teclado Físico
  useEffect(() => {
    const isBackKeyEvent = (e: KeyboardEvent) => {
      const code = e.keyCode || e.which;
      const key = e.key;

      return (
        code === 4 ||
        code === 27 ||
        key === 'Escape' ||
        key === 'Back' ||
        key === 'GoBack' ||
        key === 'BrowserBack' ||
        e.code === 'BrowserBack' ||
        code === 10009 ||
        code === 461 ||
        code === 216 ||
        code === 166 ||
        ((key === 'Backspace' || code === 8) &&
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA')
      );
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isMenuKey =
        e.keyCode === 82 ||
        e.which === 82 ||
        e.key === 'ContextMenu' ||
        e.code === 'ContextMenu' ||
        e.key === 'Menu' ||
        ((e.key === 'm' || e.key === 'M') &&
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA');

      if (isMenuKey) {
        e.preventDefault();
        e.stopPropagation();
        setIsMenuOpen((prev) => !prev);
        return;
      }

      if (isBackKeyEvent(e)) {
        e.preventDefault();
        e.stopPropagation();
        executeBackStep();
        return;
      }

      if ((e.key === '/' || e.key === 's') && document.activeElement?.tagName !== 'INPUT') {
        const searchInput = document.getElementById('channel-search-input');
        if (searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      }
    };

    const handleGlobalKeyUp = (e: KeyboardEvent) => {
      if (isBackKeyEvent(e)) {
        e.preventDefault();
        e.stopPropagation();
        executeBackStep();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown, { capture: true });
    window.addEventListener('keyup', handleGlobalKeyUp, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown, { capture: true });
      window.removeEventListener('keyup', handleGlobalKeyUp, { capture: true });
    };
  }, []);

  const handleConfirmExit = () => {
    soundService.playSelect();
    isExitingRef.current = true;
    setShowExitConfirm(false);

    // 1. Pausa e descarrega todos os players de áudio/vídeo imediatamente
    document.querySelectorAll('video, audio').forEach((el) => {
      try {
        const media = el as HTMLMediaElement;
        media.pause();
        media.src = '';
        media.load();
      } catch {
        // ignore
      }
    });

    // 2. Cordova / PhoneGap / Capacitor
    try {
      const nav = navigator as unknown as {
        app?: { exitApp?: () => void };
        device?: { exitApp?: () => void };
      };
      if (typeof nav.app?.exitApp === 'function') {
        nav.app.exitApp();
        return;
      }
      if (typeof nav.device?.exitApp === 'function') {
        nav.device.exitApp();
        return;
      }
    } catch {
      // ignore
    }

    // 3. Android Bridges (APK Studio, Web2App, WebView wrapper nativo, etc.)
    try {
      const win = window as unknown as {
        Android?: { exitApp?: () => void; closeApp?: () => void; finish?: () => void; close?: () => void };
        AndroidInterface?: { exitApp?: () => void; closeApp?: () => void; finish?: () => void };
        JSInterface?: { exitApp?: () => void; closeApp?: () => void; finish?: () => void };
        apkStudio?: { exitApp?: () => void; close?: () => void };
        app?: { exit?: () => void };
      };

      if (typeof win.Android?.exitApp === 'function') { win.Android.exitApp(); return; }
      if (typeof win.Android?.closeApp === 'function') { win.Android.closeApp(); return; }
      if (typeof win.Android?.finish === 'function') { win.Android.finish(); return; }
      if (typeof win.Android?.close === 'function') { win.Android.close(); return; }

      if (typeof win.AndroidInterface?.exitApp === 'function') { win.AndroidInterface.exitApp(); return; }
      if (typeof win.AndroidInterface?.closeApp === 'function') { win.AndroidInterface.closeApp(); return; }
      if (typeof win.AndroidInterface?.finish === 'function') { win.AndroidInterface.finish(); return; }

      if (typeof win.JSInterface?.exitApp === 'function') { win.JSInterface.exitApp(); return; }
      if (typeof win.JSInterface?.closeApp === 'function') { win.JSInterface.closeApp(); return; }
      if (typeof win.JSInterface?.finish === 'function') { win.JSInterface.finish(); return; }

      if (typeof win.apkStudio?.exitApp === 'function') { win.apkStudio.exitApp(); return; }
      if (typeof win.apkStudio?.close === 'function') { win.apkStudio.close(); return; }
      if (typeof win.app?.exit === 'function') { win.app.exit(); return; }
    } catch {
      // ignore
    }

    // 4. Smart TVs (Samsung Tizen e LG webOS)
    try {
      const win = window as unknown as {
        tizen?: { application?: { getCurrentApplication?: () => { exit?: () => void } } };
        webOS?: { platformBack?: () => void };
      };
      if (typeof win.tizen?.application?.getCurrentApplication?.()?.exit === 'function') {
        win.tizen.application.getCurrentApplication()?.exit?.();
        return;
      }
      if (typeof win.webOS?.platformBack === 'function') {
        win.webOS.platformBack();
        return;
      }
    } catch {
      // ignore
    }

    // 5. iOS / WebKit WebViews
    try {
      const win = window as unknown as {
        webkit?: {
          messageHandlers?: {
            exitApp?: { postMessage?: (arg: string) => void };
            close?: { postMessage?: (arg: string) => void };
          };
        };
      };
      if (typeof win.webkit?.messageHandlers?.exitApp?.postMessage === 'function') {
        win.webkit.messageHandlers.exitApp.postMessage('');
        return;
      }
      if (typeof win.webkit?.messageHandlers?.close?.postMessage === 'function') {
        win.webkit.messageHandlers.close.postMessage('');
        return;
      }
    } catch {
      // ignore
    }

    // 6. Tentativa de fechamento de janela/aba do navegador e WebChromeClient
    try {
      window.open('', '_self', '');
      window.close();
    } catch {
      // ignore
    }

    try {
      window.close();
    } catch {
      // ignore
    }

    // 7. Navegação de retorno para desempilhar WebView e fechar a Activity raiz
    try {
      window.history.go(-1);
    } catch {
      try {
        window.history.back();
      } catch {
        // ignore
      }
    }

    // 8. Se estiver em um navegador comum onde scripts não podem fechar a aba diretamente por política de segurança:
    setTimeout(() => {
      isExitingRef.current = false;
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0c0e14] text-gray-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Sticky Top Navigation & Filter Bar */}
      <div className="sticky top-0 z-50 w-full shadow-2xl bg-[#0c0e14] isolate [transform:translateZ(0)]">
        <Header
          totalChannels={channels.length}
          onlineChannels={onlineCount}
          offlineChannels={offlineCount}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          favoritesCount={favorites.length}
          onOpenFavorites={() => {
            setSelectedCategory('FAVORITOS');
            if (viewMode === 'epg') setViewMode('rows');
          }}
          onOpenMenu={() => setIsMenuOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <SearchBar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      {/* Main View: Fileiras, Mosaico ou Guia */}
      <main className="flex-1">
        {viewMode === 'rows' && (
          <ChannelRows
            groupedChannels={groupedChannels}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectChannel={handleSelectChannel}
            onClearFilters={handleClearFilters}
          />
        )}
        {viewMode === 'grid' && (
          <ChannelGrid
            groupedChannels={groupedChannels}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectChannel={handleSelectChannel}
            onClearFilters={handleClearFilters}
          />
        )}
        {viewMode === 'epg' && (
          <EpgGrid
            groupedChannels={groupedChannels}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectChannel={handleSelectChannel}
            onClearFilters={handleClearFilters}
            onlineCount={onlineCount}
            offlineCount={offlineCount}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        )}
      </main>

      {/* Floating Smart TV Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-[#171a23] border border-amber-400/60 rounded-xl shadow-2xl text-amber-300 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Trava de Segurança: Modal de Confirmação de Saída */}
      <ExitConfirmModal
        isOpen={showExitConfirm}
        onCancel={() => setShowExitConfirm(false)}
        onConfirmExit={handleConfirmExit}
      />

      {/* Three Dots / Menu List Modal */}
      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenFavorites={() => {
          setSelectedCategory('FAVORITOS');
          if (viewMode === 'epg') setViewMode('rows');
        }}
        favoritesCount={favorites.length}
        totalChannels={channels.length}
        onOpenExit={() => setShowExitConfirm(true)}
      />

      {/* IPTV Fullscreen Player com Motor Híbrido (HLS / MPEG-TS / Embed) e MX Player */}
      {activePlayingChannel && (
        <FullscreenViewer
          channel={activePlayingChannel}
          onClose={() => setActivePlayingChannel(null)}
          onPrevChannel={handlePrevChannel}
          onNextChannel={handleNextChannel}
        />
      )}
    </div>
  );
}