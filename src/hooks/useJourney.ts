import { useEffect } from 'react';
import { content, type Section } from '../data/content';
import { useSceneStore } from '../state/useSceneStore';
export const routeOrder: Section[] = ['home', 'projects', 'roomly', 'swiftship', 'signalroute', 'about', 'contact'];
export function readHash(): Section { const value = location.hash.slice(1); return Object.hasOwn(content.sectionNames, value) ? value as Section : 'home'; }
export function navigate(section: Section) { if (readHash() !== section || !location.hash) location.hash = section; }
export function stepSection(direction: number) { const current = useSceneStore.getState().section; const index = Math.max(0, Math.min(routeOrder.length - 1, routeOrder.indexOf(current) + direction)); navigate(routeOrder[index]); }
export function useJourney() {
  useEffect(() => {
    const update = () => { useSceneStore.getState().setSection(readHash()); };
    update();
    const key = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented || useSceneStore.getState().plain) return;
      if ((event.target as HTMLElement).closest('input,textarea,select,[contenteditable="true"]')) return;
      if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) { event.preventDefault(); stepSection(event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1); }
    };
    window.addEventListener('hashchange', update);
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('hashchange', update); window.removeEventListener('keydown', key); };
  }, []);
}
