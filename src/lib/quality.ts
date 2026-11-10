import { subscribeTick,setTickerQuality } from './ticker';
import { useSceneStore } from '../state/useSceneStore';
import type { QualityTier } from '../config/quality';
const tiers:QualityTier[]=['low','medium','high'];
export function startQualityManager(){
 const samples=new Float64Array(120),sorted=new Float64Array(120);let index=0,count=0,last=0,age=0,check=0,bad=0,good=0,lastUpgrade=-Infinity,lowered=false;
 const apply=()=>{const s=useSceneStore.getState();document.documentElement.dataset.quality=s.quality;setTickerQuality(s.quality);};apply();
 const unsubStore=useSceneStore.subscribe((s,p)=>{if(s.quality!==p.quality)apply();if(s.qualityChoice!==p.qualityChoice){count=0;bad=good=0;lowered=false;}});
 const reset=()=>{last=0;count=0;age=0;bad=good=0;};document.addEventListener('visibilitychange',reset);
 const unsubTick=subscribeTick(()=>{const now=performance.now();if(!last){last=now;return;}const dt=now-last;last=now;age+=dt;const s=useSceneStore.getState();if(s.qualityChoice!=='auto')return;samples[index++%120]=dt;count=Math.min(120,count+1);if(age<2000||count<120||now-check<500)return;const elapsed=check?Math.min(1000,now-check):500;check=now;sorted.set(samples);sorted.sort();const p95=sorted[114];bad=p95>24?bad+elapsed:0;good=p95<14?good+elapsed:0;const rank=tiers.indexOf(s.quality);let next=s.quality;
  if(bad>=3000&&rank>0){next=tiers[rank-1];lowered=true;}else if(lowered&&good>=15000&&rank<2&&now-lastUpgrade>=60000){next=tiers[rank+1];lastUpgrade=now;}
  if(next!==s.quality){useSceneStore.getState().setQuality(next);bad=good=0;count=0;if(new URLSearchParams(location.search).get('perf')==='1')console.info('[quality]',next,'p95',p95.toFixed(1));}
 },{priority:-100});
 return()=>{unsubTick();unsubStore();document.removeEventListener('visibilitychange',reset);};
}
