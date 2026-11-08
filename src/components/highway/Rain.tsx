import { subscribeTick } from '../../lib/ticker';
import './highway.css';
import { useEffect,useRef } from 'react';
import { useSceneStore } from '../../state/useSceneStore';
import { useStopPreferences } from '../../hooks/useStopAnimations';
export function Rain(){
 const ref=useRef<HTMLDivElement>(null),motion=useSceneStore(s=>s.motion),ignited=useSceneStore(s=>s.ignited),section=useSceneStore(s=>s.section),{mobile,reduced,hidden}=useStopPreferences();
 useEffect(()=>{
  const root=ref.current,canvas=root?.querySelector('canvas');if(!root||!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;
  let w=innerWidth,h=innerHeight,time=0,frames=0,fpsClock=0;
  const drops=Array.from({length:mobile?80:220},()=>({x:Math.random(),y:Math.random(),z:.2+Math.random()*.8}));
  const ripples=Array.from(root.querySelectorAll<HTMLElement>('.rain-ripple')),lenses=Array.from(root.querySelectorAll<HTMLElement>('.lens-drop'));
  const fog=root.querySelector<HTMLElement>('.rain-fog')!,sheen=root.querySelector<HTMLElement>('.rain-sheen')!;
  let ui:DOMRect[]=[];
  const resize=()=>{w=innerWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ui=Array.from(document.querySelectorAll<HTMLElement>('.home-copy,.contact-copy,.view-panel,.gantry-signs,.contact-gantry')).map(el=>el.getBoundingClientRect());};resize();
  root.dataset.pool=String(ripples.length+lenses.length);root.dataset.rainPool=String(drops.length);root.dataset.frames='0';
  if(hidden||reduced||!motion||!ignited){ctx.clearRect(0,0,w,h);root.style.opacity='0';return;}
  root.style.opacity='1';
  const tick=(dt:number)=>{const realDt=dt;time+=dt;const {weather,speed}=useSceneStore.getState();if(root.parentElement){if(root.parentElement.dataset.raining!==String(weather>.1))root.parentElement.dataset.raining=String(weather>.1);if(root.parentElement.style.getPropertyValue('--weather')!==String(weather))root.parentElement.style.setProperty('--weather',String(weather));}ctx.clearRect(0,0,w,h);const count=Math.round(drops.length*weather);
   for(let i=0;i<count;i++){const d=drops[i];d.y+=dt*(.25+d.z*.8)*Math.max(.2,speed);d.x+=dt*.045*d.z;if(d.y>1.05){d.y=-.05;d.x=Math.random();}if(d.x>1)d.x=0;const len=10+d.z*28;ctx.strokeStyle=`rgba(255,220,239,${(.25+d.z*.3)*weather})`;ctx.lineWidth=.5+d.z*.7;ctx.beginPath();ctx.moveTo(d.x*w,d.y*h);ctx.lineTo(d.x*w+len*.14,d.y*h+len);ctx.stroke();}
   ripples.forEach((node,i)=>{const p=(time/.6+i/12)%1,x=w*(.28+(i*.137)% .45),y=h*(.79+(i*.053)%.18);node.style.transform=`translate(${x}px,${y}px) scale(${.2+p*1.4},${.07+p*.25})`;node.style.opacity=String(weather*(1-p)*.35);});
   lenses.forEach((node,i)=>{const phase=(time/(4+i%4)+i*.19)%1,x=w*(i%2?.975:.025),y=h*(.2+phase*.5);const blocked=ui.some(r=>x>=r.left-12&&x<=r.right+12&&y>=r.top-12&&y<=r.bottom+12);node.style.transform=`translate(${x}px,${y}px)`;node.style.opacity=blocked?'0':String(Math.sin(phase*Math.PI)*weather*.5);});
   fog.style.opacity=String(weather*.2);sheen.style.opacity=String(weather*.35);root.dataset.weather=weather.toFixed(2);root.dataset.rainActive=String(count);root.dataset.frames='1';frames++;fpsClock+=realDt;if(fpsClock>=1){root.dataset.fps=String(Math.round(frames/fpsClock));frames=0;fpsClock=0;}
  };const unsubscribe=subscribeTick(tick,{priority:10,quality:'medium'});window.addEventListener('resize',resize);
  return()=>{unsubscribe();window.removeEventListener('resize',resize);ctx.clearRect(0,0,w,h);root.dataset.frames='0';};
 },[mobile,reduced,hidden,motion,ignited,section]);
 return <div ref={ref} className="rain-world" aria-hidden="true"><svg className="weather-rail-glow" viewBox="0 0 1440 800" preserveAspectRatio="none"><path d="M0 687L628 529M1440 687L812 529" fill="none" stroke="#ff92b8" strokeWidth="5"/></svg><div className="rain-fog"/><div className="rain-sheen"/><canvas className="rain-canvas"/>{Array.from({length:12},(_,i)=><span key={i} className="rain-ripple"/>)}{!mobile&&Array.from({length:6},(_,i)=><span key={i} className="lens-drop"/>)}</div>;
}
export function HighwayPerf(){
 const ref=useRef<HTMLOutputElement>(null);
 useEffect(()=>{const timer=setInterval(()=>{const node=ref.current;if(!node)return;const rain=document.querySelector<HTMLElement>('.rain-world');const pools=Array.from(document.querySelectorAll<HTMLElement>('[data-pool]')).map(n=>Number(n.dataset.pool));node.textContent=`FPS ${rain?.dataset.fps??'—'} · pools ${pools.reduce((a,b)=>a+b,0)} · rain ${rain?.dataset.rainActive??'0'}/${rain?.dataset.rainPool??'0'}`;},500);return()=>clearInterval(timer);},[]);
 return new URLSearchParams(location.search).get('perf')==='1'?<output ref={ref} className="highway-perf"/>:null;
}
