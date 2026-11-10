export type QualityTier='high'|'medium'|'low';
export type QualityChoice=QualityTier|'auto';
export const QUALITY={
 high:{dpr:1.5,bloom:true,ripple:true,rain:true,rainExtras:true,ambient:true,audioReactive:true,parallax:true,poolScale:1,backdrop:true},
 medium:{dpr:1.25,bloom:true,ripple:false,rain:true,rainExtras:false,ambient:true,audioReactive:true,parallax:false,poolScale:.5,backdrop:false},
 low:{dpr:1,bloom:false,ripple:false,rain:false,rainExtras:false,ambient:false,audioReactive:false,parallax:false,poolScale:0,backdrop:false}
} as const;
export function initialQuality():QualityTier {
 const nav=navigator as Navigator & {deviceMemory?:number;connection?:{saveData?:boolean}};
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||nav.connection?.saveData||(nav.deviceMemory??8)<=2||(nav.hardwareConcurrency??8)<=2)return 'low';
 if(innerWidth<768||/Android|iPhone|iPad/i.test(nav.userAgent)||(nav.deviceMemory??8)<=4||(nav.hardwareConcurrency??8)<=4||devicePixelRatio>2)return 'medium';
 return 'high';
}
export function qualityOverride():QualityChoice {const value=new URLSearchParams(location.search).get('quality');return value==='high'||value==='medium'||value==='low'?value:'auto';}
