import { useId } from 'react';

function Wheel({ x }: { x: number }) {
  return <g transform={`translate(${x} 166)`}>
    <circle r="29" fill="#090b13" stroke="#292b38" strokeWidth="3"/>
    <circle r="20" fill="#777b89" stroke="#c2bdc7" strokeWidth="1.5"/>
    <circle r="16" fill="#222633"/>
    <g className="wheel-spokes">{Array.from({ length: 12 }, (_, i) => <path key={i} d="M-2-7L-3-18H3L2-7Z" transform={`rotate(${i * 30})`} fill="#a0a2ad"/>)}</g>
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
    {/* Low roof, long bonnet and straight beltline of an eighties wedge coupe. */}
    <path d="M45 132L67 115L184 108L263 71L384 71L453 112L583 124L616 143L612 174H579A39 39 0 0 0 501 174H164A39 39 0 0 0 86 174H46Z" fill={`url(#${id}-metal)`} stroke="#8f8598" strokeWidth="1.5"/>
    <path d="M201 108L268 78H378L427 110Z" fill={`url(#${id}-glass)`} stroke="#c3abbc" strokeWidth="1.4"/>
    <path d="M278 79L266 110M379 79L409 110" stroke="#8b8598" strokeWidth="3"/>
    <path d="M265 113L436 115L425 164H249Z" fill="none" stroke="#1b2232" strokeWidth="1.5"/>
    <path d="M50 139L603 145" stroke="#151b29" strokeWidth="6"/>
    <path d="M65 117L183 112M452 115L580 127M175 165H490" stroke="#d8adc1" strokeWidth="1"/>
    <path d="M61 121H179M73 125H166M85 129H152" stroke="#292c3b" strokeWidth="2"/>
    <path d="M45 139H63V150H43Z" fill="#ff315f" className="brake-lights"/>
    <path d="M592 139L610 145V150H592Z" fill="#ffe7b2"/>
    <path d="M48 164H80M587 163H614" stroke="#101725" strokeWidth="8"/>
    <rect x="288" y="120" width="22" height="3" rx="1" fill="#c5b5c3"/>
    <path d="M416 110L429 103L443 108V115H428Z" fill="#6c667c" stroke="#b797ae"/>
    <Wheel x={125}/><Wheel x={540}/>
    <path d="M171 176H492" stroke="#0f1422" strokeWidth="7"/>
    <path d="M177 172H486" stroke="#bf658c" strokeWidth="1"/>
  </svg>;
}
