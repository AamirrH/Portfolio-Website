import { QualityControl } from './QualityControl';
import { content } from '../../data/content';
import { useSceneStore } from '../../state/useSceneStore';
import { AudioToggle } from './AudioToggle';
import { PlainToggle } from './PlainToggle';
export function TopBar() { const motion = useSceneStore(state => state.motion); const section = useSceneStore(state => state.section); return <header className="topbar"><a href="#home" className="brand-link" aria-label={content.controls.home}><span className="brand-mark">{content.owner.initials}<span className="brand-slash">/</span></span><span className="eyebrow">{content.brand.name}</span></a><span className="top-section mono"><span className="status-dot"/>{content.sectionNames[section]}</span><nav className="compact-nav" aria-label={content.controls.navigation}>{content.nav.map(item => <a key={item.id} href={`#${item.id}`} aria-current={section === item.id || (item.id === 'projects' && ['roomly','swiftship','signalroute'].includes(section)) ? 'page' : undefined}>{item.label}</a>)}</nav><button className="motion-toggle" aria-pressed={motion} onClick={()=>useSceneStore.getState().setMotion(!motion)}>{motion?content.controls.motionOn:content.controls.motionOff}</button><QualityControl/><AudioToggle/><PlainToggle/></header>; }


