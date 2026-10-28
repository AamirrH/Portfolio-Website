import { content, type Project } from '../../data/content';
import { ProjectMetrics } from './ProjectMetrics';
export function ProjectBody({ project, plain = false }: { project: Project; plain?: boolean }) {
  const Heading = plain ? 'h3' : 'h1';
  const Subheading = plain ? 'h4' : 'h2';
  return <><div className="project-heading"><p className="eyebrow accent">{project.category}</p><span className="project-badge">{content.projects.exit} {project.exit}</span></div><Heading>{project.title}</Heading><p className="project-pitch">{project.pitch}</p><ProjectMetrics project={project} animated={!plain}/><Subheading className="eyebrow subsection-heading">{content.projects.overview}</Subheading><ul className="highlights">{project.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul><Subheading className="eyebrow subsection-heading">{content.projects.tech}</Subheading><ul className="tech-chips">{project.stack.map(tech => <li key={tech}>{tech}</li>)}</ul><div className="project-links">{project.live && <a className="primary-link" href={project.live} target="_blank" rel="noreferrer">{content.projects.live}<span aria-hidden="true">↗</span></a>}{project.repo ? <a className="text-link" href={project.repo} target="_blank" rel="noreferrer">{content.projects.repo}<span aria-hidden="true">↗</span></a> : <span className="todo-label">{project.repoTodo}</span>}</div></>;
}
