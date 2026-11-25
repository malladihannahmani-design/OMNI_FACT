// Subtle Web Audio API cyber synthesizer
class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    // Check local storage for mute preference
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('CYBER_AUDIO_ENABLED');
      this.enabled = stored !== null ? stored === 'true' : false; // Default mute for calm experience, user can enable!
    }
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('CYBER_AUDIO_ENABLED', String(this.enabled));
    }
    if (this.enabled) {
      this.playBeep(880, 0.05, 'sine');
    }
    return this.enabled;
  }

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playClick(): void {
    this.playBeep(1200, 0.03, 'sine', 0.04);
  }

  public playScan(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  public playVerdict(isFake: boolean): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (isFake) {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.35);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.35);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(660, now + 0.1);
        osc.frequency.setValueAtTime(880, now + 0.2);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.35);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.36);
    } catch {
      // Ignore
    }
  }

  public playBeep(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.05): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration + 0.01);
    } catch {
      // Ignore
    }
  }
}

export const soundFx = new SoundEffectsManager();
