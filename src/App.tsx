import { useEffect } from 'react';
import { content, projects } from './data/content';
import { CameraRig } from './components/scene/CameraRig';
import { TopBar } from './components/navigation/TopBar';
import { JourneyFooter } from './components/navigation/JourneyFooter';
import { MobileNav } from './components/navigation/MobileNav';
import { Home } from './components/views/Home';
import { ProjectsIndex } from './components/views/ProjectsIndex';
import { ProjectPanel } from './components/views/ProjectPanel';
import { About } from './components/views/About';
import { Contact } from './components/views/Contact';
import { PlainMode } from './components/views/PlainMode';
import { Gate } from './components/Gate';
import { useJourney } from './hooks/useJourney';
import { useScrollJourney } from './hooks/useScrollJourney';
import { usePreferences } from './hooks/usePreferences';
import { useSceneStore } from './state/useSceneStore';
import { useAtmosphere } from './hooks/useAtmosphere';
export default function App() {
  useJourney();
  usePreferences();
  const { cyclePalette } = useAtmosphere();
  const ignited = useSceneStore(state => state.ignited);
  const plain = useSceneStore(state => state.plain);
  const section = useSceneStore(state => state.section);
  useScrollJourney(ignited && !plain);
  const project = projects.find(item => item.id === section);
  useEffect(() => {
    if (!ignited || plain) return;
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [section, ignited, plain]);
  return <>
    <div {...{ inert: !ignited ? '' : undefined }} aria-hidden={!ignited || undefined}>
      <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus({ preventScroll: true }); }}>{content.controls.skip}</a>
      <TopBar/>
      {plain ? <PlainMode/> : <>
        <CameraRig/><div className="journey-track" aria-hidden="true"/>
        {section === 'home' && <button className="sun-control" onClick={cyclePalette} aria-label={content.controls.palette} title={content.controls.palette}/>}
        <main id="main-content" tabIndex={-1} className="drive-content" key={section}>
          {section === 'home' ? <Home/> : section === 'projects' ? <ProjectsIndex/> : project ? <ProjectPanel project={project}/> : section === 'about' ? <About/> : <Contact/>}
        </main>
        <JourneyFooter/>
      </>}
      <MobileNav/>
      <span className="sr-only" role="status" aria-live="polite">{content.sectionNames[section]}</span>
    </div>
    {!ignited && <Gate/>}
  </>;
}
