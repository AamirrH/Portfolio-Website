import { test, expect } from '@playwright/test';

for (const width of [1440, 390]) test(`original road with rain ${width}`, async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
  await page.goto('/#contact');
  await page.getByRole('button', { name: 'PRESS TO IGNITE' }).click();
  await expect(page.locator('.gate')).toHaveCount(0);
  for (const section of ['home', 'projects', 'contact']) {
    await page.evaluate(hash => { location.hash = hash; }, section);
    await expect(page.locator('.rear-car')).toHaveCount(1);
    await expect(page.locator('.living-traffic,.roadside-pool,.oncoming-world,.lower-city,.plain-traffic')).toHaveCount(0);
  }
  await expect.poll(() => page.locator('.rain-world').getAttribute('data-rain-active').then(Number)).toBeGreaterThan(0);
  await page.screenshot({ path: `screenshots/rain-only-${width}.png` });
  await page.keyboard.press('r');
  await expect.poll(() => page.locator('.rain-world').getAttribute('data-rain-active').then(Number)).toBe(0);
  await page.keyboard.press('r');
  await expect.poll(() => page.locator('.rain-world').getAttribute('data-rain-active').then(Number)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Motion on', exact: true }).click();
  await expect(page.locator('.rain-world')).toHaveCSS('opacity', '0');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.plain-content')).toHaveCount(1);
  await expect(page.locator('.plain-traffic')).toHaveCount(0);
  expect(errors).toEqual([]);
});
