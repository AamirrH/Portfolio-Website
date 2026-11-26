import { create } from 'zustand';

interface FrutigerEffects {
  motion: boolean;
  toggleMotion: () => void;
}

export const useFrutigerEffects = create<FrutigerEffects>(set => ({
  motion: true,
  toggleMotion: () => set(state => ({ motion: !state.motion })),
}));

export function FrutigerControls() {
  const { motion, toggleMotion } = useFrutigerEffects();
  return <div className="day-controls">
    <button type="button" onClick={toggleMotion} aria-pressed={motion}>Motion</button>
  </div>;
}
