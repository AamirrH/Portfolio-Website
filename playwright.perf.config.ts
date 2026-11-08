import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./perf',testMatch:'visual.spec.ts',snapshotPathTemplate:'{testDir}/baseline/{arg}{ext}',outputDir:'.qa/perf-visual',reporter:[['json',{outputFile:'perf/visual-pixelmatch.json'}]],expect:{toMatchSnapshot:{maxDiffPixelRatio:.02,threshold:.2}}});
