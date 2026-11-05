function Wheel({ x }: { x: number }) {
  return <g transform={`translate(${x} 151)`}><g className="sprite-wheel"><image href="/assets/cars/wheel.webp" x="-44" y="-44" width="88" height="88"/></g></g>;
}
export function SideCar() {
  return <svg className="raster-side-car" viewBox="0 0 660 235" aria-hidden="true">
    <g transform="translate(660 0) scale(-1 1)">
      <image href="/assets/cars/side.webp" x="50" y="24" width="560" height="151"/>
      <Wheel x={167}/><Wheel x={491}/>
      <path className="brake-lights" d="M553 109H582V113H553Z" fill="#ff3b62" opacity=".55"/>
    </g>
  </svg>;
}
