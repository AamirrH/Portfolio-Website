import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(root, 'deployment');
if (path.relative(root, output) !== 'deployment') throw new Error('Unexpected deployment target');

const files = new Set(['index.html', 'favicon.svg', 'og-placeholder.svg']);
const asset = name => files.add(`assets/${name}`);
const manifest = JSON.parse(await readFile(path.join(root, 'src/data/imageManifest.json'), 'utf8'));

for (const name of ['skyline/far.webp', 'skyline/mid.webp', 'skyline/near.webp',
  'stops/roomly.webp', 'stops/swiftship.webp', 'stops/signalroute.webp',
  'cars/rear.webp', 'cars/side.webp', 'cars/wheel.webp']) {
  const key = `/assets/${name}`;
  const variants = manifest[key]?.variants;
  if (!variants) throw new Error(`Missing responsive art entry: ${key}`);
  for (const variant of variants) files.add(variant.src.slice(1));
}

for (const name of ['facades.svg', 'facades-mobile.svg']) asset(`skyline/${name}`);
for (const name of ['roomly', 'swiftship', 'signalroute']) asset(`stops/${name}-silhouette.png`);
for (const name of ['text-cyan', 'text-pink', 'image', 'voice', 'flagged', 'envelope']) asset(`stops/msg-${name}.webp`);
for (const name of ['left', 'right']) asset(`neighbors/${name}.webp`);
for (const name of ['space-grotesk-400.woff2', 'space-grotesk-500.woff2']) asset(`fonts/${name}`);
for (const name of ['resonance.webm', 'resonance.m4a']) asset(`audio/${name}`);
asset('effects/grain.webp');
asset('documents/Resume_Aamir.pdf');
asset('tech/LICENSE');

const content = await readFile(path.join(root, 'src/data/content.ts'), 'utf8');
for (const [, name] of content.matchAll(/\bicon: '([\w-]+)'/g)) asset(`tech/${name}.svg`);
const stops = await readFile(path.join(root, 'src/data/stops.ts'), 'utf8');
for (const [, name] of stops.matchAll(/\basset:'([\w-]+)'/g)) asset(`props/${name}.webp`);

for (const name of await readdir(path.join(root, 'dist/assets'))) {
  if (/\.(?:js|css)$/.test(name)) asset(name);
}
for (const name of await readdir(path.join(root, 'public/assets/layers'))) {
  if (/\.(?:svg|png|webp|jpg|avif)$/.test(name)) asset(`layers/${name}`);
}

// Validate every source before replacing a previous deployment package.
for (const name of files) {
  const source = path.join(root, name === 'index.html' || name === 'favicon.svg' || name === 'og-placeholder.svg'
    ? 'dist' : name.startsWith('assets/') && /\.(?:js|css)$/.test(name)
      ? 'dist' : 'public', name);
  await readFile(source);
}

await rm(output, { recursive: true, force: true });
const publicRoot = path.join(output, 'public');
for (const name of [...files].sort()) {
  const source = path.join(root, name === 'index.html' || name === 'favicon.svg' || name === 'og-placeholder.svg'
    ? 'dist' : name.startsWith('assets/') && /\.(?:js|css)$/.test(name)
      ? 'dist' : 'public', name);
  const target = path.join(publicRoot, name);
  await mkdir(path.dirname(target), { recursive: true });
  await cp(source, target);
}

const config = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'));
await writeFile(path.join(output, 'vercel.json'), JSON.stringify({
  $schema: 'https://openapi.vercel.sh/vercel.json',
  framework: null,
  buildCommand: null,
  outputDirectory: 'public',
  headers: config.headers
}, null, 2) + '\n');
console.log(`Prepared deployment/public with ${files.size} runtime files.`);
