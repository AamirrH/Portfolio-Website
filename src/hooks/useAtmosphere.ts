import { useCallback, useEffect, useState } from 'react';
import { BPM } from '../config';
import { cameraPresets } from '../scene/cameraPresets';
import { useSceneStore } from '../state/useSceneStore';
export type Palette = 'sunset' | 'night' | 'dawn';
export function paletteForHour(hour: number): Palette { if (hour >= 5 && hour < 8) return 'dawn'; if (hour >= 17 && hour < 20) return 'sunset'; return 'night'; }
const palettes: Palette[] = ['sunset','night','dawn'];
export function useAtmosphere() {
  const [palette, setPalette] = useState<Palette>(() => paletteForHour(new Date().getHours()));
  useEffect(() => { document.documentElement.dataset.palette = palette; document.documentElement.style.setProperty('--pulse-duration', `${60 / BPM}s`); }, [palette]);
  const cyclePalette = useCallback(() => setPalette(current => palettes[(palettes.indexOf(current)+1)%palettes.length]), []);
  useEffect(() => {
    const sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let position = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const key = (event: KeyboardEvent) => {
      const state = useSceneStore.getState();
      if (state.plain || !state.ignited || matchMedia('(prefers-reduced-motion: reduce)').matches || (event.target as HTMLElement).closest('input,textarea,select,[contenteditable]')) return;
      position = event.key === sequence[position] ? position+1 : event.key === sequence[0] ? 1 : 0;
      if (position !== sequence.length) return;
      position = 0; clearTimeout(timer);
      state.setSpeed(3.5); document.documentElement.classList.add('boosting');
      timer = setTimeout(() => { const current = useSceneStore.getState(); current.setSpeed(cameraPresets[current.camera].speed); document.documentElement.classList.remove('boosting'); }, 3000);
    };
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('keydown', key); clearTimeout(timer); document.documentElement.classList.remove('boosting'); };
  }, []);
  return { cyclePalette };
}
