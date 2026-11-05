import { useId } from 'react';

function Wheel({ x }: { x: number }) {
  return <g transform={`translate(${x} 163)`}>
    <circle r="32" fill="#090b13" stroke="#292b38" strokeWidth="3"/>
    <circle r="20" fill="#777b89" stroke="#c2bdc7" strokeWidth="1.5"/>
    <circle r="16" fill="#222633"/>
    <g className="wheel-spokes">{Array.from({ length: 5 }, (_, i) => <path key={i} d="M-2-7L-3-18H3L2-7Z" transform={`rotate(${i * 72})`} fill="#a0a2ad"/>)}</g>
    <circle r="6" fill="#5b5f6c" stroke="#c5bcc8"/>
  </g>;
}

export function SideCar() {
  const id = useId().replace(/:/g, '');
  return <svg viewBox="0 0 660 235" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#b9adb9"/><stop offset=".32" stopColor="#7d7e8d"/><stop offset=".36" stopColor="#4d5364"/><stop offset=".8" stopColor="#303646"/><stop offset="1" stopColor="#171c2a"/></linearGradient>
      <linearGradient id={`${id}-glass`} x2=".3" y2="1"><stop stopColor="#413449"/><stop offset="1" stopColor="#101724"/></linearGradient>
    </defs>
    <ellipse cx="333" cy="195" rx="273" ry="7" fill="#080a12" opacity=".6"/>
    <path d="M62 139L80 119L174 111L264 76H377L441 112L572 126L600 145V174H558A39 39 0 0 0 480 174H178A39 39 0 0 0 100 174H62Z" fill={`url(#${id}-metal)`} stroke="#ada6b4" strokeWidth="1.5"/>
    <path d="M193 110L268 83H370L418 112Z" fill={`url(#${id}-glass)`} stroke="#aea4b4" strokeWidth="2"/>
    <path d="M275 83L262 112M375 87L397 112" stroke="#77788a" strokeWidth="3"/>
    <path d="M254 117H433L420 164H244Z" fill="none" stroke="#202635" strokeWidth="2"/>
    <path d="M68 140L590 146" stroke="#141a26" strokeWidth="7"/>
    <path d="M80 121L177 116M444 117L568 131" stroke="#ddd0d9" strokeWidth="1.5"/>
    <path d="M86 124H168M91 128H156M98 132H145" stroke="#202635" strokeWidth="2"/>
    <path d="M64 140H81V151H62Z" fill="#ff3657" className="brake-lights"/>
    <path d="M578 140L595 146V151H578Z" fill="#ffe2b1"/>
    <path d="M64 165H94M564 165H600" stroke="#111722" strokeWidth="8"/>
    <rect x="280" y="122" width="19" height="3" rx="1" fill="#c2b8c4"/>
    <path d="M406 110L420 104L432 110V116H417Z" fill="#686579" stroke="#a697ad"/>
    <Wheel x={139}/><Wheel x={519}/>
    <path d="M181 176H477" stroke="#0f1422" strokeWidth="7"/>
    <path d="M184 172H474" stroke="#bf658c" strokeWidth="1"/>
  </svg>;
}
