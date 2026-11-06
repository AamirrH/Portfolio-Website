import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useSceneStore } from '../../state/useSceneStore';
import { useStopPreferences } from '../../hooks/useStopAnimations';
import { TRAFFIC, VEHICLES, type Vehicle } from './traffic.config';
import './highway.css';
const lastAppearance:Partial<Record<Vehicle,number>>={};
interface Car { kind:Vehicle; lane:number; from:number; target:number; turn:number; depth:number; velocity:number; nextTurn:number; brake:number; active:boolean; }
interface Box {x:number;y:number;width:number;height:number}
const hits=(a:Box,b:Box)=>a.x<b.x+b.width+8&&a.x+a.width+8>b.x&&a.y<b.y+b.height+8&&a.y+a.height+8>b.y;
export function LivingTraffic(){
 const ref=useRef<HTMLDivElement>(null),section=useSceneStore(s=>s.section),motion=useSceneStore(s=>s.motion),ignited=useSceneStore(s=>s.ignited);
 const {mobile,reduced,hidden}=useStopPreferences();
 const [ready,setReady]=useState(false);
 useEffect(()=>{const frame=requestAnimationFrame(()=>setReady(true));return()=>cancelAnimationFrame(frame);},[]);
 useEffect(()=>{
  const root=ref.current;if(!root||!ready||!ignited)return;
  const nodes=Array.from(root.querySelectorAll<HTMLElement>('.traffic-car'));
  const max=nodes.length,center=mobile?1:2,lanes=mobile?[0,2]:[0,1,3,4];
  const cars:Car[]=Array.from({length:max},()=>({kind:'sedan',lane:0,from:0,target:0,turn:1,depth:0,velocity:0,nextTurn:0,brake:0,active:false}));
  let frame=0,last=0,elapsed=0,spawn=0,frames=0,fpsClock=0,w=innerWidth,h=innerHeight,playerHeight=180,player:Box={x:0,y:0,width:0,height:0};
  const resize=()=>{w=innerWidth;h=innerHeight;const r=document.querySelector('.rear-car svg')?.getBoundingClientRect();if(r){playerHeight=r.width*183/440*1.08;player={x:r.x+r.width*.07,y:r.y+r.height*.12,width:r.width*.86,height:r.height*.81};}};resize();
  const project=(c:Car):Box=>{const cfg=TRAFFIC[c.kind],playerDepth=Math.max(.15,(player.y+player.height-h*.65625)/(h*.55)),scale=c.depth/playerDepth;const height=playerHeight/1.14*cfg.height*cfg.fudge*scale;return {x:w*.5+(c.lane-center)*w*(mobile?3:.75)*c.depth-height*cfg.aspect/2,y:h*.65625+h*.55*c.depth-height,width:height*cfg.aspect,height};};
  const setCar=(index:number,kind:Vehicle,lane:number,depth:number,fast=false)=>{const c=cars[index];Object.assign(c,{kind,lane,from:lane,target:lane,turn:1,depth,velocity:(fast?-1:1)*(.022+Math.random()*.014),nextTurn:elapsed+8+Math.random()*7,brake:0,active:true});const node=nodes[index],cfg=TRAFFIC[kind];node.dataset.kind=kind;node.style.width=`${200*cfg.aspect}px`;node.style.height='200px';node.style.setProperty('--sprite',`url(/assets/traffic/${kind}.webp)`);node.querySelector('img')!.src=`/assets/traffic/${kind}.webp`;node.querySelectorAll<HTMLElement>('.tail-light').forEach((light,i)=>{light.style.left=`${cfg.lights[i]}%`;light.style.top=`${cfg.lights[2]}%`;light.style.height=`${cfg.lights[3]}%`;});};
  const draw=(dt:number)=>{
   const state=useSceneStore.getState(),occupied:Box[]=[];
   if(root.style.getPropertyValue('--night')!==String(state.timeOfDay))root.style.setProperty('--night',String(state.timeOfDay));if(root.style.getPropertyValue('--wetness')!==String(state.weather))root.style.setProperty('--wetness',String(state.weather));
   cars.map((car,i)=>({car,i})).sort((a,b)=>b.car.depth-a.car.depth).forEach(({car:c,i})=>{
    const node=nodes[i];if(!c.active){node.style.opacity='0';return;}
    if(dt){
     const previous=c.depth;c.depth+=c.velocity*dt*state.speed;
     if(c.depth<.025||c.depth>.85){c.active=false;node.style.opacity='0';return;}
     if(elapsed>c.nextTurn && c.turn>=1){const target=c.target+(Math.random()<.5?-1:1);c.nextTurn=elapsed+8+Math.random()*7;if(lanes.includes(target)&&!cars.some(other=>other!==c&&other.active&&Math.abs(other.target-target)<.1&&Math.abs(other.depth-c.depth)<.18)){c.from=c.lane;c.target=target;c.turn=0;c.brake=.3;}}
     c.turn=Math.min(1,c.turn+dt/1.2);const ease=c.turn*c.turn*(3-2*c.turn);c.lane=c.from+(c.target-c.from)*ease;
     const box=project(c);if(occupied.some(other=>hits(box,other))){c.depth=previous;c.brake=.3;if(c.depth>.55){c.active=false;node.style.opacity='0';return;}}
     c.brake=Math.max(0,c.brake-dt);
    }
    const box=project(c);if(hits(box,player)||occupied.some(other=>hits(box,other))){node.style.opacity='0';return;}occupied.push(box);
    const wobble=c.kind==='rickshaw'?Math.sin(elapsed*5)*1.5:0;
    node.style.transform=`translate3d(${box.x+wobble}px,${box.y}px,0) rotate(${c.kind==='rickshaw'?Math.sin(elapsed*3)*.8:(c.target-c.from)*Math.sin(c.turn*Math.PI)*1.3}deg) scale(${box.height/200})`;
    node.style.opacity=String(Math.min(1,(c.depth-.025)*20));node.style.zIndex=String(Math.round(c.depth*100));node.dataset.braking=String(c.brake>0);
    node.querySelector<HTMLElement>('.traffic-haze')!.style.opacity=String(Math.min(.6,Math.max(0,1-Math.pow(c.depth/.4,.6))));
   });
  };
  ['sedan','hatch','taxi'].forEach((kind,i)=>setCar(i,kind as Vehicle,lanes[i%lanes.length],mobile?.12+i*.045:.065+i*.06));draw(0);
  root.dataset.pool=String(max);root.dataset.frames='0';
  if(hidden||reduced||!motion)return()=>{root.dataset.frames='0';};
  const tick=(now:number)=>{const realDt=last?(now-last)/1000:0,dt=Math.min(.05,realDt);last=now;elapsed+=dt;spawn-=dt*useSceneStore.getState().speed;
   if(spawn<=0){spawn=1.7+Math.random()*1.4;const index=cars.findIndex(c=>!c.active);if(index>=0){const eligible=VEHICLES.filter(kind=>!['swiftship-van','rickshaw'].includes(kind)||(!cars.some(c=>c.active&&c.kind===kind)&&performance.now()/1000-(lastAppearance[kind]??-25)>=25));const sum=eligible.reduce((v,k)=>v+TRAFFIC[k].weight,0);let roll=Math.random()*sum;const kind=eligible.find(k=>(roll-=TRAFFIC[k].weight)<=0)??'sedan';const lane=lanes[Math.floor(Math.random()*lanes.length)],fast=Math.random()<.25,depth=fast?(mobile?.12:.27):.03;if(!cars.some(c=>c.active&&c.target===lane&&Math.abs(c.depth-depth)<.15)){setCar(index,kind,lane,depth,fast);lastAppearance[kind]=performance.now()/1000;}}}
   draw(dt);frames++;fpsClock+=realDt;if(fpsClock>=.5){root.dataset.fps=String(Math.round(frames/fpsClock));frames=0;fpsClock=0;}root.dataset.active=String(cars.filter(c=>c.active).length);root.dataset.frames='1';frame=requestAnimationFrame(tick);
  };frame=requestAnimationFrame(tick);window.addEventListener('resize',resize);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',resize);root.dataset.frames='0';nodes.forEach(n=>n.style.opacity='0');};
 },[mobile,reduced,hidden,motion,ready,ignited,section]);
 const debug=new URLSearchParams(location.search).get('debug')==='rects';
 return <div ref={ref} className={`living-traffic ${debug?'traffic-debug':''}`} aria-hidden="true">{ready&&Array.from({length:mobile?4:10},(_,i)=><div key={i} className="traffic-car" style={{'--sprite':'none'} as CSSProperties}><img alt="" decoding="async"/><span className="traffic-grade"/><span className="traffic-night"/><span className="traffic-haze"/><i className="tail-light"/><i className="tail-light"/><span className="vehicle-sign"/><span className="tail-reflection"/></div>)}</div>;
}
