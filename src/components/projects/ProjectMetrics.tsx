import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import type { Project } from '../../data/content';
import { content } from '../../data/content';
export function ProjectMetrics({ project, animated = true }: { project: Project; animated?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!animated || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => { gsap.fromTo('.gauge-needle', { rotation: -90 }, { rotation: (_i, target: SVGElement) => Number(target.dataset.angle), transformOrigin: '50% 100%', duration: 1.4, ease: 'power3.out', delay: .2 }); gsap.fromTo('.delivery-fill', { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: 'power3.out' }); }, ref);
    return () => ctx.revert();
  }, [project.id, animated]);
  return <div ref={ref} className={`project-metrics ${project.id === 'swiftship' ? 'telemetry' : ''}`}>
    <dl className="metrics-grid">{project.metrics.map((metric,i) => <div className="metric" key={metric.label}>
      {project.id === 'swiftship' && i < 2 && <svg className="gauge" viewBox="0 0 120 66" aria-hidden="true"><path d="M10 60a50 50 0 0 1 100 0" pathLength="100" fill="none" stroke="#413047" strokeWidth="4"/><path d="M10 60a50 50 0 0 1 100 0" pathLength="100" fill="none" stroke={i === 0 ? '#25f4ee' : '#ff84b5'} strokeWidth="4" strokeDasharray={`${(metric.progress ?? 0)*100} 100`}/><g className="gauge-needle" data-angle={-90+(metric.progress ?? 0)*180} style={{ transformOrigin: '60px 60px', transform: `rotate(${-90+(metric.progress ?? 0)*180}deg)` }}><path d="M60 60L60 22" stroke="#fdf2ff" strokeWidth="1.5"/></g><circle cx="60" cy="60" r="3" fill="#fdf2ff"/></svg>}
      <dt>{metric.label}</dt><dd className="metric-value">{metric.value}</dd><dd className="metric-detail">{metric.detail}</dd>
      {project.id === 'swiftship' && i === 2 && <div className="delivery-track" aria-hidden="true"><span className="delivery-fill"/></div>}
    </div>)}</dl>{project.id === 'swiftship' && <p className="gauge-note">{content.projects.gaugeNote}</p>}
  </div>;
}
