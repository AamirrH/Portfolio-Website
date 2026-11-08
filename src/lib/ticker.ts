import gsap from 'gsap';
import { useSceneStore } from '../state/useSceneStore';
export type QualityTier = 'high' | 'medium' | 'low';
interface Task { run:(dt:number,timeMs:number)=>void; priority:number; quality:QualityTier; }
const tasks:Task[]=[];
let attached=false, elapsed=0, tier:QualityTier='high';
const ranks={low:0,medium:1,high:2};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
gsap.ticker.lagSmoothing(500,33);
const allowed=()=>{const s=useSceneStore.getState();return s.ignited&&s.motion&&!s.plain&&!document.hidden&&!reduced.matches;};
const tick=(_time:number,delta:number)=>{const dt=Math.min(.05,Math.max(0,delta/1000));elapsed+=dt*1000;for(const task of tasks)if(ranks[task.quality]<=ranks[tier])task.run(dt,elapsed);};
function sync(){const next=allowed()&&tasks.length>0;if(next===attached)return;attached=next;if(next)gsap.ticker.add(tick);else gsap.ticker.remove(tick);}
export function subscribeTick(run:Task['run'],options:{priority?:number;quality?:QualityTier}={}){const task={run,priority:options.priority??0,quality:options.quality??'low'};tasks.push(task);tasks.sort((a,b)=>a.priority-b.priority);sync();return()=>{const index=tasks.indexOf(task);if(index>=0)tasks.splice(index,1);sync();};}
export function setTickerQuality(value:QualityTier){tier=value;}
export const tickerDiagnostics=()=>({subscriptions:tasks.length,running:attached,quality:tier});
useSceneStore.subscribe((s,p)=>{if(s.motion!==p.motion||s.ignited!==p.ignited||s.plain!==p.plain)sync();});
document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
Object.assign(window,{__ticker:tickerDiagnostics});
