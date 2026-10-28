import { useEffect } from 'react';
import { useSceneStore } from '../state/useSceneStore';
import { readHash } from './useJourney';
export function usePreferences() {
  const plain = useSceneStore(state => state.plain);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => { if (media.matches) { useSceneStore.getState().setPlain(true); useSceneStore.getState().ignite(); } };
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('plain-mode', plain);
    if (!plain) return;
    const frame = requestAnimationFrame(() => document.getElementById(readHash())?.scrollIntoView({ behavior: 'instant' }));
    return () => cancelAnimationFrame(frame);
  }, [plain]);
}
