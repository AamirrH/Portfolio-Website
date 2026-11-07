import meta from '../../public/assets/sides/city-below.json';
export const CITY_PLATE = { offsetY:0, scale:1.04 } as const;
export const HORIZON_PCT = .71; // Used only if the actual drawn rail geometry is unavailable.
export const PLATE_META=meta;
export interface PlateRect { id:string;x:number;y:number;w:number;h:number;color?:string; }
const rect=(id:string,x:number,y:number,w:number,h:number,color?:string):PlateRect=>({
 id,x,y:(y*meta.sourceHeight-meta.trimTop*100)/meta.height,w,h:h*meta.sourceHeight/meta.height,color,
});
export const DARK_WINDOWS=[
 [2.2,51.5,1,1.8],[2.2,54,1,1.6],[4.5,51.3,.5,.65],[6.3,51.4,.5,.65],
 [6.3,54,.5,1],[10,51.4,.6,.9],[4.5,59.9,.5,1],[9.1,60,.5,.8],
 [9.8,60,.5,.8],[10.6,60,.5,.8],[16.2,50.2,.8,1.6],[18.4,60,.6,1.8],
 [29.3,45.2,.3,.65],[31.3,46.5,.3,.6],[32.1,45.3,.3,.6],[29.3,49.3,.3,.6],
 [30.6,55,.3,.7],[33.3,55,.3,.7],[65.9,47.8,.35,1.1],[67.3,47.8,.35,1.1],
 [69.8,60.3,.35,1.2],[70.9,60.3,.35,1.2],[8.4,94.3,1.8,2.8],[34.1,96,.75,1.1],
].map((v,i)=>rect('window-off-'+i,v[0],v[1],v[2],v[3]));
export const WARM_WINDOWS=[
 [1.8,94.4,1.5,2.7],[15.1,94.6,1.2,2.7],[18.1,94.5,1.2,2.5],
 [27.3,84,.7,2.5],[38,95.9,.65,1.4],[40.4,96,.7,1.4],
 [64.7,61,.4,1],[66.3,61,.4,1],[76.8,68.8,.4,1.5],[91,82.2,.8,2.5],
].map((v,i)=>rect('window-on-'+i,v[0],v[1],v[2],v[3]));
export const SIGNS=[
 rect('roof-pink',16.5,36.5,5.5,4.8,'#ff53bc'),
 rect('blade-cyan',23.8,45.4,1.7,13,'#25f4ee'),
 rect('roof-foreground',19.9,69.2,7.1,8.8,'#ff53bc'),
 rect('blade-right',62.3,47.7,1,8,'#25f4ee'),
 rect('blade-low',68,81.7,1.6,15.5,'#ff53bc'),
 rect('right-windows',72.1,71.9,4.2,9.5,'#ffb347'),
];
export const plateY=(rawY:number)=>(rawY*meta.sourceHeight-meta.trimTop*100)/meta.height;
export const STREETS=[
 [[32,70.7],[49,70.5],[52,70.3]],
 [[65,72.5],[80,72.5],[99,72.5]],
 [[50,99],[53,83],[55,68]],
 [[58,98],[57.5,80],[56.8,58]],
].map(points=>points.map(([x,y])=>({x,y:plateY(y)})));
