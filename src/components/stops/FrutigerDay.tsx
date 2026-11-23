import { useEffect, useRef, type CSSProperties } from 'react';
import type { OverlayRect } from '../../data/stops';
import { useStopPreferences } from '../../hooks/useStopAnimations';
import { useFrutigerEffects } from './FrutigerControls';
import './frutiger-day.css';

const sprite = (name: string) => `/assets/stops/frutiger-sprites/${name}.webp`;
type EffectStyle = CSSProperties & Record<`--${string}`, string | number>;
const cloudCount = 8;
const bubbleCount = 10;
const sparklePositions = [[5, 76], [18, 28], [33, 68], [45, 16], [61, 46], [79, 24], [94, 72]];

function Wings() {
  return <>
    <img className="day-wing-open" src={sprite('butterfly-open')} alt="" />
    <img className="day-wing-closed" src={sprite('butterfly-closed')} alt="" />
  </>;
}

export function FrutigerSky({ active }: { active: boolean }) {
  const sky = useRef<HTMLDivElement>(null);
  const { quality, motion } = useFrutigerEffects();
  const { reduced, hidden, mobile } = useStopPreferences();

  useEffect(() => {
    const layer = sky.current;
    if (!layer || !active || reduced || mobile || hidden || !motion || quality !== 'high') return;
    function track(event: PointerEvent) {
      if (event.pointerType === 'touch' || !layer) return;
      layer.style.setProperty('--lens-x', `${(event.clientX / innerWidth * 2 - 1) * 8}px`);
      layer.style.setProperty('--lens-y', `${(event.clientY / innerHeight * 2 - 1) * 8}px`);
    }
    window.addEventListener('pointermove', track, { passive: true });
    return () => {
      window.removeEventListener('pointermove', track);
      layer.style.removeProperty('--lens-x');
      layer.style.removeProperty('--lens-y');
    };
  }, [active, reduced, mobile, hidden, quality, motion]);

  return <div className="day-sky" ref={sky} aria-hidden="true">
    <div className="day-sun" />
    <div className="day-lens">{[0, 1, 2].map(i => <i key={i} />)}</div>
    <div className="day-clouds">
      {Array.from({ length: mobile ? 4 : cloudCount }, (_, i) => {
        const style: EffectStyle = { '--cloud-speed': `${47 + i * 6}s`, '--cloud-delay': `-${9 + i * 12}s`, '--depth': .1 + i % 3 * .1 };
        return <div key={i} className="day-cloud-depth" style={style}>
          <img className="day-cloud" src={sprite(`cloud-${i % 5 + 1}`)} alt="" />
        </div>;
      })}
    </div>
    <img className="day-backdrop" src="/assets/stops/frutiger-backdrop.webp" alt="" />
    <div className="day-flyer"><div className="day-bob"><Wings /></div></div>
  </div>;
}

export function FrutigerBubbles() {
  const quality = useFrutigerEffects(state => state.quality);
  const { mobile } = useStopPreferences();
  const count = mobile || quality === 'medium' ? 5 : bubbleCount;
  return <div className="day-bubbles" aria-hidden="true">
    {Array.from({ length: count }, (_, i) => {
      const style: EffectStyle = {
        '--bubble-size': `${[14, 22, 32, 45, 64, 90, 27, 37, 52, 71][i]}px`,
        '--bubble-life': `${7 + i % 8}s`,
        '--bubble-delay': `-${i * 1.7 + 1}s`,
        '--bubble-x': `${4 + (i * 29) % 92}%`,
        '--bubble-y': `${88 - (i * 7) % 26}%`,
        '--wobble': `${i % 2 ? 12 : -12}px`,
      };
      return <i className="day-bubble" key={i} style={style} />;
    })}
  </div>;
}

export function FrutigerDetail({ rect, title }: { rect: OverlayRect; title: string }) {
  switch (rect.kind) {
    case 'day-sign': return <span className="day-fascia">{title}</span>;
    case 'day-glass': return <i className="day-glass-sheen" />;
    case 'day-water': return <i className="day-water-sheen" />;
    case 'day-roof': return <div className="day-perched"><Wings /></div>;
    case 'day-sparkles':
      return sparklePositions.map(([x, y], i) => {
        const style: EffectStyle = { left: `${x}%`, top: `${y}%`, '--sparkle-delay': `-${i * .63 + rect.x * .1}s`, '--sparkle-period': `${2.5 + i % 4 * .6}s` };
        return <img key={i} className="day-sparkle" src={sprite(`sparkle-${i % 3 + 1}`)} alt="" style={style} />;
      });
    default: return null;
  }
}
