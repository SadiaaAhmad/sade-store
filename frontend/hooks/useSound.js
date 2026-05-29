import { createContext, useContext, useState, useCallback } from 'react';

const SoundContext = createContext(null);

export function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(false);

  const play = useCallback((type) => {
    if (!enabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const configs = {
        hover:   { freq: 440, duration: 0.08, gain: 0.03 },
        click:   { freq: 520, duration: 0.12, gain: 0.05 },
        add:     { freq: 523, duration: 0.2,  gain: 0.04 },
        open:    { freq: 400, duration: 0.2,  gain: 0.04 },
        success: { freq: 659, duration: 0.3,  gain: 0.05 },
      };
      const config = configs[type] || configs.click;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(config.freq, ctx.currentTime);
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(config.gain, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + config.duration + 0.05);
    } catch (e) {}
  }, [enabled]);

  return (
    <SoundContext.Provider value={{ enabled, toggle: () => setEnabled(p => !p), play }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound must be inside SoundProvider');
  return ctx;
}