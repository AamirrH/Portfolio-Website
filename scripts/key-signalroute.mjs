import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { chromaKey } from './chroma-key.mjs';
const out = new URL('../public/assets/stops/', import.meta.url);
const report = {};
import { components } from './asset-components.mjs';
for (const name of ['signalroute','messages']) {
  const input = await readFile(new URL(`../assets-src/${name}-raw.png`, import.meta.url));
  const {data,info:{width,height}} = await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  chromaKey(data,width,height);
  if (name === 'signalroute') {
    // Remove the thin drawn baseline, preserving the shared pole/depot/gate contact edge.
    let bottom = height-1;
    while (bottom > 0 && !data.subarray(bottom*width*4,(bottom+1)*width*4).some((v,i)=>i%4===3 && v>0)) bottom--;
    data.fill(0,(bottom-7)*width*4,(bottom+1)*width*4);
    const keyed = await sharp(data,{raw:{width,height,channels:4}}).png().toBuffer();
    const trimmed = await sharp(keyed).trim({threshold:0}).resize({height:720}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    const encoded = await sharp(trimmed.data,{raw:trimmed.info}).webp({quality:90,alphaQuality:100}).toBuffer();
    const mask = Buffer.from(trimmed.data);
    for(let i=0;i<mask.length;i+=4) {mask[i]=mask[i+1]=mask[i+2]=255;mask[i+3]=mask[i+3]>0?255:0;}
    await writeFile(new URL('signalroute.webp',out),encoded);
    await sharp(mask,{raw:trimmed.info}).png({palette:true,colours:2}).toFile(new URL('signalroute-silhouette.png',out).pathname.replace(/^\/(\w:)/,'$1'));
    report.building={width:trimmed.info.width,height:trimmed.info.height,bytes:encoded.length};
  } else {
    const boxes = components(data,width,height).slice(0,6);
    if(boxes.length!==6) throw new Error('Expected six message components');
    boxes.sort((a,b)=>a.top-b.top);
    const sorted=[...boxes.slice(0,3).sort((a,b)=>a.left-b.left),...boxes.slice(3).sort((a,b)=>a.left-b.left)];
    const names=['text-cyan','text-pink','image','voice','flagged','envelope'];
    report.sprites=[];
    for(let i=0;i<6;i++) {
      const {area,...box}=sorted[i];
      const sprite=sharp(data,{raw:{width,height,channels:4}}).extract(box).resize({width:160});
      await writeFile(new URL(`msg-${names[i]}.webp`,out),await sprite.clone().webp({quality:90,alphaQuality:100}).toBuffer());
      await writeFile(new URL(`msg-${names[i]}.png`,out),await sprite.clone().png().toBuffer());
      report.sprites.push({name:names[i],...box,area});
    }
  }
}
await writeFile(new URL('signalroute-report.json',out),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
