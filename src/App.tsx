import { content } from './data/content';
import { Scene } from './components/scene/Scene';
export default function App() {
  return <><Scene/><header className="topbar"><span className="brand-mark">{content.owner.initials}<span className="brand-slash">/</span></span><span className="eyebrow">{content.brand.name}</span><span className="topbar-right eyebrow">{content.brand.subline}</span></header><main className="home-copy"><p className="eyebrow">{content.hero.eyebrow}</p><h1>{content.hero.line1}<br/><em>{content.hero.line2}</em></h1><p className="home-description">{content.hero.description}</p></main></>;
}
