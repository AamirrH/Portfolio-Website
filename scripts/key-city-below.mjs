import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
const {data,info:{width,height}}=await sharp('assets-src/city-below-raw.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const seen=new Uint8Array(width*height),queue=new Int32Array(width*height);let head=0,tail=0;
const add=p=>{if(!seen[p]&&data[p*4+1]-Math.max(data[p*4],data[p*4+2])>60){seen[p]=1;queue[tail++]=p;}};
for(let x=0;x<width;x++){add(x);add((height-1)*width+x);}for(let y=0;y<height;y++){add(y*width);add(y*width+width-1);}
while(head<tail){const p=queue[head++],x=p%width,y=Math.floor(p/width);data[p*4+3]=0;if(x)add(p-1);if(x<width-1)add(p+1);if(y)add(p-width);if(y<height-1)add(p+width);if(x&&y)add(p-width-1);if(x<width-1&&y)add(p-width+1);if(x&&y<height-1)add(p+width-1);if(x<width-1&&y<height-1)add(p+width+1);}
// The antenna lattice encloses pockets of the EXTERIOR green backdrop.
// Limit this cleanup to above the first substantially solid skyline row;
// neon/interior colours within the city below that boundary remain opaque.
let skylineRow=height;
for(let y=0;y<height;y++){let solid=0;for(let x=0;x<width;x++)if(!seen[y*width+x])solid++;if(solid>width*.8){skylineRow=y;break;}}
for(let y=0;y<skylineRow;y++)for(let x=0;x<width;x++){const p=y*width+x;if(data[p*4+1]-Math.max(data[p*4],data[p*4+2])>60){seen[p]=1;data[p*4+3]=0;}}
for(let y=0;y<height;y++)for(let x=0;x<width;x++){
 const p=y*width+x;if(seen[p])continue;let d=3;
 for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const a=x+dx,b=y+dy;if(a>=0&&a<width&&b>=0&&b<height&&seen[b*width+a])d=Math.min(d,Math.max(Math.abs(dx),Math.abs(dy)));}
 if(d<3){data[p*4+3]=d===1?170:235;data[p*4+1]=Math.min(data[p*4+1],Math.max(data[p*4],data[p*4+2]));}
}
// User-specified clone stamp, scaled from the 2576x1438 reference, BEFORE trimming.
const rx=width/2576,ry=height/1438,x=Math.round(2400*rx),y=Math.round(1280*ry);
const pw=Math.round(140*rx),ph=Math.round(120*ry),shift=Math.round(210*rx),feather=14*Math.min(rx,ry);
const mask=Buffer.alloc(pw*ph);
for(let j=0;j<ph;j++)for(let i=0;i<pw;i++)mask[j*pw+i]=Math.round(255*Math.min(1,Math.min(i,j,pw-1-i,ph-1-j)/feather));
const soft=await sharp(mask,{raw:{width:pw,height:ph,channels:1}}).blur(3.5).toColourspace('b-w').raw().toBuffer();
const original=Buffer.from(data);
for(let j=0;j<ph;j++)for(let i=0;i<pw;i++){
 const alpha=soft[j*pw+i]/255,target=((y+j)*width+x+i)*4,source=((y+j)*width+x-shift+i)*4;
 for(let c=0;c<4;c++)data[target+c]=Math.round(original[target+c]*(1-alpha)+original[source+c]*alpha);
}
let top=0;
while(top<height&&!data.subarray(top*width*4,(top+1)*width*4).some((v,i)=>i%4===3&&v>0))top++;
await mkdir('public/assets/sides',{recursive:true});
const trimmed=sharp(data,{raw:{width,height,channels:4}}).extract({left:0,top,width,height:height-top});
await trimmed.clone().webp({quality:88,alphaQuality:100}).toFile('public/assets/sides/city-below.webp');
await trimmed.clone().flatten({background:'#777777'}).png().toFile('screenshots/city-below-keyed.png');
const metadata={width,height:height-top,sourceWidth:width,sourceHeight:height,trimTop:top,clone:{x,y,width:pw,height:ph,shift,feather}};
await writeFile('public/assets/sides/city-below.json',JSON.stringify(metadata,null,2));
console.log(metadata);
