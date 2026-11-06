import type { CSSProperties } from 'react';
type Depth = 'far' | 'mid' | 'near';
const lights = [{x:61.7,y:1.1},{x:84.4,y:2.5},{x:96.2,y:16.2}];
const signs = [{x:19.7,y:62.3,w:1.7,h:13.1},{x:39.4,y:58.8,w:1.7,h:14.7},{x:57.8,y:63.6,w:1.7,h:14.1},{x:66.3,y:59.7,w:1.8,h:16.7},{x:95.5,y:59.3,w:1.5,h:15.3}];
function Skyline({depth}:{depth:Depth}) {
 const debug = new URLSearchParams(location.search).get('debug') === 'rects';
 return <div className={`raster-city city-${depth}`} aria-hidden="true"><div className="city-tiles">
  {[-2,-1,0,1,2].map((tile)=><div key={tile} className={`city-tile ${tile%2 ? 'city-mirrored' : ''} ${debug ? 'city-debug' : ''}`} style={{'--tile':tile} as CSSProperties}>
   <img src={`/assets/skyline/${depth}.webp`} alt="" decoding="async"/>
   {depth !== 'far' && <>
    {lights.map((p,i)=><span key={`light-${i}`} className="raster-aviation aviation-light" style={{left:`${p.x}%`,top:`${p.y}%`,animationDuration:`${1.3+i*.5}s`,animationDelay:`${-i*.6}s`}}/>)}
    {signs.map((p,i)=><span key={`sign-${i}`} className="raster-neon city-neon" style={{left:`${p.x}%`,top:`${p.y}%`,width:`${p.w}%`,height:`${p.h}%`,color:i%2?'#ff4b9b':'#25f4ee',animationDelay:`${-i*1.3}s`}}/>)}
   </>}
   <div className="city-art-haze"/>
  </div>)}
 </div></div>;
}
export function FarSkyline(){return <Skyline depth="far"/>;}
export function MidSkyline(){return <Skyline depth="mid"/>;}
export function NearBuildings(){return <Skyline depth="near"/>;}
