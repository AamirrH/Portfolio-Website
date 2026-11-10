import { content } from '../../data/content';
import { useSceneStore } from '../../state/useSceneStore';
import type { QualityChoice } from '../../config/quality';
export function QualityControl(){const choice=useSceneStore(s=>s.qualityChoice);return <label className="quality-control"><span>{content.controls.quality}</span><select aria-label={content.controls.quality} value={choice} onChange={e=>useSceneStore.getState().setQualityChoice(e.target.value as QualityChoice)}><option value="auto">{content.controls.qualityAuto}</option><option value="high">{content.controls.qualityHigh}</option><option value="medium">{content.controls.qualityMedium}</option><option value="low">{content.controls.qualityLow}</option></select></label>;}
