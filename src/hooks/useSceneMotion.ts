import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { useSceneStore } from '../state/useSceneStore';
import { BPM } from '../config';
export function useSceneMotion(ref: RefObject<HTMLDivElement>) {
  const quality=useSceneStore(s=>s.quality);
  const motion=useSceneStore(state=>state.motion);
  const speed = useSceneStore(state => state.speed);
  useEffect(() => {
    const scene = ref.current;
    if (!scene) return;
    if (scene.classList.contains('rear-scene')) scene.style.setProperty('--suspension-amplitude', String(Math.min(1.3, Math.max(.25, speed))));
    scene.style.setProperty('--road-duration', `${1.6 / Math.max(.01, speed)}s`);
    scene.style.setProperty('--wheel-duration', `${.65 / Math.max(.01, speed)}s`);
    scene.style.setProperty('--pulse-duration', `${60 / BPM}s`);
  }, [speed, ref]);
  useEffect(() => {
    const scene = ref.current;
    if (!scene) return;
    if (!motion||quality!=='high') return;
    const mq = matchMedia('(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const movers = Array.from(scene.querySelectorAll<HTMLElement>('[data-depth]')).map(layer => ({ depth: Number(layer.dataset.depth), x: gsap.quickTo(layer, 'x', { duration: .6, ease: 'power2.out' }), y: gsap.quickTo(layer, 'y', { duration: .6, ease: 'power2.out' }) }));
    const move = (event: PointerEvent) => {
      if (!useSceneStore.getState().motion || !mq.matches || document.hidden || event.pointerType === 'touch') return;
      const x = (event.clientX / innerWidth - .5) * 16;
      const y = (event.clientY / innerHeight - .5) * 9;
      movers.forEach(mover => { mover.x(x * mover.depth); mover.y(y * mover.depth); });
    };
    const reset = () => movers.forEach(mover => { mover.x(0); mover.y(0); });
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', reset);
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', reset); movers.forEach(mover => { mover.x.tween.kill(); mover.y.tween.kill(); }); };
  }, [ref,motion,quality]);
}
