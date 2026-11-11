import { content } from '../../data/content';

export function About() {
  return <section className="view-panel about-panel">
    <div className="panel-inner">
      <p className="eyebrow accent">{content.about.eyebrow}</p>
      <h1>{content.about.title}</h1>
      <p className="panel-description">{content.owner.biography}</p>
      <a className="primary-link" href={content.about.resumeUrl} download>{content.about.resume} ↓</a>
    </div>
  </section>;
}
