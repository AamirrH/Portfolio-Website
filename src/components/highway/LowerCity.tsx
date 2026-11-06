import { useEffect,useRef } from 'react';
import { useSceneStore } from '../../state/useSceneStore';
import { useStopPreferences } from '../../hooks/useStopAnimations';
import { ONCOMING_SIDE } from './traffic.config';
export function LowerCity(){
 const ref=useRef<HTMLDivElement>(null),motion=useSceneStore(s=>s.motion),ignited=useSceneStore(s=>s.ignited),section=useSceneStore(s=>s.section),{mobile,reduced,hidden}=useStopPreferences();
 useEffect(()=>{const root=ref.current;if(!root)return;root.dataset.pool=String(mobile?0:7);root.dataset.frames='0';if(mobile||reduced||hidden||!motion||!ignited)return;const lights=Array.from(root.querySelectorAll<SVGGElement>('.lower-car'));const train=root.querySelector<SVGGElement>('.metro-train')!;let frame=0,last=0,time=0;
 const tick=(now:number)=>{const dt=last?Math.min(.05,(now-last)/1000)*useSceneStore.getState().speed:0;last=now;time+=dt;lights.forEach((node,i)=>{const t=(time*.035+i*.17)%1;node.style.transform=`translate(${890+t*650}px,${640+i%3*45+t*80}px)`;});const phase=(time+20)%25;train.style.opacity=phase>20?'1':'0';train.style.transform=`translate(${900+(phase-20)*135}px,700px)`;root.dataset.frames='1';frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return()=>{cancelAnimationFrame(frame);root.dataset.frames='0';};
 },[mobile,reduced,hidden,motion,ignited,section]);
 return <div ref={ref} className={`lower-city city-side-${ONCOMING_SIDE==='left'?'right':'left'}`} data-depth="0.35" aria-hidden="true"><svg viewBox="0 0 1440 800" preserveAspectRatio="none">
 <defs><linearGradient id="lower-city-fog" x2="0" y2="1"><stop stopColor="#8b54734d"/><stop offset="1" stopColor="#2b153f99"/></linearGradient></defs>
 <path d="M900 560H1440V800H1180Z" fill="#121425"/>
 <g fill="none" stroke="#241d33" strokeWidth="18"><path d="M940 590L1440 740M1000 660L1440 790M1130 720L1440 820M1130 550L1250 800M1320 530L1420 800"/></g>
 <g fill="none" strokeWidth="2" strokeDasharray="7 8"><path d="M940 590L1440 740M1000 660L1440 790" stroke="#ff5199"/><path d="M1130 550L1250 800M1320 530L1420 800" stroke="#25f4ee"/></g>
 {[0,1,2,3,4,5].map(i=><g key={i}><path d={`M${1060+i%3*135} ${585+Math.floor(i/3)*110}l80 18v48l-80-18Z`} fill="#241b35" stroke="#70405f"/>{[0,1,2,3].map(j=><rect key={j} x={1070+i%3*135+j*15} y={615+Math.floor(i/3)*110+j*3} width="5" height="7" fill={j%2?'#ffd192':'#70cbd2'} opacity=".5"/>)}</g>)}
 <path d="M900 700H1440" stroke="#40314d" strokeWidth="12"/>
 {!mobile&&<>{Array.from({length:6},(_,i)=><g key={i} className="lower-car" fill={i%2?'#ffd0d9':'#ff5a82'}><circle r="2"/><circle cx="5" r="2"/></g>)}<g className="metro-train"><rect width="180" height="17" rx="5" y="-22" fill="#353449" stroke="#b596b5"/>{Array.from({length:14},(_,i)=><rect key={i} x={6+i*12} y="-18" width="7" height="6" fill="#ffd6a1"/>)}</g></>}
 <path d="M900 560H1440V800H1180Z" fill="url(#lower-city-fog)"/>
 </svg></div>;
}
