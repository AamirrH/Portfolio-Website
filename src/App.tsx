import { startQualityManager } from './lib/quality';
import { useHighwayState } from './hooks/useHighwayState';
import { useEffect, useState, lazy, Suspense } from 'react';
import { content, projects } from './data/content';
const CameraRig=lazy(()=>import('./components/scene/CameraRig').then(m=>({default:m.CameraRig})));
const TopBar=lazy(()=>import('./components/navigation/TopBar').then(m=>({default:m.TopBar})));
const JourneyFooter=lazy(()=>import('./components/navigation/JourneyFooter').then(m=>({default:m.JourneyFooter})));
const MobileNav=lazy(()=>import('./components/navigation/MobileNav').then(m=>({default:m.MobileNav})));
const Home=lazy(()=>import('./components/views/Home').then(m=>({default:m.Home})));
const ProjectsIndex=lazy(()=>import('./components/views/ProjectsIndex').then(m=>({default:m.ProjectsIndex})));
const ProjectPanel=lazy(()=>import('./components/views/ProjectPanel').then(m=>({default:m.ProjectPanel})));
const About=lazy(()=>import('./components/views/About').then(m=>({default:m.About})));
const Contact=lazy(()=>import('./components/views/Contact').then(m=>({default:m.Contact})));
const PlainMode=lazy(()=>import('./components/views/PlainMode').then(m=>({default:m.PlainMode})));
import { Gate } from './components/Gate';
import { useJourney } from './hooks/useJourney';
import { useScrollJourney } from './hooks/useScrollJourney';
import { usePreferences } from './hooks/usePreferences';
import { useSceneStore } from './state/useSceneStore';
import { useAtmosphere } from './hooks/useAtmosphere';
import { idleTask } from './lib/idle';
export default function App() {
  useEffect(startQualityManager,[]);
  useJourney();
  useHighwayState();
  usePreferences();
  useAtmosphere();
  const ignited = useSceneStore(state => state.ignited);
  const plain = useSceneStore(state => state.plain);
  const section = useSceneStore(state => state.section);
  const [scenePrepared, setScenePrepared] = useState(false);
  useEffect(() => {
    if (ignited) setScenePrepared(true);
    const prepare = () => setScenePrepared(true);
    document.addEventListener('endless:prepare-scene', prepare);
    return () => document.removeEventListener('endless:prepare-scene', prepare);
  }, [ignited]);
  useEffect(() => {
    if (!scenePrepared || plain) return;
    return idleTask(() => {
      void Promise.allSettled([
        import('./components/scene/CameraRig'),
        import('./components/scene/TravelScenes'),
        import('./components/stops/ProjectStops'),
        import('./components/views/ProjectsIndex'),
        import('./components/views/ProjectPanel'),
        import('./components/views/About'),
        import('./components/views/Contact'),
        import('./components/navigation/TopBar'),
        import('./components/navigation/JourneyFooter'),
        import('./components/navigation/MobileNav')
      ]);
      void import('./data/stops').then(({ stops }) => Promise.all(Object.values(stops).map(stop => {
        if (!stop.building.src) return Promise.resolve();
        const image = new Image();
        image.decoding = 'async';
        image.src = stop.building.src;
        return image.decode().catch(() => {});
      })));
    }, 500);
  }, [scenePrepared, plain]);
  const appReady = ignited || scenePrepared;
  useScrollJourney(ignited && !plain);
  const project = projects.find(item => item.id === section);
  useEffect(() => {
    if (!ignited || plain) return;
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [section, ignited, plain]);
  return <>
    <div className={!ignited ? 'pre-ignition' : undefined} {...{ inert: !ignited ? '' : undefined }} aria-hidden={!ignited || undefined}>
      {appReady && <>
      <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus({ preventScroll: true }); }}>{content.controls.skip}</a>
      <Suspense fallback={null}><TopBar/></Suspense>
      {plain ? <Suspense fallback={null}><PlainMode/></Suspense> : <>
        <Suspense fallback={null}><CameraRig/></Suspense><div className="journey-track" aria-hidden="true"/>
        <main id="main-content" tabIndex={-1} className="drive-content" key={section}>
          <Suspense fallback={null}>{section === 'home' ? <Home/> : section === 'projects' ? <ProjectsIndex/> : project ? <ProjectPanel project={project}/> : section === 'about' ? <About/> : <Contact/>}</Suspense>
        </main>
        <Suspense fallback={null}><JourneyFooter/></Suspense>
      </>}
      <Suspense fallback={null}><MobileNav/></Suspense>
      <span className="sr-only" role="status" aria-live="polite">{content.sectionNames[section]}</span>
      </>}
    </div>
    {!ignited && <Gate/>}
  </>;
}
