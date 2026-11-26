import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const assets = fileURLToPath(new URL('../public/assets/', import.meta.url));
const output = path.join(assets, 'road-trip');
await mkdir(output, { recursive: true });

const stops = {
  roomly: 'roomly',
  swiftship: 'swiftship',
  signalroute: 'signalroute',
  'frutiger-aero': 'frutiger',
  'frutiger-backdrop': 'frutiger-backdrop',
};

for (const [id, source] of Object.entries(stops)) {
  for (const width of [480, 768]) {
    await sharp(path.join(assets, 'stops', source + '.webp'))
      .resize({ width })
      .webp({ quality: 83, alphaQuality: 96 })
      .toFile(path.join(output, `${id}-${width}w.webp`));
  }
}

// Bake the parked car using the same body and wheel positions as SideCar.
const body = await sharp(path.join(assets, 'cars/side.webp')).resize(560, 151, { fit: 'fill' }).png().toBuffer();
const wheel = await sharp(path.join(assets, 'cars/wheel.webp')).resize(88, 88).png().toBuffer();
const parkedCar = await sharp({ create: { width: 560, height: 171, channels: 4, background: '#0000' } })
  .composite([
    { input: body, left: 0, top: 0 },
    { input: wheel, left: 73, top: 83 },
    { input: wheel, left: 397, top: 83 },
  ])
  .png().toBuffer();
await sharp(parkedCar).flop().resize({ width: 480 }).webp({ quality: 87 }).toFile(path.join(output, 'parked-car.webp'));
