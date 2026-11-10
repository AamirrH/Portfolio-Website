import { QUALITY } from '../config/quality';
import { subscribeTick } from '../lib/ticker';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { DEFAULT_VOLUME } from '../config';
import { readPreference, savePreference } from '../lib/preferences';
import { useSceneStore } from '../state/useSceneStore';
interface AudioControls { muted: boolean; unavailable: boolean; unlock: () => void; toggle: () => void; }
const AudioControlContext = createContext<AudioControls | null>(null);
const hasTrack = Object.keys(import.meta.glob('/public/assets/audio/resonance.webm', { query: '?url', import: 'default', eager: true })).length > 0;
export function AudioProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const context = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const [unavailable, setUnavailable] = useState(!hasTrack);
  const [muted, setMuted] = useState(() => readPreference('endless-muted') === 'true' || !hasTrack);
  const [playing, setPlaying] = useState(false);
  const unlocked = useRef(false);
  const mutedRef = useRef(muted);
  const quality=useSceneStore(s=>s.quality);
  const section = useSceneStore(s=>s.section);
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
        meter.fftSize = 256;
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
      if(mutedRef.current)void context.current?.suspend().catch(()=>{});
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
  useEffect(() => { mutedRef.current = muted;if(!muted)return;const timer=setTimeout(()=>{void context.current?.suspend().catch(()=>{});},60000);return()=>clearTimeout(timer); }, [muted]);
  useEffect(() => {
    const visibility = () => { if (document.hidden) { audio.current?.pause(); void context.current?.suspend().catch(() => {}); } else if (unlocked.current && !mutedRef.current) play(); };
    document.addEventListener('visibilitychange', visibility);
    return () => document.removeEventListener('visibilitychange', visibility);
  }, [play]);
  useEffect(() => {
    let accumulated = 0;
    const root = document.documentElement;
    const active = playing && !muted && !unavailable && !plain && QUALITY[quality].audioReactive;
    root.dataset.audio = active ? 'reactive' : 'fallback';
    const data = new Uint8Array(analyser.current?.frequencyBinCount ?? 256);
    let scales:HTMLElement[]=[],glows:HTMLElement[]=[],brakes:SVGElement[]=[];
    const collect=()=>{scales=Array.from(document.querySelectorAll<HTMLElement>('.sun-disc'));glows=Array.from(document.querySelectorAll<HTMLElement>('.sun-aura,.road-sign'));brakes=Array.from(document.querySelectorAll<SVGElement>('.brake-lights'));};
    collect();const observer=new MutationObserver(collect);
    if(active)observer.observe(document.body,{childList:true,subtree:true});
    const tick = (dt:number) => {
      accumulated+=dt;if(accumulated<1/30)return;accumulated%=1/30;
      if (document.hidden || !active || !analyser.current) return;
      analyser.current.getByteFrequencyData(data);
      const energy = (data[1]+data[2]+data[3]+data[4]) / (255*4);
      scales.forEach(n=>n.style.setProperty('--audio-scale', String(1+energy*.035)));
      glows.forEach(n=>n.style.setProperty('--audio-glow', String(.45+energy*.55)));
      brakes.forEach(n=>n.style.setProperty('--audio-brake', String(.7+energy*.3)));

    };
    const unsubscribe=active?subscribeTick(tick,{priority:20,quality:'medium'}):()=>{};
    return () => { observer.disconnect(); unsubscribe(); root.dataset.audio = 'fallback'; };
  }, [playing, muted, unavailable, plain, section, quality]);
  useEffect(() => () => { void context.current?.close().catch(() => {}); context.current = null; analyser.current = null; }, []);
  const value = useMemo(() => ({ muted, unavailable, unlock, toggle }), [muted, unavailable, unlock, toggle]);
  return <AudioControlContext.Provider value={value}><audio ref={audio} preload="none" loop onError={fail} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>{hasTrack&&<><source src="/assets/audio/resonance.webm" type='audio/webm; codecs="opus"'/><source src="/assets/audio/resonance.m4a" type="audio/mp4"/></>}</audio>{children}</AudioControlContext.Provider>;
}
export function useAudio() { const controls = useContext(AudioControlContext); if (!controls) throw new Error('AudioProvider is required'); return controls; }
