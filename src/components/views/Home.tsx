import { content } from '../../data/content';
import { GantryNav } from '../navigation/GantryNav';
export function Home() { return <><GantryNav/><section className="home-copy"><h1>{content.hero.line1}<br/><em>{content.hero.line2}</em></h1><p className="home-description">{content.hero.description}</p><a className="primary-link" href="#projects">{content.hero.cta}<span aria-hidden="true">↗</span></a></section><a className="scroll-hint" href="#projects"><span aria-hidden="true">↓</span>{content.hero.hint}</a></>; }
