import { test,expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
for(const width of [1440,390]) for(const scene of ['home','projects','contact','rain']) test(`living highway ${scene} ${width}`,async({page})=>{
 test.setTimeout(60000);await page.setViewportSize({width,height:width===390?844:900});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto(`/?perf=1${scene==='rain'?'&weather=rain':''}#${scene==='rain'?'contact':scene}`);await page.getByRole('button',{name:'PRESS TO IGNITE'}).click();await expect(page.locator('.gate')).toHaveCount(0);await expect(page.locator('.living-traffic')).toHaveAttribute('data-pool',width===390?'4':'10');
 await page.screenshot({path:`screenshots/highway-${scene}-${width}-0s.png`});await page.waitForTimeout(8000);
 await expect.poll(()=>page.locator('.traffic-car').evaluateAll(nodes=>nodes.filter(n=>{const r=n.getBoundingClientRect();return Number(getComputedStyle(n).opacity)>.05&&r.right>0&&r.left<innerWidth&&r.bottom>0&&r.top<innerHeight;}).length),{timeout:12000}).toBeGreaterThan(0);
 await page.screenshot({path:`screenshots/highway-${scene}-${width}-8s.png`});
 await expect(page.locator('.rain-canvas')).toHaveCount(1);if(scene==='contact'||scene==='rain')await expect.poll(()=>page.locator('.rain-world').getAttribute('data-rain-active').then(Number)).toBeGreaterThan(0);
 const report=await page.evaluate(()=>({pools:Array.from(document.querySelectorAll<HTMLElement>('[data-pool]')).map(n=>({class:n.className,pool:Number(n.dataset.pool),frames:n.dataset.frames,fps:n.dataset.fps})),rain:document.querySelector<HTMLElement>('.rain-world')?.dataset.rainActive,perf:document.querySelector('.highway-perf')?.textContent,overflow:document.documentElement.scrollWidth>innerWidth}));expect(report.overflow).toBe(false);expect(report.pools.reduce((a,b)=>a+b.pool,0)).toBeLessThan(80);
 await writeFile(`screenshots/highway-${scene}-${width}-perf.json`,JSON.stringify(report,null,2));
 await page.getByRole('button',{name:'Motion on',exact:true}).click();await expect(page.locator('.living-traffic')).toHaveAttribute('data-frames','0');const before=await page.locator('.traffic-car').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).transform));await page.waitForTimeout(300);expect(await page.locator('.traffic-car').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).transform))).toEqual(before);
 await page.getByRole('button',{name:'Motion off',exact:true}).click();await expect(page.locator('.living-traffic')).toHaveAttribute('data-frames','1');
 expect(errors).toEqual([]);
});
test('highway pools stay bounded for two minutes and clean up',async({page})=>{
 test.setTimeout(180000);await page.goto('/?weather=rain&perf=1#contact');await page.getByRole('button',{name:'PRESS TO IGNITE'}).click();await expect(page.locator('.living-traffic')).toHaveAttribute('data-frames','1');const count=await page.locator('.rear-scene *').count();
 await page.waitForTimeout(121000);expect(await page.locator('.rear-scene *').count()).toBe(count);
 await page.evaluate(()=>{(window as Window & {oldRoots?:Element[]}).oldRoots=Array.from(document.querySelectorAll('[data-pool]'));});await page.evaluate(()=>{location.hash='roomly';});await expect(page.locator('.rain-world')).toHaveCount(0);await expect(page.locator('.living-traffic')).toHaveCount(0);expect(await page.evaluate(()=>(window as Window & {oldRoots?:Element[]}).oldRoots?.every(n=>n.getAttribute('data-frames')==='0'))).toBe(true);
});

test('rain key, hidden-tab cleanup and reduced motion',async({page})=>{
 await page.goto('/#contact');await page.getByRole('button',{name:'PRESS TO IGNITE'}).click();await expect.poll(()=>page.locator('.rain-world').getAttribute('data-rain-active').then(Number)).toBeGreaterThan(0);
 await page.keyboard.press('r');await expect.poll(()=>page.locator('.rain-world').getAttribute('data-rain-active').then(Number)).toBe(0);
 await page.keyboard.press('r');await expect.poll(()=>page.locator('.rain-world').getAttribute('data-rain-active').then(Number)).toBeGreaterThan(0);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
 await expect.poll(()=>page.locator('[data-pool]').evaluateAll(nodes=>nodes.every(n=>n.getAttribute('data-frames')==='0'))).toBe(true);
 await page.evaluate(()=>{Reflect.deleteProperty(document,'hidden');document.dispatchEvent(new Event('visibilitychange'));});await expect(page.locator('.living-traffic')).toHaveAttribute('data-frames','1');
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.plain-traffic img')).toHaveCount(3);await page.getByRole('button',{name:'Drive mode',exact:true}).click();await expect(page.locator('.living-traffic')).toHaveAttribute('data-frames','0');await expect(page.locator('.rain-world')).toHaveCSS('opacity','0');
});
