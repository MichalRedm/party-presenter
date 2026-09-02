/**
 * Web Audio API Sound Synthesizer for Party Presenter
 * 100% offline, zero external asset dependencies, instant low-latency playback.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.7;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {
        // Safe catch on autoplay lock
      });
    }
    return this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Subtle click / tap sound
   */
  public playClick(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(this.volume * 0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Safe guard
    }
  }

  /**
   * Gentle Ding / Bell sound (Card reveal, category select)
   */
  public playDing(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [1046.5, 1318.51, 1567.98]; // C6, E6, G6 harmonic bell

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        const noteGain = (this.volume * 0.25) / (idx + 1);
        gain.gain.setValueAtTime(noteGain, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + 0.65);
      });
    } catch {
      // Safe guard
    }
  }

  /**
   * Tension clock tick
   */
  public playTick(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(this.volume * 0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {
      // Safe guard
    }
  }

  /**
   * Buzzer / Error sound (Assassin revealed, time up, wrong guess)
   */
  public playBuzzer(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(130, now);
      osc2.frequency.setValueAtTime(138, now);

      gain.gain.setValueAtTime(this.volume * 0.4, now);
      gain.gain.setValueAtTime(this.volume * 0.35, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch {
      // Safe guard
    }
  }

  /**
   * Grand celebratory fanfare / victory brass
   */
  public playFanfare(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Arpeggiated triumphant fanfare: C5, E5, G5, high C6
      const melody = [
        { freq: 523.25, time: 0.0, dur: 0.12 },
        { freq: 659.25, time: 0.13, dur: 0.12 },
        { freq: 783.99, time: 0.26, dur: 0.15 },
        { freq: 1046.5, time: 0.42, dur: 0.6 },
      ];

      melody.forEach(item => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.freq, now + item.time);

        gain.gain.setValueAtTime(0.001, now + item.time);
        gain.gain.linearRampToValueAtTime(this.volume * 0.35, now + item.time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + item.time + item.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + item.time);
        osc.stop(now + item.time + item.dur + 0.05);
      });
    } catch {
      // Safe guard
    }
  }

  /**
   * Tension Drumroll / suspense build
   */
  public playDrumroll(durationSeconds: number = 2.0): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const numHits = Math.floor(durationSeconds * 20);

      for (let i = 0; i < numHits; i++) {
        const hitTime = now + (i * durationSeconds) / numHits;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(80 + Math.random() * 30, hitTime);

        // Crescendo effect
        const hitVol = this.volume * 0.1 + (i / numHits) * (this.volume * 0.25);
        gain.gain.setValueAtTime(hitVol, hitTime);
        gain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(hitTime);
        osc.stop(hitTime + 0.07);
      }
    } catch {
      // Safe guard
    }
  }

  /**
   * Victory grand fanfare chord with shimmer
   */
  public playVictory(): void {
    if (this.isMuted) return;
    this.playFanfare();
    setTimeout(() => {
      this.playDing();
    }, 450);
  }
}

export const soundEngine = new SoundEngine();
