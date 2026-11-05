import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromaKey} from './chroma-key.mjs';
await mkdir('public/assets/cars',{recursive:true});
const entries=[['rear','rear.png',null,640],['side','side.png',null,1000],['wheel','wheel.png',null,256],['top','top.png',null,480]];
for(const [name,file,crop,size] of entries){
 let input=sharp(`assets-src/cars/${file}`);
 if(crop) input=input.extract(crop);
 const {data,info:{width,height}}=await input.ensureAlpha().raw().toBuffer({resolveWithObject:true});
 chromaKey(data,width,height);
 if(name==='side') for(let y=Math.floor(height*.76);y<height;y++) for(let x=Math.floor(width*.85);x<width;x++) data[(y*width+x)*4+3]=0;
 const png=await sharp(data,{raw:{width,height,channels:4}}).png().toBuffer();
 const result=await sharp(png).trim({threshold:0}).resize({width:size}).webp({quality:90,alphaQuality:100}).toBuffer();
 await writeFile(`public/assets/cars/${name}.webp`,result);
 console.log(name,await sharp(result).metadata(),result.length);
}
