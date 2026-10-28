import { content } from '../../data/content';
import { useSceneStore } from '../../state/useSceneStore';
import { AudioToggle } from './AudioToggle';
import { PlainToggle } from './PlainToggle';
export function TopBar() { const section = useSceneStore(state => state.section); return <header className="topbar"><a href="#home" className="brand-link" aria-label={content.controls.home}><span className="brand-mark">{content.owner.initials}<span className="brand-slash">/</span></span><span className="eyebrow">{content.brand.name}</span></a><span className="top-section mono"><span className="status-dot"/>{content.sectionNames[section]}</span><nav className="compact-nav" aria-label={content.controls.navigation}>{content.nav.map(item => <a key={item.id} href={`#${item.id}`} aria-current={section === item.id || (item.id === 'projects' && ['roomly','swiftship','signalroute'].includes(section)) ? 'page' : undefined}>{item.label}</a>)}</nav><AudioToggle/><PlainToggle/></header>; }


