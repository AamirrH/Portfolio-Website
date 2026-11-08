import images from '../data/imageManifest.json';
type Art={width:number;height:number;variants:{src:string;width:number}[]};
export function responsiveArt(src:string,sizes:string,low=false){const art=(images as Record<string,Art>)[src];return art?{width:art.width,height:art.height,srcSet:art.variants.filter(v=>!low||v.width<=480).map(v=>`${v.src} ${v.width}w`).join(', '),sizes,decoding:'async' as const}:{};}
