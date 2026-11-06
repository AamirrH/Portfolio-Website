import { useEffect,useRef } from 'react';
import { useSceneStore } from '../../state/useSceneStore';
import { useStopPreferences } from '../../hooks/useStopAnimations';
import { ONCOMING_SIDE } from './traffic.config';
export function Oncoming(){
 const ref=useRef<HTMLDivElement>(null),motion=useSceneStore(s=>s.motion),ignited=useSceneStore(s=>s.ignited),section=useSceneStore(s=>s.section);
 const {mobile,reduced,hidden}=useStopPreferences();
 useEffect(()=>{
  const root=ref.current;if(!root)return;const nodes=Array.from(root.querySelectorAll<HTMLElement>('.oncoming-car'));const wash=root.querySelector<HTMLElement>('.barrier-wash')!;const depths=nodes.map((_,i)=>i<2?.04+i*.12:-1);let frame=0,last=0,clock=0,next=1.5;
  const draw=(dt:number)=>{let passing=false;nodes.forEach((node,i)=>{if(depths[i]<0){node.style.opacity='0';return;}depths[i]+=dt*.105;if(depths[i]>.65){depths[i]=-1;node.style.opacity='0';return;}const d=depths[i],sign=ONCOMING_SIDE==='left'?-1:1,x=innerWidth*.5+sign*innerWidth*(1.2+(i%2)*.13)*d,y=innerHeight*(.65625+d*.55);node.style.transform=`translate(${x-40*d*3}px,${y-35*d*3}px) scale(${d*3})`;node.style.opacity=String(Math.min(1,d*12));if(d>.28)passing=true;});wash.style.opacity=!mobile&&passing?String(.075+.075*Math.sin(clock*2*Math.PI*10)):'0';};
  draw(0);root.dataset.pool=String(nodes.length);root.dataset.frames='0';if(hidden||reduced||!motion||!ignited)return;
  const tick=(now:number)=>{const dt=last?Math.min(.05,(now-last)/1000)*useSceneStore.getState().speed:0;last=now;clock+=dt;next-=dt;if(next<=0){const index=depths.findIndex(d=>d<0);if(index>=0){depths[index]=.02;nodes[index].dataset.truck=String(Math.random()<.18);}next=1.5+Math.random()*2.5;}draw(dt);root.dataset.frames='1';frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return()=>{cancelAnimationFrame(frame);root.dataset.frames='0';wash.style.opacity='0';};
 },[mobile,reduced,hidden,motion,ignited,section]);
 return <div ref={ref} className={`oncoming-world oncoming-${ONCOMING_SIDE}`} aria-hidden="true"><svg className="oncoming-plane" viewBox="0 0 1440 800" preserveAspectRatio="none"><path d="M610 525H630L-150 800H-700Z" fill="#141527"/><path d="M630 525L-150 800" stroke="#44364b" strokeWidth="13"/><path d="M630 525L-150 800" stroke="#ff6191" strokeWidth="2"/><path d="M600 530L-400 800" stroke="#9d93b3" strokeWidth="2" strokeDasharray="6 24"/></svg><span className="barrier-wash"/>{Array.from({length:mobile?3:6},(_,i)=><div key={i} className="oncoming-car"><i/><i/><span className="amber-markers"/><span className="headlight-cone"/></div>)}</div>;
}
