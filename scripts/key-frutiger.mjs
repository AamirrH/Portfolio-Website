import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';
import { keyMagenta } from './chroma-key.mjs';

// Search windows isolate the intended artwork from the unused clouds and footer.
// Coordinates use a 900 × 502 reference of the source sheet.
const sprites = [
  ['butterfly-open', 25, 25, 240, 186],
  ['butterfly-closed', 244, 25, 365, 185],
  ['cloud-1', 376, 45, 532, 151],
  ['cloud-2', 543, 49, 696, 154],
  ['cloud-3', 702, 40, 877, 160],
  ['cloud-4', 25, 215, 283, 348],
  ['cloud-5', 615, 175, 873, 318],
  ['sparkle-1', 512, 324, 658, 472],
  ['sparkle-2', 665, 345, 774, 460],
  ['sparkle-3', 787, 367, 862, 442],
];

function isolateLargest(data, width, height) {
  const labels = new Uint32Array(width * height);
  const queue = new Uint32Array(labels.length);
  let largest = 0;
  let largestSize = 0;
  for (let pixel = 0; pixel < labels.length; pixel++) {
    if (labels[pixel] || !data[pixel * 4 + 3]) continue;
    const label = pixel + 1;
    let end = 0;
    function add(next) {
      if (!labels[next] && data[next * 4 + 3]) {
        labels[next] = label;
        queue[end++] = next;
      }
    }
    add(pixel);
    for (let i = 0; i < end; i++) {
      const next = queue[i];
      const x = next % width;
      if (x > 0) add(next - 1);
      if (x < width - 1) add(next + 1);
      if (next >= width) add(next - width);
      if (next < labels.length - width) add(next + width);
    }
    if (end > largestSize) {
      largest = label;
      largestSize = end;
    }
  }
  if (!largest) throw new Error('No foreground component found.');
  for (let i = 0; i < labels.length; i++) {
    if (labels[i] !== largest) data.fill(0, i * 4, i * 4 + 4);
  }
}

function alphaBounds(data, width, height) {
  let left = width, right = -1, top = height, bottom = -1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (!data[(y * width + x) * 4 + 3]) continue;
    left = Math.min(left, x);
    right = Math.max(right, x);
    top = Math.min(top, y);
    bottom = Math.max(bottom, y);
  }
  if (right < 0) throw new Error('Magenta key produced an empty image.');
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

export async function keyFrutigerAssets(root) {
  const assets = path.join(root, 'public/assets/stops');
  const spriteDir = path.join(assets, 'frutiger-sprites');
  const screenshots = path.join(root, 'screenshots');
  await Promise.all([mkdir(spriteDir, { recursive: true }), mkdir(screenshots, { recursive: true })]);
  const source = (name) => path.join(root, 'asset-src-generated', name + '.png');
  const previews = [];
  async function writeAsset(image, destination, maxWidth, { component = true, backdrop = false, exteriorGaps, sparkle = false } = {}) {
    const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width, height } = info;
    // The antialiasing on the yellow stars was drawn against pink.
    if (sparkle) for (let i = 0; i < data.length; i += 4) {
      const m = Math.min(data[i], data[i + 2]) - data[i + 1];
      if (m > 35 && Math.min(data[i], data[i + 2]) > 90) data[i + 1] = Math.min(data[i], data[i + 2]) - 91;
    }
    keyMagenta(data, width, height, exteriorGaps);
    if (sparkle) for (let i = 0; i < data.length; i += 4) {
      if (!data[i + 3] || data[i + 1] < 140) continue;
      // Keep the pale yellow highlight and remove the sheet's pink cast.
      data[i] = Math.min(data[i], data[i + 1] + 12);
      data[i + 2] = Math.min(data[i + 2], data[i + 1]);
    }
    if (component) isolateLargest(data, width, height);
    const crop = alphaBounds(data, width, height);
    if (backdrop) Object.assign(crop, { left: 0, width, height: height - crop.top });
    const result = await sharp(data, { raw: info }).extract(crop)
      .resize({ width: maxWidth, withoutEnlargement: true }).webp({ quality: 92, alphaQuality: 100 }).toFile(destination);
    previews.push(destination);
    console.log(path.basename(destination), result.width, result.height, result.size);
  }
  const pavilion = path.join(assets, 'frutiger.webp');
  await writeAsset(sharp(source('Frutiger-Aero-Building')), pavilion, 1440, {
    // Background visible between the narrow supports and behind the foliage.
    exteriorGaps: [[2374, 577], [377, 611], [388, 1082], [422, 1099], [2346, 1219]],
  });
  const { data: alpha, info: maskInfo } = await sharp(pavilion).extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  const silhouette = path.join(assets, 'frutiger-silhouette.png');
  await sharp({ create: { width: maskInfo.width, height: maskInfo.height, channels: 3, background: 'white' } })
    .joinChannel(alpha, { raw: maskInfo }).png().toFile(silhouette);
  previews.push(silhouette);
  await writeAsset(sharp(source('Background-Aero')), path.join(assets, 'frutiger-backdrop.webp'), 1920, { component: false, backdrop: true });
  const sheet = sharp(source('Frutiger-Aero-Background'));
  const { width, height } = await sheet.metadata();
  for (const [name, x1, y1, x2, y2] of sprites) {
    const left = Math.floor(x1 * width / 900);
    const top = Math.floor(y1 * height / 502);
    const crop = { left, top, width: Math.ceil(x2 * width / 900) - left, height: Math.ceil(y2 * height / 502) - top };
    await writeAsset(sheet.clone().extract(crop), path.join(spriteDir, name + '.webp'), 420, { sparkle: name === 'sparkle-2' || name === 'sparkle-3' });
  }
  const tiles = await Promise.all(previews.map(async (input, i) => ({
    input: await sharp(input).resize(320, 180, { fit: 'contain', background: '#808080' }).flatten({ background: '#808080' }).png().toBuffer(),
    left: i % 3 * 320,
    top: Math.floor(i / 3) * 180,
  })));
  await sharp({ create: { width: 960, height: Math.ceil(tiles.length / 3) * 180, channels: 3, background: '#808080' } })
    .composite(tiles).png().toFile(path.join(screenshots, 'frutiger-keyed.png'));
}
