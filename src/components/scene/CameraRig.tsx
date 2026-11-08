import { decodeScene } from '../../lib/idle';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, lazy, Suspense, type ComponentType } from 'react';
import gsap from 'gsap';
import { useSceneStore, type CameraPreset } from '../../state/useSceneStore';
import { cameraPresets } from '../../scene/cameraPresets';
import { TRANSITION_DURATION } from '../../config';
const RearScene=lazy(()=>import('./TravelScenes').then(m=>({default:m.RearScene})));
const DashScene=lazy(()=>import('./TravelScenes').then(m=>({default:m.DashScene})));
const AerialScene=lazy(()=>import('./TravelScenes').then(m=>({default:m.AerialScene})));
const RoomlyStop=lazy(()=>import('../stops/ProjectStops').then(m=>({default:m.RoomlyStop})));
const SwiftShipStop=lazy(()=>import('../stops/ProjectStops').then(m=>({default:m.SwiftShipStop})));
const SignalRouteStop=lazy(()=>import('../stops/ProjectStops').then(m=>({default:m.SignalRouteStop})));
import { Overlay } from './Overlay';
import { SceneLayer } from './SceneLayer';
type SceneId = 'rear' | 'dash' | 'aerial' | 'roomly' | 'swiftship' | 'signalroute';
const scenes: Record<SceneId, ComponentType> = { rear: RearScene, dash: DashScene, aerial: AerialScene, roomly: RoomlyStop, swiftship: SwiftShipStop, signalroute: SignalRouteStop };
function SceneFrame({ id, active, remove }: { id: SceneId; active: boolean; remove: (id: SceneId) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const motion=useSceneStore(state=>state.motion);
  useLayoutEffect(() => {
    let cancelled=false;let tween:gsap.core.Tween|undefined;
    const start=()=>{if(cancelled)return;tween = gsap.to(ref.current, { opacity: active ? 1 : 0, duration: !motion || matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : TRANSITION_DURATION,
      ease: 'power3.inOut', onComplete: () => { if (!active) remove(id); } });};
    let observer:MutationObserver|undefined;
    const ready=()=>{if(!ref.current?.querySelector('.travel-scene,.stop-scene'))return;observer?.disconnect();void decodeScene(ref.current).then(start);};
    if(active&&ref.current){observer=new MutationObserver(ready);observer.observe(ref.current,{childList:true,subtree:true});ready();}else start();
    return () => { cancelled=true;observer?.disconnect();tween?.kill(); };
  }, [id, active, remove, motion]);
  const Component = scenes[id];
  return <div ref={ref} className="scene-frame" data-scene={id} data-active={active} style={{ zIndex: active ? 2 : 1 }}><Suspense fallback={null}><Component/></Suspense></div>;
}
export function CameraRig() {
  const section = useSceneStore(state => state.section);
  const target: SceneId = section === 'home' || section === 'projects' ? 'rear' : section === 'about' ? 'dash' : section === 'contact' ? 'rear' : section;
  const [mounted, setMounted] = useState<SceneId[]>([target]);
  const targetRef = useRef(target);
  targetRef.current = target;
  const remove = useCallback((id: SceneId) => { if (targetRef.current !== id) setMounted(current => current.filter(scene => scene !== id)); }, []);
  useLayoutEffect(() => {
    setMounted(current => current.includes(target) ? current : [...current, target]);
    const camera: CameraPreset = target === 'roomly' || target === 'swiftship' || target === 'signalroute' ? 'side' : target;
    useSceneStore.getState().setCamera(camera);
    useSceneStore.getState().setSpeed(cameraPresets[camera].speed);
  }, [target]);
  useEffect(() => {
    const visibility = () => { document.documentElement.classList.toggle('tab-hidden', document.hidden); gsap.globalTimeline.paused(document.hidden); };
    visibility(); document.addEventListener('visibilitychange', visibility);
    return () => { document.removeEventListener('visibilitychange', visibility); gsap.globalTimeline.resume(); };
  }, []);
  return <div className="scene camera-rig">{mounted.map(id => <SceneFrame key={id} id={id} active={id === target} remove={remove}/>)}<div className="speed-streaks"/><SceneLayer name="overlay"><Overlay/></SceneLayer></div>;
}
