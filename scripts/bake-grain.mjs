import sharp from 'sharp';
import fs from 'node:fs/promises';
await fs.mkdir('public/assets/effects',{recursive:true});let seed=987;const rgba=Buffer.alloc(256*256*4);for(let p=0;p<rgba.length;p+=4){seed=(seed*16807)%2147483647;rgba[p]=rgba[p+1]=rgba[p+2]=seed%256;rgba[p+3]=7;}await sharp(rgba,{raw:{width:256,height:256,channels:4}}).webp({quality:35}).toFile('public/assets/effects/grain.webp');
