import { responsiveArt } from '../../lib/responsiveArt';
import { idleTask } from '../../lib/idle';
import { useEffect, useRef, useId, type CSSProperties } from 'react';
import { type StopConfig, stops, stopArtOrder } from '../../data/stops';
import { content, projects } from '../../data/content';
import { useSceneStore } from '../../state/useSceneStore';
import { SceneSky } from '../scene/TravelScenes';
import { SideCar } from '../scene/SideCar';
import { StopProps } from './StopProps';
import { SignalFlow } from './SignalFlow';
import { SignalBuilding } from './SignalBuilding';
import { StopOverlays, OrderTickets } from './StopOverlays';
import { useStopAnimations } from '../../hooks/useStopAnimations';

import { useStopPolish } from '../../hooks/useStopPolish';
import { SCENE_QUALITY } from '../../config';
import { NearBuildings } from '../scene/Skyline';

type StopStyle = CSSProperties & Record<`--${string}`, string | number>;
export function StopScene({ stop }: { stop: StopConfig }) {
  const ref = useRef<HTMLDivElement>(null);
  useStopAnimations(ref, stop);
  useStopPolish(ref);
  const rippleId = `ripple-${useId().replace(/:/g, "")}`;
  const debug = new URLSearchParams(location.search).get('debug') === 'rects';
  const tickets = stop.overlays.find(rect => rect.kind === 'tickets');
  const { building, door } = stop;
  const project = projects.find(item => item.id === stop.id);
  const ignited=useSceneStore(s=>s.ignited);
  const active = useSceneStore(state => state.section === stop.id);
  useEffect(() => {
    if(!ignited||!active)return;
    const nextId = stopArtOrder[(stopArtOrder.indexOf(stop.id)+1)%stopArtOrder.length];
    const src = stops[nextId].building.src;
    if (!src) return;
    let cancelled=false;
    const cancel=idleTask(()=>{if(cancelled)return;const image=new Image();image.decoding='async';image.src=src;void image.decode().catch(()=>{});});
    return()=>{cancelled=true;cancel();};
  }, [stop.id,ignited,active]);
  const style: StopStyle = { '--height-vh': building.heightVh, '--mobile-height-vh': building.mobileHeightVh, '--anchor-x': building.anchorXPct, '--building-aspect': building.aspect, '--building-mask': building.silhouette ? `url("${building.silhouette}")` : 'none' };
  const art = building.src ? <img {...responsiveArt(building.src,'(max-width:767px) 85vw, 55vw')} className="stop-art" src={building.src} alt="" loading="eager" decoding="async"/> : <SignalBuilding/>;
  return <div ref={ref} className={`stop-scene stop-${stop.id}`} data-stop={stop.id} style={style}>
    <SceneSky/>
    <div className="stop-city-near" data-stop-depth="6"><NearBuildings/></div>
    {SCENE_QUALITY.reflectionRipple && <svg className="reflection-filter" aria-hidden="true"><defs><filter id={rippleId} x="-10%" width="120%"><feTurbulence type="fractalNoise" baseFrequency=".008 .1" numOctaves="1" seed="7" result="noise"/><feColorMatrix in="noise" type="matrix" values="1 0 0 0 0  0 0 0 0 .5  0 0 1 0 0  0 0 0 1 0" result="horizontalNoise"/><feDisplacementMap in="SourceGraphic" in2="horizontalNoise" scale="6" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>}
    <div className="building-anchor"><div className="building-parallax" data-stop-depth="8"><div className="building-contact-shadow"/><div className="building-arrival">
      {art}{building.silhouette && <><div className="building-tint"/><div className="building-rim"/><div className="building-grade"/><div className="building-occlusion"/></>}
      {SCENE_QUALITY.bloom && building.src && <img className="building-bloom" src={building.src} alt=""/>}
      <StopOverlays stop={stop} debug={debug}/>
      {active && door && project?.live && <a className="building-door" href={project.live} target="_blank" rel="noopener noreferrer" aria-label={`${content.projects.door}: ${project.title}`} style={{ left: `${door.x}%`, top: `${door.y}%`, width: `${door.width}%`, height: `${door.height}%` }}><span>{content.projects.door} ↗</span></a>}
    </div></div></div>
    <div className="stop-asphalt"/><div className="stop-sidewalk"><i className="drain-grate"/><i className="drain-grate"/></div><div className="stop-curb"/>
    <div className="ground-spills" data-stop-depth="8" aria-hidden="true"><span className="spill spill-main"/><span className="spill spill-secondary"/></div>
    <div className="building-reflection"><div className="reflection-parallax" data-stop-depth="10" style={{'--ripple-filter': SCENE_QUALITY.reflectionRipple ? `url(#${rippleId})` : 'none'} as CSSProperties}>{building.src ? <img src={building.src} alt="" decoding="async"/> : <SignalBuilding/>}</div></div>
    <StopProps stop={stop}/>
    <div className="stop-near-lane"/>
    {tickets && <OrderTickets rect={tickets}/>}
    {stop.id === 'signalroute' && <SignalFlow root={ref} stop={stop}/>}
    <div className="car-anchor"><div className="car-contact-shadow"/><div className="parked-car"><SideCar/></div><div className="car-reflection"><SideCar/></div></div>
  </div>;
}
