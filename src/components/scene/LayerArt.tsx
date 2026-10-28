import { useState, type ReactNode } from 'react';
export type LayerName = 'sky' | 'sun' | 'far-skyline' | 'near-buildings' | 'power-lines' | 'highway' | 'gantry' | 'car-rear' | 'car-side' | 'overlay';
const files = Object.keys(import.meta.glob('/public/assets/layers/*.{svg,png,webp,jpg,avif}', { eager: true, query: '?url', import: 'default' }));
export function LayerArt({ name, children }: { name: LayerName; children: ReactNode }) {
  const [failed, setFailed] = useState(false);
  const path = files.find(file => file.split('/').pop()?.replace(/\.[^.]+$/, '') === name);
  return path && !failed ? <img className="layer-art" src={path.replace('/public', '')} alt="" onError={() => setFailed(true)} /> : <>{children}</>;
}
