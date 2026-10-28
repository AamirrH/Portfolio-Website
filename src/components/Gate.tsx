import { useEffect, useRef, useState } from 'react';
import { content } from '../data/content';
import { useSceneStore } from '../state/useSceneStore';
import { useAudio } from '../audio/AudioProvider';
export function Gate() {
  const [starting, setStarting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const { unlock } = useAudio();
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const art = Array.from(document.querySelectorAll<HTMLImageElement>('.layer-art')).map(img => img.decode().catch(() => {}));
    void Promise.allSettled([document.fonts.ready, ...art]);
    return () => { document.body.style.overflow = previous; clearTimeout(timer.current); };
  }, []);
  const start = () => {
    if (starting) return;
    unlock(); setStarting(true);
    timer.current = setTimeout(() => useSceneStore.getState().ignite(), 950);
  };
  return <div ref={ref} className={`gate ${starting ? 'starting' : ''}`} role="dialog" aria-modal="true" aria-labelledby="gate-title" onKeyDown={event => {
    if (event.key === 'Tab') { const buttons = ref.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'); if (buttons?.length) { event.preventDefault(); const index = Array.from(buttons).indexOf(document.activeElement as HTMLButtonElement); buttons[(index+(event.shiftKey ? -1 : 1)+buttons.length)%buttons.length].focus(); } }
  }}><div className="gate-grid"/><div className="gate-sun"/><p className="gate-brand eyebrow">{content.brand.name}<span> / </span>{content.brand.subline}</p><div className="gate-center"><p className="eyebrow accent">{content.gate.eyebrow}</p><h1 id="gate-title">{content.gate.title}</h1><p className="gate-subtitle">{content.gate.subtitle}</p><button className="ignite-button" onClick={start} disabled={starting}><span className="key-slot" aria-hidden="true"><span/></span><span>{starting ? content.gate.starting : content.gate.ignite}</span><span aria-hidden="true">↗</span></button><p className="gate-hint">{content.gate.hint}</p><button className="quiet-route" onClick={() => { useSceneStore.getState().setPlain(true); useSceneStore.getState().ignite(); }}>{content.gate.plain} →</button></div><p className="gate-audio eyebrow">{content.gate.audio}</p></div>;
}
