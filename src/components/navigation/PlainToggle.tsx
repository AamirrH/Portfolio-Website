import { content } from '../../data/content';
import { useSceneStore } from '../../state/useSceneStore';
export function PlainToggle() { const plain = useSceneStore(state => state.plain); const setPlain = useSceneStore(state => state.setPlain); return <button className="utility-button plain-toggle" onClick={() => setPlain(!plain)} aria-pressed={plain}><span aria-hidden="true">{plain ? '◈' : '▤'}</span>{plain ? content.controls.scene : content.controls.plain}</button>; }
