import { decodeScene } from '../../lib/idle';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, lazy, Suspense, type ComponentType } from 'react';
import gsap from 'gsap';
import { useSceneStore, type CameraPreset } from '../../state/useSceneStore';
import { cameraPresets } from '../../scene/cameraPresets';
import { TRANSITION_DURATION } from '../../config';
import type { ProjectId } from '../../data/content';
import { useFrutigerEffects } from '../stops/FrutigerControls';
const RearScene=lazy(()=>import('./TravelScenes').then(m=>({default:m.RearScene})));
const DashScene=lazy(()=>import('./TravelScenes').then(m=>({default:m.DashScene})));
const AerialScene=lazy(()=>import('./TravelScenes').then(m=>({default:m.AerialScene})));
const RoomlyStop=lazy(()=>import('../stops/ProjectStops').then(m=>({default:m.RoomlyStop})));
const SwiftShipStop=lazy(()=>import('../stops/ProjectStops').then(m=>({default:m.SwiftShipStop})));
const SignalRouteStop=lazy(()=>import('../stops/ProjectStops').then(m=>({default:m.SignalRouteStop})));
const FrutigerStop=lazy(()=>import('../stops/ProjectStops').then(m=>({default:m.FrutigerStop})));
import { Overlay } from './Overlay';
import { SceneLayer } from './SceneLayer';
type SceneId = 'rear' | 'dash' | 'aerial' | ProjectId;
const daylightId = 'frutiger-aero';
const scenes: Record<SceneId, ComponentType> = { rear: RearScene, dash: DashScene, aerial: AerialScene, roomly: RoomlyStop, swiftship: SwiftShipStop, signalroute: SignalRouteStop, [daylightId]: FrutigerStop };

function snapshotSky(from: HTMLElement, to: HTMLElement) {
  const source = from.firstElementChild;
  const destination = to.firstElementChild;
  if (!(source instanceof HTMLElement) || !(destination instanceof HTMLElement)) return;
  const sky = source.cloneNode(false) as HTMLElement;
  sky.classList.add('day-sky-snapshot');
  sky.removeAttribute('data-stop');
  sky.setAttribute('aria-hidden', 'true');
  const layers = source.querySelectorAll(':scope > :is(.day-sky,.layer-sky,.layer-sun,.layer-far-skyline,.layer-mid-skyline,.layer-near-buildings,.stop-city-near)');
  for (const layer of layers) {
    const copy = layer.cloneNode(true) as HTMLElement;
    copy.querySelector('.day-flyer')?.remove();
    sky.append(copy);
  }
  const foreground = destination.querySelector(':scope > :is(.building-anchor,.layer-highway)');
  destination.insertBefore(sky, foreground);
  return sky;
}

function SceneFrame({ id, active, remove, hold, dayTransition, bloom }: {
  id: SceneId;
  active: boolean;
  remove: (id: SceneId) => void;
  hold: boolean;
  dayTransition: { from: SceneId; to: SceneId } | null;
  bloom: HTMLDivElement | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const motion=useSceneStore(state=>state.motion);
  useLayoutEffect(() => {
    if (hold) return;
    let cancelled=false;let tween:gsap.core.Tween|undefined;
    let flash: gsap.core.Timeline | undefined;
    let snapshot: HTMLElement | undefined;
    let outgoing: HTMLElement | null | undefined;
    const start=()=>{
      if(cancelled)return;
      const crossing = active && dayTransition?.to === id ? dayTransition : null;
      const day = useFrutigerEffects.getState();
      const staticDay = crossing && (!day.motion || day.quality === 'low');
      const duration = !motion || staticDay || matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : TRANSITION_DURATION;
      const frame = ref.current;
      if (!frame) return;
      if (crossing && duration) {
        outgoing = frame.parentElement?.querySelector<HTMLElement>(`.scene-frame[data-scene="${crossing.from}"]`);
        if (outgoing) snapshot = snapshotSky(outgoing, frame);
      }
      if (crossing && duration && bloom) {
        flash = gsap.timeline()
          .fromTo(bloom, { opacity: 0 }, { opacity: .35, duration: duration / 2, ease: 'sine.inOut' })
          .to(bloom, { opacity: 0, duration: duration / 2, ease: 'sine.inOut' });
      }
      if (snapshot && outgoing) {
        gsap.set(frame, { opacity: 1 });
        outgoing.style.visibility = 'hidden';
      }
      tween = gsap.to(snapshot ?? frame, { opacity: active && !snapshot ? 1 : 0, duration,
        ease: crossing ? 'sine.inOut' : 'power3.inOut',
        onComplete: () => {
          if (!active) remove(id);
          if (crossing) remove(crossing.from);
        }
      });
    };
    let observer:MutationObserver|undefined;
    const ready=()=>{if(!ref.current?.querySelector('.travel-scene,.stop-scene'))return;observer?.disconnect();void decodeScene(ref.current).then(start);};
    if(active&&ref.current){observer=new MutationObserver(ready);observer.observe(ref.current,{childList:true,subtree:true});ready();}else start();
    return () => {
      cancelled = true;
      observer?.disconnect();
      tween?.kill();
      flash?.kill();
      snapshot?.remove();
      if (outgoing) outgoing.style.removeProperty('visibility');
      if (flash && bloom) bloom.style.opacity = '0';
    };
  }, [id, active, remove, motion, hold, dayTransition, bloom]);
  const Component = scenes[id];
  return <div ref={ref} className="scene-frame" data-scene={id} data-active={active} style={{ zIndex: active ? 2 : 1 }}><Suspense fallback={null}><Component/></Suspense></div>;
}
export function CameraRig() {
  const section = useSceneStore(state => state.section);
  const target: SceneId = section === 'home' || section === 'projects' ? 'rear' : section === 'about' ? 'dash' : section === 'contact' ? 'rear' : section;
  const [mounted, setMounted] = useState<SceneId[]>([target]);
  const targetRef = useRef(target);
  targetRef.current = target;
  const previousTarget = useRef(target);
  const [dayTransition, setDayTransition] = useState<{ from: SceneId; to: SceneId } | null>(null);
  const [bloom, setBloom] = useState<HTMLDivElement | null>(null);
  const remove = useCallback((id: SceneId) => { if (targetRef.current !== id) setMounted(current => current.filter(scene => scene !== id)); }, []);
  useLayoutEffect(() => {
    const from = previousTarget.current;
    if (from !== target) {
      setDayTransition(from === daylightId || target === daylightId ? { from, to: target } : null);
      previousTarget.current = target;
    }
    setMounted(current => current.includes(target) ? current : [...current, target]);
    const camera: CameraPreset = target === 'rear' || target === 'dash' ? target : 'side';
    useSceneStore.getState().setCamera(camera);
    useSceneStore.getState().setSpeed(cameraPresets[camera].speed);
  }, [target]);
  useEffect(() => {
    const visibility = () => { document.documentElement.classList.toggle('tab-hidden', document.hidden); gsap.globalTimeline.paused(document.hidden); };
    visibility(); document.addEventListener('visibilitychange', visibility);
    return () => { document.removeEventListener('visibilitychange', visibility); gsap.globalTimeline.resume(); };
  }, []);
  const crossing = dayTransition?.to === target && mounted.includes(dayTransition.from) ? dayTransition : null;
  const daylight = mounted.includes(daylightId);
  return <div className="scene camera-rig" data-daylight={daylight || undefined}>
    {mounted.map(id => <SceneFrame key={id} id={id} active={id === target} remove={remove}
      hold={crossing?.from === id} dayTransition={id === target ? crossing : null} bloom={bloom}/>)}
    <div className="speed-streaks"/>
    <SceneLayer name="overlay"><Overlay/></SceneLayer>
    <div className="day-transition-bloom" ref={setBloom} aria-hidden="true"/>
  </div>;
}
