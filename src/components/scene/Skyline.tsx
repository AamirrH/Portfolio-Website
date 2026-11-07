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
   {depth !== 'far' && <LowerFacades/>}<div className="city-art-haze"/>
  </div>)}
 </div></div>;
}
export function FarSkyline(){return <Skyline depth="far"/>;}
export function MidSkyline(){return <Skyline depth="mid"/>;}
export function NearBuildings(){return <Skyline depth="near"/>;}

function LowerFacades(){return <svg className="lower-facades" viewBox="0 0 1800 650" preserveAspectRatio="none"><defs><linearGradient id="facade-grade" x2="0" y2="1"><stop stopColor="#251630"/><stop offset="1" stopColor="#100c20"/></linearGradient></defs><rect width="1800" height="650" fill="url(#facade-grade)"/>{Array.from({length:22},(_,i)=><g key={i}><rect x={i*84} width="3" height="650" fill="#080817" opacity=".55"/>{Array.from({length:9},(_,j)=>(i*7+j*3)%5<2?<rect className={j%2?'facade-window secondary-window':'facade-window'} key={j} x={i*84+18+(j%3)*15} y={22+j*65} width="6" height="10" fill={(i+j)%3?'#c78d82':'#e6bd87'} opacity=".3"/>:null)}{i%7===2&&<g><rect x={i*84+57} y="60" width="9" height="126" fill={i%2?'#c95190':'#328e9a'} opacity=".5"/>{[0,1,2,3,4].map(k=><rect key={k} x={i*84+59} y={70+k*22} width="5" height="10" fill="#d8b4ce" opacity=".5"/>)}</g>}</g>)}</svg>;}
export function DeckEdge(){return <svg className="deck-edge" viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden="true"><defs><filter id="deck-glow"><feGaussianBlur stdDeviation="6"/></filter></defs><path d="M0 700L628 542M1440 700L812 542" stroke="rgba(8,4,20,.85)" strokeWidth="30" fill="none"/><path d="M0 690L628 532M1440 690L812 532" stroke="#ff2a8a" strokeWidth="3" opacity=".55" filter="url(#deck-glow)" fill="none"/></svg>;}
