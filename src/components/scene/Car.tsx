export function RearCar() {
  return <svg className="raster-rear-car" viewBox="0 0 440 240" aria-hidden="true">
    <ellipse cx="220" cy="221" rx="139" ry="10" fill="#070a12" opacity=".55"/>
    <image href="/assets/cars/rear.webp" x="80" y="35" width="280" height="183"/>
    <g className="brake-lights raster-brakes" fill="#ff3658" opacity=".45">
      <path d="M128 98H167V119H128Z M273 98H312V119H273Z"/>
    </g>
  </svg>;
}
