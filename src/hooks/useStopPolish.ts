import { useSceneStore } from '../state/useSceneStore';
import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { useStopPreferences } from './useStopAnimations';
export function useStopPolish(ref: RefObject<HTMLDivElement>) {
  const quality=useSceneStore(s=>s.quality);
  const { mobile, reduced, hidden } = useStopPreferences();
  useEffect(() => {
    const root = ref.current;
    if (!root || quality!=='high' || mobile || reduced || hidden || !matchMedia('(pointer:fine)').matches) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-stop-depth]'));
    const movers = nodes.map(node => ({ node, amount: Number(node.dataset.stopDepth), move: gsap.quickTo(node, 'x', {duration:.6,ease:'power2.out'}) }));
    const move = (event: PointerEvent) => { if(event.pointerType !== 'touch') movers.forEach(item => item.move((event.clientX/innerWidth*2-1)*item.amount)); };
    const reset = () => movers.forEach(item => item.move(0));
    window.addEventListener('pointermove',move,{passive:true});
    document.addEventListener('pointerleave',reset);
    return () => { window.removeEventListener('pointermove',move); document.removeEventListener('pointerleave',reset); movers.forEach(item=>item.move.tween.kill()); gsap.set(nodes,{clearProps:'transform'}); };
  },[ref,mobile,reduced,hidden,quality]);
}
