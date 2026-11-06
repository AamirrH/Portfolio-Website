import { useEffect, useLayoutEffect, useState, type RefObject } from 'react';
import gsap from 'gsap';
import { type StopConfig } from '../data/stops';
import { useSceneStore } from '../state/useSceneStore';

export function useStopPreferences() {
  const read = () => ({ reduced: matchMedia('(prefers-reduced-motion: reduce)').matches, mobile: matchMedia('(max-width: 767px)').matches, hidden: document.hidden });
  const [preferences, setPreferences] = useState(read);
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)'), mobile = matchMedia('(max-width: 767px)');
    const update = () => setPreferences(read());
    reduced.addEventListener('change', update); mobile.addEventListener('change', update); document.addEventListener('visibilitychange', update);
    return () => { reduced.removeEventListener('change', update); mobile.removeEventListener('change', update); document.removeEventListener('visibilitychange', update); };
  }, []);
  return preferences;
}

export function useStopAnimations(ref: RefObject<HTMLDivElement>, stop: StopConfig) {
  const ignited = useSceneStore(state => state.ignited);
  const section = useSceneStore(state => state.section);
  const plain = useSceneStore(state => state.plain);
  const { reduced, mobile, hidden } = useStopPreferences();
  const active = ignited && !plain && section === stop.id;
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !active) return;
    if (reduced) { root.dataset.arrived = 'true'; return; }
    root.dataset.arrived = 'false';
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ onComplete: () => { root.dataset.arrived = 'true'; } });
      timeline.fromTo('.parked-car', { x: -innerWidth * .6, y: 2, scaleY: .985 }, { x: 0, y: 0, scaleY: 1, duration: 1.2, ease: 'power3.out', transformOrigin: '50% 83%' }, 0);
      timeline.fromTo('.car-reflection', { x: -innerWidth * .6, opacity: 0 }, { x: 0, opacity: .3, duration: 1.2, ease: 'power3.out' }, 0);
      timeline.fromTo('.building-arrival', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'power3.out' }, .15);
      timeline.fromTo('.building-reflection', { opacity: 0 }, { opacity: .3, duration: .8 }, .15);
      timeline.fromTo('.parked-car .brake-lights', { opacity: .2 }, { opacity: 1, duration: .15 }, .05).to('.parked-car .brake-lights', { opacity: .65, duration: .6 }, .6);
    }, root);
    return () => { ctx.revert(); };
  }, [ref, active, reduced]);

  useEffect(() => {
    const root = ref.current;
    if (!root || !active || reduced || hidden) return;
    let disposed = false;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const tweens = new Set<gsap.core.Animation>();
    const diagnostics = () => { root.dataset.timerCount = String(timers.size); root.dataset.tweenCount = String(tweens.size); };
    const later = (callback: () => void, ms: number) => {
      const timer = setTimeout(() => { timers.delete(timer); diagnostics(); if (!disposed) callback(); }, ms);
      timers.add(timer); diagnostics();
    };
    const repeat = (callback: () => void, min: number, max: number) => {
      const next = () => later(() => { callback(); next(); }, min + Math.random() * (max-min));
      next();
    };
    const animate = (target: gsap.TweenTarget, vars: gsap.TweenVars) => {
      const tween = gsap.to(target, { ...vars, onComplete: () => { tweens.delete(tween); diagnostics(); } });
      tweens.add(tween); diagnostics();
    };
    const windows = Array.from(root.querySelectorAll<HTMLElement>('.overlay-window')).slice(0, mobile ? 3 : 10);
    const darkWindows = new Set<HTMLElement>();
    if (windows.length) repeat(() => {
      const window = windows[Math.floor(Math.random() * windows.length)];
      const dark = !darkWindows.has(window);
      if (dark) darkWindows.add(window); else darkWindows.delete(window);
      animate(window.querySelector('.window-dark'), { opacity: dark ? .82 : 0, duration: .4, overwrite: true });
      animate(window.querySelector('.window-warm'), { opacity: dark ? 0 : .55, duration: .4, overwrite: true });
    }, 1200, 3000);
    if (stop.id === 'roomly') repeat(() => {
      animate(root.querySelector('.vacancy-open'), { opacity: 0, duration: .08 });
      animate(root.querySelector('.vacancy-full'), { opacity: 1, duration: .12 });
      later(() => { animate(root.querySelector('.vacancy-full'), { opacity: .2, duration: .05 }); later(() => animate(root.querySelector('.vacancy-full'), { opacity: 1, duration: .06 }), 90); }, 120);
      later(() => { animate(root.querySelector('.vacancy-full'), { opacity: 0, duration: .1 }); animate(root.querySelector('.vacancy-open'), { opacity: 1, duration: .15 }); }, 1800);
    }, 5000, 9000);
    if (stop.id === 'swiftship') {
      repeat(() => {
        animate(root.querySelectorAll('.interior-grade,.spill-secondary'), { opacity: .9, duration: .15 });
        later(() => animate(root.querySelectorAll('.interior-grade,.spill-secondary'), {opacity:1,duration:.4}), 180);
      },5000,9000);
      repeat(() => {
        const neon = root.querySelectorAll('.neon-glow,.stop-swiftship .spill-main');
        animate(neon, { opacity: .08, duration: .03 });
        later(() => animate(neon, { opacity: .9, duration: .03 }), 100);
        later(() => animate(neon, { opacity: .2, duration: .03 }), 180);
        later(() => animate(neon, { opacity: .8, duration: .06 }), 260);
      }, 6000, 10000);
      if (!mobile) {
        const tickets = Array.from(root.querySelectorAll<HTMLElement>('.order-ticket'));
        const origin = stop.overlays.find(rect => rect.kind === 'tickets');
        let index = 0;
        if (origin && tickets.length) repeat(() => {
          const ticket = tickets[index++ % tickets.length];
          const box = ticket.parentElement!.getBoundingClientRect();
          const travel = { progress: 0 };
          gsap.set(ticket, { opacity: 0, x: 0, y: 0 });
          animate(travel, { progress: 1, duration: 1.4, ease: 'none', onUpdate: () => {
            const t = travel.progress, u = 1-t;
            const x = u*u*origin.x + 2*u*t*112 + t*t*106;
            const y = u*u*origin.y + 2*u*t*15 + t*t*110;
            gsap.set(ticket, { x: (x-origin.x)/100*box.width, y: (y-origin.y)/100*box.height, opacity: Math.sin(Math.PI*t)*.65 });
          } });
        }, 1200, 2000);
      }
    }
    diagnostics();
    return () => {
      disposed = true; timers.forEach(clearTimeout); timers.clear(); tweens.forEach(tween => tween.kill()); tweens.clear(); diagnostics();
      gsap.set(root.querySelectorAll('.window-dark,.window-warm,.vacancy-full,.order-ticket'), { clearProps: 'transform,opacity' });
      gsap.set(root.querySelectorAll('.vacancy-open,.neon-glow,.interior-grade,.spill-secondary,.spill-main'), { clearProps: 'opacity' });
    };
  }, [ref, stop, active, reduced, mobile, hidden]);
}
