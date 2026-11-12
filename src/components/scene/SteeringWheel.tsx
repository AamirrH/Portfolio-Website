import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { content } from '../../data/content';

const MAX_TURN = 120;
const clamp = (angle: number) => Math.max(-MAX_TURN, Math.min(MAX_TURN, angle));
const normalize = (angle: number) => ((angle + 540) % 360) - 180;

export function SteeringWheel() {
  const wheel = useRef<HTMLButtonElement>(null);
  const rotation = useRef(0);
  const drag = useRef<{ pointerId: number; startAngle: number; startRotation: number } | null>(null);

  const pointerAngle = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return Math.atan2(event.clientY - rect.top - rect.height / 2, event.clientX - rect.left - rect.width / 2) * 180 / Math.PI;
  };
  const turn = (angle: number, dragging = false) => {
    const element = wheel.current;
    if (!element) return;
    rotation.current = clamp(angle);
    element.style.transition = dragging ? 'none' : '';
    element.style.transform = `rotate(${rotation.current}deg)`;
    element.setAttribute('aria-valuenow', String(Math.round(rotation.current)));
  };
  const finish = (event: PointerEvent<HTMLButtonElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    turn(0);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      turn(rotation.current + (event.key === 'ArrowLeft' ? -15 : 15));
    } else if (event.key === 'Home') {
      event.preventDefault();
      turn(0);
    }
  };

  return <button
    ref={wheel}
    className="steering-wheel"
    type="button"
    role="slider"
    aria-label={content.about.steeringLabel}
    aria-valuemin={-MAX_TURN}
    aria-valuemax={MAX_TURN}
    aria-valuenow={0}
    onPointerDown={event => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      drag.current = { pointerId: event.pointerId, startAngle: pointerAngle(event), startRotation: rotation.current };
      event.currentTarget.setPointerCapture(event.pointerId);
    }}
    onPointerMove={event => {
      const state = drag.current;
      if (!state || state.pointerId !== event.pointerId) return;
      turn(state.startRotation + normalize(pointerAngle(event) - state.startAngle), true);
    }}
    onPointerUp={finish}
    onPointerCancel={finish}
    onKeyDown={onKeyDown}
  ><img src="/assets/cockpit/steering-wheel.webp" alt="" width="720" height="723" draggable="false" decoding="async"/></button>;
}
