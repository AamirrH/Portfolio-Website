import { content } from '../../data/content';

export function About() {
  return <section className="view-panel about-panel">
    <div className="panel-inner">
      <p className="eyebrow accent">{content.about.eyebrow}</p>
      <h1>{content.about.title}</h1>
      <p className="panel-description">{content.owner.biography}</p>
      <div className="about-education">
        <span className="eyebrow">{content.about.educationTitle}</span>
        <strong>{content.about.degree}</strong>
        <span>{content.about.school} · {content.about.years}</span>
      </div>
      <a className="primary-link" href={content.about.resumeUrl} target="_blank" rel="noopener noreferrer">{content.about.resume} <span aria-hidden="true">↗</span></a>
    </div>
  </section>;
}
