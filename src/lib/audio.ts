/**
 * Real-time audio synthesizer using the native Web Audio API
 */
class SoundEngine {
  private static ctx: AudioContext | null = null;
  private static muted: boolean = false;

  private static getCtx(): AudioContext | null {
    if (this.muted) return null;
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch (e) {
      console.warn("Web Audio API is not supported in this browser:", e);
      return null;
    }
  }

  public static toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  public static isMuted(): boolean {
    return this.muted;
  }

  /**
   * Sound triggered on a correct answer
   */
  public static playSuccess() {
    const ctx = this.getCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const gainNode = ctx.createGain();

      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      // Play a beautiful ascending C major arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.2);
      });
    } catch (e) {
      // Ignore audio crash errors
    }
  }

  /**
   * Sound triggered on an incorrect answer
   */
  public static playFailure() {
    const ctx = this.getCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now); // Low frequency
      osc.frequency.linearRampToValueAtTime(90, now + 0.25);

      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  /**
   * Sparkling bell sound for opening widgets or reading slides
   */
  public static playSparkle() {
    const ctx = this.getCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15); // A6

      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  }

  /**
   * Sound when completing a full book or unit
   */
  public static playTrophy() {
    const ctx = this.getCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const baseFreq = 261.63; // C4

      // Harmony of notes (C4, E4, G4, C5) playing in synthesis
      [1.0, 1.25, 1.5, 2.0].forEach((multiplier) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * multiplier, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * multiplier * 2, now + 0.4);

        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.6);
      });
    } catch (e) {}
  }
}

export default SoundEngine;
