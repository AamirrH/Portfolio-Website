import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve('public/assets/tech-art');
const sheets = [
  {
    project: 'roomly', rows: 2, alphaFloor: 130,
    names: ['java', 'spring-boot', 'spring-security', 'spring-data-jpa', 'react', 'postgresql',
      'razorpay', 'google-calendar', 'jwt', 'docker'],
  },
  {
    project: 'signalroute', rows: 1, alphaFloor: 20,
    names: ['python', 'pandas', 'pydantic', 'scikit-learn', 'gemini', 'pillow'],
  },
];

await mkdir(output, { recursive: true });
for (const sheet of sheets) {
  const source = path.resolve(`assets-src/tech/${sheet.project}-icons-cutout.png`);
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (info.width % 6 || info.height % sheet.rows) throw new Error(`Unexpected ${sheet.project} sheet dimensions`);
  for (let pixel = 3; pixel < data.length; pixel += 4) {
    const alpha = data[pixel];
    data[pixel] = alpha <= sheet.alphaFloor ? 0 : Math.min(255, Math.round((alpha - sheet.alphaFloor) * 255 / (255 - sheet.alphaFloor)));
  }
  const cleaned = await sharp(data, { raw: info }).png().toBuffer();
  const cellWidth = info.width / 6;
  const cellHeight = info.height / sheet.rows;
  for (let index = 0; index < sheet.names.length; index++) {
    const cell = await sharp(cleaned).extract({
      left: (index % 6) * cellWidth,
      top: Math.floor(index / 6) * cellHeight,
      width: cellWidth,
      height: cellHeight,
    }).png().toBuffer();
    await sharp(cell)
      .trim({ background: '#00000000', threshold: 8 })
      .resize(160, 160, { fit: 'contain', background: '#00000000' })
      .webp({ quality: 90, effort: 6 })
      .toFile(path.join(output, `${sheet.project}-${sheet.names[index]}.webp`));
  }
  console.log(`Wrote ${sheet.names.length} ${sheet.project} icons`);
}

// The supplied Pillow pictogram had photographic texture; use its cleaned variant.
const pillowSource = path.resolve('assets-src/tech/signalroute-pillow-clean.png');
const { data: pillow, info: pillowInfo } = await sharp(pillowSource).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let pixel = 3; pixel < pillow.length; pixel += 4) {
  const alpha = pillow[pixel];
  pillow[pixel] = alpha <= 35 ? 0 : Math.min(255, Math.round((alpha - 35) * 255 / 220));
}
await sharp(pillow, { raw: pillowInfo })
  .trim({ background: '#00000000', threshold: 8 })
  .resize(160, 160, { fit: 'contain', background: '#00000000' })
  .webp({ quality: 90, effort: 6 })
  .toFile(path.join(output, 'signalroute-pillow.webp'));
