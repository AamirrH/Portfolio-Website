import { useState } from 'react';
import { content } from '../../data/content';

export function About() {
  const [mobileBioOpen, setMobileBioOpen] = useState(false);
  return <section className="view-panel about-panel">
    <div className="panel-inner">
      <p className="eyebrow accent">{content.about.eyebrow}</p>
      <h1>{content.about.title}</h1>
      <button className="about-mobile-toggle" type="button" aria-controls="about-bio" aria-expanded={mobileBioOpen}
        onClick={() => setMobileBioOpen(open => !open)}>
        Bio &amp; résumé <span aria-hidden="true">▾</span>
      </button>
      <div className="about-details" id="about-bio" data-mobile-open={mobileBioOpen}>
        <p className="panel-description">{content.owner.biography}</p>
        <div className="about-education">
          <span className="eyebrow">{content.about.educationTitle}</span>
          <strong>{content.about.degree}</strong>
          <span>{content.about.school} · {content.about.years}</span>
        </div>
        <a className="primary-link" href={content.about.resumeUrl} target="_blank" rel="noopener noreferrer">{content.about.resume} <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </section>;
}
