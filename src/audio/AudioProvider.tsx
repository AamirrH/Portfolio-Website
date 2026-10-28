import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { DEFAULT_VOLUME } from '../config';
import { readPreference, savePreference } from '../lib/preferences';
import { useSceneStore } from '../state/useSceneStore';
interface AudioControls { muted: boolean; unavailable: boolean; unlock: () => void; toggle: () => void; }
const AudioControlContext = createContext<AudioControls | null>(null);
const hasTrack = Object.keys(import.meta.glob('/public/audio/resonance.mp3', { query: '?url', import: 'default', eager: true })).length > 0;
export function AudioProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const context = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const [unavailable, setUnavailable] = useState(!hasTrack);
  const [muted, setMuted] = useState(() => readPreference('endless-muted') === 'true' || !hasTrack);
  const [playing, setPlaying] = useState(false);
  const unlocked = useRef(false);
  const mutedRef = useRef(muted);
  const plain = useSceneStore(state => state.plain);
  const fail = useCallback(() => { setUnavailable(true); setMuted(true); setPlaying(false); audio.current?.pause(); }, []);
  const play = useCallback(() => { const element = audio.current; if (!element || !hasTrack || document.hidden) return; void context.current?.resume().catch(() => {}); void element.play().catch(() => { if (element.error) fail(); }); }, [fail]);
  const unlock = useCallback(() => {
    unlocked.current = true;
    if (!hasTrack || !audio.current) return;
    try {
      if (!context.current) {
        const ctx = new AudioContext();
        const source = ctx.createMediaElementSource(audio.current);
        const meter = ctx.createAnalyser();
        meter.fftSize = 512;
        meter.smoothingTimeConstant = .82;
        source.connect(meter); meter.connect(ctx.destination);
        context.current = ctx; analyser.current = meter;
        if (!mutedRef.current) {
          const engine = ctx.createOscillator(); const gain = ctx.createGain();
          engine.type = 'sawtooth'; engine.frequency.setValueAtTime(38, ctx.currentTime); engine.frequency.exponentialRampToValueAtTime(92, ctx.currentTime + .45); engine.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 1.1);
          gain.gain.setValueAtTime(.012, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + 1.2);
          engine.connect(gain); gain.connect(ctx.destination); engine.start(); engine.stop(ctx.currentTime + 1.2); engine.onended = () => { engine.disconnect(); gain.disconnect(); };
        }
      }
      audio.current.volume = DEFAULT_VOLUME;
      audio.current.muted = mutedRef.current;
      if (!mutedRef.current) play();
    } catch { fail(); }
  }, [play, fail]);
  const toggle = useCallback(() => {
    if (unavailable) return;
    const next = !mutedRef.current;
    mutedRef.current = next; setMuted(next); savePreference('endless-muted', String(next));
    if (audio.current) audio.current.muted = next;
    if (next) audio.current?.pause(); else { unlock(); play(); }
  }, [unavailable, unlock, play]);
  useEffect(() => { mutedRef.current = muted; }, [muted]);
  useEffect(() => {
    const visibility = () => { if (document.hidden) { audio.current?.pause(); void context.current?.suspend().catch(() => {}); } else if (unlocked.current && !mutedRef.current) play(); };
    document.addEventListener('visibilitychange', visibility);
    return () => document.removeEventListener('visibilitychange', visibility);
  }, [play]);
  useEffect(() => {
    let frame = 0;
    const root = document.documentElement;
    const active = playing && !muted && !unavailable && !plain;
    root.dataset.audio = active ? 'reactive' : 'fallback';
    const data = new Uint8Array(analyser.current?.frequencyBinCount ?? 256);
    const tick = () => {
      if (document.hidden || !active || !analyser.current) return;
      analyser.current.getByteFrequencyData(data);
      const energy = (data[1]+data[2]+data[3]+data[4]) / (255*4);
      root.style.setProperty('--audio-scale', String(1+energy*.035));
      root.style.setProperty('--audio-glow', String(.45+energy*.55));
      root.style.setProperty('--audio-brake', String(.7+energy*.3));
      frame = requestAnimationFrame(tick);
    };
    if (active) tick();
    return () => { cancelAnimationFrame(frame); root.dataset.audio = 'fallback'; };
  }, [playing, muted, unavailable, plain]);
  useEffect(() => () => { void context.current?.close().catch(() => {}); context.current = null; analyser.current = null; }, []);
  const value = useMemo(() => ({ muted, unavailable, unlock, toggle }), [muted, unavailable, unlock, toggle]);
  return <AudioControlContext.Provider value={value}><audio ref={audio} src={hasTrack ? '/audio/resonance.mp3' : undefined} preload="none" loop onError={fail} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}/>{children}</AudioControlContext.Provider>;
}
export function useAudio() { const controls = useContext(AudioControlContext); if (!controls) throw new Error('AudioProvider is required'); return controls; }
