import type { CameraPreset } from '../state/useSceneStore';
import type { LayerName } from '../components/scene/LayerArt';
export interface LayerTransform { xPercent: number; yPercent: number; scale: number; rotation: number; opacity: number; blur: number; }
interface Preset { speed: number; layers: Record<LayerName, LayerTransform>; car: 'rear' | 'side'; }
const base: LayerTransform = { xPercent: 0, yPercent: 0, scale: 1, rotation: 0, opacity: 1, blur: 0 };
const layerNames: LayerName[] = ['sky','sun','far-skyline','near-buildings','power-lines','highway','gantry','car-rear','car-side','overlay'];
function layers(overrides: Partial<Record<LayerName, Partial<LayerTransform>>>): Record<LayerName, LayerTransform> { return Object.fromEntries(layerNames.map(name => [name, { ...base, ...overrides[name] }])) as Record<LayerName, LayerTransform>; }
export const cameraPresets: Record<CameraPreset, Preset> = {
  rear: { speed: 1, car: 'rear', layers: layers({ 'car-side': { opacity: 0 } }) },
  side: { speed: 1.7, car: 'side', layers: layers({ sky: { scale: 1.12 }, sun: { xPercent: -26, yPercent: -8, scale: .83 }, 'far-skyline': { scale: 1.18, yPercent: -2, blur: .6 }, 'near-buildings': { scale: 1.3, yPercent: -3, blur: 1.5 }, 'power-lines': { xPercent: -10, scale: 1.12, opacity: .35 }, highway: { yPercent: 7 }, gantry: { xPercent: -70, opacity: 0, scale: 1.2 }, 'car-rear': { xPercent: -30, scale: .7, opacity: 0 }, 'car-side': { opacity: 1 } }) },
  dash: { speed: .85, car: 'rear', layers: layers({ sky: { scale: 1.2, yPercent: -4 }, sun: { scale: 1.45, yPercent: -4 }, 'far-skyline': { scale: 1.15 }, 'near-buildings': { scale: 1.4, yPercent: 7 }, highway: { scale: 1.3, yPercent: 12 }, gantry: { scale: 1.7, yPercent: -40, opacity: 0 }, 'car-rear': { scale: 3, yPercent: 50, opacity: 0 }, 'car-side': { opacity: 0 } }) },
  aerial: { speed: .65, car: 'rear', layers: layers({ sky: { opacity: .65 }, sun: { yPercent: -20, scale: .65 }, 'far-skyline': { scale: .85, yPercent: -9 }, 'near-buildings': { scale: .7, rotation: -12, yPercent: 2, opacity: .7 }, 'power-lines': { opacity: 0 }, highway: { scale: 1.65, rotation: -22, yPercent: -12, xPercent: -14 }, gantry: { scale: .45, rotation: -22, yPercent: 12, xPercent: -18, opacity: .5 }, 'car-rear': { scale: .42, rotation: -22, yPercent: -5, xPercent: -23 }, 'car-side': { opacity: 0 } }) }
};
