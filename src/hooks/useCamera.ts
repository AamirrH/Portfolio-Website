import { useLayoutEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { useSceneStore, type CameraPreset } from '../state/useSceneStore';
import { cameraPresets } from '../scene/cameraPresets';
import { TRANSITION_DURATION } from '../config';
import type { LayerName } from '../components/scene/LayerArt';
export function useCamera(ref: RefObject<HTMLDivElement>) {
  const section = useSceneStore(state => state.section);
  const first = useRef(true);
  const camera: CameraPreset = ['roomly','swiftship','signalroute'].includes(section) ? 'side' : section === 'about' ? 'dash' : section === 'contact' ? 'aerial' : 'rear';
  useLayoutEffect(() => {
    const scene = ref.current;
    if (!scene) return;
    const preset = cameraPresets[camera];
    const duration = first.current || matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : TRANSITION_DURATION;
    first.current = false;
    useSceneStore.getState().setCamera(camera);
    useSceneStore.getState().setSpeed(preset.speed);
    scene.dataset.camera = camera;
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { duration, ease: 'power3.inOut' } });
      for (const [name, config] of Object.entries(preset.layers) as [LayerName, typeof preset.layers[LayerName]][]) {
        const { blur, ...transform } = config;
        // Blur is static; only transform and opacity are tweened.
        gsap.set(`[data-layer="${name}"]`, { filter: blur ? `blur(${blur}px)` : 'none' });
        timeline.to(`[data-layer="${name}"]`, transform, 0);
      }
      timeline.to('.rear-road', { opacity: camera === 'side' ? 0 : 1 }, 0);
      timeline.to('.side-road', { opacity: camera === 'side' ? 1 : 0 }, 0);
      timeline.to('.cockpit', { opacity: camera === 'dash' ? 1 : 0, yPercent: camera === 'dash' ? 0 : 100 }, 0);
      if (duration) timeline.fromTo('.speed-streaks', { opacity: 0, scaleX: .7 }, { opacity: .55, scaleX: 1.1, duration: duration / 2, repeat: 1, yoyo: true }, 0);
    }, scene);
    // Retain the current pose so an interrupted camera move starts from that pose.
    return () => ctx.kill(false);
  }, [camera, ref]);
}
