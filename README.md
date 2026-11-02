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
- `src/components/scene/CameraRig.tsx`: crossfades independent rear, dashboard, aerial, and project-stop scene components. Camera changes never rotate or skew individual layers.
- `src/scene/cameraPresets.ts`: travel speeds; project stops are parked at zero speed.
- `src/state/useSceneStore.ts`: one speed value drives road and wheel animation timing.
- `src/components/stops/`: Roomly, SwiftShip, and SignalRoute stop compositions, masked artwork, pooled overlays, and a procedural signal/data-centre building.
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

The supplied Resonance track is included at `public/assets/audio/resonance.mp3`. Replace that file and rebuild to change the music. It is served as a separate static asset, outside the JavaScript bundle.

The ignition click unlocks AudioContext, optionally synthesizes a short engine start, and plays the local audio at volume 0.35. AnalyserNode reads low-frequency energy to drive sun scale/glow, taillight opacity, and sign illumination. Mute preference persists in localStorage. Audio and animation pause when the tab is hidden. A missing/failed track is silent and shows sound off. The fallback pulse uses `BPM` from `src/config.ts` (92 by default). The browser audio check verifies MP3 decoding, ignition playback, analyser response, looping configuration, volume, and mute persistence: `npx playwright test tests/audio.spec.ts`.

## Accessibility and mobile

Plain mode unmounts the scene and provides a normal scrolling page with identical project data. It persists locally and is enabled automatically for reduced-motion preferences. The ignition gate is bypassed when plain mode is active. All reduced-motion animations are disabled, including when drive mode is explicitly selected. The gate traps focus, background UI is inert until ignition, navigation is keyboard accessible, and section changes have a live announcement.

Below 768px, pointer parallax, near buildings, power lines, grain, and chromatic edges are disabled; a bottom tab bar replaces gantry navigation. Small screens retain independent project-card scrolling. At particularly short viewport heights, decorative side-car and dashboard readouts are hidden to prioritize the content.

## Atmosphere and extras

The initial CSS palette is sunset. On load, visitor-local time selects dawn (05:00–07:59), sunset (17:00–19:59), or deep night otherwise. Click/focus the sun on the home scene to cycle palettes. The Konami sequence (up, up, down, down, left, right, left, right, B, A) adds a three-second speed boost; it is disabled in plain/reduced-motion mode. The about dashboard’s CS/∞ dials are decorative, not skill ratings or claimed performance metrics.

## Vercel

Import the GitHub repository into Vercel and select the Vite framework. Use `npm run build` and the `dist` output directory; `vercel.json` supplies these settings. No server, API, environment variables, or path rewrites are required because navigation uses URL hashes. This task prepares the deployment; it does not create a Vercel project or claim a live deployment.

Before publishing, replace the SVG social placeholder with `public/og.png` (1200×630), set `og:image` to the final absolute HTTPS image URL, and add `og:url`/canonical metadata using the real deployment URL. SVG is a design placeholder; social crawlers generally need PNG/JPEG. The local SVG favicon is ready.

## Illustrated project stops

The original images are preserved as `assets-src/roomly-raw.png` and `assets-src/swiftship-raw.png`. They were copied from the supplied `assests-src/` folder; those originals were not modified. Their actual canvas size is 2752×1536, so watermark coordinates are scaled from the request's 2576×1438 reference size.

```sh
npm run assets:key
```

`scripts/key-assets.mjs` uses Sharp to key green with the requested 40–110 greenness ramp, despill translucent/two-pixel edge neighborhoods, erase the sparkle, identify the building footprint 24 pixels above the alpha bottom, remove the protruding ground line, and trim. The raw canvas contains green padding below the ground line, so the script measures the alpha bottom rather than the canvas bottom. It writes quality-90 WebP files and white alpha silhouettes to `public/assets/stops/`. Height-based downsampling enforces a combined 400,000-byte limit without reducing quality. Current art plus masks totals **255,280 bytes**. `asset-report.json` records source/crop/output dimensions and percentage ground-contact bounds.

Tune the building height, anchor, and percentage overlay rectangles in `src/data/stops.ts`. Desktop heights are 62vh/44vh for Roomly/SwiftShip, mobile 38vh/30vh. An aspect-preserving height cap ensures the wide store fits the viewport; desktop anchors also stay clear of the card. No width-based distortion is applied. Buildings meet the curb exactly; wheel contact is computed from the side-car SVG's actual baseline. The separate reflected image is vertically flipped, faded, and blurred on desktop. Both reflections drop blur on mobile.

Open `/?debug=rects#roomly` or `/?debug=rects#swiftship` to inspect labeled overlay rectangles. Roomly has ten individual pane overlays, the replacement vacancy plate, and a cropped glowing blade sign. SwiftShip has the open-sign glow, status light, interior breathing light, and a six-element ticket pool following a quadratic arc. Mobile animates only three Roomly panes and emits no tickets. Visibility/reduced-motion changes cancel scheduled work. Scene departure clears timers/tweens and removes outgoing scene DOM after the crossfade. Animation only changes transforms and opacity; all shadows, masks, and blur are static.

## Verification

With `npm run dev` running, execute:

```sh
npm run test:stops
```

Playwright uses installed Microsoft Edge in headless mode (`channel: 'msedge'` in `playwright.config.ts`). The six tests cover both raster stops at **1440×900** and **390×844**, actual curb/wheel contact, card clearance, no horizontal overflow, image readiness, reflection opacity, zero console/page errors on those views, stop 1 → 2 → 3 → back → 1 cleanup, mode toggling, and reduced-motion startup. Screenshots—including both overlay-debug views and SignalRoute—are saved under `screenshots/`. Failure traces are written to ignored `.qa/playwright/`.

## Validation and remaining inputs

The original nine phases and the illustrated-stop feature have successful production builds and incremental Git commits pushed to `origin/main`. All six stop checks passed. The production JS is approximately 112 KB gzipped, excluding local fonts/audio and the separately loaded stop artwork. Lighthouse 85+ is a target, not a measured score: run a desktop Lighthouse audit against the deployed production build before claiming it. The supplied audio now passes the browser playback and mute-persistence check.

Supply:

- Optional replacement layer art as above.
- Final 1200×630 OG PNG/JPEG and deployment URL.
- SignalRoute AI repository URL in `content.ts`.
- Contact email, graduation year, and résumé URL/file if desired; the corresponding TODOs are explicit.
