import type { CSSProperties } from 'react';
import type { StopConfig } from '../../data/stops';
import { propAssets } from '../../data/propAssets';
export function StopProps({stop}:{stop:StopConfig}) {
 return <>
  {stop.neighbors && <><div className="stop-neighbors" aria-hidden="true">{['left','right'].map(side=><div key={side} className={`stop-neighbor neighbor-${side}`}><img src={`/assets/neighbors/${side}.webp`} alt=""/><span className="neighbor-grade"/><img className="neighbor-reflection" src={`/assets/neighbors/${side}.webp`} alt=""/></div>)}</div><div className="neighbor-reflections" aria-hidden="true">{['left','right'].map(side=><div key={side} className={`stop-neighbor neighbor-${side}`}><img className="neighbor-reflection" src={`/assets/neighbors/${side}.webp`} alt=""/></div>)}</div></>}
  {stop.props.map((prop,i)=>{
   const art=propAssets[prop.asset];
   const style={'--prop-x':`${prop.x}%`,'--mobile-prop-x':`${prop.mobileX??prop.x}%`,'--prop-height':prop.height/100*prop.scale,'--prop-aspect':art.aspect,'--prop-mask':`url(${art.src})`,zIndex:prop.z} as CSSProperties;
   return <div key={`${prop.asset}-${i}`} className={`stop-prop-stage prop-${prop.placement} ${prop.mobile?'prop-mobile':'prop-desktop'}`} style={style} aria-hidden="true"><div className="stop-prop" data-prop={prop.asset}><div className="prop-parallax" data-stop-depth="14"><span className="prop-shadow"/><img className="prop-art" src={art.src} alt=""/><span className="prop-grade"/><img className="prop-reflection" src={art.src} alt=""/></div></div></div>;
  })}
 </>;
}
