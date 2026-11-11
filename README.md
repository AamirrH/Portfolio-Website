# Endless Road

Aamir Hussain’s synthwave portfolio: a layered SVG/CSS night drive built with Vite, React 18, strict TypeScript, Tailwind, GSAP + ScrollTrigger, Zustand, and the Web Audio API. No WebGL, Three.js, router library, audio library, or remotely hosted visual assets.

## Run locally

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Node 22 is recommended. `npm run build` runs strict TypeScript checking before generating `dist/`. Fonts are self-hosted as WOFF2. The dev server binds to 127.0.0.1.

## Static deployment folder

Run `npm run build:deployment` to refresh `deployment/`. It contains a self-contained Vercel site: `vercel.json` plus `public/` with the compiled pages, scripts, styles, and assets used at runtime. It excludes source code, dependencies, raw artwork, unused traffic/city assets, and image-processing reports. The two audio formats and downloadable résumé are included.

To deploy this package from the repository, set the Vercel **Root Directory** to `deployment`. Its config selects the **Other** framework, skips building, and serves `public/`. The site uses hash links, so no route rewrites are needed. Re-run the command and commit the refreshed folder after each website change.

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

The ignition click unlocks AudioContext, optionally synthesizes a short engine start, and plays the supplied track at volume 0.35. The browser prefers the compressed Opus WebM at `public/audio/resonance.webm`, then AAC at `public/audio/resonance.m4a`; the original MP3 remains archived under `assets-src/audio/` and is not served. AnalyserNode reads low-frequency energy at 30 Hz to drive sun scale/glow, taillight opacity, and sign illumination. Mute preference persists in localStorage. Audio and animation pause when the tab is hidden. A missing/failed track is silent and shows sound off. The fallback pulse uses `BPM` from `src/config.ts` (92 by default). The browser audio check verifies playback, analyser response, looping configuration, volume, and mute persistence: `npx playwright test tests/audio.spec.ts`.

## Accessibility and mobile

Plain mode unmounts the scene and provides a normal scrolling page with identical project data. It persists locally and is enabled automatically for reduced-motion preferences. The ignition gate is bypassed when plain mode is active. All reduced-motion animations are disabled, including when drive mode is explicitly selected. The gate traps focus, background UI is inert until ignition, navigation is keyboard accessible, and section changes have a live announcement.

Below 768px, pointer parallax, near buildings, power lines, grain, and chromatic edges are disabled; a bottom tab bar replaces gantry navigation. Small screens retain independent project-card scrolling. At particularly short viewport heights, decorative side-car and dashboard readouts are hidden to prioritize the content.

## Atmosphere and extras

The initial CSS palette is sunset. On load, visitor-local time selects dawn (05:00–07:59), sunset (17:00–19:59), or deep night otherwise. Click/focus the sun on the home scene to cycle palettes. The Konami sequence (up, up, down, down, left, right, left, right, B, A) adds a three-second speed boost; it is disabled in plain/reduced-motion mode. The about dashboard’s CS/∞ dials are decorative, not skill ratings or claimed performance metrics.

### Quality and performance checks

The top bar's Quality selector offers Auto, High, Medium, and Low. `?quality=high|medium|low` pins a tier; without it, Auto chooses an initial tier from device capabilities and can adjust while the scene is running. Motion Off, Plain mode, reduced-motion, and hidden tabs pause the shared animation ticker. The lightweight inline gate paints before React; scene and animation modules begin loading when ignition starts. Diagnostics are available with `?perf=1`.

The reproducible production-preview harness is `node --experimental-strip-types scripts/perf-run.ts after`; route/profile filters are documented in `scripts/perf-run.ts`. `scripts/perf-leaks.ts` checks cleanup and heap/DOM growth. Results and comparison tables are written under `perf/`. `npm run build` regenerates the strict TypeScript production bundle.

## Vercel

Import the GitHub repository into Vercel and select the Vite framework. Use `npm run build` and the `dist` output directory; `vercel.json` supplies these settings. No server, API, environment variables, or path rewrites are required because navigation uses URL hashes. This task prepares the deployment; it does not create a Vercel project or claim a live deployment.

Before publishing, replace the SVG social placeholder with `public/og.png` (1200×630), set `og:image` to the final absolute HTTPS image URL, and add `og:url`/canonical metadata using the real deployment URL. SVG is a design placeholder; social crawlers generally need PNG/JPEG. The local SVG favicon is ready.

## Illustrated project stops

The original images are preserved as `assets-src/roomly-raw.png` and `assets-src/swiftship-raw.png`. They were copied from the supplied `assests-src/` folder; those originals were not modified. Their actual canvas size is 2752×1536, so watermark coordinates are scaled from the request's 2576×1438 reference size.

```sh
npm run assets:key
```

`scripts/key-assets.mjs` uses Sharp to key green with the requested 40–110 greenness ramp, despill translucent/two-pixel edge neighborhoods, erase the sparkle, identify the building footprint 24 pixels above the alpha bottom, remove the protruding ground line, and trim. The raw canvas contains green padding below the ground line, so the script measures the alpha bottom rather than the canvas bottom. It writes quality-90 WebP files and white alpha silhouettes to `public/assets/stops/`. Height-based downsampling enforces a combined 400,000-byte limit without reducing quality. The original two stops total **255,280 bytes**; all three stops, six WebP sprites, and silhouettes total **350,613 bytes**. `asset-report.json` records source/crop/output dimensions and percentage ground-contact bounds.

Tune the building height, anchor, and percentage overlay rectangles in `src/data/stops.ts`. Desktop heights are 62vh/44vh for Roomly/SwiftShip, mobile 38vh/30vh. An aspect-preserving height cap ensures the wide store fits the viewport; desktop anchors also stay clear of the card. No width-based distortion is applied. Buildings meet the curb exactly; wheel contact is computed from the side-car SVG's actual baseline. The separate reflected image is vertically flipped, faded, and blurred on desktop. Both reflections drop blur on mobile.

Open `/?debug=rects#roomly` or `/?debug=rects#swiftship` to inspect labeled overlay rectangles. Roomly has ten individual pane overlays, the replacement vacancy plate, and a cropped glowing blade sign. SwiftShip has the open-sign glow, status light, interior breathing light, and a six-element ticket pool following a quadratic arc. Mobile animates only three Roomly panes and emits no tickets. Visibility/reduced-motion changes cancel scheduled work. Scene departure clears timers/tweens and removes outgoing scene DOM after the crossfade. Animation only changes transforms and opacity; all shadows, masks, and blur are static.

## Verification

With `npm run dev` running, execute:

```sh
npm run test:stops
```

Playwright uses installed Microsoft Edge in headless mode (`channel: 'msedge'` in `playwright.config.ts`). The stop and SignalRoute tests cover all three raster stops at **1440×900** and **390×844**, actual curb/wheel contact, card clearance, no horizontal overflow, image readiness, reflection opacity, zero console/page errors on those views, stop 1 → 2 → 3 → back → 1 cleanup, mode toggling, and reduced-motion startup. Screenshots—including both overlay-debug views and SignalRoute—are saved under `screenshots/`. Failure traces are written to ignored `.qa/playwright/`.

## Validation and remaining inputs

The original nine phases and the illustrated-stop feature have successful production builds and incremental Git commits pushed to `origin/main`. The original stop checks and added SignalRoute checks pass. The production JS is approximately 114 KB gzipped, excluding local fonts/audio and the separately loaded stop artwork. Lighthouse 85+ is a target, not a measured score: run a desktop Lighthouse audit against the deployed production build before claiming it. The supplied audio now passes the browser playback and mute-persistence check.

Supply:

- Optional replacement layer art as above.
- Final 1200×630 OG PNG/JPEG and deployment URL.
- SignalRoute AI repository URL in `content.ts`.
- Contact email, graduation year, and résumé URL/file if desired; the corresponding TODOs are explicit.


### SignalRoute raster stop

`assets-src/signalroute-raw.png` and `assets-src/messages-raw.png` preserve the supplied originals. `npm run assets:key` also runs `scripts/key-signalroute.mjs`, sharing `chroma-key.mjs` with the other stops. It removes the baseline and watermark, trims the depot, produces its sunset silhouette, and selects the six largest connected alpha components in reading order from the sprite sheet. Each icon is exported as transparent PNG and quality-90 WebP; the scene loads WebP only. `signalroute-report.json` records dimensions and component boxes.

`stops.ts` defines the lens, chute, barrier, LED, fascia, and dish rectangles. Inspect `/?debug=rects#signalroute`. The depot, pole, and gate share one trimmed baseline aligned to the curb. The baked barrier uses the requested red-flash fallback; it does not rotate or obscure the underlying artwork.

`SignalFlow.tsx` owns one cancellable animation frame and a fixed pool of eight sprites (four on mobile). Signal timing is green 2.4 s, amber 1.0 s, red 2.8 s. Packets spawn at least 700 ms apart, with a 20% flagged probability. Green routes to NOTIFY; amber queues near DIGEST for 600 ms; red stops before the gate. Flagged messages dissolve before the depot with a cross burst. Chute flashes last 200 ms. Server LEDs change at 0.4–1.6 s intervals. Mobile uses straight intake paths and hides rooftop waves; reduced motion has a static green signal and no packet pool. Scene changes, hidden tabs, and preference changes cancel the frame and clear active packets.

`npx playwright test tests/signalroute.spec.ts tests/stops.spec.ts` checks all raster stops, signal cycling, message movement, card clearance, pool bounds, reduced motion, and 1→2→3→1 cleanup. SignalRoute screenshots and debug overlays at 1440×900 and 390×844 are in `screenshots/`.

### DeLorean artwork

Accepted car originals live in `assets-src/cars/`. Run `node scripts/key-cars.mjs` to chroma-key, despill, trim, and export transparent WebP assets into `public/assets/cars/`. The side source is the clean wheel-less body supplied on November 5; separate tyres rotate during arrival and stop when parked. All project stops share `SideCar.tsx`, including their reflections. Home and contact share the rear sprite through `Car.tsx`. Reduced-motion preferences disable tyre rotation.

The top-view asset is prepared but currently unused. The earlier overlapping side-reference images and the front three-quarter image are not used by the runtime.

### Stop lighting and skyline polish

The three city depths are generated in `src/components/scene/Skyline.tsx`; `mid-skyline` also supports an optional layer-art replacement. Stop sidewalks, occlusion, accent grading, light pools and reflections are shared in `src/stops.css`. SwiftShip's window grade uses the existing interior overlay rectangle in `src/data/stops.ts` (`?debug=rects`).

`SCENE_QUALITY` in `src/config.ts` controls bloom and reflection ripple. Bloom and ripple are disabled on mobile; reduced motion disables ripple and pointer parallax. `useStopPolish` cleans up its GSAP tweens and pointer listeners on unmount and when preferences change. Reflection displacement is horizontal only.

Verification: `npm run build`; `npx playwright test tests/stops.spec.ts tests/polish.spec.ts`. These cover the home and three stop screenshots at 1440x900 and 390x844, sidewalk alignment, card clearance, console errors, scene cleanup, parallax and reduced-motion fallbacks. Updated previews are in `screenshots/`.

### Illustrated skyline, neighbours and street props

`npm run assets:key` now also runs `scripts/key-environment.mjs`. Canonical source sheets are `assets-src/props-raw.png`, `neighbors-raw.png`, and `skyline-raw.png`, copied from the supplied `screenshots/background-entities/` artwork. The single skyline sheet is used for all three depths with different scale and grading, as requested. Mirrored tiles conceal seams; antenna and blade-sign HTML overlays can be inspected with `?debug=rects`.

The props extractor groups connected components into twelve named sprites, retaining disconnected rack/chair pieces while excluding pixels from adjacent objects. Outputs and crop reports live in `public/assets/props/`, `neighbors/`, and `skyline/`. `src/data/propAssets.ts` is generated by the pipeline.

Edit each stop's `props` list in `src/data/stops.ts` to change its asset, horizontal percentage (of the usable scene area before the card), height relative to its building, scale, z-order, front/behind placement, and mobile visibility/position. Roomly and SwiftShip show four props on desktop and two on mobile; SignalRoute shows three and one. Roomly also has the two cropped neighbour facades, with reduced outer extents on mobile.

### Rain
Rear scenes retain the original highway and DeLorean, with no added traffic, oncoming cars, roadside pools or lower-city layer.
Contact defaults to rain intensity 0.7; home/projects are dry. R toggles rain and ?weather=rain forces it.
Motion off, reduced motion and hidden tabs pause the effect. ?perf=1 shows rain FPS and pool counts.
The canvas uses at most 220 streaks on desktop and 80 on mobile. Existing music is unchanged.
Archived traffic source assets are retained but are not loaded by the site.
Verification: npx playwright test tests/highway.spec.ts.

### Rear road projection
Only the rear routes (#home, #projects, #contact) mount RoadMarkings. The road model reads the actual neon path segments and the rendered DeLorean sprite in the road SVG's 1440x800 coordinates. It recalibrates after a 150 ms debounced resize.

The measured intersection is (720, 505.8535). Sprite scale and camera height vary with viewport and the existing suspension pose at calibration. The original illustration does not match a 5.25 m rail half-width. With the owner's approval, all three lanes are proportional to the measured road: lane borders and studs use +/-rail/3. Neither the car nor rail artwork is repositioned. The illustration has no independent physical strip-height datum, so light packets follow the measured neon plane exactly. Drawing is clipped at the actual asphalt start as well as between the rails, with a short fade at that visible horizon.

Phase integrates 26 m/s at cruise speed; boosts change its derivative, never its value. A fixed 40-streak pool and reused canvas path draw the road surface. Off/reduced motion draws one static frame; hidden tabs and inactive routes cancel RAF. No traffic or other highway extras are enabled.

Use ?debug=road for projection rays and depth ticks (dense labels are available as SVG titles); ?perf=1 includes road FPS and average canvas CPU submission time. window.__road exposes phase, geometry and RAF/cost diagnostics. Canvas timings do not include the rest of the scene or asynchronous GPU/compositor work.

Run npx playwright test tests/road.spec.ts for speed, rail alignment, desktop/mobile captures, reduced motion, hidden-tab cleanup and a two-minute post-GC memory check. Evidence lives in screenshots/road-*.png and road-model.json / road-memory.json.

### Archived city plate
The generated city-below.webp and keying pipeline are retained but unused. CITY_PLATE and all traffic/side-fill flags are false; plate overlays and debug code have been removed.

### Rear scene polish
Near/mid tile facades continue behind the deck only in rear views, inheriting their existing parallax. A 90px fog blend and a separate underside edge sit beneath the unchanged highway artwork. Projects uses the shared RoadSign component and existing content categories as subtitles.

RoadMarkings uses 0.11 m paint, 0.3 m / 0.10 glow, bottom-scale fade and a halo cutoff near the camera. Decorative borders and studs are 20% wider than the approved proportional lane spacing; the road model and rails are unchanged. The large unchanged car can still occlude distant markings, especially on mobile.

Run npx playwright test tests/rear-polish.spec.ts for all rear routes at 1440x900 and 390x844, 3s/10s screenshots and console checks.
