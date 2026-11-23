import { create } from 'zustand';
import type { QualityTier } from '../../config/quality';
import { content } from '../../data/content';

interface FrutigerEffects {
  quality: QualityTier;
  motion: boolean;
  setQuality: (quality: QualityTier) => void;
  toggleMotion: () => void;
}

export const useFrutigerEffects = create<FrutigerEffects>(set => ({
  quality: 'high',
  motion: true,
  setQuality: quality => set({ quality }),
  toggleMotion: () => set(state => ({ motion: !state.motion })),
}));

export function FrutigerControls() {
  const { quality, motion, setQuality, toggleMotion } = useFrutigerEffects();
  return <div className="day-controls">
    <label>
      Scene quality
      <select value={quality} onChange={event => setQuality(event.target.value as QualityTier)}>
        <option value="high">{content.controls.qualityHigh}</option>
        <option value="medium">{content.controls.qualityMedium}</option>
        <option value="low">{content.controls.qualityLow}</option>
      </select>
    </label>
    <button type="button" onClick={toggleMotion} aria-pressed={motion}>Motion</button>
  </div>;
}
