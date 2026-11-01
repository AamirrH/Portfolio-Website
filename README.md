# Endless Road

Aamir Hussain’s synthwave portfolio: a layered SVG/CSS night drive built with Vite, React 18, strict TypeScript, Tailwind, GSAP + ScrollTrigger, Zustand, and the Web Audio API. No WebGL, Three.js, router library, audio library, or remotely hosted visual assets.

## Run locally

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Node 22 is recommended. `npm run build` runs strict TypeScript checking before generating `dist/`. Fonts are bundled locally from Fontsource. The dev server binds to 127.0.0.1.

## Content and links

Edit `src/data/content.ts` for owner details, copy, labels, project information, measurements, and links. Missing information is shown as a clearly marked TODO, never a fabricated link. Static SEO metadata is in `index.html`.

Routes: `#home`, `#projects`, `#roomly`, `#swiftship`, `#signalroute`, `#about`, `#contact`. Direct links retain their destination through the ignition gate. Scroll the background, use arrow keys, select the gantry exits, or use the footer arrows. Project cards have their own scroll area so long descriptions remain readable. Browser back/forward works with explicit navigation; scrolling replaces the current history entry.

## Scene and camera controls

- `src/components/scene/`: independent sky, sun, skyline, near buildings, power lines, highway, gantry, car, and overlay components.
- `src/scene/cameraPresets.ts`: rear, side, dash, and aerial poses, including per-layer translation, scale, rotation, opacity, static blur, and road speed.
- `src/state/useSceneStore.ts`: one speed value drives road and wheel animation timing.
- `src/hooks/useCamera.ts`: 1.2-second GSAP transitions with `power3.inOut`; interrupted transitions continue from their current pose.
- `src/styles.css`: palette variables, scene composition, responsive rules, and transform/opacity animation. Blur and shadows are static, never tweened.

### Optional replacement art

Add files to `public/assets/layers/` with these exact base names:

| File base name | Replaces |
| --- | --- |
| `sky` | Gradient sky and clouds |
| `sun` | Disc, scanline cuts, and aura |
| `far-skyline` | Distant buildings |
| `near-buildings` | Foreground left/right buildings |
| `power-lines` | Wires and poles |
| `highway` | Road, rails, lane dashes, streetlights |
| `gantry` | Steel structure; semantic nav remains separate |
| `car-rear` | Rear chase car |
| `car-side` | Side profile car |
| `overlay` | Film grain, vignette, scanlines |

Supported extensions: `.svg`, `.png`, `.webp`, `.jpg`, `.avif`. Use one file per base name. Transparent 1440×800 full-scene canvases work well: place the object where it should appear in the scene. Images fill their layer using `object-fit: cover`; avoid essential detail at the edges. For cars, use transparent full-scene artwork with the vehicle positioned to match the fallback. Missing or failed images automatically use the procedural fallback. Add assets before building; rebuild for Vercel to discover them. Replacing a layer with a flat image preserves camera/parallax transforms but cannot preserve internal SVG wheel/window/scanline animation.

The `context/` folder is reference material, not a runtime asset source. Updated references can be reviewed in a later design pass; the application does not automatically copy them into production.

### Audio

Supply `public/audio/resonance.mp3`, then restart/rebuild. The audio is intentionally absent from this repository. Nothing downloads or bundles a third-party track automatically.

The ignition click unlocks AudioContext, optionally synthesizes a short engine start, and plays the local audio at volume 0.35. AnalyserNode reads low-frequency energy to drive sun scale/glow, taillight opacity, and sign illumination. Mute preference persists in localStorage. Audio and animation pause when the tab is hidden. A missing/failed track is silent and shows sound off. The fallback pulse uses `BPM` from `src/config.ts` (92 by default). Actual music playback and beat response still need a check after the supplied file is added.

## Accessibility and mobile

Plain mode unmounts the scene and provides a normal scrolling page with identical project data. It persists locally and is enabled automatically for reduced-motion preferences. The ignition gate is bypassed when plain mode is active. All reduced-motion animations are disabled, including when drive mode is explicitly selected. The gate traps focus, background UI is inert until ignition, navigation is keyboard accessible, and section changes have a live announcement.

Below 768px, pointer parallax, near buildings, power lines, grain, and chromatic edges are disabled; a bottom tab bar replaces gantry navigation. Small screens retain independent project-card scrolling. At particularly short viewport heights, decorative side-car and dashboard readouts are hidden to prioritize the content.

## Atmosphere and extras

The initial CSS palette is sunset. On load, visitor-local time selects dawn (05:00–07:59), sunset (17:00–19:59), or deep night otherwise. Click/focus the sun on the home scene to cycle palettes. The Konami sequence (up, up, down, down, left, right, left, right, B, A) adds a three-second speed boost; it is disabled in plain/reduced-motion mode. The about dashboard’s CS/∞ dials are decorative, not skill ratings or claimed performance metrics.

## Vercel

Import the GitHub repository into Vercel and select the Vite framework. Use `npm run build` and the `dist` output directory; `vercel.json` supplies these settings. No server, API, environment variables, or path rewrites are required because navigation uses URL hashes. This task prepares the deployment; it does not create a Vercel project or claim a live deployment.

Before publishing, replace the SVG social placeholder with `public/og.png` (1200×630), set `og:image` to the final absolute HTTPS image URL, and add `og:url`/canonical metadata using the real deployment URL. SVG is a design placeholder; social crawlers generally need PNG/JPEG. The local SVG favicon is ready.

## Validation and remaining inputs

Each of the nine requested phases has a successful production build and a separate Git commit. Commits are pushed to `origin/main`. Browser QA covered ignition without audio, direct project links, desktop project navigation, narrow mobile overflow, and plain-mode content. The production JS is approximately 109 KB gzipped, excluding local fonts/audio. Lighthouse 85+ is a target, not a measured score: run a desktop Lighthouse audit against the deployed production build before claiming it. No live audio file is available for playback verification yet.

Supply:

- `public/audio/resonance.mp3` (with appropriate rights).
- Optional replacement layer art as above.
- Final 1200×630 OG PNG/JPEG and deployment URL.
- SignalRoute AI repository URL in `content.ts`.
- Contact email, graduation year, and résumé URL/file if desired; the corresponding TODOs are explicit.
