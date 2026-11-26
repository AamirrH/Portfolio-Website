import { lazy, Suspense, useSyncExternalStore } from 'react';
import { useSceneStore } from './state/useSceneStore';

const DesktopPortfolio = lazy(() => import('./DesktopPortfolio'));
const RoadTrip = lazy(() => import('./components/views/RoadTrip'));
const mobileViewport = matchMedia('(max-width: 767px), (hover: none) and (pointer: coarse) and (max-height: 600px)');

const isMobileViewport = () => mobileViewport.matches;

function subscribeToViewport(update: () => void) {
  const onChange = () => {
    // Mobile scrolling tracks the visible stop without writing to browser history.
    // Carry it through to the other layout when the viewport changes.
    const { section } = useSceneStore.getState();
    history.replaceState(history.state, '', `#${section}`);
    update();
  };
  mobileViewport.addEventListener('change', onChange);
  return () => mobileViewport.removeEventListener('change', onChange);
}

export default function App() {
  const mobile = useSyncExternalStore(subscribeToViewport, isMobileViewport);
  return <Suspense fallback={null}>{mobile ? <RoadTrip/> : <DesktopPortfolio/>}</Suspense>;
}
