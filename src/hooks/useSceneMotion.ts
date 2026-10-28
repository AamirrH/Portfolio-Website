import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { useSceneStore } from '../state/useSceneStore';
import { BPM } from '../config';
export function useSceneMotion(ref: RefObject<HTMLDivElement>) {
  const speed = useSceneStore(state => state.speed);
  useEffect(() => {
    const scene = ref.current;
    if (!scene) return;
    scene.style.setProperty('--road-duration', `${1.6 / speed}s`);
    scene.style.setProperty('--wheel-duration', `${.65 / speed}s`);
    scene.style.setProperty('--pulse-duration', `${60 / BPM}s`);
  }, [speed, ref]);
  useEffect(() => {
    const scene = ref.current;
    if (!scene) return;
    const mq = matchMedia('(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const movers = Array.from(scene.querySelectorAll<HTMLElement>('[data-depth]')).map(layer => ({ depth: Number(layer.dataset.depth), x: gsap.quickTo(layer, 'x', { duration: 1.3, ease: 'power2.out' }), y: gsap.quickTo(layer, 'y', { duration: 1.3, ease: 'power2.out' }) }));
    const move = (event: PointerEvent) => {
      if (!mq.matches || document.hidden) return;
      const x = (event.clientX / innerWidth - .5) * 16;
      const y = (event.clientY / innerHeight - .5) * 9;
      movers.forEach(mover => { mover.x(x * mover.depth); mover.y(y * mover.depth); });
    };
    const reset = () => movers.forEach(mover => { mover.x(0); mover.y(0); });
    const visibility = () => { document.documentElement.classList.toggle('tab-hidden', document.hidden); if (document.hidden) gsap.globalTimeline.pause(); else gsap.globalTimeline.resume(); };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', reset);
    document.addEventListener('visibilitychange', visibility);
    visibility();
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', reset); document.removeEventListener('visibilitychange', visibility); movers.forEach(mover => { mover.x.tween.kill(); mover.y.tween.kill(); }); gsap.globalTimeline.resume(); };
  }, [ref]);
}
