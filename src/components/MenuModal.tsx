import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Rows3,
  LayoutGrid,
  CalendarDays,
  Star,
  Download,
  ExternalLink,
  Check,
  LogOut,
  Lock,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { ViewMode } from '../types';
import { soundService } from '../services/soundService';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onOpenFavorites: () => void;
  favoritesCount: number;
  totalChannels: number;
  onOpenExit?: () => void;
  adminUrl?: string; // URL da sua plataforma/painel admin
}

export const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  onClose,
  viewMode,
  setViewMode,
  onOpenFavorites,
  favoritesCount,
  totalChannels,
  onOpenExit,
  adminUrl = 'https://satv-apk-check-tv.vercel.app/',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Estados para o Admin / Senha (digita os 4 dígitos e abre direto)
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const ADMIN_PIN = '5711'; // Senha configurada de 4 dígitos

  // Liberação de memória ao fechar o modal
  useEffect(() => {
    if (!isOpen) {
      setIsAdminOpen(false);
      setShowPasswordModal(false);
      setPasswordInput('');
      setPasswordError(false);
    }
  }, [isOpen]);

  // Focus inicial inteligente ao abrir o menu
  useEffect(() => {
    if (!isOpen || isAdminOpen || showPasswordModal) return;

    const timer = setTimeout(() => {
      let targetToFocus: HTMLElement | null = null;
      if (viewMode === 'rows') {
        targetToFocus = document.getElementById('menu-opt-rows');
      } else if (viewMode === 'grid') {
        targetToFocus = document.getElementById('menu-opt-grid');
      } else if (viewMode === 'epg') {
        targetToFocus = document.getElementById('menu-opt-epg');
      }

      if (!targetToFocus) {
        targetToFocus = modalRef.current?.querySelector<HTMLElement>('[data-menu-item="true"]') || null;
      }

      if (targetToFocus) {
        targetToFocus.focus();
        targetToFocus.scrollIntoView({ block: 'nearest', behavior: 'auto' });
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [isOpen, viewMode, isAdminOpen, showPasswordModal]);

  // Navegação D-Pad / Voltar do controle
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const code = e.keyCode || e.which;

      const isUp = key === 'ArrowUp' || code === 38 || code === 19;
      const isDown = key === 'ArrowDown' || code === 40 || code === 20;
      const isEnter =
        key === 'Enter' ||
        key === ' ' ||
        code === 13 ||
        code === 23 ||
        code === 66;
      const isBack =
        key === 'Escape' ||
        code === 27 ||
        code === 4 ||
        code === 10009;

      if (isBack) {
        e.preventDefault();
        e.stopPropagation();
        if (isAdminOpen) {
          setIsAdminOpen(false); // Fecha o painel admin com o botão voltar e volta para os canais
          return;
        }
        if (showPasswordModal) {
          setShowPasswordModal(false);
          setPasswordInput('');
          setPasswordError(false);
          return;
        }
        onClose();
        setTimeout(() => {
          document.getElementById('btn-three-dots-menu')?.focus();
        }, 50);
        return;
      }

      if (isAdminOpen) return;

      // Se o modal de senha estiver aberto, deixamos o input gerenciar as teclas normalmente, exceto o Back
      if (showPasswordModal) return;

      if (isUp || isDown) {
        e.preventDefault();
        e.stopPropagation();

        const elements = (modalRef.current ? Array.from(modalRef.current.querySelectorAll('[data-menu-item="true"]')) : []) as HTMLElement[];
        const menuItems = elements.filter((el) => el.offsetParent !== null && !el.hasAttribute('disabled'));

        if (menuItems.length === 0) return;

        const currentActive = document.activeElement as HTMLElement | null;
        let currentIndex = currentActive ? menuItems.indexOf(currentActive) : -1;

        let nextIndex = 0;
        if (isDown) {
          nextIndex = currentIndex >= 0 && currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
        } else if (isUp) {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
        }

        const nextTarget = menuItems[nextIndex];
        if (nextTarget) {
          nextTarget.focus();
          nextTarget.scrollIntoView({ block: 'nearest', behavior: 'auto' });
        }
        return;
      }

      if (isEnter) {
        const currentActive = document.activeElement as HTMLElement | null;
        if (currentActive && currentActive.getAttribute('data-menu-item') === 'true') {
          e.preventDefault();
          e.stopPropagation();
          currentActive.click();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isOpen, onClose, showPasswordModal, isAdminOpen]);

  const handleAdminSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordInput === ADMIN_PIN) {
      soundService.playSelect();
      setPasswordError(false);
      setShowPasswordModal(false);
      setPasswordInput('');
      setIsAdminOpen(true); // Abre o painel admin internamente por cima do app
    } else {
      setPasswordError(true);
    }
  };

  if (!isOpen) return null;

  // Se a senha estiver correta, abre o painel preenchendo a tela e permitindo voltar para os canais com 1 clique
  if (isAdminOpen) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col bg-black animate-fadeIn">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#11141c] border-b border-white/15 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Painel Administrativo - Online</span>
          </div>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition cursor-pointer outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Aplicativo</span>
          </button>
        </div>
        <div className="flex-1 w-full relative bg-neutral-900">
          <iframe
            src={adminUrl}
            title="Painel Admin"
            className="w-full h-full border-none"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 select-none"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-[#11141c] border border-white/15 rounded-2xl shadow-2xl overflow-hidden text-gray-200 flex flex-col text-sm"
      >
        {/* Cabeçalho Minimalista */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#161a24]">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <div className="flex items-baseline gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Menu Principal
              </h2>
              <span className="text-[11px] text-emerald-400 font-semibold">
                {totalChannels > 0 ? `${totalChannels} canais online` : '131 canais online'}
              </span>
            </div>
          </div>
          <button
            id="menu-btn-close-top"
            data-menu-item="true"
            type="button"
            tabIndex={0}
            onClick={onClose}
            aria-label="Fechar menu"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 focus:ring-2 focus:ring-amber-400 focus:bg-white/20 transition cursor-pointer outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div
          ref={scrollContainerRef}
          className="p-3.5 space-y-3 max-h-[72vh] overflow-y-auto no-scrollbar"
        >
          {/* 1. Modo de Exibição */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              Modo de Exibição
            </span>
            <div className="grid grid-cols-1 gap-1.5 pt-0.5">
              <button
                id="menu-opt-rows"
                data-menu-item="true"
                type="button"
                tabIndex={0}
                onClick={() => {
                  setViewMode('rows');
                  onClose();
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer outline-none focus:ring-2 focus:ring-amber-400 focus:bg-[#222838] ${
                  viewMode === 'rows'
                    ? 'bg-red-600/20 border-red-500/80 text-white font-bold'
                    : 'bg-[#171a23] hover:bg-[#1f2330] border-white/10 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Rows3 className={`w-4 h-4 shrink-0 ${viewMode === 'rows' ? 'text-red-400' : 'text-slate-400'}`} />
                  <div className="truncate">
                    <div className="text-xs font-bold text-white">Fileiras Horizontais (TV)</div>
                    <div className="text-[10px] text-slate-400 truncate">Estilo Smart TV</div>
                  </div>
                </div>
                {viewMode === 'rows' && <Check className="w-3.5 h-3.5 text-red-400 shrink-0 ml-2" />}
              </button>

              <button
                id="menu-opt-grid"
                data-menu-item="true"
                type="button"
                tabIndex={0}
                onClick={() => {
                  setViewMode('grid');
                  onClose();
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer outline-none focus:ring-2 focus:ring-amber-400 focus:bg-[#222838] ${
                  viewMode === 'grid'
                    ? 'bg-red-600/20 border-red-500/80 text-white font-bold'
                    : 'bg-[#171a23] hover:bg-[#1f2330] border-white/10 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <LayoutGrid className={`w-4 h-4 shrink-0 ${viewMode === 'grid' ? 'text-red-400' : 'text-slate-400'}`} />
                  <div className="truncate">
                    <div className="text-xs font-bold text-white">Mosaico (Grade Vertical)</div>
                    <div className="text-[10px] text-slate-400 truncate">Grade compacta</div>
                  </div>
                </div>
                {viewMode === 'grid' && <Check className="w-3.5 h-3.5 text-red-400 shrink-0 ml-2" />}
              </button>

              <button
                id="menu-opt-epg"
                data-menu-item="true"
                type="button"
                tabIndex={0}
                onClick={() => {
                  setViewMode('epg');
                  onClose();
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer outline-none focus:ring-2 focus:ring-amber-400 focus:bg-[#222838] ${
                  viewMode === 'epg'
                    ? 'bg-red-600/20 border-red-500/80 text-white font-bold'
                    : 'bg-[#171a23] hover:bg-[#1f2330] border-white/10 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <CalendarDays className={`w-4 h-4 shrink-0 ${viewMode === 'epg' ? 'text-red-400' : 'text-slate-400'}`} />
                  <div className="truncate">
                    <div className="text-xs font-bold text-white">Guia de Programação (EPG)</div>
                    <div className="text-[10px] text-slate-400 truncate">Grade de horários ao vivo</div>
                  </div>
                </div>
                {viewMode === 'epg' && <Check className="w-3.5 h-3.5 text-red-400 shrink-0 ml-2" />}
              </button>
            </div>
          </div>

          {/* 2. Meus Favoritos */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              Favoritos
            </span>
            <button
              id="menu-opt-favorites"
              data-menu-item="true"
              type="button"
              tabIndex={0}
              onClick={() => {
                onOpenFavorites();
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all text-left cursor-pointer outline-none focus:ring-2 focus:ring-amber-400"
            >
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-amber-300">Meus Favoritos</div>
                  <div className="text-[10px] text-slate-400">Atalho [ 0 ] ou Play/Pause</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[11px] font-black">
                {favoritesCount}
              </span>
            </button>
          </div>

          {/* 3. MX Player Pro */}
          <div className="p-3 rounded-xl bg-[#151924] border border-white/10 space-y-2">
            <p className="text-[10px] text-slate-300 leading-relaxed">
              Canais em formato <strong className="text-white">.TS</strong> exigem o <strong className="text-blue-300">MX Player Pro v3.1.1</strong>:
            </p>
            <a
              id="menu-opt-download-mx"
              data-menu-item="true"
              href="https://files-2.modyolo.com/MX%20Player%20Pro/MX%20Player%20Pro_v3_1_1.apk"
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={0}
              className="flex items-center justify-center gap-1.5 w-full py-2 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition outline-none cursor-pointer shadow-md focus:ring-2 focus:ring-amber-400"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar MX Player Pro v3.1.1 (APK)</span>
              <ExternalLink className="w-3 h-3 text-blue-200" />
            </a>
          </div>

          {/* 4. Opção de Administrador Protegida por Senha (Digita os 4 dígitos) */}
          <div className="pt-1">
            {showPasswordModal ? (
              <form onSubmit={handleAdminSubmit} className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Digite a Senha (5711)
                  </span>
                  <button
                    type="button"
                    onClick={() => { setShowPasswordModal(false); setPasswordError(false); }}
                    className="text-slate-400 hover:text-white text-[10px]"
                  >
                    Cancelar
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    autoFocus
                    maxLength={4}
                    value={passwordInput}
                    onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                    placeholder="PIN..."
                    className="w-full bg-black/60 border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white outline-none focus:border-amber-400 tracking-widest text-center font-bold"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg cursor-pointer"
                  >
                    OK
                  </button>
                </div>
                {passwordError && (
                  <p className="text-[10px] text-red-400 font-semibold text-center">Senha incorreta!</p>
                )}
              </form>
            ) : (
              <button
                id="menu-opt-admin"
                data-menu-item="true"
                type="button"
                tabIndex={0}
                onClick={() => {
                  soundService.playSelect();
                  setShowPasswordModal(true);
                  setPasswordInput('');
                  setPasswordError(false);
                }}
                className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition text-left cursor-pointer outline-none focus:ring-1 focus:ring-amber-400 group"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
                  <span className="text-[11px] text-slate-400 group-hover:text-slate-200">Painel de Controle / Admin</span>
                </div>
                <span className="text-[9px] text-slate-500 font-mono">[ PIN ]</span>
              </button>
            )}
          </div>

          {/* 5. Sair do aplicativo */}
          {onOpenExit && (
            <div>
              <button
                id="menu-opt-exit"
                data-menu-item="true"
                type="button"
                tabIndex={0}
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    onOpenExit();
                  }, 50);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-red-950/20 hover:bg-red-900/40 border border-red-500/20 transition text-left cursor-pointer outline-none focus:ring-2 focus:ring-red-400"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-xs font-bold text-red-300">Sair do Aplicativo</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="px-4 py-2 bg-[#0e1118] border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] text-slate-500">D-Pad / OK / Voltar</span>
          <button
            id="menu-opt-close-bottom"
            data-menu-item="true"
            type="button"
            tabIndex={0}
            onClick={onClose}
            className="px-3.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer outline-none focus:ring-2 focus:ring-amber-400"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};