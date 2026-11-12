import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { content } from '../../data/content';

const MAX_TURN = 120;
const STEP_ANGLE = 35;
const clamp = (angle: number) => Math.max(-MAX_TURN, Math.min(MAX_TURN, angle));
const normalize = (angle: number) => ((angle + 540) % 360) - 180;

export function SteeringWheel({ onStep, activeGroup }: { onStep: (direction: -1 | 1) => void; activeGroup: string }) {
  const wheel = useRef<HTMLButtonElement>(null);
  const rotation = useRef(0);
  const drag = useRef<{ pointerId: number; startAngle: number; lastStep: number } | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

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
      const direction = event.key === 'ArrowLeft' ? -1 : 1;
      onStep(direction);
      turn(direction * STEP_ANGLE);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => turn(0), 300);
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
    aria-valuetext={activeGroup}
    onPointerDown={event => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      if (resetTimer.current) clearTimeout(resetTimer.current);
      turn(0);
      drag.current = { pointerId: event.pointerId, startAngle: pointerAngle(event), lastStep: 0 };
      event.currentTarget.setPointerCapture(event.pointerId);
    }}
    onPointerMove={event => {
      const state = drag.current;
      if (!state || state.pointerId !== event.pointerId) return;
      const angle = clamp(normalize(pointerAngle(event) - state.startAngle));
      turn(angle, true);
      const step = Math.trunc(angle / STEP_ANGLE);
      while (state.lastStep !== step) {
        const direction = step > state.lastStep ? 1 : -1;
        onStep(direction);
        state.lastStep += direction;
      }
    }}
    onPointerUp={finish}
    onPointerCancel={finish}
    onKeyDown={onKeyDown}
  ><img src="/assets/cockpit/steering-wheel.webp" alt="" width="720" height="723" draggable="false" decoding="async"/></button>;
}
