import { test, expect, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

async function enter(page: Page, id: string, debug = false) {
  await page.goto(`/${debug ? '?debug=rects' : ''}#${id}`);
  const ignition = page.getByRole('button', { name: 'PRESS TO IGNITE' });
  if (await ignition.isVisible()) await ignition.click();
  await expect(page.locator(`.scene-frame[data-scene="${id}"]`)).toHaveCSS('opacity', '1');
  await expect(page.locator(`[data-stop="${id}"]`)).toHaveAttribute('data-arrived', 'true');
  await expect(page).toHaveURL(new RegExp(`#${id}$`));
  await page.evaluate(() => document.fonts.ready);
}

for (const viewport of [{width:1440,height:900}, {width:390,height:844}]) {
  test.describe(`${viewport.width}×${viewport.height}`, () => {
    test.use({ viewport });
    for (const id of ['roomly','swiftship']) test(`${id} sits on the curb with visible car and no card overlap`, async ({page}) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await enter(page, id);
      const layout = await page.evaluate(() => {
        const bounds = (selector: string) => document.querySelector(selector)!.getBoundingClientRect().toJSON();
        const art = document.querySelector<HTMLImageElement>('.scene-frame[data-active="true"] .stop-art')!;
        return { building: bounds('.scene-frame[data-active="true"] .building-anchor'), curb: bounds('.scene-frame[data-active="true"] .stop-sidewalk'), card: bounds('.stop-project-panel'), car: bounds('.scene-frame[data-active="true"] .parked-car'), lane: bounds('.scene-frame[data-active="true"] .stop-near-lane'), overflow: document.documentElement.scrollWidth > innerWidth, imageReady: art.complete && art.naturalWidth > 0 };
      });
      expect(layout.imageReady).toBe(true);
      expect(layout.overflow).toBe(false);
      expect(Math.abs(layout.building.bottom - layout.curb.top)).toBeLessThan(1);
      expect(Math.abs(layout.car.top + layout.car.height * 195 / 235 - layout.lane.top)).toBeLessThan(2);
      if (viewport.width >= 768) expect(layout.building.right + 8).toBeLessThanOrEqual(layout.card.left);
      else { expect(layout.building.bottom).toBeLessThan(layout.card.top); expect(layout.car.top + layout.car.height * 195 / 235).toBeLessThan(layout.card.top); }
      await expect(page.locator('.scene-frame[data-active="true"] .building-reflection')).toHaveCSS('opacity', '0.22');
      const door = page.getByRole('link', {name: `Open live project: ${id === 'roomly' ? 'Roomly' : 'SwiftShip'}`});
      const live = id === 'roomly' ? 'https://roomly-xi.vercel.app' : 'https://swift-ship-nu.vercel.app';
      await expect(door).toHaveAttribute('href', live);
      await door.focus();
      await expect(door).toBeFocused();
      await page.context().route(`${live}/**`, route => route.fulfill({body: 'Live project destination'}));
      const popupPromise = page.waitForEvent('popup');
      await door.click();
      const popup = await popupPromise;
      await popup.waitForLoadState();
      expect(popup.url()).toBe(`${live}/`);
      await popup.close();
      await door.blur();
      await page.mouse.move(0, 0);
      await expect(page.locator('.project-metrics')).toHaveCount(0);
      await mkdir('screenshots', {recursive:true});
      await page.screenshot({path:`screenshots/${id}-${viewport.width}x${viewport.height}.png`});
      const notes = page.locator('.project-details');
      await expect(notes).not.toHaveAttribute('open', '');
      await notes.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(notes).toHaveAttribute('open', '');
      await expect(notes.locator('.technical-notes')).toBeVisible();
      await page.keyboard.press('Enter');
      await expect(notes).not.toHaveAttribute('open', '');
      expect(errors).toEqual([]);
    });
  });
}

test('debug coordinates and full exit round-trip clean up scenes, timers and pools', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await enter(page, 'roomly', true);
  await expect(page.locator('.debug-rects .overlay-rect')).toHaveCount(12);
  await page.screenshot({path:'screenshots/roomly-debug-1440x900.png'});
  for (const id of ['swiftship','signalroute','swiftship','roomly']) {
    // Keep a test-only reference to the departing element to verify cleanup.
    await page.evaluate(() => { (window as Window & { previousStop?: Element }).previousStop = document.querySelector('.scene-frame[data-active="true"] .stop-scene')!; });
    await page.locator(`.route-progress a[href="#${id}"]`).click();
    await expect(page.locator(`.scene-frame[data-scene="${id}"]`)).toHaveCSS('opacity','1');
    await expect(page.locator('.scene-frame')).toHaveCount(1);
    await expect(page.locator(`[data-stop="${id}"]`)).toHaveAttribute('data-arrived','true');
    expect(await page.evaluate(() => (window as Window & { previousStop?: Element }).previousStop?.getAttribute('data-timer-count'))).toBe('0');
    await expect(page.locator('.order-ticket')).toHaveCount(id === 'swiftship' ? 6 : 0);
    if (id === 'swiftship') await page.screenshot({path:'screenshots/swiftship-debug-1440x900.png'});
    if (id === 'signalroute') await page.screenshot({path:'screenshots/signalroute-1440x900.png'});
  }
  await page.getByRole('button', {name:'Plain mode',exact:true}).click();
  await expect(page.locator('.camera-rig')).toHaveCount(0);
  await expect(page.locator('.plain-content')).toBeVisible();
  await page.getByRole('button', {name:'Drive mode',exact:true}).click();
  await expect(page.locator('.scene-frame[data-scene="roomly"]')).toHaveCSS('opacity','1');
  expect(errors).toEqual([]);
});

test('reduced motion defaults to plain mode and a static stop when drive mode is chosen', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/#swiftship');
  await expect(page.locator('.plain-content')).toBeVisible();
  await expect(page.locator('.gate')).toHaveCount(0);
  await page.getByRole('button', {name:'Drive mode',exact:true}).click();
  await expect(page.locator('[data-stop="swiftship"]')).toHaveAttribute('data-arrived','true');
  await expect(page.locator('.ticket-anchor')).toBeHidden();
  expect(await page.locator('[data-stop="swiftship"]').getAttribute('data-timer-count')).toBeNull();
});
