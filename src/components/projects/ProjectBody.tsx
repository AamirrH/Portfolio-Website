import { content, projectTechArtwork, projectTechArtworkByProject, projectTechIcons, type Project } from '../../data/content';
import type { CSSProperties } from 'react';
export function ProjectBody({ project, plain = false }: { project: Project; plain?: boolean }) {
  const Heading = plain ? 'h3' : 'h1';
  const Subheading = plain ? 'h4' : 'h2';
  const live = project.live === 'LIVE_URL' ? undefined : project.live;
  const repo = project.repo === 'REPO_URL' ? undefined : project.repo;
  return <>
    <Heading>{project.title}</Heading>
    {project.chips && <ul className="project-facts" aria-label="Project facts" style={{ '--project-accent': project.accent } as CSSProperties}>
      {project.chips.map(chip => <li key={chip}>{chip}</li>)}
    </ul>}
    <p className="project-pitch">{project.pitch}</p>
    {(live || repo || project.repoTodo) && <div className="project-links">
      {live && <a className="primary-link" href={live} target="_blank" rel="noreferrer">{content.projects.live}<span aria-hidden="true">↗</span></a>}
      {repo ? <a className="text-link" href={repo} target="_blank" rel="noreferrer">{content.projects.repo}<span aria-hidden="true">↗</span></a> : <span className="todo-label">{project.repoTodo}</span>}
    </div>}
    {live && !plain && <p className="project-door-hint">{content.projects.doorHint}</p>}
    <Subheading className="eyebrow subsection-heading">{content.projects.overview}</Subheading>
    <ul className="highlights">{project.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
    <Subheading className="eyebrow subsection-heading">{content.projects.tech}</Subheading>
    <ul className="project-tech-list">{project.stack.map(tech => {
      const artwork = projectTechArtworkByProject[project.id]?.[tech] ?? projectTechArtwork[tech];
      return <li key={tech}>
        {artwork ? <span className={`project-tech-art${artwork.wide ? ' wide' : ''}`} aria-hidden="true"><img src={artwork.src} alt="" width="160" height="160" loading="lazy" decoding="async"/>{artwork.overlay && <span className="project-tech-art-label">{artwork.overlay}</span>}</span>
          : projectTechIcons[tech] ? <img src={`/assets/tech/${projectTechIcons[tech]}.svg`} alt="" width="38" height="38" loading="lazy" decoding="async"/>
          : <span className="project-tech-glyph" aria-hidden="true">{tech.slice(0, 2).toUpperCase()}</span>}
        <span>{tech}</span>
      </li>;
    })}</ul>
  </>;
}
