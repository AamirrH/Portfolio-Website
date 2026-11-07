import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';
import { useSceneStore } from '../../state/useSceneStore';
import { useStopPreferences } from '../../hooks/useStopAnimations';
import { BASE_V, CRUISE_SPEED, sForY, useRoadModel, worldToScreen, type RoadModel } from '../../scene/roadModel';
import './roadMarkings.css';

interface RoadDiagnostics {
  phase:number; vp:RoadModel['vp']; s0:number; h:number; F:number; rail:number;
  raf:boolean; fps:number; drawMs:number; frames:number;
}
declare global { interface Window { __road?:RoadDiagnostics; } }
const MIN_SCALE=2.5;
// Decorative lane spacing is 20% wider; projection and rails are unchanged.
const laneX=(rail:number)=>rail/3*1.2;
const smooth=(value:number)=>{const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);};
const modulo=(n:number,d:number)=>((n%d)+d)%d;

function RoadDebug({model:m}:{model:RoadModel}) {
  const bottom=sForY(m.height,m);
  let lastLabelY=Infinity;
  const depths=Array.from({length:Math.floor((m.F/MIN_SCALE)/10)},(_,i)=>(i+1)*10);
  return <svg className="road-debug" viewBox={`0 0 ${m.width} ${m.height}`} preserveAspectRatio="none">
    <path d={`M0 ${m.vp.y}H${m.width}`} stroke="#25f4ee" strokeDasharray="5 5"/>
    {[-m.rail,m.rail,-laneX(m.rail),laneX(m.rail)].map((x,i)=>{const p=worldToScreen(x,bottom,m);return <path key={x} d={`M${m.vp.x} ${m.vp.y}L${p.x} ${p.y}`} fill="none" stroke={i<2?'#ff3030':'#ffff30'} strokeWidth={i<2?2:1}/>;})}
    <circle cx={m.vp.x} cy={m.vp.y} r="4" fill="#25f4ee"/>
    {depths.map(z=>{const s=m.F/z,p=worldToScreen(0,s,m);const label=lastLabelY-p.y>10;if(label)lastLabelY=p.y;return p.y<m.height&&s>MIN_SCALE?<g key={z}><path d={`M${p.x-6} ${p.y}h12`} stroke="#fff"/><title>{z}m / s {s.toFixed(1)}</title>{label&&<text x={p.x+10} y={p.y} fontSize="8" fill="#fff">{z}m / s {s.toFixed(1)}</text>}</g>:null;})}
    <rect x="15" y="80" width="280" height="112" rx="5" fill="#060b19" opacity=".95"/>
    <text x="26" y="100" fill="#fff" fontSize="12" fontFamily="monospace">
      <tspan x="26">vp {m.vp.x.toFixed(2)}, {m.vp.y.toFixed(2)}</tspan>
      <tspan x="26" dy="19">s0 {m.s0.toFixed(2)} px/m / h {m.h.toFixed(3)} m</tspan>
      <tspan x="26" dy="19">F {m.F.toFixed(2)} / rail {m.rail.toFixed(3)} m</tspan>
      <tspan x="26" dy="19">red: measured neon / yellow: lanes</tspan>
      <tspan x="26" dy="19">rail height datum: measured neon plane</tspan>
    </text>
  </svg>;
}

export function RoadMarkings(){
  const ref=useRef<HTMLDivElement>(null),canvasRef=useRef<HTMLCanvasElement>(null);
  const model=useRoadModel(ref);
  const {reduced,hidden}=useStopPreferences();
  const ignited=useSceneStore(s=>s.ignited),section=useSceneStore(s=>s.section);
  const phase=useRef(Math.random()*108),time=useRef(0);
  const streaks=useRef<Float64Array>();
  if(!streaks.current){
    streaks.current=new Float64Array(160);
    for(let i=0;i<40;i++){streaks.current[i*4]=Math.random()*10-5;streaks.current[i*4+1]=2+Math.random()*5;streaks.current[i*4+2]=Math.random();streaks.current[i*4+3]=.05+Math.random()*.04;}
  }
  useEffect(()=>{
    const canvas=canvasRef.current,root=ref.current,m=model;
    if(!canvas||!root||!m)return;
    const ctx=canvas.getContext('2d');if(!ctx)return;
    const active=['home','projects','contact'].includes(section);
    const running=active&&ignited&&!reduced&&!hidden;
    const bounds=root.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);
    canvas.width=Math.round(bounds.width*dpr);canvas.height=Math.round(bounds.height*dpr);
    const sx=canvas.width/m.width,sy=canvas.height/m.height;
    const bottomS=sForY(m.height,m);
    const near=m.F/bottomS,far=m.F/MIN_SCALE,depth=far-near;
    const dashCycle=Math.ceil(depth/9)*9,studCycle=Math.ceil(depth/12)*12,packetCycle=Math.ceil(depth/14)*14;
    const pool=streaks.current!;
    const diagnostic:RoadDiagnostics={phase:phase.current,vp:m.vp,s0:m.s0,h:m.h,F:m.F,rail:m.rail,raf:false,fps:0,drawMs:0,frames:0};
    window.__road=diagnostic;
    let raf=0,last=0,fpsTime=0,fpsFrames=0,cost=0;
    const clip=new Path2D();
    clip.moveTo(m.vp.x-m.rail*sForY(m.top,m),m.top);clip.lineTo(m.vp.x+m.rail*sForY(m.top,m),m.top);clip.lineTo(m.vp.x+m.rail*sForY(m.height,m),m.height);clip.lineTo(m.vp.x-m.rail*sForY(m.height,m),m.height);clip.closePath();
    // Reuse the context's current path. No arrays, points or Path2Ds are allocated in a frame.
    const quad=(x:number,z:number,length:number,width:number,color:string,alpha:number,raise=0)=>{
      const z1=Math.max(near,z),z2=Math.min(far,z+length);
      if(z1>=z2)return;
      const a=m.F/z1,b=m.F/z2;
      const y1=m.vp.y+(m.h-raise)*a,y2=m.vp.y+(m.h-raise)*b;
      if(y1<m.top || Math.abs(x)-width/2>m.rail)return;
      const fade=smooth((a-MIN_SCALE)/(MIN_SCALE*1.2))*smooth((y1-m.top)/12);
      ctx.globalAlpha=alpha*fade;ctx.fillStyle=color;ctx.strokeStyle=color;
      ctx.beginPath();
      if(width*a*sx<.6){
        ctx.lineWidth=1/sx;ctx.moveTo(m.vp.x+x*a,y1);ctx.lineTo(m.vp.x+x*b,y2);ctx.stroke();return;
      }
      ctx.moveTo(m.vp.x+(x-width/2)*a,y1);ctx.lineTo(m.vp.x+(x+width/2)*a,y1);
      ctx.lineTo(m.vp.x+(x+width/2)*b,y2);ctx.lineTo(m.vp.x+(x-width/2)*b,y2);ctx.closePath();ctx.fill();
    };
    const debugOverlay=root.closest('.rear-scene')?.querySelector<SVGSVGElement>('.road-debug');
    const parallax=root.closest<HTMLElement>('.parallax-layer');
    const draw=(animate:boolean)=>{
      if(debugOverlay) debugOverlay.style.transform=parallax?.style.transform??'';
      const start=performance.now(),speed=useSceneStore.getState().speed,ratio=speed/CRUISE_SPEED;
      const blur=Math.min(1.8,1+.35*Math.max(0,ratio-1));
      ctx.setTransform(sx,0,0,sy,0,0);ctx.clearRect(0,0,m.width,m.height);
      ctx.save();ctx.clip(clip);
      for(let side=-1;side<=1;side+=2)quad(side*(m.rail-.45),near,depth,.12,'#ffffff',.35);
      if(animate){
        for(let i=0;i<40;i++){const n=i*4,z=near+modulo(pool[n+2]*depth-phase.current*1.15,depth);quad(pool[n],z,pool[n+1],.05,'#ffffff',pool[n+3]);}
      }
      // Two passes: broad pink glow, then the crisp white paint.
      for(let pass=0;pass<2;pass++){
        ctx.shadowColor=pass===0?'#ff4fa8':'transparent';ctx.shadowBlur=pass===0?8:0;
        const offset=modulo(-phase.current,9);
        for(let i=-1;i<dashCycle/9;i++){
          const z=near+offset+i*9;
          const scale=m.F/Math.max(near,z);
          const bottomFade=1-smooth((scale-.82*bottomS)/(.18*bottomS));
          const glowFade=1-smooth((scale-.65*bottomS)/(.15*bottomS));
          for(let side=-1;side<=1;side+=2)quad(side*laneX(m.rail),z,3*blur,pass===0?.3:.11,pass===0?'#ff4fa8':'#fff3fb',bottomFade*(pass===0?.10*glowFade:.88));
        }
      }
      ctx.shadowBlur=0;
      for(let i=0;i<studCycle/12;i++){
        const z=near+modulo(i*12+4.5-phase.current,studCycle);
        const alpha=animate?.75+.25*Math.sin(time.current*Math.PI*12):.75;
        for(let side=-1;side<=1;side+=2)quad(side*laneX(m.rail),z,.18*blur,.18,i%2?'#25f4ee':'#ff4fa8',alpha);
      }
      if(animate){
        ctx.globalCompositeOperation='lighter';
        for(let i=0;i<packetCycle/14;i++){
          const z=near+modulo(i*14-phase.current*1.25,packetCycle);
          // Two nested colors approximate a soft strip gradient without per-frame gradient objects.
          for(let side=-1;side<=1;side+=2){
            quad(side*m.rail,z,2,.09,'#ff2a8a',.35,m.railHeight);
            quad(side*m.rail,z+.3,1.4,.035,'#ffd0ee',.7,m.railHeight);
          }
        }
      }
      ctx.restore();diagnostic.phase=phase.current;diagnostic.frames++;cost+=performance.now()-start;
    };
    const tick=(now:number)=>{
      const dt=last?(now-last)/1000:0;last=now;
      phase.current+=BASE_V*(useSceneStore.getState().speed/CRUISE_SPEED)*dt;time.current+=dt;
      draw(true);fpsTime+=dt;fpsFrames++;
      if(fpsTime>=1){diagnostic.fps=Math.round(fpsFrames/fpsTime);diagnostic.drawMs=cost/fpsFrames;fpsTime=0;fpsFrames=0;cost=0;}
      diagnostic.raf=true;raf=requestAnimationFrame(tick);
    };
    root.style.visibility=active?'visible':'hidden';
    if(active&&!hidden)draw(running);
    if(running){diagnostic.raf=true;raf=requestAnimationFrame(tick);}
    return()=>{cancelAnimationFrame(raf);diagnostic.raf=false;};
  },[model,reduced,hidden,ignited,section]);
  const debug=new URLSearchParams(location.search).get('debug')==='road';
  const perf=new URLSearchParams(location.search).get('perf')==='1';
  return <div className="road-markings" ref={ref} aria-hidden="true"><canvas ref={canvasRef}/>{model&&debug&&ref.current?.closest('.rear-scene')&&createPortal(<RoadDebug model={model}/>,ref.current.closest('.rear-scene')!)} {perf&&<RoadPerf/>}</div>;
}
function RoadPerf(){
  const ref=useRef<HTMLOutputElement>(null);
  useEffect(()=>{const timer=setInterval(()=>{if(ref.current){const d=window.__road;ref.current.textContent=`Road ${d?.fps??0} FPS / ${d?.drawMs.toFixed(2)??0} ms`; }},500);return()=>clearInterval(timer);},[]);
  return <output ref={ref} className="road-perf"/>;
}
