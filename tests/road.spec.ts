import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

test('road projection, speed and debug comparison',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/?debug=road&perf=1#home');
  await page.getByRole('button',{name:'PRESS TO IGNITE'}).click();
  await expect.poll(()=>page.evaluate(()=>window.__road?.raf)).toBe(true);
  await page.waitForTimeout(2000);
  const samples=await page.evaluate(async()=>{
    const result=[];
    for(let i=0;i<3;i++){result.push({phase:window.__road!.phase,t:performance.now()});if(i<2)await new Promise(resolve=>setTimeout(resolve,500));}
    return result;
  });
  for(let i=1;i<3;i++){const rate=(samples[i].phase-samples[i-1].phase)/((samples[i].t-samples[i-1].t)/1000);expect(rate).toBeGreaterThan(23.4);expect(rate).toBeLessThan(28.6);}
  const geometry=await page.evaluate(()=>{
    const m=window.__road!;
    const n=document.querySelector('[data-road-rails]')!.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    const slope=(n[3]-n[1])/(n[2]-n[0]);
    return {...m,railError:Math.abs((n[0]+(800-n[1])/slope)-(m.vp.x-m.rail*(800-m.vp.y)/m.h))};
  });
  expect(geometry.railError).toBeLessThan(.01);
  expect(geometry.drawMs).toBeLessThan(1);
  await writeFile('screenshots/road-model.json',JSON.stringify({samples,geometry},null,2));
  await page.screenshot({path:'screenshots/road-debug-a.png'});
  const firstPhase=await page.evaluate(()=>window.__road!.phase);
  await page.waitForTimeout(120);
  expect(await page.evaluate(()=>window.__road!.phase)).toBeGreaterThan(firstPhase);
  await page.screenshot({path:'screenshots/road-debug-b.png'});
});

for(const width of [1440,390])for(const section of ['home','projects','contact'])test(`road ${section} ${width}`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.setViewportSize({width,height:width===390?844:900});await page.goto('/#'+section);await page.getByRole('button',{name:'PRESS TO IGNITE'}).click();
  await expect.poll(()=>page.evaluate(()=>window.__road?.raf)).toBe(true);
  await page.waitForTimeout(3000);await page.screenshot({path:`screenshots/road-${section}-${width}-3s.png`});
  await page.waitForTimeout(5000);await page.screenshot({path:`screenshots/road-${section}-${width}-8s.png`});
  expect(errors).toEqual([]);
});

test('road static reduced motion and cleanup',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/#home');await page.getByRole('button',{name:'Drive mode',exact:true}).click();
  await expect(page.locator('.road-markings canvas')).toHaveCount(1);
  await expect.poll(()=>page.evaluate(()=>window.__road?.raf)).toBe(false);
  const phase=await page.evaluate(()=>window.__road!.phase);
  await page.waitForTimeout(500);expect(await page.evaluate(()=>window.__road!.phase)).toBe(phase);
  await page.screenshot({path:'screenshots/road-reduced.png'});
  await page.evaluate(()=>{location.hash='roomly';});
  await expect(page.locator('.road-markings')).toHaveCount(0);
  expect(await page.evaluate(()=>window.__road!.raf)).toBe(false);
});

test('road two minute bounded memory and hidden pause',async({page})=>{
  test.setTimeout(160000);
  const session=await page.context().newCDPSession(page);
  await page.goto('/#home');await page.getByRole('button',{name:'PRESS TO IGNITE'}).click();
  await page.waitForTimeout(3000);
  await session.send('HeapProfiler.collectGarbage');
  const before=await session.send('Runtime.getHeapUsage');
  const nodes=await page.locator('*').count();
  await page.waitForTimeout(120000);
  await session.send('HeapProfiler.collectGarbage');
  const after=await session.send('Runtime.getHeapUsage');
  expect(await page.locator('*').count()).toBe(nodes);
  expect(after.usedSize-before.usedSize).toBeLessThan(1000000);
  await writeFile('screenshots/road-memory.json',JSON.stringify({before:before.usedSize,after:after.usedSize,delta:after.usedSize-before.usedSize,road:await page.evaluate(()=>window.__road)},null,2));
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'));});
  await expect.poll(()=>page.evaluate(()=>window.__road?.raf)).toBe(false);
  await page.evaluate(()=>{Reflect.deleteProperty(document,'hidden');document.dispatchEvent(new Event('visibilitychange'));});
  await expect.poll(()=>page.evaluate(()=>window.__road?.raf)).toBe(true);
  await page.getByRole('button',{name:'Motion on',exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>window.__road?.raf)).toBe(false);
});
