import { expect, test } from '@playwright/test';

test('landscape phone keeps project info closed between stops', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 844, height: 390 },
    isMobile: true,
    hasTouch: true,
  });
  try {
    const page = await context.newPage();
    await page.goto('/#swiftship');
    const board = page.locator('.stop-project-panel');
    const info = page.getByRole('button', { name: 'Project info', exact: true });
    const close = page.getByRole('button', { name: 'Close project info' });
    await expect(page.locator('[data-stop="swiftship"]')).toHaveAttribute('data-arrived', 'true');
    await expect(board).toBeHidden();
    await expect(info).toHaveAttribute('aria-controls', 'swiftship-project-info');
    await info.click();
    await expect(close).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(info).toBeFocused();
    await expect(board).toBeHidden();
    await info.click();
    await page.getByRole('link', { name: 'Next project' }).click();
    await expect(page).toHaveURL(/#signalroute$/);
    await expect(board).toBeHidden();
    await expect(info).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('[data-stop="signalroute"]')).toHaveAttribute('data-arrived', 'true');
  } finally {
    await context.close();
  }
});
