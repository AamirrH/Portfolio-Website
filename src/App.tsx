import { content } from './data/content';
import { Scene } from './components/scene/Scene';
import { TopBar } from './components/navigation/TopBar';
import { JourneyFooter } from './components/navigation/JourneyFooter';
import { Home } from './components/views/Home';
import { ProjectsIndex } from './components/views/ProjectsIndex';
import { useJourney } from './hooks/useJourney';
import { useSceneStore } from './state/useSceneStore';
export default function App() {
  useJourney();
  const section = useSceneStore(state => state.section);
  return <><Scene/><TopBar/><main id="main-content" className="drive-content" key={section}>{section === 'home' ? <Home/> : section === 'projects' ? <ProjectsIndex/> : <section className="view-panel"><p className="eyebrow">{content.brand.name}</p><h1>{content.sectionNames[section]}</h1><a className="primary-link" href="#projects">{content.projects.back} ↗</a></section>}</main><JourneyFooter/></>;
}
