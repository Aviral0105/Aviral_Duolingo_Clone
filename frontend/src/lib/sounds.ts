// Zero-dependency sound effects using Web Audio API
class SoundManager {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Signature bright Duolingo Ding
  playCorrect() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880.00, now + 0.1); // A5

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Subtle click/tap sound for buttons and selections
  playTap() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(440.0, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Low error buzz / thud
  playIncorrect() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(220.0, now); // A3
    osc.frequency.setValueAtTime(164.81, now + 0.1); // E3

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Victory fanfare on lesson completion
  playVictory() {
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime + idx * 0.12;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.start(now);
      osc.stop(now + 0.5);
    });
  }

  // Native Web Speech pronunciation with Hindi and rate (slow/normal) support
  speak(text: string, rate: number = 0.9, lang: string = "hi-IN") {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    try {
      // Chrome audio queue bug workaround: cancel previous and resume if suspended
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = typeof rate === "number" ? rate : 0.9; // 0.9 normal, 0.5 snail
      utter.lang = typeof lang === "string" ? lang : "hi-IN";
      utter.pitch = 1.0;
      utter.volume = 1.0;

      // Select best Hindi voice if available in browser
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const hindiVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith("hi") ||
            v.name.toLowerCase().includes("hindi")
        );
        if (hindiVoice) {
          utter.voice = hindiVoice;
        } else {
          const indianVoice = voices.find((v) => v.lang.toLowerCase().includes("in"));
          if (indianVoice) {
            utter.voice = indianVoice;
          }
        }
      }

      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      utter.onerror = () => {
        // Silently ignore browser voice synthesis cancel or network events
      };

      window.speechSynthesis.speak(utter);
    } catch {
      // Graceful fallback if SpeechSynthesis is blocked or unsupported
    }
  }
}

export const sounds = new SoundManager();
