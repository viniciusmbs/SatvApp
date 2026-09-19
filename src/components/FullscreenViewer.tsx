import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Tv,
  ExternalLink,
  Radio,
  Sliders,
  AlertCircle,
} from 'lucide-react';
import Hls from 'hls.js';
import mpegts from 'mpegts.js';
import { Channel } from '../types';
import { soundService } from '../services/soundService';
import { getChannelLogo } from '../data/channelLogos';

interface FullscreenViewerProps {
  channel: Channel | null;
  onClose: () => void;
  onPrevChannel?: () => void;
  onNextChannel?: () => void;
}

type PlaybackEngine = 'auto' | 'hls' | 'mpegts' | 'embed' | 'native';

export const FullscreenViewer: React.FC<FullscreenViewerProps> = ({
  channel,
  onClose,
  onPrevChannel,
  onNextChannel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const mpegtsPlayerRef = useRef<mpegts.Player | null>(null);
  const hideTimerRef = useRef<any>(null);

  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [engine, setEngine] = useState<PlaybackEngine>('auto');
  const [activeEngine, setActiveEngine] = useState<string>('Detectando...');
  const [reloadKey, setReloadKey] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mxTriggeredNotice, setMxTriggeredNotice] = useState(false);

  // 1. DETECÇÃO DE TIPO DE TRANSMISSÃO
  const isHls = Boolean(channel?.url && (channel.url.includes('.m3u8') || channel.url.includes('/hls/')));
  const isMpegTs = Boolean(channel?.url && (channel.url.includes('.ts') || channel.url.includes(':80/')));
  const isDirectMedia = isHls || isMpegTs;

  // 1. DETECÇÃO DE DISPOSITIVO (Fire Stick / Android TV / Mobile Android)
  const isAndroidOrFireStick = typeof navigator !== 'undefined' && /Android|AFT|Silk|FireTV/i.test(navigator.userAgent);

  // Auto-hide controls after 4 seconds of inactivity
  const wakeControls = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);
  }, []);

  // DISPARO AUTOMÁTICO DO INTENT DO MX PLAYER (FIRESTICK / ANDROID)
  const openInMxPlayer = useCallback((streamUrl: string, channelName: string) => {
    const mxIntent = `intent:${streamUrl}#Intent;package=com.mxtech.videoplayer.ad;type=video/*;S.title=${encodeURIComponent(
      channelName
    )};end`;
    const genericIntent = `intent:${streamUrl}#Intent;action=android.intent.action.VIEW;type=video/*;S.title=${encodeURIComponent(
      channelName
    )};end`;

    setMxTriggeredNotice(true);
    setTimeout(() => setMxTriggeredNotice(false), 3000);

    try {
      window.location.href = mxIntent;
      setTimeout(() => {
        try {
          window.location.href = genericIntent;
        } catch {
          // ignore
        }
      }, 1000);
    } catch {
      try {
        window.location.href = genericIntent;
      } catch {
        // ignore
      }
    }
  }, []);

  // Disparo automático ao abrir o canal no Android / Fire Stick
  useEffect(() => {
    if (channel && isAndroidOrFireStick) {
      const timer = setTimeout(() => {
        openInMxPlayer(channel.url, channel.name);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [channel?.url, isAndroidOrFireStick, openInMxPlayer]);

  // 3. AUTO-PLAY NO IFRAME (timeout 1200ms após carregar o canal para disparar comandos de play)
  useEffect(() => {
    if (!channel || isDirectMedia) return;

    const timer = setTimeout(() => {
      try {
        iframeRef.current?.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        iframeRef.current?.contentWindow?.postMessage({ type: 'play' }, '*');
      } catch {
        // ignore cross-origin postMessage restriction
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [channel?.url, reloadKey, isDirectMedia]);

  // Limpeza de players de vídeo anteriores
  const cleanupPlayers = useCallback(() => {
    if (hlsRef.current) {
      try {
        hlsRef.current.destroy();
      } catch {
        // ignore
      }
      hlsRef.current = null;
    }

    if (mpegtsPlayerRef.current) {
      try {
        mpegtsPlayerRef.current.pause();
        mpegtsPlayerRef.current.unload();
        mpegtsPlayerRef.current.detachMediaElement();
        mpegtsPlayerRef.current.destroy();
      } catch {
        // ignore
      }
      mpegtsPlayerRef.current = null;
    }

    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      } catch {
        // ignore
      }
    }
  }, []);

  // Determinar qual motor usar com base na URL
  const determineEngine = useCallback(
    (url: string, userChoice: PlaybackEngine): 'hls' | 'mpegts' | 'embed' | 'native' => {
      if (userChoice !== 'auto') {
        return userChoice;
      }

      const cleanUrl = url.trim().toLowerCase();

      // 1. Detectar HLS (.m3u8)
      if (cleanUrl.includes('.m3u8') || cleanUrl.includes('/hls/')) {
        return 'hls';
      }

      // 2. Detectar MPEG-TS (.ts)
      if (cleanUrl.includes('.ts') || cleanUrl.includes(':80/')) {
        return 'mpegts';
      }

      // 3. Qualquer outro provedor web / embed (rdcanais, rdse, embedtv, etc)
      return 'embed';
    },
    []
  );

  // Inicializar reprodução de acordo com o motor detectado
  useEffect(() => {
    if (!channel) return;

    cleanupPlayers();
    setHasError(false);
    setErrorMessage('');
    wakeControls();

    // Se não for mídia direta (.m3u8 / .ts), não inicializa players de vídeo HTML5
    if (!isDirectMedia) {
      setActiveEngine('EMBED');
      return;
    }

    const targetEngine = determineEngine(channel.url, engine);
    setActiveEngine(targetEngine.toUpperCase());

    const video = videoRef.current;

    if (targetEngine === 'hls' && video) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 60,
          manifestLoadingTimeOut: 15000,
          manifestLoadingMaxRetry: 3,
        });

        hlsRef.current = hls;
        hls.loadSource(channel.url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {
            // Se autoplay bloqueado pelo navegador, tentar mudo
            video.muted = true;
            setIsMuted(true);
            video.play().catch(() => {});
          });
          setIsPlaying(true);
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                // Falha fatal no HLS -> tentar fallback para iframe embed
                hls.destroy();
                setActiveEngine('EMBED');
                setEngine('embed');
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Suporte nativo ao HLS no Safari / iOS
        video.src = channel.url;
        video.play().catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
        setIsPlaying(true);
      } else {
        // Fallback para embed se HLS não for suportado
        setActiveEngine('EMBED');
        setEngine('embed');
      }
    } else if (targetEngine === 'mpegts' && video) {
      if (mpegts.isSupported()) {
        try {
          const player = mpegts.createPlayer(
            {
              type: 'mse',
              isLive: true,
              url: channel.url,
            },
            {
              enableWorker: true,
              lazyLoad: false,
              liveBufferLatencyChasing: true,
            }
          );

          mpegtsPlayerRef.current = player;
          player.attachMediaElement(video);
          player.load();
          const playRes = player.play();
          if (playRes && typeof (playRes as any).catch === 'function') {
            (playRes as Promise<void>).catch(() => {
              video.muted = true;
              setIsMuted(true);
              const retryRes = player.play();
              if (retryRes && typeof (retryRes as any).catch === 'function') {
                (retryRes as Promise<void>).catch(() => {});
              }
            });
          }
          setIsPlaying(true);

          player.on(mpegts.Events.ERROR, () => {
            // Em caso de erro, mudar para fallback nativo ou embed
            setActiveEngine('EMBED');
            setEngine('embed');
          });
        } catch (err: any) {
          setActiveEngine('EMBED');
          setEngine('embed');
        }
      } else {
        setActiveEngine('EMBED');
        setEngine('embed');
      }
    } else if (targetEngine === 'native' && video) {
      video.src = channel.url;
      video.play().catch(() => {
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => {});
      });
      setIsPlaying(true);
    }

    return () => {
      cleanupPlayers();
    };
  }, [channel, engine, reloadKey, cleanupPlayers, determineEngine, wakeControls]);

  // Sincronização de eventos globais de atividade (Mouse, Toque, Teclado)
  useEffect(() => {
    const handleActivity = () => wakeControls();

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('click', handleActivity);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [wakeControls]);

  // Controles de Tela Cheia Nativa do Navegador
  const toggleFullscreen = () => {
    soundService.playSelect();
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Alternar Play / Pause
  const togglePlayPause = () => {
    soundService.playSelect();
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play().catch(() => {});
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  // Alternar Mudo
  const toggleMute = () => {
    soundService.playSelect();
    const video = videoRef.current;
    if (video) {
      const nextMuted = !video.muted;
      video.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  // Alterar Volume
  const handleVolumeChange = (newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolume(clamped);
    if (videoRef.current) {
      videoRef.current.volume = clamped;
      videoRef.current.muted = clamped === 0;
      setIsMuted(clamped === 0);
    }
  };

  // 3. ATALHOS DE TECLADO / CONTROLE REMOTO (SMART TV 10-FOOT)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      wakeControls();
      const code = e.keyCode || e.which;
      const key = e.key;

      // Tecla ESC / Backspace / Android Back (4) / Tizen (10009) para Sair
      if (key === 'Escape' || key === 'Backspace' || code === 4 || code === 10009) {
        e.preventDefault();
        soundService.playSelect();
        onClose();
        return;
      }

      // Tecla F para alternar Tela Cheia
      if (key === 'f' || key === 'F') {
        e.preventDefault();
        toggleFullscreen();
        return;
      }

      // Tecla M para Mudo
      if (key === 'm' || key === 'M') {
        e.preventDefault();
        toggleMute();
        return;
      }

      // Barra de Espaço ou Tecla MediaPlayPause (85, 126, 127) para Play/Pause
      if (key === ' ' || key === 'MediaPlayPause' || code === 85 || code === 126 || code === 127) {
        e.preventDefault();
        togglePlayPause();
        return;
      }

      // Teclas Esquerda ou Canal Anterior
      if ((key === 'ArrowLeft' || key === 'MediaTrackPrevious' || code === 412) && onPrevChannel) {
        e.preventDefault();
        soundService.playSelect();
        onPrevChannel();
        return;
      }

      // Teclas Direita ou Próximo Canal
      if ((key === 'ArrowRight' || key === 'MediaTrackNext' || code === 417) && onNextChannel) {
        e.preventDefault();
        soundService.playSelect();
        onNextChannel();
        return;
      }

      // Tecla Cima para Canal Anterior (convenção comum em IPTV Smart TV)
      if (key === 'ArrowUp' && onPrevChannel) {
        e.preventDefault();
        soundService.playSelect();
        onPrevChannel();
        return;
      }

      // Tecla Baixo para Próximo Canal
      if (key === 'ArrowDown' && onNextChannel) {
        e.preventDefault();
        soundService.playSelect();
        onNextChannel();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrevChannel, onNextChannel, wakeControls]);

  if (!channel) return null;

  const currentEngineType = determineEngine(channel.url, engine);
  const channelLogo = channel.logo || getChannelLogo(channel.name, undefined, channel.group);

  return (
    <div
      ref={containerRef}
      id="satv-fullscreen-viewer"
      className={`fixed inset-0 z-50 bg-black w-screen h-screen flex flex-col overflow-hidden select-none ${
        !showControls ? 'cursor-none' : 'cursor-default'
      }`}
      onMouseMove={wakeControls}
      onClick={wakeControls}
    >
      {/* ============================================================ */}
      {/* 1. BARRA SUPERIOR OSD (TRANSPARENTE COM BACKDROP-BLUR)        */}
      {/* ============================================================ */}
      <header
        className={`absolute top-0 left-0 right-0 z-30 transition-all duration-300 transform ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        } bg-gradient-to-b from-black/90 via-black/60 to-transparent backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-white/10`}
      >
        {/* Lado Esquerdo: Botão Voltar + Logo + Nome + Status ONLINE Verde Piscando */}
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <button
            id="viewer-back-btn"
            type="button"
            onClick={onClose}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xl transition focus:ring-2 focus:ring-white outline-none cursor-pointer shrink-0"
            title="Voltar aos canais (ESC / Voltar)"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Voltar</span>
          </button>

          {/* Logo do Canal */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-black/60 border border-white/20 flex items-center justify-center p-1 shrink-0 shadow-inner">
            <img
              src={channelLogo}
              alt=""
              className="max-w-full max-h-full object-contain"
              onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
            />
          </div>

          {/* Nome e Grupo */}
          <div className="min-w-0 flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-white font-extrabold text-sm sm:text-base drop-shadow-md truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                {channel.name}
              </span>
              <span className="hidden sm:inline-block text-[10px] bg-red-600/80 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {channel.group || 'IPTV'}
              </span>
            </div>

            {/* Status ONLINE com sinalzinho Radio verde piscando e texto branco */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse shrink-0" />
              <span className="text-[11px] font-bold text-white tracking-wide">ONLINE</span>

              <span className="text-slate-400 text-[11px] mx-1">•</span>
              <span className="text-[10px] font-mono font-semibold text-slate-300 uppercase">
                {activeEngine}
              </span>
            </div>
          </div>
        </div>

        {/* Lado Direito: Recarregar + Tela Cheia */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Recarregar */}
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="p-2 sm:p-2.5 text-slate-200 hover:text-white bg-black/50 hover:bg-black/80 border border-white/15 rounded-xl transition shadow cursor-pointer outline-none"
            title="Recarregar transmissão"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Alternar Tela Cheia */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 sm:p-2.5 text-slate-200 hover:text-white bg-black/50 hover:bg-black/80 border border-white/15 rounded-xl transition shadow cursor-pointer outline-none"
            title={isFullscreen ? 'Sair da Tela Cheia (F)' : 'Tela Cheia Total (F)'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Aviso de Disparo Automático no Player (Toast rápido) */}
      {mxTriggeredNotice && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-black/85 border border-red-500/80 px-4 py-2 rounded-xl text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md animate-in fade-in duration-200">
          <Tv className="w-4 h-4 text-red-400 animate-bounce" />
          <span>Iniciando transmissão no player...</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. ÁREA PRINCIPAL DE VÍDEO (MOTOR HÍBRIDO HLS / TS / EMBED) */}
      {/* ============================================================ */}
      <main className="flex-1 w-full h-full relative bg-black flex items-center justify-center">
        {/* Caso isDirectMedia seja falso, NÃO renderize a tag <video>. Renderize um <iframe> ocupando 100% da tela */}
        {!isDirectMedia ? (
          <iframe
            ref={iframeRef}
            key={`frame-${channel.url}-${reloadKey}`}
            src={channel.url}
            title={channel.name}
            className="w-full h-full border-0 bg-black"
            allow="autoplay *; fullscreen *; encrypted-media *; picture-in-picture *"
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Elemento de Vídeo HTML5 acoplado com HLS.js, MPEGTS.js ou Nativo */
          <video
            ref={videoRef}
            key={`video-${channel.url}-${reloadKey}`}
            className="w-full h-full object-contain bg-black"
            autoPlay
            playsInline
            controls={false}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => {
              setHasError(true);
              setErrorMessage('Não foi possível carregar a transmissão direta.');
            }}
          />
        )}

        {/* Botão flutuante discreto de contingência para canais Embed */}
        {!isDirectMedia && (
          <div
            className={`absolute bottom-20 right-4 z-40 transition-all duration-300 ${
              showControls ? 'opacity-100 translate-y-0' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <a
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundService.playSelect()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black/95 text-white text-xs font-bold border border-white/20 transition shadow-2xl cursor-pointer backdrop-blur-md"
              title="Abrir em Nova Aba caso o navegador bloqueie o iframe por cabeçalho X-Frame-Options"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>Abrir em Nova Aba</span>
            </a>
          </div>
        )}

        {/* Mensagem de Erro com Ação de Recuperação */}
        {hasError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-3 animate-pulse" />
            <h3 className="text-white font-bold text-lg mb-1">Transmissão Indisponível</h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-md mb-4">{errorMessage}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => {
                  setHasError(false);
                  setReloadKey((k) => k + 1);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-white/20 transition cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-white" />
                Recarregar Transmissão
              </button>
              <a
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                Abrir em Nova Aba
              </a>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* 3. BARRA INFERIOR OSD (SE ESCONDE APÓS 4 SEGUNDOS)           */}
      {/* ============================================================ */}
      <footer
        className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-300 transform ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
        } bg-gradient-to-t from-black/95 via-black/75 to-transparent backdrop-blur-md px-4 sm:px-6 py-4 flex items-center justify-between border-t border-white/10`}
      >
        {/* Lado Esquerdo: Play/Pause, Mudo, Volume */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Botão Play / Pause */}
          <button
            type="button"
            onClick={togglePlayPause}
            className="p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer outline-none border border-white/15"
            title={isPlaying ? 'Pausar (Espaço)' : 'Reproduzir (Espaço)'}
          >
            {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />}
          </button>

          {/* Botão Mudo */}
          <button
            type="button"
            onClick={toggleMute}
            className="p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer outline-none border border-white/15"
            title={isMuted ? 'Ativar Som (M)' : 'Mudo (M)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Slider de Volume (Desktop / Tablet) */}
          <div className="hidden md:flex items-center space-x-2 pl-1">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-20 lg:w-28 accent-red-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
              title="Ajustar Volume"
            />
          </div>
        </div>

        {/* Centro: Troca de Canais (Anterior / Próximo) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {onPrevChannel && (
            <button
              type="button"
              onClick={onPrevChannel}
              className="flex items-center space-x-1 sm:space-x-1.5 px-3 sm:px-4 py-2 bg-black/60 hover:bg-black/90 active:scale-95 border border-white/15 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg transition cursor-pointer outline-none"
              title="Canal Anterior (Seta Esquerda / Cima do Controle)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Anterior</span>
            </button>
          )}

          {onNextChannel && (
            <button
              type="button"
              onClick={onNextChannel}
              className="flex items-center space-x-1 sm:space-x-1.5 px-3 sm:px-4 py-2 bg-black/60 hover:bg-black/90 active:scale-95 border border-white/15 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg transition cursor-pointer outline-none"
              title="Próximo Canal (Seta Direita / Baixo do Controle)"
            >
              <span className="hidden xs:inline">Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Lado Direito: Seletor de Motor / Ferramentas */}
        <div className="flex items-center space-x-2">
          {/* Seletor Rápido de Motor de Vídeo */}
          <div className="flex items-center bg-black/60 rounded-xl p-0.5 border border-white/15 text-[10px] font-bold text-slate-300">
            <button
              type="button"
              onClick={() => setEngine('auto')}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                engine === 'auto' ? 'bg-red-600 text-white shadow' : 'hover:text-white'
              }`}
              title="Motor Automático (HLS / TS / Embed)"
            >
              Auto
            </button>
            <button
              type="button"
              onClick={() => setEngine('embed')}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                engine === 'embed' ? 'bg-red-600 text-white shadow' : 'hover:text-white'
              }`}
              title="Modo Iframe Embed"
            >
              Web
            </button>
          </div>

          {/* Abrir em Nova Aba */}
          <a
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1 p-2 bg-black/60 hover:bg-black/80 border border-white/15 rounded-xl text-slate-300 hover:text-white transition shadow"
            title="Abrir URL em nova aba"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default FullscreenViewer;
