import { test, expect } from '@playwright/test';
for (const width of [1440,390]) test(`skyline depths and home ${width}`,async({page})=>{
  await page.setViewportSize({width,height:width===390?844:900});
  const errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error') errors.push(m.text());});
  await page.goto('/#home');
  await page.getByRole('button',{name:'PRESS TO IGNITE'}).click();
  await expect(page.locator('.gate')).toHaveCount(0);
  await expect(page.locator('.rear-scene .city-far')).toBeVisible();
  await expect(page.locator('.rear-scene .city-mid')).toBeVisible();
  await expect(page.locator('.rear-scene .city-near')).toBeVisible();
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:`screenshots/home-${width}x${width===390?844:900}.png`});
  await page.goto('/#swiftship');
  await expect(page.locator('[data-stop="swiftship"]')).toHaveAttribute('data-arrived','true');
  await expect(page.locator('.stop-curb')).toHaveCSS('height','14px');
  await expect(page.locator('.interior-grade')).toBeVisible();
  const bloom=page.locator('.building-bloom');
  if(width===390) { await expect(bloom).toBeHidden(); await expect(page.locator('.reflection-parallax')).toHaveCSS('filter','none'); }
  else {
    await expect(bloom).toBeVisible();
    await page.mouse.move(1430,450);
    await expect.poll(()=>page.locator('.building-parallax').evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m41)).toBeGreaterThan(6);
    await page.emulateMedia({reducedMotion:'reduce'});
    await expect(page.locator('.plain-content')).toBeVisible();
    await page.getByRole('button',{name:'Drive mode',exact:true}).click();
    await expect(page.locator('.reflection-parallax')).toHaveCSS('filter','none');
    await expect(page.locator('.building-parallax')).toHaveCSS('transform','none');
  }
  expect(errors).toEqual([]);
});
