import { expect, test } from '@playwright/test';

for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
  test.describe(`${viewport.width}×${viewport.height} phone`, () => {
    test.use({ viewport, isMobile: true, hasTouch: true });

    test('road and steering wheel stay visible until tech info is opened', async ({ page }) => {
      await page.goto('/#about');
      await expect(page.locator('[data-scene="dash"]')).toHaveCSS('opacity', '1');
      const wheel = page.getByRole('slider', { name: /Steering wheel/ });
      const info = page.getByRole('button', { name: 'Tech stack', exact: true });
      const console = page.locator('.dash-console');
      await expect(wheel).toBeInViewport({ ratio: .95 });
      await expect(info).toBeVisible();
      await expect(console).toBeHidden();
      await expect(page.locator('.dashboard-shell')).toHaveCSS('background-image', 'none');
      const road = await page.locator('[data-scene="dash"] [data-road-surface]').boundingBox();
      expect(road!.y).toBeGreaterThan(viewport.height * .63);

      await wheel.press('ArrowRight');
      await info.click();
      const close = page.getByRole('button', { name: 'Close tech stack' });
      await expect(close).toBeFocused();
      await expect(page.getByRole('tab', { name: 'Frameworks' })).toHaveAttribute('aria-selected', 'true');
      const tech = page.getByRole('tabpanel');
      await expect(tech.locator('li')).toHaveCount(8);
      await expect.poll(() => tech.locator('li').evaluateAll(
        items => items.every(item => item.scrollWidth <= item.clientWidth),
      )).toBe(true);
      expect(await console.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      const last = tech.getByText('REST APIs');
      await last.scrollIntoViewIfNeeded();
      await expect(last).toBeInViewport();
      await close.press('Escape');
      await expect(console).toBeHidden();
      await expect(info).toBeFocused();
      await expect(page).toHaveURL(/#about$/);
    });

    test('compact About card opens the full biography and hosted résumé', async ({ page }, testInfo) => {
      await page.goto('/#about');
      await expect(page.locator('[data-scene="dash"]')).toHaveCSS('opacity', '1');
      const card = page.locator('.about-panel');
      const toggle = card.getByRole('button', { name: 'Bio & résumé' });
      await expect(card.getByRole('heading')).toHaveText('Curiosity is the engine.');
      await expect(card.locator('.about-details')).toBeHidden();
      expect((await card.boundingBox())!.height).toBeLessThan(100);
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      const resume = card.getByRole('link', { name: 'View résumé' });
      await resume.scrollIntoViewIfNeeded();
      await expect(resume).toBeInViewport();
      await expect(resume).toHaveAttribute('href', /^https:\/\//);
      await toggle.click();
      await expect(card.locator('.about-details')).toBeHidden();
      await page.screenshot({ path: testInfo.outputPath('road-first.png') });
    });
  });
}

test('laptop keeps the steering wheel and visible tech console', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('/#about');
  await expect(page.locator('.dash-console')).toBeVisible();
  await expect(page.locator('.about-panel .about-details')).toBeVisible();
  await expect(page.locator('.about-mobile-toggle')).toBeHidden();
  await expect(page.locator('.dash-tech-open, .dash-tech-close').filter({ visible: true })).toHaveCount(0);
  await page.getByRole('slider', { name: /Steering wheel/ }).press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Frameworks' })).toHaveAttribute('aria-selected', 'true');
});
