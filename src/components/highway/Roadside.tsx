import { useEffect,useRef } from 'react';
import { useSceneStore } from '../../state/useSceneStore';
import { useStopPreferences } from '../../hooks/useStopAnimations';
type Kind='lamp'|'marker'|'billboard'|'gantry';
export function Roadside(){
 const ref=useRef<HTMLDivElement>(null),motion=useSceneStore(s=>s.motion),ignited=useSceneStore(s=>s.ignited),section=useSceneStore(s=>s.section);
 const {mobile,reduced,hidden}=useStopPreferences();
 useEffect(()=>{
  const root=ref.current;if(!root)return;const nodes=Array.from(root.querySelectorAll<HTMLElement>('.roadside-item'));
  const slots=nodes.map((node,i)=>({node,kind:node.dataset.kind as Kind,d:node.dataset.kind==='lamp'?.06+(i%4)*.09:-1,side:i%2?-1:1}));
  let frame=0,last=0,clock=0,lamp=0,marker=0,billboard=14,gantry=22,sequence=0;
  const spawn=(kind:Kind)=>{const item=slots.find(s=>s.kind===kind&&s.d<0);if(item)item.d=.015;};
  const draw=(dt:number)=>{for(const item of slots){if(item.d<0){item.node.style.opacity='0';continue;}item.d+=dt*.12;if(item.d>.85){item.d=-1;item.node.style.opacity='0';continue;}const d=item.d,side=item.kind==='marker'?1:item.side,x=innerWidth*.5+side*innerWidth*1.65*d,y=innerHeight*(.65625+d*.55),scale=d*2;
   item.node.style.transform=item.kind==='gantry'?`translate(${innerWidth*.5-360*scale}px,${y-180*scale}px) scale(${scale})`:`translate(${x-25*scale}px,${y-300*scale}px) scale(${scale})`;
   item.node.style.opacity=String(Math.min(1,d*15));}
  };draw(0);root.dataset.pool=String(slots.length);root.dataset.frames='0';if(reduced||hidden||!motion||!ignited)return;
  const tick=(now:number)=>{const dt=last?Math.min(.05,(now-last)/1000)*useSceneStore.getState().speed:0;last=now;clock+=dt;lamp-=dt;marker-=dt;billboard-=dt;gantry-=dt;
   if(lamp<=0){spawn('lamp');lamp=1.1;}if(marker<=0){spawn('marker');marker=3;}if(billboard<=0){spawn('billboard');sequence++;billboard=sequence<3?1.5:15;if(sequence===3)sequence=0;}if(gantry<=0){if(section!=='home')spawn('gantry');gantry=22;}draw(dt);root.dataset.frames='1';frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(frame);root.dataset.frames='0';};
 },[mobile,reduced,hidden,motion,ignited,section]);
 const kinds:Kind[]=[...Array<Kind>(mobile?4:8).fill('lamp'),...Array<Kind>(3).fill('marker'),...Array<Kind>(3).fill('billboard'),'gantry'];
 return <div ref={ref} className="roadside-pool" aria-hidden="true">{kinds.map((kind,i)=><div key={i} className={`roadside-item roadside-${kind}`} data-kind={kind}>
 {kind==='lamp'?<><svg viewBox="0 0 180 300"><path d="M25 300V80Q25 15 105 15h45" fill="none" stroke="#241b32" strokeWidth="7"/><path d="M109 15h41" stroke="#ffe2e5" strokeWidth="5"/></svg><span className="lamp-pool"/><span className="lamp-cone"/></>:kind==='marker'?<svg viewBox="0 0 60 300"><path d="M20 300v-80h16v80" fill="#33293d"/><path d="M21 225h14v10H21Z" fill="#e6c6d3"/></svg>:kind==='billboard'?<svg viewBox="0 0 180 300"><path d="M25 300V120h130v180" fill="none" stroke="#21192f" strokeWidth="6"/><rect x="0" y="100" width="175" height="90" rx="3" fill="#17172a" stroke="#d84e97"/><path className="billboard-glyphs" d="M20 120h24v20H26v30M65 165v-40h23v20H70m45-20h30v40h-20" fill="none" stroke="#25f4ee" strokeWidth="5"/></svg>:<svg viewBox="0 0 720 180"><path d="M0 180V10H720V180M0 10L720 45M0 45L720 10" fill="none" stroke="#292333" strokeWidth="8"/><path d="M160 35h165v65H160ZM380 35h165v65H380Z" fill="#17443b" stroke="#8cae96"/><path d="M210 65h65m155 0h65" stroke="#aac3af" strokeWidth="4"/></svg>}
 </div>)}</div>;
}
