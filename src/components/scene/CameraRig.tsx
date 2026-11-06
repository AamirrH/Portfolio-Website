import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { useSceneStore, type CameraPreset } from '../../state/useSceneStore';
import { cameraPresets } from '../../scene/cameraPresets';
import { TRANSITION_DURATION } from '../../config';
import { RearScene, DashScene, AerialScene } from './TravelScenes';
import { RoomlyStop, SwiftShipStop, SignalRouteStop } from '../stops/ProjectStops';
import { Overlay } from './Overlay';
import { SceneLayer } from './SceneLayer';
type SceneId = 'rear' | 'dash' | 'aerial' | 'roomly' | 'swiftship' | 'signalroute';
const scenes: Record<SceneId, () => ReactNode> = { rear: RearScene, dash: DashScene, aerial: AerialScene, roomly: RoomlyStop, swiftship: SwiftShipStop, signalroute: SignalRouteStop };
function SceneFrame({ id, active, remove }: { id: SceneId; active: boolean; remove: (id: SceneId) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const motion=useSceneStore(state=>state.motion);
  useLayoutEffect(() => {
    const tween = gsap.to(ref.current, { opacity: active ? 1 : 0, duration: !motion || matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : TRANSITION_DURATION,
      ease: 'power3.inOut', onComplete: () => { if (!active) remove(id); } });
    return () => { tween.kill(); };
  }, [id, active, remove, motion]);
  const Component = scenes[id];
  return <div ref={ref} className="scene-frame" data-scene={id} data-active={active} style={{ zIndex: active ? 2 : 1 }}><Component/></div>;
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
