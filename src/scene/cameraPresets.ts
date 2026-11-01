import type { CameraPreset } from '../state/useSceneStore';
// Independent scenes own their geometry; the rig only crossfades.
export const cameraPresets: Record<CameraPreset, { speed: number }> = {
  rear: { speed: 1 }, side: { speed: 0 }, dash: { speed: .85 }, aerial: { speed: .65 }
};
