import { test, expect, type Page } from '@playwright/test';

const route = 'frutiger-aero';
test.describe.configure({ mode: 'parallel' });
const bounds = async (page: Page, selector: string) => {
  const box = await page.locator(selector).boundingBox();
  if (!box) throw new Error(`Missing visible bounds for ${selector}`);
  return box;
};

async function ready(page: Page, id: string) {
  await expect(page.locator(`.scene-frame[data-scene="${id}"]`)).toHaveCSS('opacity', '1', { timeout: 25000 });
  await expect(page.locator(`[data-stop="${id}"]`)).toHaveAttribute('data-arrived', 'true');
  await page.evaluate(() => document.fonts.ready);
}

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`daylight stop at ${viewport.width}×${viewport.height}`, async ({ page }) => {
    test.setTimeout(165000);
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(`/#${route}`);
    await ready(page, route);
    const start = Date.now();
    const stop = page.locator(`[data-stop="${route}"]`);
    const pool = async () => Promise.all(['.day-cloud', '.day-bubble', '.day-flyer,.day-perched', '.day-sparkle']
      .map(selector => stop.locator(selector).count()));
    const mobile = viewport.width < 768;
    const counts = [mobile ? 4 : 8, mobile ? 5 : 10, 2, 14];
    expect(await pool()).toEqual(counts);
    expect(await stop.locator('.day-fascia').innerText()).toBe('Frutiger Aero');
    await expect(stop.locator('.day-backdrop')).toBeVisible();
    await expect(stop.locator('.building-reflection,.car-reflection,.building-tint')).toHaveCount(0);
    const building = await bounds(page, '.building-anchor');
    const sidewalk = await bounds(page, '.stop-sidewalk');
    const board = await bounds(page, '.stop-project-panel');
    expect(Math.abs(building.y + building.height - sidewalk.y)).toBeLessThan(1);
    if (mobile) expect(building.y + building.height).toBeLessThan(board.y);
    else expect(building.x + building.width + 8).toBeLessThan(board.x);
    const initialPosition = await bounds(page, '.day-flyer');
    const initialBubble = await stop.locator('.day-bubble').first().evaluate(el => getComputedStyle(el).transform);
    for (const second of [3, 10]) {
      await page.waitForTimeout(Math.max(0, start + second * 1000 - Date.now()));
      await page.screenshot({ path: `screenshots/frutiger-${viewport.width}x${viewport.height}-${second}s.png` });
    }
    const movedPosition = await bounds(page, '.day-flyer');
    expect(Math.hypot(movedPosition.x - initialPosition.x, movedPosition.y - initialPosition.y)).toBeGreaterThan(10);
    expect(await stop.locator('.day-bubble').first().evaluate(el => getComputedStyle(el).transform)).not.toBe(initialBubble);
    if (!mobile) {
      const poolNodes = await stop.locator('.day-cloud,.day-bubble,.day-flyer,.day-perched,.day-sparkle').elementHandles();
      await page.waitForTimeout(Math.max(0, start + 120_000 - Date.now()));
      expect(await pool()).toEqual(counts);
      for (const node of poolNodes) expect(await node.evaluate(el => el.isConnected)).toBe(true);
    }
    const quality = page.getByLabel('Scene quality');
    await quality.selectOption('medium');
    await expect(stop.locator('.day-bubble')).toHaveCount(5);
    await expect(stop.locator('.day-perched')).toBeHidden();
    await quality.selectOption('low');
    await expect(stop).toHaveAttribute('data-day-motion', 'false');
    await quality.selectOption('high');
    const motion = page.getByRole('button', { name: 'Motion', exact: true });
    await motion.click();
    await expect(stop).toHaveAttribute('data-day-motion', 'false');
    await motion.click();
    await expect(stop).toHaveAttribute('data-day-motion', 'true');
    await expect(page.getByRole('link', { name: 'Previous project' })).toHaveAttribute('href', '#signalroute');
    await page.getByRole('link', { name: 'All projects' }).click();
    await expect(page.getByRole('navigation', { name: 'All exits' }).getByRole('link', { name: /Frutiger Aero/ })).toHaveAttribute('href', `#${route}`);
    expect(errors).toEqual([]);
  });
}

test('daylight crossfade cleans up and respects reduced motion', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/#swiftship');
  await ready(page, 'swiftship');
  for (const id of [route, 'swiftship']) {
    await page.evaluate(target => { location.hash = target; }, id);
    await expect(page.locator('.day-sky-snapshot')).toHaveCount(1);
    await expect.poll(() => page.locator('.day-transition-bloom').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0);
    await ready(page, id);
    await expect(page.locator('.day-sky-snapshot')).toHaveCount(0);
    await expect(page.locator('.scene-frame')).toHaveCount(1);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.plain-content')).toBeVisible();
  await page.goto(`/#${route}`);
  await page.getByRole('button', { name: 'Drive mode', exact: true }).click();
  await ready(page, route);
  await expect(page.locator(`[data-stop="${route}"]`)).toHaveAttribute('data-day-motion', 'false');
  await expect(page.locator('.day-bubble').first()).toBeHidden();
  await expect(page.locator('.day-fascia')).toBeVisible();
  expect(errors).toEqual([]);
});
