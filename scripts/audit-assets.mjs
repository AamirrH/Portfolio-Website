import fs from 'node:fs/promises';
import sharp from 'sharp';
const files=[];async function walk(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())await walk(p);else{const {size}=await fs.stat(p);let meta={};if(/\.(webp|png|jpg|avif)$/.test(p))meta=await sharp(p).metadata().then(m=>({width:m.width,height:m.height}));files.push({path:p,bytes:size,...meta});}}}await walk('public');files.sort((a,b)=>b.bytes-a.bytes);await fs.writeFile('perf/assets-before.json',JSON.stringify(files,null,2));console.log(files.slice(0,10));
