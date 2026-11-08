# Hotspots measured before optimization

Source: 0b5ed88; production Edge headless at 1440x900, 4x CPU. Corrected gate-ready timing. Inclusive trace totals overlap and must not be summed.

## home

|Event|ms|
|---|---:|
|RunTask|39317.6|
|ProxyMain::BeginMainFrame|12400.6|
|WebFrameWidgetImpl::UpdateLifecycle|11062.3|
|LocalFrameView::RunStyleAndLayoutLifecyclePhases|9917.4|
|LocalFrameView::UpdateStyleAndLayout|9914.0|
|Blink.Style.UpdateTime|9888.5|
|UpdateLayoutTree|9885.6|
|Document::updateStyle|9878.9|
|Document::recalcStyle|9871.4|
|Scheduler::RunTask|4735.2|

Style 9885.0 ms; layout 0.0 ms; scripting 557.7 ms.
Paint: 474.2 ms.
PaintArtifactCompositor::Update: 610.1 ms.
RendererRasterWorker: 310.3 ms.
GPUTask: 405.2 ms.

## roomly

|Event|ms|
|---|---:|
|RunTask|28471.6|
|ProxyMain::BeginMainFrame|10246.0|
|WebFrameWidgetImpl::UpdateLifecycle|9097.2|
|LocalFrameView::RunStyleAndLayoutLifecyclePhases|7806.9|
|LocalFrameView::UpdateStyleAndLayout|7799.3|
|Blink.Style.UpdateTime|7717.9|
|UpdateLayoutTree|7715.5|
|Document::updateStyle|7710.8|
|Document::recalcStyle|7681.3|
|Scheduler::RunTask|3592.1|

Style 7715.2 ms; layout 21.4 ms; scripting 349.0 ms.
Paint: 550.5 ms.
PaintArtifactCompositor::Update: 378.6 ms.
RendererRasterWorker: 575.0 ms.
GPUTask: 578.9 ms.

## Priorities
1. Audio writes inherited custom properties on document root every frame, invalidating thousands of descendants. Scope these to consuming elements and meter at 30Hz.
2. Large facade SVG trees are static and repeated; external SVG images can preserve exact drawing with far fewer DOM nodes.
3. Rain clears a viewport canvas and updates invisible ripple/lens nodes even when dry. Skip this work.
4. Reflection turbulence is animated every frame, and grain is a live full-screen SVG filter. Test static/baked equivalents against high-tier snapshots.
5. SignalFlow reads geometry each frame and filters/allocates packet arrays. Cache resize geometry and recycle slots.

CameraRig already unmounts outgoing presets after a crossfade; preserve this. Stop preload links currently produce unused-preload console warnings; replace with cancellable idle image decode.

These are code-linked hypotheses, not attributed GPU hardware timings. Retain only after A/B measurement. Raw traces are retained as gzip.
