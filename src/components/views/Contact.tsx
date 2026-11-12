import { content } from '../../data/content';
export function ContactLinks() { return <div className="contact-links"><a href={content.owner.github} target="_blank" rel="noreferrer"><span>{content.contact.github}</span><span aria-hidden="true">↗</span></a><a href={content.owner.linkedin} target="_blank" rel="noreferrer"><span>{content.contact.linkedin}</span><span aria-hidden="true">↗</span></a><a href={`mailto:${content.owner.email}`}><span>{content.contact.email}</span><span aria-hidden="true">↗</span></a></div>; }
export function Contact() { return <>
  <section className="gantry-nav contact-gantry" aria-label={content.contact.title}>
    <div className="road-sign identity-sign"><p className="sign-meta">{content.brand.name} ↑</p><h1>{content.contact.title}</h1><p className="sign-bottom">{content.contact.eyebrow}</p></div>
    <div className="road-sign contact-exits"><ContactLinks/><a className="resume-link" href={content.about.resumeUrl} download>{content.about.resume} ↓</a></div>
  </section>
  <div className="home-copy contact-copy"><p className="home-description">{content.contact.description}</p><a className="primary-link" href="#home">← {content.contact.home}</a></div>
</>; }
