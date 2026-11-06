import sharp from 'sharp';
import { mkdir,writeFile } from 'node:fs/promises';
import { components } from './asset-components.mjs';
const {data,info:{width,height}}=await sharp('assets-src/traffic-raw.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const seen=new Uint8Array(width*height),queue=new Int32Array(width*height);let head=0,tail=0;
const green=p=>data[p*4+1]-Math.max(data[p*4],data[p*4+2])>60;
function add(p){if(!seen[p]&&green(p)){seen[p]=1;queue[tail++]=p;}}
for(let x=0;x<width;x++){add(x);add((height-1)*width+x);}for(let y=0;y<height;y++){add(y*width);add(y*width+width-1);}
while(head<tail){const p=queue[head++],x=p%width,y=Math.floor(p/width);data[p*4+3]=0;if(x)add(p-1);if(x<width-1)add(p+1);if(y)add(p-width);if(y<height-1)add(p+width);}
// Feather only the two-pixel boundary; enclosed window glass stays opaque.
for(let y=0;y<height;y++)for(let x=0;x<width;x++){const p=y*width+x;if(seen[p])continue;let distance=3;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const nx=x+dx,ny=y+dy;if(nx>=0&&nx<width&&ny>=0&&ny<height&&seen[ny*width+nx])distance=Math.min(distance,Math.max(Math.abs(dx),Math.abs(dy)));}if(distance<3){data[p*4+3]=distance===1?190:240;data[p*4+1]=Math.min(data[p*4+1],Math.max(data[p*4],data[p*4+2]));}}
let blobs=components(data,width,height,true);
for(const b of blobs)if(b.area<8000&&Math.hypot(width-(b.left+b.width/2),height-(b.top+b.height/2))<220)for(const p of b.pixels)data[p*4+3]=0;
blobs=components(data,width,height,true).filter(b=>b.area>20000).sort((a,b)=>(a.top+a.height/2)-(b.top+b.height/2));
// Cluster rows by centre-y before sorting left-to-right.
const rows=[];
for(const blob of blobs){
 const cy=blob.top+blob.height/2;
 let row=rows.find(r=>Math.abs(r.cy-cy)<height*.22);
 if(!row){row={cy,items:[]};rows.push(row);}
 row.items.push(blob);row.cy=row.items.reduce((n,b)=>n+b.top+b.height/2,0)/row.items.length;
}
const ordered=rows.sort((a,b)=>a.cy-b.cy).flatMap(r=>r.items.sort((a,b)=>a.left-b.left));
if(![7,8].includes(ordered.length))throw new Error('Expected 7 or 8 traffic components; found '+ordered.length);
const view=ordered.length===7?'straight':'threeQuarter';
// The supplied replacement has a blue sedan and TWO taxis, not the old
// red-coupe sheet. Preserve the owner's explicit bottom-row taxi selection.
// --legacy-first-coupe supports the original eight-car layout from the brief.
const legacy=process.argv.includes('--legacy-first-coupe');
const chosen=ordered.length===7?ordered:legacy?ordered.slice(1):[ordered[0],ordered[1],ordered[5],ordered[3],ordered[4],ordered[6],ordered[7]];
const names=legacy&&ordered.length===8?['sedan','hatch','camper','truck','taxi','swiftship-van','rickshaw']:['sedan','hatch','taxi','camper','truck','swiftship-van','rickshaw'];
const manifest={},previews=[];
await mkdir('public/assets/traffic',{recursive:true});
for(let n=0;n<chosen.length;n++){
 const b=chosen[n],isolated=Buffer.alloc(data.length);for(const p of b.pixels)data.copy(isolated,p*4,p*4,p*4+4);
 const refY=b.top+b.height-17;let left=width,right=0;for(let x=b.left;x<b.left+b.width;x++)if(isolated[(refY*width+x)*4+3]){left=Math.min(left,x);right=Math.max(right,x);}
 const margin=(right-left)*.06;
 for(let y=b.top+b.height-14;y<b.top+b.height;y++)for(let x=b.left;x<b.left+b.width;x++){const p=(y*width+x)*4;if((x<left-margin||x>right+margin)&&Math.max(...isolated.subarray(p,p+3))<110)isolated[p+3]=0;}
 // Open only long, thin drawn baselines; a second border flood reaches the
 // green trapped between tyres without touching enclosed window glass.
 for(let y=b.top+b.height-14;y<b.top+b.height;y++) {
   let run=0,maxRun=0;
   for(let x=b.left;x<b.left+b.width;x++){const p=(y*width+x)*4;run=isolated[p+3]&&Math.max(...isolated.subarray(p,p+3))<100?run+1:0;maxRun=Math.max(maxRun,run);}
   let count=0,above=0;for(let x=b.left;x<b.left+b.width;x++){if(isolated[(y*width+x)*4+3])count++;if(isolated[((y-3)*width+x)*4+3])above++;}
   if(maxRun>b.width*.5 || count>above*1.2) for(let x=b.left;x<b.left+b.width;x++)isolated[(y*width+x)*4+3]=0;
 }
 const visited=new Uint8Array(width*height);let h=0,t=0;
 const addOutside=p=>{if(!visited[p]&&(!isolated[p*4+3]||green(p))){visited[p]=1;queue[t++]=p;}};
 for(let x=b.left;x<b.left+b.width;x++){addOutside(b.top*width+x);addOutside((b.top+b.height-1)*width+x);}
 for(let y=b.top;y<b.top+b.height;y++){addOutside(y*width+b.left);addOutside(y*width+b.left+b.width-1);}
 while(h<t){const p=queue[h++],x=p%width,y=Math.floor(p/width);isolated[p*4+3]=0;if(x>b.left)addOutside(p-1);if(x<b.left+b.width-1)addOutside(p+1);if(y>b.top)addOutside(p-width);if(y<b.top+b.height-1)addOutside(p+width);}
 // The replacement truck drawing encloses an exterior green gap inside its
 // mirror arm. This inspected cutout is outside the cabin, not window glass.
 if(names[n]==='truck')for(let y=b.top+Math.floor(b.height*.2);y<b.top+b.height*.5;y++)for(let x=b.left+Math.floor(b.width*.88);x<b.left+b.width;x++){const p=y*width+x;if(green(p)&&data[p*4+1]>180)isolated[p*4+3]=0;}
 const raw=await sharp(isolated,{raw:{width,height,channels:4}}).extract({left:b.left,top:b.top,width:b.width,height:b.height}).png().toBuffer();
 const out=await sharp(raw).trim({threshold:0}).webp({quality:90,alphaQuality:100}).toBuffer({resolveWithObject:true});
 await writeFile(`public/assets/traffic/${names[n]}.webp`,out.data);manifest[names[n]]={width:out.info.width,height:out.info.height};
 previews.push({input:await sharp(out.data).resize({width:300,height:280,fit:'inside'}).png().toBuffer(),left:20+(n%4)*330,top:20+Math.floor(n/4)*320});
 console.log(`${names[n]}: ${out.info.width} x ${out.info.height}`);
}
await writeFile('public/assets/traffic/traffic.json',JSON.stringify(manifest,null,2));
await writeFile('public/assets/traffic/view.json',JSON.stringify({view,sourceCount:ordered.length,selection:legacy?'legacy-first-coupe':'approved-bottom-taxi'},null,2));
await sharp({create:{width:1340,height:640,channels:4,background:'#777777'}}).composite(previews).png().toFile('screenshots/traffic-sheet.png');

