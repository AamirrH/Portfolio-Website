import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
for(const route of ['home','projects','roomly','swiftship','signalroute','about','contact'])for(const width of [1440,390])test(`${route} ${width}`,()=>{expect(readFileSync(`perf/after/${route}-${width}.png`)).toMatchSnapshot(`${route}-${width}.png`);});
