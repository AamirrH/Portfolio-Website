import { content } from '../../data/content';
import { RoadSign } from '../navigation/RoadSign';
export function ProjectsIndex() { return <>
  <div className="gantry-nav project-gantry">
    <RoadSign className="project-journey-sign">
      <p className="sign-meta">{content.projects.signDetail}</p>
      <h2>{content.projects.signTitle}</h2>
      <p className="sign-bottom">{content.projects.signHint} <span aria-hidden="true">↓</span></p>
    </RoadSign>
  </div>
  <section className="home-copy projects-copy"><h1>{content.projects.title}</h1><p className="home-description">{content.projects.description}</p></section>
</>; }
