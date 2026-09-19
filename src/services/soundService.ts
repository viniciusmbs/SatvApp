/**
 * Serviço de áudio com Web Audio API para navegação de Smart TV
 * Sem dependências externas de arquivos de áudio
 */

class SoundService {
  public enabled: boolean = true;
  private ctx: AudioContext | null = null;

  constructor() {
    try {
      const saved = localStorage.getItem('tv_sound_enabled');
      if (saved !== null) {
        this.enabled = saved === 'true';
      }
    } catch {}
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    try {
      localStorage.setItem('tv_sound_enabled', String(this.enabled));
    } catch {}
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    try {
      localStorage.setItem('tv_sound_enabled', String(this.enabled));
    } catch {}
    return this.enabled;
  }

  public playSelect() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  public playNav() {
    // Desativado conforme solicitado: som apenas no clique, não ao navegar entre botões
  }

  public playFavorite() {
    this.playSelect();
  }

  public playMenu() {
    this.playSelect();
  }

  public toggleMute(): boolean {
    const enabled = this.toggle();
    return !enabled;
  }

  public getIsMuted(): boolean {
    return !this.enabled;
  }

  public setMuted(muted: boolean) {
    this.setEnabled(!muted);
  }

  public playBack() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.09);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }
}

export const soundService = new SoundService();