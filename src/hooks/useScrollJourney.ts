import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSceneStore } from '../state/useSceneStore';
import { readHash, routeOrder } from './useJourney';
gsap.registerPlugin(ScrollTrigger);
export function useScrollJourney(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let syncing = true;
    let frame = 0;
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    const trigger = ScrollTrigger.create({ start: 0, end: () => (routeOrder.length-1) * innerHeight, invalidateOnRefresh: true, onUpdate: self => {
      if (syncing) return;
      const section = routeOrder[Math.round(self.progress * (routeOrder.length-1))];
      if (section !== useSceneStore.getState().section) { useSceneStore.getState().setSection(section); history.replaceState(null, '', `#${section}`); }
    } });
    const syncHash = () => {
      syncing = true;
      cancelAnimationFrame(frame);
      const section = readHash();
      useSceneStore.getState().setSection(section);
      window.scrollTo({ top: routeOrder.indexOf(section) * innerHeight, behavior: 'instant' });
      frame = requestAnimationFrame(() => { trigger.refresh(); syncing = false; trigger.update(); });
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('resize', syncHash);
    return () => { trigger.kill(); cancelAnimationFrame(frame); window.removeEventListener('hashchange', syncHash); window.removeEventListener('resize', syncHash); history.scrollRestoration = previousRestoration; };
  }, [enabled]);
}
