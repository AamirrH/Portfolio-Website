import { projects } from './data/content';
import { Scene } from './components/scene/Scene';
import { TopBar } from './components/navigation/TopBar';
import { JourneyFooter } from './components/navigation/JourneyFooter';
import { Home } from './components/views/Home';
import { ProjectsIndex } from './components/views/ProjectsIndex';
import { useJourney } from './hooks/useJourney';
import { useSceneStore } from './state/useSceneStore';
import { useScrollJourney } from './hooks/useScrollJourney';
import { ProjectPanel } from './components/views/ProjectPanel';
import { About } from './components/views/About';
import { Contact } from './components/views/Contact';
import { Gate } from './components/Gate';
export default function App() {
  useJourney();
  const ignited = useSceneStore(state => state.ignited);
  useScrollJourney(ignited);
  const section = useSceneStore(state => state.section);
  const project = projects.find(item => item.id === section);
  return <><div {...{ inert: !ignited ? '' : undefined }} aria-hidden={!ignited || undefined}><Scene/><div className="journey-track" aria-hidden="true"/><TopBar/><main id="main-content" className="drive-content" key={section}>{section === 'home' ? <Home/> : section === 'projects' ? <ProjectsIndex/> : project ? <ProjectPanel project={project}/> : section === 'about' ? <About/> : <Contact/>}</main><JourneyFooter/></div>{!ignited && <Gate/>}</>;
}
