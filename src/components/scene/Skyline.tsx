import { useId } from 'react';

type Depth = 'far' | 'mid' | 'near';
const sample = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
function Skyline({ depth }: { depth: Depth }) {
  const id = useId().replace(/:/g, '');
  const near = depth === 'near', far = depth === 'far';
  const base = near ? 570 : 543;
  const color = far ? '#6b3a7a' : near ? '#1b0f2e' : '#3b1e55';
  const buildings = Array.from({ length: near ? 8 : 19 }, (_, i) => {
    const width = near ? 75 + sample(i+12)*55 : 60 + sample(i+22)*100;
    const x = near ? (i < 4 ? i*100-25 : 1065+(i-4)*100) : i*82-45;
    const height = near ? 310 - (i < 4 ? i : 7-i)*62 + sample(i)*45 : (far ? 75 : 110) + sample(i+31)*(far ? 110 : 165);
    return { x, width, height };
  });
  return <svg className={`skyline-svg city-${depth}`} viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id={`${id}-haze`} x2="0" y2="1"><stop stopColor="#bd739f" stopOpacity="0"/><stop offset="1" stopColor="#bd739f" stopOpacity={far ? '.5' : '.25'}/></linearGradient></defs>
    {buildings.map((b,i) => {
      const top = base-b.height, cols = Math.floor((b.width-14)/13), rows = Math.floor((b.height-20)/15);
      const outline = `M${b.x} ${base}V${top+12}h${b.width*.18}V${top}h${b.width*.64}v12h${b.width*.18}V${base}Z`;
      return <g key={i}>
        <path d={outline} fill={color}/>
        {Array.from({length:rows*cols},(_,w) => {
          const row = Math.floor(w/cols), col=w%cols, seed=i*701+w;
          const darkFloor = sample(i*17+row*31)<.3;
          const lit = !darkFloor && sample(seed) < (far ? .1 : near ? .22 : .58);
          if(!lit) return null;
          return <rect key={w} className={sample(seed+900)<.03 ? 'city-window-twinkle' : undefined} x={b.x+8+col*13} y={top+20+row*15} width={far ? 2 : 4} height={far ? 3 : 6} fill={near ? '#e7b984' : '#f3bdd1'} opacity={far ? .2 : .4+sample(seed+1)*.3} style={{animationDuration:`${2+sample(seed+2)*3}s`,animationDelay:`${-sample(seed+3)*5}s`}}/>;
        })}
        {near && <g fill="#20132f" stroke="#473049" strokeWidth="1"><rect x={b.x+20} y={top-10} width="23" height="10"/><path d={`M${b.x+35} ${top-10}v-8h15v8M${b.x+57} ${top+4}v-30`}/>{i%3!==1 && <circle className="aviation-light" cx={b.x+57} cy={top-26} r="2" fill="#ff526c" stroke="none" style={{animationDuration:`${1.2+sample(i+90)*1.3}s`,animationDelay:`${-sample(i)*2}s`}}/>}</g>}
        {((!near&&!far&&(i===3||i===14))||(near&&(i===1||i===6))) && <g className="city-neon" style={{animationDelay:`${-i*.7}s`}} fill={i%2 ? '#25f4ee' : '#ff4b9b'}><rect x={b.x+b.width-7} y={top+36} width="9" height="47" opacity=".18"/>{[0,1,2,3].map(j=><path key={j} d={`M${b.x+b.width-5} ${top+40+j*10}h5v3h-3v3h-2Z`}/>)}</g>}
        <path d={outline} fill={`url(#${id}-haze)`}/>
      </g>;
    })}
  </svg>;
}
export function FarSkyline() { return <Skyline depth="far"/>; }
export function MidSkyline() { return <Skyline depth="mid"/>; }
export function NearBuildings() { return <Skyline depth="near"/>; }
