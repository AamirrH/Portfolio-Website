import { useEffect, useLayoutEffect, useRef } from 'react';
import { content, projects, technologyGroups, type Project, type Section } from '../../data/content';
import { readHash, routeOrder } from '../../hooks/useJourney';
import { useSceneStore } from '../../state/useSceneStore';
import { ProjectBody } from '../projects/ProjectBody';
import { ContactLinks } from './Contact';
import { PlainMode } from './PlainMode';
import './road-trip.css';

const artDirectory = '/assets/road-trip';
const nav = [
  { id: 'home', label: 'Home' },
  ...content.nav.map(({ id, label }) => ({ id, label })),
] satisfies { id: Section; label: string }[];

function useReadingRoute(plain: boolean) {
  useLayoutEffect(() => {
    const section = readHash();
    useSceneStore.getState().setSection(section);
    if (!location.hash) history.replaceState(history.state, '', '#home');
    if (section === 'home') window.scrollTo(0, 0);
    else document.getElementById(section)?.scrollIntoView();
  }, [plain]);

  useEffect(() => {
    const syncHash = () => useSceneStore.getState().setSection(readHash());
    window.addEventListener('hashchange', syncHash);
    const active = new Set<Section>();
    let atEnd = false;
    const updateSection = () => {
      // Contact can be shorter than the viewport. Highlight it at the end of the page.
      const section = atEnd ? 'contact' : routeOrder.filter(id => active.has(id)).at(-1);
      if (section) useSceneStore.getState().setSection(section);
    };
    let observer: IntersectionObserver | undefined;
    const observeSections = () => {
      observer?.disconnect();
      active.clear();
      const header = document.querySelector('.trip-header')?.getBoundingClientRect().height ?? 69;
      const bottom = Math.max(0, window.innerHeight - header - window.innerHeight * .16);
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          const section = entry.target.id as Section;
          if (entry.isIntersecting) active.add(section);
          else active.delete(section);
        }
        updateSection();
      }, { rootMargin: `-${header}px 0px -${bottom}px 0px` });
      for (const section of routeOrder) {
        const element = document.getElementById(section);
        if (element) observer.observe(element);
      }
    };
    observeSections();
    window.addEventListener('resize', observeSections);
    const endObserver = new IntersectionObserver(([entry]) => {
      atEnd = entry.isIntersecting;
      updateSection();
    });
    const end = document.getElementById('trip-end');
    if (end) endObserver.observe(end);
    return () => {
      observer?.disconnect();
      endObserver.disconnect();
      window.removeEventListener('resize', observeSections);
      window.removeEventListener('hashchange', syncHash);
    };
  }, [plain]);
}

function StopImage({ name, className, eager, sizes }: {
  name: string;
  className: string;
  eager: boolean;
  sizes: string;
}) {
  return <img className={className} src={`${artDirectory}/${name}-480w.webp`}
    srcSet={`${artDirectory}/${name}-480w.webp 480w, ${artDirectory}/${name}-768w.webp 768w`}
    sizes={sizes} loading={eager ? 'eager' : 'lazy'} decoding="async" alt=""/>;
}

function StopScene({ project, eager }: { project: Project; eager: boolean }) {
  const daylight = project.stop?.sky === 'frutiger-day';
  const building = <StopImage className="trip-building" name={project.id} eager={eager}
    sizes={project.id === 'roomly' ? '(min-width: 680px) 260px, 46vw' : '(min-width: 680px) 560px, 85vw'}/>;
  return <div className={`trip-scene${daylight ? ' trip-daylight' : ''}`} aria-hidden="true">
    {daylight
      ? <StopImage className="trip-backdrop" name="frutiger-backdrop" eager={eager} sizes="(min-width: 680px) 640px, 100vw"/>
      : <span className="trip-sun"/>}
    {daylight ? <div className="trip-pavilion">
      {building}
      <span>{project.title}</span>
    </div> : building}
    <div className="trip-street"/>
    <img className="trip-car" src={`${artDirectory}/parked-car.webp`} width="480" height="147"
      loading={eager ? 'eager' : 'lazy'} decoding="async" alt=""/>
  </div>;
}

function RoadTripContent({ initialSection }: { initialSection: Section }) {
  const eagerHero = initialSection === 'home' || initialSection === 'projects';
  return <main id="main-content" className="trip-content" tabIndex={-1}>
    <section id="home" className="trip-home">
      <p className="trip-kicker">{content.owner.role}</p>
      <h1>{content.owner.name}</h1>
      <p className="trip-intro">{content.owner.intro}</p>
      <div className="trip-scene trip-hero-scene" aria-hidden="true">
        <span className="trip-sun"/>
        <img className="trip-skyline" src="/assets/skyline/far-480w.webp" loading={eagerHero ? 'eager' : 'lazy'} decoding="async" alt=""/>
        <div className="trip-highway"/>
        <img className="trip-hero-car trip-car" src="/assets/cars/rear-480w.webp" width="480" height="314"
          loading={eagerHero ? 'eager' : 'lazy'} decoding="async" alt=""/>
      </div>
      <a className="primary-link trip-cta" href="#projects">{content.hero.cta} <span aria-hidden="true">↓</span></a>
    </section>

    <section id="projects" className="trip-directory">
      <h2>{content.projects.title}</h2>
      <nav aria-label="Project stops">
        {projects.map(project => <a key={project.id} href={`#${project.id}`}>
          <span aria-hidden="true">{project.exit}</span> {project.title}
        </a>)}
      </nav>
    </section>

    {projects.map(project => <article id={project.id} className="trip-project" key={project.id}>
      <StopScene project={project} eager={initialSection === project.id}/>
      <div className="trip-project-copy">
        <p className="trip-kicker">{content.projects.exit} {project.exit}</p>
        <ProjectBody project={project} plain/>
      </div>
    </article>)}

    <section id="about" className="trip-text-section">
      <p className="trip-kicker">{content.about.eyebrow}</p>
      <h2>{content.about.title}</h2>
      <p>{content.owner.biography}</p>
      <h3>{content.about.educationTitle}</h3>
      <p>{content.about.degree}<br/>{content.about.school} · {content.about.years}</p>
      <a className="primary-link" href={content.about.resumeUrl} target="_blank" rel="noopener noreferrer">
        {content.about.resume} <span aria-hidden="true">↗</span>
      </a>
      <h3>{content.about.skillsTitle}</h3>
      <dl className="trip-skills">
        {technologyGroups.map(group => <div key={group.id}>
          <dt>{group.label}</dt>
          <dd>{group.technologies.map(technology => technology.name).join(' · ')}</dd>
        </div>)}
      </dl>
    </section>

    <section id="contact" className="trip-text-section">
      <p className="trip-kicker">{content.contact.eyebrow}</p>
      <h2>{content.contact.title}</h2>
      <p>{content.contact.description}</p>
      <ContactLinks/>
      <a className="primary-link" href="#home">{content.contact.home} <span aria-hidden="true">↑</span></a>
    </section>
  </main>;
}

export default function RoadTrip() {
  const plain = useSceneStore(state => state.plain);
  const section = useSceneStore(state => state.section);
  const initialSection = useRef(readHash());
  useReadingRoute(plain);

  const togglePlain = () => {
    history.replaceState(history.state, '', `#${useSceneStore.getState().section}`);
    useSceneStore.getState().setPlain(!plain);
  };
  const navSection = projects.some(project => project.id === section) ? 'projects' : section;

  return <div className="road-trip">
    <a className="skip-link" href="#main-content" onClick={event => {
      event.preventDefault();
      document.getElementById('main-content')?.focus();
    }}>{content.controls.skip}</a>
    <header className="trip-header">
      <a className="trip-brand" href="#home"><strong>{content.owner.initials}</strong> {content.brand.name}</a>
      <button type="button" aria-pressed={plain} onClick={togglePlain}>{plain ? 'Road Trip' : content.controls.plain}</button>
    </header>
    {plain ? <PlainMode/> : <RoadTripContent initialSection={initialSection.current}/>}
    <div className="trip-end" id="trip-end" aria-hidden="true"/>
    <nav className="trip-nav" aria-label={content.controls.navigation}>
      {nav.map(({ id, label }) => <a key={id} href={`#${id}`} aria-current={navSection === id ? 'location' : undefined}>{label}</a>)}
    </nav>
  </div>;
}
