import { test, expect, type Page } from '@playwright/test';
import { projects } from '../src/data/content';

async function enter(page: Page, id: string, debug = false) {
  await page.goto(`/${debug ? '?debug=rects' : ''}#${id}`);
  const ignition = page.getByRole('button', { name: 'PRESS TO IGNITE' });
  if (await ignition.isVisible()) await ignition.click();
  // Lazy scene chunks and artwork can take longer than an animation to load.
  await page.locator(`[data-stop="${id}"]`).waitFor({ state:'attached', timeout:25000 });
  await expect(page.locator(`.scene-frame[data-scene="${id}"]`)).toHaveCSS('opacity', '1');
  await expect(page.locator(`[data-stop="${id}"]`)).toHaveAttribute('data-arrived', 'true');
  await expect(page).toHaveURL(new RegExp(`#${id}$`));
  await page.evaluate(() => document.fonts.ready);
}

test('plain mode retains every project detail', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/#roomly');
  await expect(page.locator('.plain-content')).toBeVisible();
  for (const project of projects) {
    const article = page.locator(`.plain-project#${project.id}`);
    await expect(article.locator('.project-pitch')).toHaveText(project.pitch);
    await expect(article.locator('.highlights li')).toHaveText(project.highlights);
    await expect(article.locator('.project-tech-list li > span:last-child')).toHaveText(project.stack);
  }
  await expect(page.locator('.stop-project-panel')).toHaveCount(0);
});

for (const viewport of [
  {width:1366,height:768}, {width:1280,height:720}, {width:1536,height:864},
  {width:1440,height:900}, {width:1024,height:640}
]) {
  test.describe(`${viewport.width}×${viewport.height}`, () => {
    test.use({ viewport });
    for (const id of ['roomly','swiftship','signalroute']) test(`${id} sits on the curb with visible car and no card overlap`, async ({page}, testInfo) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await enter(page, id);
      await expect.poll(() => page.locator('.scene-frame[data-active="true"] .stop-art').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      const layout = await page.evaluate(() => {
        const bounds = (selector: string) => document.querySelector(selector)!.getBoundingClientRect().toJSON();
        const art = document.querySelector<HTMLImageElement>('.scene-frame[data-active="true"] .stop-art')!;
        return { building: bounds('.scene-frame[data-active="true"] .building-anchor'), curb: bounds('.scene-frame[data-active="true"] .stop-sidewalk'), card: bounds('.stop-project-panel'), car: bounds('.scene-frame[data-active="true"] .parked-car'), lane: bounds('.scene-frame[data-active="true"] .stop-near-lane'), overflow: document.documentElement.scrollWidth > innerWidth, imageReady: art.complete && art.naturalWidth > 0 };
      });
      const props = page.locator('.scene-frame[data-active="true"] .stop-prop:visible');
      const expectedProps = viewport.width < 768 ? (id === 'signalroute' ? 1 : 2) : (id === 'signalroute' ? 3 : 4);
      await expect(props).toHaveCount(expectedProps);
      for (const prop of await props.all()) {
        await expect.poll(()=>prop.locator('.prop-art').evaluate((img:HTMLImageElement)=>img.complete && img.naturalWidth>0)).toBe(true);
        const box = await prop.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        if(viewport.width >= 768) expect(box!.x+box!.width+14).toBeLessThan(layout.card.left);
        else expect(box!.y+box!.height).toBeLessThan(layout.card.top);
      }
      expect(layout.imageReady).toBe(true);
      expect(layout.overflow).toBe(false);
      expect(Math.abs(layout.building.bottom - layout.curb.top)).toBeLessThan(1);
      expect(Math.abs(layout.car.top + layout.car.height * 195 / 235 - layout.lane.top)).toBeLessThan(2);
      if (viewport.width >= 768) {
        expect(layout.building.right + 8).toBeLessThanOrEqual(layout.card.left);
        expect(layout.building.top).toBeGreaterThanOrEqual(87);
        expect(layout.building.left).toBeGreaterThanOrEqual(0);
        expect(layout.card.width).toBeLessThanOrEqual(460);
        expect(layout.card.height).toBeLessThanOrEqual(560);
        expect(layout.card.top).toBeGreaterThanOrEqual(87);
        expect(layout.card.bottom).toBeLessThanOrEqual(viewport.height - 87);
        // The wide buildings should gain visible area, not just move sideways.
        if (id !== 'roomly') {
          const aspect = id === 'swiftship' ? 1445 / 900 : 1439 / 720;
          const previousHeight = Math.min(viewport.height * (id === 'swiftship' ? .44 : .43), (viewport.width - Math.min(640, Math.max(360, viewport.width * .44)) - 80) / aspect);
          expect(layout.building.height).toBeGreaterThan(previousHeight * 1.1);
        }
      }
      else { expect(layout.building.bottom).toBeLessThan(layout.card.top); expect(layout.car.top + layout.car.height * 195 / 235).toBeLessThan(layout.card.top); }
      await expect(page.locator('.scene-frame[data-active="true"] .building-reflection')).toHaveCSS('opacity', '0.3');
      if (id !== 'signalroute') {
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
      }
      await expect(page.locator('.project-metrics')).toHaveCount(0);
      const inner = page.locator('.stop-project-panel .panel-inner');
      const header = await page.locator('.board-header').boundingBox();
      const pagination = await page.locator('.project-pagination').boundingBox();
      expect(await inner.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      await inner.hover();
      await page.mouse.wheel(0, 2000);
      await expect.poll(() => inner.evaluate(el => Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop))).toBeLessThanOrEqual(1);
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator('.project-tech-list li').last()).toBeInViewport();
      expect(await page.locator('.board-header').boundingBox()).toEqual(header);
      expect(await page.locator('.project-pagination').boundingBox()).toEqual(pagination);
      await inner.evaluate(el => { el.scrollTop = 0; });
      await page.screenshot({path:testInfo.outputPath(`${id}-${viewport.width}x${viewport.height}.png`)});
      await expect(page.locator('.project-details')).toHaveCount(0);
      expect(errors).toEqual([]);
    });
  });
}
