import type { ReactNode } from 'react';
import { LayerArt, type LayerName } from './LayerArt';
import { Sky } from './Sky';
import { Sun } from './Sun';
import { FarSkyline, NearBuildings } from './Skyline';
import { PowerLines } from './PowerLines';
import { Highway } from './Highway';
import { Gantry } from './Gantry';
import { RearCar } from './Car';
import { Overlay } from './Overlay';
export const depths = { sky: .15, sun: .25, 'far-skyline': .4, 'near-buildings': 1.2, 'power-lines': .7, highway: .25, gantry: .8, 'car-rear': .4, 'car-side': .5, overlay: 0 } satisfies Record<LayerName, number>;
function Layer({ name, children }: { name: LayerName; children: ReactNode }) { return <div className={`scene-layer layer-${name}`} data-layer={name}><div className="parallax-layer" data-depth={depths[name]}><LayerArt name={name}>{children}</LayerArt></div></div>; }
export function Scene() { return <div className="scene" aria-hidden="true"><Layer name="sky"><Sky/></Layer><Layer name="sun"><Sun/></Layer><Layer name="far-skyline"><FarSkyline/></Layer><Layer name="near-buildings"><NearBuildings/></Layer><Layer name="power-lines"><PowerLines/></Layer><Layer name="highway"><Highway/></Layer><Layer name="gantry"><Gantry/></Layer><Layer name="car-rear"><div className="rear-car"><RearCar/></div></Layer><Layer name="overlay"><Overlay/></Layer></div>; }
