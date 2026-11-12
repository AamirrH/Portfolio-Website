import { useCallback, useState } from 'react';
import { content, technologyGroups } from '../../data/content';
import { SteeringWheel } from './SteeringWheel';
import './cockpit.css';

export function Cockpit() {
  const [activeId, setActiveId] = useState(technologyGroups[0].id);
  const active = technologyGroups.find(group => group.id === activeId) ?? technologyGroups[0];
  const shiftGroup = useCallback((direction: -1 | 1) => {
    setActiveId(current => {
      const index = technologyGroups.findIndex(group => group.id === current);
      return technologyGroups[(index + direction + technologyGroups.length) % technologyGroups.length].id;
    });
  }, []);

  return <div className="cockpit">
    <div className="windshield-post left-post" aria-hidden="true"/>
    <div className="windshield-post right-post" aria-hidden="true"/>
    <div className="dashboard-shell">
      <SteeringWheel onStep={shiftGroup} activeGroup={active.label}/>
      <div className="dash-console">
        <div className="dash-console-heading">
          <strong>{content.about.skillsTitle}</strong>
          <span>{content.about.stackHint}</span>
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
          <ul className="dash-tech-grid">
            {active.technologies.map(tech => <li key={tech.name}>
              {tech.icon ? <img src={`/assets/tech/${tech.icon}.svg`} width="32" height="32" alt="" loading="lazy"/> : <span className="dash-tech-glyph" aria-hidden="true">{tech.name.slice(0, 2).toUpperCase()}</span>}
              <span>{tech.name}</span>
            </li>)}
          </ul>
        </div>
      </div>
    </div>
  </div>;
}
