import { content, projects, type Project } from '../../data/content';
import { ProjectBody } from '../projects/ProjectBody';
export function ProjectPanel({ project }: { project: Project }) {
  const index = projects.indexOf(project);
  return <section className="view-panel project-panel"><div className="panel-inner"><a className="back-link" href="#projects">← {content.projects.back}</a><ProjectBody project={project}/><nav className="project-pagination" aria-label={content.projects.indexLabel}>{index > 0 ? <a href={`#${projects[index-1].id}`} aria-label={content.projects.previous}>← {projects[index-1].title}</a> : <span/>}{index < projects.length-1 ? <a href={`#${projects[index+1].id}`} aria-label={content.projects.next}>{projects[index+1].title} →</a> : <a href="#about">{content.nav[1].label} →</a>}</nav></div></section>;
}
