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
export default function App() {
  useJourney();
  useScrollJourney(true);
  const section = useSceneStore(state => state.section);
  const project = projects.find(item => item.id === section);
  return <><Scene/><div className="journey-track" aria-hidden="true"/><TopBar/><main id="main-content" className="drive-content" key={section}>{section === 'home' ? <Home/> : section === 'projects' ? <ProjectsIndex/> : project ? <ProjectPanel project={project}/> : section === 'about' ? <About/> : <Contact/>}</main><JourneyFooter/></>;
}
