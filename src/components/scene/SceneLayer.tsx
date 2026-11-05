import type { ReactNode } from 'react';
import { LayerArt, type LayerName } from './LayerArt';
const depths: Record<LayerName, number> = { sky: .15, sun: .25, 'far-skyline': .2, 'mid-skyline': .4, 'near-buildings': .7, 'power-lines': .7, highway: .25, gantry: .8, 'car-rear': .4, 'car-side': .5, overlay: 0 };
export function SceneLayer({ name, children }: { name: LayerName; children: ReactNode }) {
  return <div className={`scene-layer layer-${name}`} data-layer={name}><div className="parallax-layer" data-depth={depths[name]} data-stop-depth={name === 'far-skyline' ? 3 : name === 'mid-skyline' ? 6 : undefined}><LayerArt name={name}>{children}</LayerArt></div></div>;
}
