import { useLayoutEffect, useState, type RefObject } from 'react';

export interface RoadModel {
  width: number; height: number; vp: { x: number; y: number };
  s0: number; h: number; F: number; rail: number; y0: number; railHeight: number; top: number;
}
export const ROAD: RoadModel = { width: 1440, height: 800, vp: { x: 0, y: 0 }, s0: 0, h: 0, F: 0, rail: 0, y0: 0, railHeight: 0, top: 0 };
export const BASE_V = 26;
export const CRUISE_SPEED = 1; // Store and rear camera baseline, not the transient boost speed.
export const sForY = (y: number, model: RoadModel = ROAD) => (y - model.vp.y) / model.h;
export const worldToScreen = (X: number, s: number, model: RoadModel = ROAD) => ({ x: model.vp.x + X * s, y: model.vp.y + model.h * s });

export function measureRoad(root: HTMLElement): RoadModel | null {
  const scene = root.closest('.rear-scene');
  const road = root.querySelector<SVGSVGElement>('.road-base');
  const image = scene?.querySelector<SVGImageElement>('.raster-rear-car image');
  const railPath = road?.querySelector('[data-road-rails]')?.getAttribute('d');
  const matrix = road?.getScreenCTM(), carMatrix = image?.getScreenCTM();
  if (!road || !image || !railPath || !matrix || !carMatrix) return null;
  // The two segments are the actual pink neon strokes, not guessed road corners.
  const n = railPath.match(/-?\d+(?:\.\d+)?/g)?.map(Number);
  if (!n || n.length !== 8) return null;
  const [ax, ay, bx, by, cx, cy, dx, dy] = n;
  const leftSlope = (by-ay)/(bx-ax), rightSlope = (dy-cy)/(dx-cx);
  const vx = (cy-rightSlope*cx-ay+leftSlope*ax)/(leftSlope-rightSlope);
  const vy = ay+leftSlope*(vx-ax);
  const toRoad = matrix.inverse().multiply(carMatrix);
  const x = image.x.baseVal.value, y = image.y.baseVal.value;
  const width = image.width.baseVal.value, height = image.height.baseVal.value;
  const left = new DOMPoint(x,y+height).matrixTransform(toRoad);
  const right = new DOMPoint(x+width,y+height).matrixTransform(toRoad);
  const s0 = Math.hypot(right.x-left.x,right.y-left.y)/1.86;
  const y0 = (left.y+right.y)/2, h = (y0-vy)/s0;
  const lx = ax+(y0-ay)/leftSlope, rx = cx+(y0-cy)/rightSlope;
  const actualRail = (rx-lx)/(2*s0);
  const model = { width:road.viewBox.baseVal.width, height:road.viewBox.baseVal.height,
    vp:{x:vx,y:vy}, s0, h, F:s0*8, rail:actualRail, y0,
    // This illustration has no separate physical rail-height datum.
    // The measured neon plane defines ground height; packets use that exact plane.
    railHeight:0, top:road.querySelector<SVGPathElement>('[data-road-surface]')!.getBBox().y };
  Object.assign(ROAD,model);
  return model;
}
export function useRoadModel(ref: RefObject<HTMLDivElement>) {
  const [model,setModel] = useState<RoadModel|null>(null);
  useLayoutEffect(()=>{
    const root=ref.current?.parentElement;if(!root)return;
    let timer:ReturnType<typeof setTimeout>;
    const rebuild=()=>setModel(measureRoad(root));
    rebuild();
    const observer=new ResizeObserver(()=>{clearTimeout(timer);timer=setTimeout(rebuild,150);});
    observer.observe(root);
    return()=>{observer.disconnect();clearTimeout(timer);};
  },[ref]);
  return model;
}
