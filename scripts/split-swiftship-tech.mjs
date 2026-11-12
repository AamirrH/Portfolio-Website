import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const source = path.resolve('assets-src/tech/swiftship-icons-cutout.png');
const output = path.resolve('public/assets/tech-art');
const names = [
  'java', 'spring-boot', 'react', 'spring-cloud-gateway', 'kafka', 'postgres-postgis',
  'redis', 'websocket', 'resilience4j', 'spring-ai-gemini', 'openrouteservice', 'docker',
];
const { width, height, hasAlpha } = await sharp(source).metadata();
if (!width || !height || !hasAlpha || width % 6 || height % 2) {
  throw new Error('Expected a transparent, evenly divided 6×2 tech icon sheet.');
}
const cellWidth = width / 6;
const cellHeight = height / 2;
await mkdir(output, { recursive: true });
for (let index = 0; index < names.length; index++) {
  const left = (index % 6) * cellWidth;
  const top = Math.floor(index / 6) * cellHeight;
  // The PostgreSQL/PostGIS pair deliberately spans the left edge of its cell.
  const extractLeft = index === 5 ? left - 120 : left;
  const extractWidth = index === 5 ? cellWidth + 120 : index === 4 ? cellWidth - 80 : cellWidth;
  const cell = await sharp(source)
    .extract({ left: extractLeft, top, width: extractWidth, height: cellHeight })
    .png()
    .toBuffer();
  await sharp(cell)
    .trim({ background: '#00000000', threshold: 8 })
    .resize(160, 160, { fit: 'contain', background: '#00000000' })
    .webp({ quality: 90, effort: 6 })
    .toFile(path.join(output, `${names[index]}.webp`));
}
console.log(`Wrote ${names.length} transparent tech icons to ${output}`);
