import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { content, technologyGroups } from '../../data/content';
import { SteeringWheel } from './SteeringWheel';
import './cockpit.css';

export function Cockpit() {
  const [activeId, setActiveId] = useState(technologyGroups[0].id);
  const [mobileTechOpen, setMobileTechOpen] = useState(false);
  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const moveFocus = useRef(false);
  const active = technologyGroups.find(group => group.id === activeId) ?? technologyGroups[0];
  const shiftGroup = useCallback((direction: -1 | 1) => {
    setActiveId(current => {
      const index = technologyGroups.findIndex(group => group.id === current);
      return technologyGroups[(index + direction + technologyGroups.length) % technologyGroups.length].id;
    });
  }, []);
  useLayoutEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    (mobileTechOpen ? closeButton : openButton).current?.focus({ preventScroll: true });
  }, [mobileTechOpen]);

  const toggleMobileTech = (open: boolean) => {
    moveFocus.current = true;
    setMobileTechOpen(open);
  };

  return <div className="cockpit">
    <div className="windshield-post left-post" aria-hidden="true"/>
    <div className="windshield-post right-post" aria-hidden="true"/>
    <div className="dashboard-shell">
      <SteeringWheel onStep={shiftGroup} activeGroup={active.label}/>
      <button ref={openButton} type="button" className="dash-tech-open" aria-controls="dash-console"
        aria-expanded={mobileTechOpen} onClick={() => toggleMobileTech(true)}>
        <span aria-hidden="true">i</span> {content.projects.tech}
      </button>
      <div id="dash-console" className="dash-console" role="region" aria-labelledby="dash-console-label"
        data-mobile-open={mobileTechOpen} tabIndex={0}
        onKeyDown={event => {
          if (event.key.startsWith('Arrow')) event.stopPropagation();
          if (event.key === 'Escape' && mobileTechOpen && closeButton.current?.getClientRects().length) {
            event.preventDefault();
            toggleMobileTech(false);
          }
        }}>
        <div className="dash-console-heading">
          <strong id="dash-console-label">{content.about.skillsTitle}</strong>
          <span>{content.about.stackHint}</span>
          <button ref={closeButton} type="button" className="dash-tech-close" aria-label="Close tech stack"
            onClick={() => toggleMobileTech(false)}>×</button>
        </div>
        <div className="dash-tabs" role="tablist" aria-label={content.about.skillsTitle}>
          {technologyGroups.map(group => <button
            key={group.id}
            id={`dash-tab-${group.id}`}
            type="button"
            role="tab"
            aria-selected={group.id === activeId}
            aria-controls="dash-technologies"
            tabIndex={group.id === activeId ? 0 : -1}
            onClick={() => setActiveId(group.id)}
            onKeyDown={event => {
              if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
              event.preventDefault();
              const index = technologyGroups.findIndex(item => item.id === activeId);
              const offset = event.key === 'ArrowRight' ? 1 : -1;
              const next = technologyGroups[(index + offset + technologyGroups.length) % technologyGroups.length];
              setActiveId(next.id);
              document.getElementById(`dash-tab-${next.id}`)?.focus();
            }}
          >{group.label}</button>)}
        </div>
        <div id="dash-technologies" className="dash-tech-panel" role="tabpanel" aria-labelledby={`dash-tab-${active.id}`}>
          <ul className="dash-tech-grid" tabIndex={0}>
            {active.technologies.map(tech => <li key={tech.name}>
              {tech.icon ? <img src={`/assets/tech/${tech.icon}.svg`} width="32" height="32" alt="" loading="lazy"/> : <span className="dash-tech-glyph" aria-hidden="true">{tech.name.slice(0, 2).toUpperCase()}</span>}
              <span className="dash-tech-name">{tech.name}</span>
            </li>)}
          </ul>
        </div>
      </div>
    </div>
  </div>;
}
