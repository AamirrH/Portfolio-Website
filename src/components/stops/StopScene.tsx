import { useEffect, type CSSProperties } from 'react';
import { type StopConfig, stops, stopArtOrder } from '../../data/stops';
import { SceneSky } from '../scene/TravelScenes';
import { SideCar } from '../scene/SideCar';
import { SignalBuilding } from './SignalBuilding';

type StopStyle = CSSProperties & Record<`--${string}`, string | number>;
export function StopScene({ stop }: { stop: StopConfig }) {
  const { building } = stop;
  useEffect(() => {
    const nextId = stopArtOrder[(stopArtOrder.indexOf(stop.id)+1)%stopArtOrder.length];
    const src = stops[nextId].building.src;
    if (!src) return;
    const link = document.createElement('link'); link.rel = 'preload'; link.as = 'image'; link.href = src;
    document.head.append(link);
    return () => link.remove();
  }, [stop.id]);
  const style: StopStyle = { '--height-vh': building.heightVh, '--mobile-height-vh': building.mobileHeightVh, '--anchor-x': building.anchorXPct, '--building-aspect': building.aspect, '--building-mask': building.silhouette ? `url("${building.silhouette}")` : 'none' };
  const art = building.src ? <img className="stop-art" src={building.src} alt="" loading="eager" decoding="async"/> : <SignalBuilding/>;
  return <div className={`stop-scene stop-${stop.id}`} data-stop={stop.id} style={style}>
    <SceneSky/>
    <div className="building-anchor"><div className="building-contact-shadow"/><div className="building-arrival">
      {art}{building.silhouette && <><div className="building-tint"/><div className="building-rim"/></>}
    </div></div>
    <div className="stop-asphalt"/><div className="stop-sidewalk"/><div className="stop-curb"/>
    <div className="building-reflection">{building.src ? <img src={building.src} alt="" decoding="async"/> : <SignalBuilding/>}</div>
    <div className="stop-near-lane"/>
    <div className="car-anchor"><div className="car-contact-shadow"/><div className="parked-car"><SideCar/></div><div className="car-reflection"><SideCar/></div></div>
  </div>;
}
