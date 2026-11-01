import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'public/assets/stops');
await mkdir(output, { recursive: true });

function bounds(data, width, height) {
  let left = width, top = height, right = -1, bottom = -1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (!data[(y * width + x) * 4 + 3]) continue;
    left = Math.min(left, x); right = Math.max(right, x);
    top = Math.min(top, y); bottom = Math.max(bottom, y);
  }
  if (right < 0) throw new Error('Chroma key produced an empty image.');
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

const report = {};
let totalBytes = 0;
for (const name of ['roomly', 'swiftship']) {
  const input = await readFile(path.join(root, `assets-src/${name}-raw.png`));
  const { data, info: { width, height } } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const transparent = new Uint8Array(width * height);
  const watermarkX = Math.floor(width * 2380 / 2576);
  const watermarkY = Math.floor(height * 1250 / 1438);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    const greenness = data[i + 1] - Math.max(data[i], data[i + 2]);
    const alpha = greenness > 110 ? 0 : greenness > 40 ? Math.round(255 * (110 - greenness) / 70) : 255;
    data[i + 3] = x > watermarkX && y > watermarkY ? 0 : Math.min(data[i + 3], alpha);
    transparent[y * width + x] = data[i + 3] === 0 ? 1 : 0;
  }
  // Use the original keyed alpha, not an iteratively expanded neighborhood.
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    let edge = data[i + 3] < 255;
    for (let dy = -2; dy <= 2 && !edge; dy++) for (let dx = -2; dx <= 2; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && transparent[ny * width + nx]) { edge = true; break; }
    }
    if (edge) data[i + 1] = Math.min(data[i + 1], Math.max(data[i], data[i + 2]));
  }

  const before = bounds(data, width, height);
  const bottom = before.top + before.height - 1;
  let groundLeft = width, groundRight = -1;
  // The originals have green padding below the line: use the alpha bottom,
  // rather than the canvas bottom, as the ground-contact edge.
  for (let y = Math.max(0, bottom - 26); y <= bottom - 22; y++) for (let x = 0; x < width; x++) {
    if (data[(y * width + x) * 4 + 3] > 0) { groundLeft = Math.min(groundLeft, x); groundRight = Math.max(groundRight, x); }
  }
  if (groundRight < groundLeft) throw new Error(`Cannot identify ${name}'s building footprint.`);
  for (let y = Math.max(0, bottom - 7); y <= bottom; y++) for (let x = 0; x < width; x++) {
    if (x < groundLeft || x > groundRight) data[(y * width + x) * 4 + 3] = 0;
  }
  const crop = bounds(data, width, height);
  const trimmed = await sharp(data, { raw: { width, height, channels: 4 } }).extract(crop).raw().toBuffer();
  let outputHeight = Math.min(crop.height, name === 'roomly' ? 1200 : 900);
  let encoded, pixels, outInfo, silhouette;
  do {
    const resized = await sharp(trimmed, { raw: { width: crop.width, height: crop.height, channels: 4 } })
      .resize({ height: outputHeight, withoutEnlargement: true }).raw().toBuffer({ resolveWithObject: true });
    pixels = resized.data; outInfo = resized.info;
    encoded = await sharp(pixels, { raw: outInfo }).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toBuffer();
    const mask = Buffer.alloc(pixels.length);
    for (let i = 0; i < pixels.length; i += 4) {
      mask[i] = mask[i + 1] = mask[i + 2] = 255;
      mask[i + 3] = pixels[i + 3] > 0 ? 255 : 0;
    }
    silhouette = await sharp(mask, { raw: outInfo }).png({ palette: true, colours: 2, compressionLevel: 9 }).toBuffer();
    if (encoded.length + silhouette.length <= 195_000) break;
    outputHeight = Math.floor(outputHeight * .9);
    if (outputHeight < 500) throw new Error(`${name} cannot fit the asset budget at usable resolution.`);
  } while (true);
  await writeFile(path.join(output, `${name}.webp`), encoded);
  await writeFile(path.join(output, `${name}-silhouette.png`), silhouette);
  totalBytes += encoded.length + silhouette.length;
  const pct = n => Number(n.toFixed(3));
  report[name] = {
    source: { width, height }, crop,
    output: { width: outInfo.width, height: outInfo.height, bytes: encoded.length, maskBytes: silhouette.length },
    boxesPct: {
      alpha: { x: 0, y: 0, width: 100, height: 100 },
      ground: { x: pct((groundLeft - crop.left) / crop.width * 100), y: pct((bottom - crop.top) / crop.height * 100), width: pct((groundRight - groundLeft + 1) / crop.width * 100), height: pct(100 / crop.height) }
    }
  };
  console.log(`${name}: ${outInfo.width} × ${outInfo.height}; WebP ${encoded.length} B + mask ${silhouette.length} B`);
  console.log(JSON.stringify(report[name], null, 2));
}
if (totalBytes >= 400_000) throw new Error(`Stop art exceeds 400 KB: ${totalBytes} bytes`);
await writeFile(path.join(output, 'asset-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Combined WebP + silhouette budget: ${totalBytes} / 400000 bytes`);
