import { useCallback, useEffect, useRef, useState } from 'react';

const MUTE_KEY = 'my2050-sound-muted';
const LEVER_BASE_FREQ = 180;

/**
 * Plays short Web Audio synth tones in reaction to lever changes.
 * - Single lever change -> rising blip (pitch scales with level 1-4)
 * - Preset / reset (many levers at once) -> soft chord
 * - Muted state persisted to localStorage; audio only starts after a user gesture.
 */
export const useSoundFx = (levels: number[]) => {
  const [muted, setMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(MUTE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const ctxRef = useRef<AudioContext | null>(null);
  const prevLevels = useRef<number[]>(levels);
  const readyRef = useRef(false);

  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    if (!ctxRef.current) ctxRef.current = new AC();
    if (ctxRef.current.state === 'suspended') {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const tone = useCallback(
    (freq: number, duration: number, type: OscillatorType = 'triangle', volume = 0.12, delay = 0) => {
      if (muted) return;
      const ctx = getCtx();
      if (!ctx) return;
      const t0 = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(volume, t0 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + duration + 0.05);
    },
    [getCtx, muted],
  );

  const playLeverChange = useCallback(
    (index: number, level: number) => {
      // Pitch climbs with level; a small per-lever offset keeps levers distinguishable.
      const freq = LEVER_BASE_FREQ + (level - 1) * 70 + (index % 5) * 12;
      tone(freq, 0.18, 'triangle', 0.12);
      tone(freq * 1.5, 0.12, 'sine', 0.06, 0.02);
    },
    [tone],
  );

  const playChord = useCallback(() => {
    [262, 330, 392].forEach((f, i) => tone(f, 0.3, 'sine', 0.08, i * 0.06));
  }, [tone]);

  // React to lever changes: single lever = blip, preset/reset = chord.
  useEffect(() => {
    if (!readyRef.current) {
      readyRef.current = true;
      prevLevels.current = levels;
      return;
    }
    const changed: number[] = [];
    levels.forEach((l, i) => {
      if ((prevLevels.current[i] ?? 1) !== l) changed.push(i);
    });
    prevLevels.current = levels;
    if (changed.length === 0) return;
    if (changed.length === 1) {
      playLeverChange(changed[0], levels[changed[0]]);
    } else {
      playChord();
    }
  }, [levels, playChord, playLeverChange]);

  const toggleMuted = useCallback(() => {
    setMuted(prev => {
      const next = !prev;
      try {
        localStorage.setItem(MUTE_KEY, next ? 'true' : 'false');
      } catch {
        /* ignore */
      }
      if (!next) getCtx(); // unlock audio on unmute
      return next;
    });
  }, [getCtx]);

  return { muted, toggleMuted };
};
