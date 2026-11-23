import { content, projects } from '../../data/content';
import { RoadSign } from '../navigation/RoadSign';
export function ProjectsIndex() { return <>
  <div className="gantry-nav project-gantry">
    <RoadSign className="project-journey-sign">
      <p className="sign-meta">FOUR PROJECTS / ONE OPEN ROAD</p>
      <h2>{content.projects.signTitle}</h2>
      <p className="sign-bottom">{content.projects.signHint} <span aria-hidden="true">↓</span></p>
    </RoadSign>
  </div>
  <nav className="road-sign all-exits" aria-label="All exits">
    <h2 className="sign-meta">ALL EXITS</h2>
    {projects.map(project => <a key={project.id} href={`#${project.id}`}>
      <span>{project.exit}</span> {project.title} <span aria-hidden="true">↗</span>
    </a>)}
  </nav>
  <section className="home-copy projects-copy"><h1>{content.projects.title}</h1><p className="home-description">Explore all four builds by scrolling, using the arrows, or choosing an exit.</p></section>
</>; }
