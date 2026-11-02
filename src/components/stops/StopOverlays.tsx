import type { CSSProperties } from 'react';
import { stopLabels, type StopConfig, type OverlayRect } from '../../data/stops';
function rectStyle(rect: OverlayRect): CSSProperties {
  return { left: `${rect.x}%`, top: `${rect.y}%`, width: `${rect.width}%`, height: `${rect.height}%` };
}
export function StopOverlays({ stop, debug }: { stop: StopConfig; debug: boolean }) {
  return <div className={`stop-overlays ${debug ? 'debug-rects' : ''}`} aria-hidden="true">
    {stop.overlays.map(rect => <div key={rect.id} className={`overlay-rect overlay-${rect.kind}`} style={rectStyle(rect)} data-overlay={rect.id}>
      {rect.kind === 'vacancy' && <div className="vacancy-plate"><span className="vacancy-open">{stopLabels.vacancy}</span><span className="vacancy-full">{stopLabels.full}</span></div>}
      {rect.kind === 'window' && <><span className="window-dark"/><span className="window-warm"/></>}
      {rect.kind === 'blade' && <div className="blade-crop"><img src={stop.building.src} alt="" decoding="async" style={{ position: 'absolute', width: `${10000 / rect.width}%`, height: `${10000 / rect.height}%`, maxWidth: 'none', left: `${-rect.x / rect.width * 100}%`, top: `${-rect.y / rect.height * 100}%` }}/></div>}
      {rect.kind === 'neon' && <span className="neon-glow"/>}
      {rect.kind === 'status' && <span className="door-status"/>}
      {rect.kind === 'interior' && <span className="interior-glow"/>}
      {rect.kind === 'signal' && <><span className="signal-dark"/><span className={`signal-glow signal-${rect.id}`}/></>}
      {rect.kind === 'chute' && <span className={`chute-glow chute-${rect.id}`}/>}
      {rect.kind === 'led' && <span className="rack-led"/>}
      {rect.kind === 'fascia' && <span className="fascia-glow"/>}
      {rect.kind === 'barrier' && <span className="barrier-glow"/>}
      {rect.kind === 'dish' && <svg className="dish-waves" viewBox="0 0 80 80"><path d="M10 70 A60 60 0 0 1 70 10"/><path d="M10 70 A60 60 0 0 1 70 10"/></svg>}
      {debug && <span className="overlay-debug-label">{rect.id}</span>}
    </div>)}
  </div>;
}
export function OrderTickets({ rect }: { rect: OverlayRect }) {
  return <div className="ticket-anchor" aria-hidden="true">
    <svg className="ticket-route" viewBox="0 0 100 100" preserveAspectRatio="none"><path d={`M${rect.x} ${rect.y} Q112 15 106 110`} fill="none" stroke="#ffc28b" strokeWidth=".22" strokeDasharray=".6 1.4"/></svg>
    {Array.from({length:6},(_,i) => <span key={i} className="order-ticket" style={{ left: `${rect.x}%`, top: `${rect.y}%` }}/>) }
  </div>;
}
