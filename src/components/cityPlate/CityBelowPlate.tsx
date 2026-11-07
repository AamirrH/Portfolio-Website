import { useEffect,useLayoutEffect,useRef,useState,type CSSProperties } from 'react';
import gsap from 'gsap';
import { useSceneStore } from '../../state/useSceneStore';
import { useStopPreferences } from '../../hooks/useStopAnimations';
import { CITY_PLATE,HORIZON_PCT,PLATE_META,DARK_WINDOWS,WARM_WINDOWS,SIGNS,STREETS,plateY,type PlateRect } from '../../config/cityPlate.config';
import { SIDE_STREAKS } from '../../config/sides.config';
import './cityPlate.css';

interface Layout {horizon:number;bottom:number;width:number;height:number;}
function readHorizon(root:HTMLElement){
 const road=root.closest('.rear-scene')?.querySelector<SVGSVGElement>('.road-base');
 const numbers=road?.querySelector('[data-road-rails]')?.getAttribute('d')?.match(/-?\d+(?:\.\d+)?/g)?.map(Number);
 if(!road||!numbers||numbers.length!==8)return HORIZON_PCT;
 const [ax,ay,bx,by,cx,cy,dx,dy]=numbers,l=(by-ay)/(bx-ax),r=(dy-cy)/(dx-cx);
 const x=(cy-r*cx-ay+l*ax)/(l-r);
 return (ay+l*(x-ax))/road.viewBox.baseVal.height;
}
export function CityBelowPlate(){
 const ref=useRef<HTMLDivElement>(null);
 const {mobile,reduced,hidden}=useStopPreferences();
 const section=useSceneStore(s=>s.section),ignited=useSceneStore(s=>s.ignited);
 const [layout,setLayout]=useState<Layout|null>(null);
 const debug=new URLSearchParams(location.search).get('debug');
 const active=['home','projects','contact'].includes(section);
 useLayoutEffect(()=>{
  const root=ref.current;if(!root)return;
  let timer:ReturnType<typeof setTimeout>;
  const measure=()=>{
   const scene=root.parentElement!,box=scene.getBoundingClientRect(),footer=document.querySelector('.journey-footer')?.getBoundingClientRect();
   const horizon=readHorizon(root)*scene.clientHeight;
   const bottom=footer?Math.max(0,(box.bottom-footer.top)*scene.clientHeight/box.height):0;
   setLayout({horizon,bottom,width:scene.clientWidth,height:scene.clientHeight});
  };
  measure();const observer=new ResizeObserver(()=>{clearTimeout(timer);timer=setTimeout(measure,150);});
  observer.observe(root.parentElement!);
  return()=>{clearTimeout(timer);observer.disconnect();};
 },[]);
 useEffect(()=>{
  const root=ref.current;if(!root||!layout)return;
  root.dataset.raf='0';root.dataset.tweens='0';root.dataset.fps='0';
  if(!active||!ignited||reduced||hidden)return;
  let raf=0,last=0,time=0,twinkleAt=1.5,frames=0,clock=0;
  const dark=Array.from(root.querySelectorAll<HTMLElement>('.plate-window-dark'));
  const warm=Array.from(root.querySelectorAll<HTMLElement>('.plate-window-warm'));
  const signs=Array.from(root.querySelectorAll<HTMLElement>('.plate-sign'));
  const dots=Array.from(root.querySelectorAll<SVGCircleElement>('.plate-street-dot'));
  const trains=Array.from(root.querySelectorAll<SVGGElement>('.plate-train'));
  const neonTimes=signs.map((_,i)=>6+i*.9);
  const tweens=new Set<gsap.core.Tween>();
  const fade=(node:Element,opacity:number,duration=.3)=>{
   const tween=gsap.to(node,{opacity,duration,overwrite:true,onComplete:()=>{tweens.delete(tween);root.dataset.tweens=String(tweens.size);}});
   tweens.add(tween);root.dataset.tweens=String(tweens.size);
  };
  const planes=Array.from(root.querySelectorAll<HTMLElement>('.city-plate-plane'));
  const movers=planes.map(p=>gsap.quickTo(p,'x',{duration:.6,ease:'power2.out'}));
  const pointer=(event:PointerEvent)=>{
   if(mobile||event.pointerType!=='mouse'||!matchMedia('(pointer:fine)').matches)return;
   const x=(event.clientX/layout.width-.5)*12;movers.forEach(move=>move(x));
  };
  const reset=()=>movers.forEach(move=>move(0));
  if(!mobile){window.addEventListener('pointermove',pointer,{passive:true});document.addEventListener('pointerleave',reset);}
  const tick=(now:number)=>{
   const dt=last?Math.min(.1,(now-last)/1000):0;last=now;time+=dt;
   const pace=Math.min(1.2,Math.max(.8,.8+useSceneStore.getState().speed*.2));
   dots.forEach((dot,i)=>{
    const path=STREETS[i%STREETS.length],p=(time*pace/(25+i*2)+i*.173)%1,t=p*(path.length-1),j=Math.min(path.length-2,Math.floor(t)),f=t-j;
    const x=path[j].x+(path[j+1].x-path[j].x)*f,y=path[j].y+(path[j+1].y-path[j].y)*f;
    dot.style.transform=`translate(${x}px,${y}px)`;dot.style.opacity=String(Math.min(1,p*10,(1-p)*10)*.65);
   });
   trains.forEach(train=>{
    const p=(time%25)/6;
    train.style.opacity=p<=1?String(Math.min(1,p*8,(1-p)*8)*.5):'0';
    train.style.transform=`translate(${56+p*50}px,${plateY(33+p*20)}px) rotate(24deg)`;
   });
   if(time>=twinkleAt){
    const collection=Math.random()<.7?dark:warm,node=collection[Math.floor(Math.random()*collection.length)];
    if(node){const on=node.dataset.on!=='true';node.dataset.on=String(on);fade(node,on?(collection===dark?.75:.5):0);}
    twinkleAt=time+1.5+Math.random()*2.5;
   }
   signs.forEach((sign,i)=>{if(time>=neonTimes[i]){fade(sign,.05,.05);const tween=gsap.to(sign,{opacity:.22,delay:.12,duration:.1,onComplete:()=>tweens.delete(tween)});tweens.add(tween);neonTimes[i]=time+6+Math.random()*6;}});
   frames++;clock+=dt;if(clock>=1){root.dataset.fps=String(Math.round(frames/clock));frames=0;clock=0;}
   root.dataset.raf='1';raf=requestAnimationFrame(tick);
  };
  raf=requestAnimationFrame(tick);root.dataset.raf='1';
  return()=>{cancelAnimationFrame(raf);tweens.forEach(t=>t.kill());movers.forEach(m=>m.tween.kill());window.removeEventListener('pointermove',pointer);document.removeEventListener('pointerleave',reset);root.dataset.raf='0';root.dataset.tweens='0';};
 },[layout,mobile,reduced,hidden,active,ignited]);
 if(!active)return <div ref={ref} className="city-below" hidden/>;
 const style=layout?{'--plate-horizon':layout.horizon+'px','--plate-bottom':layout.bottom+'px','--plate-scale':CITY_PLATE.scale,'--plate-offset':CITY_PLATE.offsetY+'px','--plate-aspect':PLATE_META.width/PLATE_META.height} as CSSProperties:undefined;
 return <div ref={ref} className={`city-below ${debug==='rects'?'plate-rects':''} ${debug==='plate'?'plate-debug':''} ${reduced||hidden?'plate-static':''}`} style={style} aria-hidden="true">
  <div className="city-plate-clip">
   {(mobile?['left','right']:['whole']).map(side=><div className={`city-plate-crop crop-${side}`} key={side}><div className="city-plate-plane">
    <img className="city-plate-image" src="/assets/sides/city-below.webp" alt="" width={PLATE_META.width} height={PLATE_META.height}/>
    <div className="plate-grade"/><div className="plate-rim"/>
    <PlateOverlays side={side} mobile={mobile} staticOnly={reduced}/>
    <div className="plate-edge"/>
   </div></div>)}
   <div className="plate-haze"/>
   {SIDE_STREAKS&&layout&&<SideStreaks layout={layout} paused={reduced||hidden||!ignited}/>}
  </div>
  {debug==='plate'&&layout&&<PlateBounds layout={layout} mobile={mobile}/>}
  {debug==='plate'&&layout&&<div className="plate-clip-label" style={{top:layout.horizon}}>HORIZON {(layout.horizon/layout.height*100).toFixed(3)}% / scale {CITY_PLATE.scale} / offset {CITY_PLATE.offsetY}px</div>}
  {new URLSearchParams(location.search).get('perf')==='1'&&<PlatePerf root={ref}/>}
 </div>;
}
function PlateOverlays({side,mobile,staticOnly}:{side:string;mobile:boolean;staticOnly:boolean}){
 const visible=(r:PlateRect)=>side==='whole'||(side==='left'?r.x<50:r.x>=50);
 const box=(r:PlateRect):CSSProperties=>({left:r.x+'%',top:r.y+'%',width:r.w+'%',height:r.h+'%',color:r.color});
 return <div className={staticOnly?'plate-overlays overlays-static':'plate-overlays'}>
  {DARK_WINDOWS.filter(visible).map(r=><i key={r.id} data-id={r.id} className="plate-window-dark plate-rect" style={box(r)}/>)}
  {WARM_WINDOWS.filter(visible).map(r=><i key={r.id} data-id={r.id} className="plate-window-warm plate-rect" style={box(r)}/>)}
  {SIGNS.filter(visible).map(r=><i key={r.id} data-id={r.id} className="plate-sign plate-rect" style={box(r)}/>)}
  <svg className="plate-streets" viewBox="0 0 100 100" preserveAspectRatio="none">
   {STREETS.map((path,i)=><path key={i} className="plate-street-path" data-id={'street-'+i} d={path.map((p,j)=>`${j?'L':'M'}${p.x} ${p.y}`).join(' ')}/>)}
   {Array.from({length:mobile?2:10},(_,i)=><circle className="plate-street-dot" key={i} r=".12" fill={i%2?'#fff3e6':'#ff626e'}/>)}
   {!mobile&&<><defs><clipPath id="plate-viaduct"><path d={`M56 ${plateY(32)}L100 ${plateY(50)}L100 ${plateY(53)}L56 ${plateY(35)}Z`}/></clipPath></defs><g clipPath="url(#plate-viaduct)"><g className="plate-train">{Array.from({length:14},(_,i)=><rect key={i} x={i*.55} width=".28" height=".55" fill="#ffd39c"/>)}</g></g><path className="plate-viaduct-debug" d={`M56 ${plateY(32)}L100 ${plateY(50)}L100 ${plateY(53)}L56 ${plateY(35)}Z`}/></>}
  </svg>
 </div>;
}
function PlateBounds({layout,mobile}:{layout:Layout;mobile:boolean}){
 const aspect=PLATE_META.width/PLATE_META.height,w=(mobile?layout.height*.4*aspect:layout.width)*CITY_PLATE.scale,h=w/aspect;
 const top=layout.height-layout.bottom-CITY_PLATE.offsetY-h;
 return <svg className="plate-bounds-debug" viewBox={`0 0 ${layout.width} ${layout.height}`} preserveAspectRatio="none">
  {(mobile?[0,layout.width-w]:[(layout.width-w)/2]).map((x,i)=><rect key={i} x={x} y={top} width={w} height={h}/>)}
 </svg>;
}
function SideStreaks({layout,paused}:{layout:Layout;paused:boolean}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas||paused)return;const ctx=canvas.getContext('2d');if(!ctx)return;
  const w=layout.width,h=layout.height-layout.horizon-layout.bottom,dpr=Math.min(devicePixelRatio,1.5);canvas.width=w*dpr;canvas.height=h*dpr;ctx.scale(dpr,dpr);
  const pool=Array.from({length:14},(_,i)=>({p:i/14,life:.8+Math.random()*.8,angle:(12+Math.random()*26)*Math.PI/180,side:i%2?1:-1}));let raf=0,last=0;
  const tick=(now:number)=>{const dt=last?Math.min(.05,(now-last)/1000):0;last=now;ctx.clearRect(0,0,w,h);ctx.strokeStyle='#ffd6eb';ctx.lineWidth=1;
   for(const s of pool){s.p=(s.p+dt*Math.max(.2,useSceneStore.getState().speed)/s.life)%1;const p=(2**(6*s.p)-1)/63,x=w/2+s.side*p*w*.55,y=p*w*.55*Math.tan(s.angle);ctx.globalAlpha=.06+p*.08;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-s.side*(3+p*35),y-(3+p*35)*Math.tan(s.angle));ctx.stroke();}
   raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf);
 },[layout,paused]);return <canvas ref={ref} className="plate-streaks"/>;
}
function PlatePerf({root}:{root:React.RefObject<HTMLDivElement>}){
 const ref=useRef<HTMLOutputElement>(null);
 useEffect(()=>{const timer=setInterval(()=>{if(ref.current)ref.current.textContent=`Plate ${root.current?.dataset.fps??0} FPS / ${root.current?.querySelectorAll('.plate-street-dot').length??0} light dots`;},500);return()=>clearInterval(timer);},[root]);
 return <output ref={ref} className="plate-perf"/>;
}
export function PlainCityPlate(){return <div className="plain-city-plate" aria-hidden="true"><img src="/assets/sides/city-below.webp" alt=""/></div>;}
