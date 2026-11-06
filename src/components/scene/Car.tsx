import { useId } from 'react';

export function RearCar({ sunset = false }: { sunset?: boolean }) {
  const id = useId().replace(/:/g, '');
  return <svg className="raster-rear-car" viewBox="0 0 440 240" aria-hidden="true">
    <g transform="translate(220 221) scale(1.35 1.08) translate(-220 -221)">
    <ellipse cx="220" cy="221" rx="139" ry="10" fill="#070a12" opacity=".55"/>
    <image href="/assets/cars/rear.webp" x="80" y="35" width="280" height="183"/>
    {sunset && <>
      <defs>
        <mask id={`${id}-body`}><image href="/assets/cars/rear.webp" x="80" y="35" width="280" height="183" style={{filter:'brightness(0) invert(1)'}}/></mask>
        <linearGradient id={`${id}-sunlight`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffe3a1" stopOpacity=".5"/><stop offset=".38" stopColor="#ffaf70" stopOpacity=".16"/><stop offset=".75" stopColor="#ffaf70" stopOpacity="0"/></linearGradient>
      </defs>
      <rect x="80" y="35" width="280" height="183" fill={`url(#${id}-sunlight)`} mask={`url(#${id}-body)`} style={{mixBlendMode:'screen'}}/>
    </>}
    <g className="brake-lights raster-brakes" fill="#ff3658" opacity=".45">
      <path d="M128 98H167V119H128Z M273 98H312V119H273Z"/>
    </g>
    </g>
  </svg>;
}
