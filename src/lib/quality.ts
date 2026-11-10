import { setTickerQuality } from './ticker';

// The scene always uses the full-quality artwork and effects.
export function startQualityManager() {
 document.documentElement.dataset.quality = 'high';
 setTickerQuality('high');
}
