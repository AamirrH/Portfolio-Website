import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { content, projects, type Project } from '../../data/content';
import { ProjectBody } from '../projects/ProjectBody';

export function ProjectPanel({ project }: { project: Project }) {
  const index = projects.indexOf(project);
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false);
  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const moveFocus = useRef(false);
  const panelId = `${project.id}-project-info`;

  useLayoutEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    (mobileInfoOpen ? closeButton : openButton).current?.focus({ preventScroll: true });
  }, [mobileInfoOpen]);

  const toggleMobileInfo = (open: boolean) => {
    moveFocus.current = true;
    setMobileInfoOpen(open);
  };

  return <>
    <button ref={openButton} className="project-info-open" type="button" aria-controls={panelId}
      aria-expanded={mobileInfoOpen} onClick={() => toggleMobileInfo(true)}>
      <span aria-hidden="true">i</span> Project info
    </button>
    <section id={panelId} className={`project-panel stop-project-panel${project.accent ? ' stop-board-accent' : ''}`}
      data-mobile-open={mobileInfoOpen}
      style={project.accent ? { '--project-accent': project.accent } as CSSProperties : undefined}
      aria-labelledby="project-directory-label"
      onKeyDown={event => {
        if (event.key === 'Escape' && mobileInfoOpen && closeButton.current?.getClientRects().length) {
          event.preventDefault();
          toggleMobileInfo(false);
        }
      }}>
      <div className="board-frame">
        <div className="board-header">
          <span id="project-directory-label">{content.projects.board}</span>
          <a href="#projects">← {content.projects.back}</a>
          <button ref={closeButton} className="project-info-close" type="button"
            aria-label="Close project info" onClick={() => toggleMobileInfo(false)}>×</button>
        </div>
        <div className="panel-inner"><ProjectBody project={project}/></div>
        <nav className="project-pagination" aria-label={content.projects.indexLabel}>
          {index > 0 ? <a href={`#${projects[index-1].id}`} aria-label={content.projects.previous}>← {projects[index-1].title}</a> : <span/>}
          {index < projects.length-1 ? <a href={`#${projects[index+1].id}`} aria-label={content.projects.next}>{projects[index+1].title} →</a> : <a href="#about">{content.nav[1].label} →</a>}
        </nav>
      </div>
    </section>
  </>;
}
