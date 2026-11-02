import { test, expect } from '@playwright/test';

for (const mobile of [false,true]) test(`SignalRoute raster flow, overlays and cleanup ${mobile ? 'mobile' : 'desktop'}`, async ({page}) => {
  await page.setViewportSize(mobile ? {width:390,height:844}:{width:1440,height:900});
  const errors:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error') errors.push(message.text());});
  await page.goto('/?debug=rects#signalroute');
  await page.getByRole('button',{name:'PRESS TO IGNITE'}).click();
  const stop = page.locator('[data-stop="signalroute"]');
  await expect(stop).toHaveAttribute('data-arrived','true');
  await expect(stop.locator('.stop-art')).toHaveAttribute('src','/assets/stops/signalroute.webp');
  await expect(stop.locator('.message-packet')).toHaveCount(mobile?4:8);
  await expect(stop.locator('.overlay-signal')).toHaveCount(3);
  await expect(stop.locator('.overlay-chute')).toHaveCount(3);
  await expect(stop.locator('.rack-led')).toHaveCount(12);
  await expect(stop).toHaveAttribute('data-signal','amber');
  await expect(stop).toHaveAttribute('data-signal','red');
  await expect(stop).toHaveAttribute('data-signal','green');
  if(mobile) await expect(stop.locator('.dish-waves')).toBeHidden();
  await expect.poll(()=>stop.locator('.message-packet img').evaluateAll(images=>images.every(img=>(img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth>0))).toBe(true);
  const moving = await page.evaluate(async()=>{
    const stop=document.querySelector('[data-stop="signalroute"]')!;
    const card=document.querySelector('.stop-project-panel')!.getBoundingClientRect();
    const samples: string[]=[];
    let overlap=false;
    for(let i=0;i<20;i++) {
      const nodes=Array.from(stop.querySelectorAll<HTMLElement>('.message-packet'));
      samples.push(nodes.map(n=>n.style.transform).join(''));
      for(const node of nodes) if(Number(node.style.opacity)>0 && (innerWidth>=768 ? node.getBoundingClientRect().right>card.left : node.getBoundingClientRect().bottom>card.top)) overlap=true;
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    return {moving:new Set(samples).size>1,overlap};
  });
  expect(moving).toEqual({moving:true,overlap:false});
  await page.screenshot({path:`screenshots/signalroute-debug-${mobile?'390x844':'1440x900'}.png`});
  await page.evaluate(()=>{(window as Window & {oldSignal?:Element}).oldSignal=document.querySelector('[data-stop="signalroute"]')!;});
  for(const id of ['roomly','swiftship','signalroute','roomly']) {
    await page.locator(`.route-progress a[href="#${id}"]`).click();
    await expect(page.locator('.scene-frame')).toHaveCount(1);
    await expect(page.locator(`[data-stop="${id}"]`)).toHaveAttribute('data-arrived','true');
  }
  expect(await page.evaluate(()=>(window as Window & {oldSignal?:Element}).oldSignal?.getAttribute('data-signal-frame-count'))).toBe('0');
  expect(await page.evaluate(()=>(window as Window & {oldSignal?:Element}).oldSignal?.getAttribute('data-message-active'))).toBe('0');
  await expect(page.locator('.message-packet')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('reduced-motion SignalRoute is static green with no message pool',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/#signalroute');
  await expect(page.locator('.plain-content')).toBeVisible();
  await page.getByRole('button',{name:'Drive mode',exact:true}).click();
  await expect(page.locator('[data-stop="signalroute"]')).toHaveAttribute('data-signal','green');
  await expect(page.locator('.message-packet')).toHaveCount(0);
  await expect(page.locator('.dish-waves')).toBeHidden();
});
