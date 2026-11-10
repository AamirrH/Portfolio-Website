import { useSceneStore } from '../state/useSceneStore';
export type QualityTier = 'high' | 'medium' | 'low';
interface Task { run:(dt:number,timeMs:number)=>void; priority:number; quality:QualityTier; }
const tasks:Task[]=[];
let frameId=0, elapsed=0, previous=0, tier:QualityTier='high';
const ranks={low:0,medium:1,high:2};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const allowed=()=>{const s=useSceneStore.getState();return s.ignited&&s.motion&&!s.plain&&!document.hidden&&!reduced.matches;};
function tick(now:number){
 frameId=0;
 if(!allowed())return;
 const dt=previous?Math.min(.05,Math.max(0,(now-previous)/1000)):0;
 previous=now;elapsed+=dt*1000;
 for(const task of tasks)if(ranks[task.quality]<=ranks[tier])task.run(dt,elapsed);
 frameId=requestAnimationFrame(tick);
}
function sync(){
 const shouldRun=allowed()&&tasks.length>0;
 if(shouldRun&&!frameId){previous=0;frameId=requestAnimationFrame(tick);}
 else if(!shouldRun&&frameId){cancelAnimationFrame(frameId);frameId=0;previous=0;}
}
export function subscribeTick(run:Task['run'],options:{priority?:number;quality?:QualityTier}={}){const task={run,priority:options.priority??0,quality:options.quality??'low'};tasks.push(task);tasks.sort((a,b)=>a.priority-b.priority);sync();return()=>{const index=tasks.indexOf(task);if(index>=0)tasks.splice(index,1);sync();};}
export function setTickerQuality(value:QualityTier){tier=value;}
export const tickerDiagnostics=()=>({subscriptions:tasks.length,running:frameId!==0,quality:tier});
useSceneStore.subscribe((s,p)=>{if(s.motion!==p.motion||s.ignited!==p.ignited||s.plain!==p.plain)sync();});
document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
Object.assign(window,{__ticker:tickerDiagnostics});
