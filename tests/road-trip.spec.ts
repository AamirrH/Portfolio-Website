import { expect, test } from '@playwright/test';
import { content, projects } from '../src/data/content';

const desktopResources = /(?:DesktopPortfolio|CameraRig|TravelScenes|ProjectStops|ScrollTrigger|gsap|resonance\.(?:webm|m4a)|\/assets\/cars\/rear\.webp)/i;

for (const [width, height] of [[320, 640], [375, 667], [390, 844], [430, 932], [844, 390]]) {
  test.describe(`${width}×${height}`, () => {
    test.use({ viewport: { width, height }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    test('scrolls through every stop with the cars clear of the board and nav', async ({ page }, testInfo) => {
      const desktopRequests: string[] = [];
      const errors: string[] = [];
      page.on('request', request => { if (desktopResources.test(request.url())) desktopRequests.push(request.url()); });
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await page.goto('/#home');
      const homeCar = page.locator('.trip-hero-car');
      await expect(homeCar).toBeInViewport({ ratio: .95 });
      await expect.poll(() => homeCar.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
      const nav = page.getByRole('navigation', { name: content.controls.navigation });
      await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'location');

      const projectsNav = page.getByRole('navigation', { name: 'Project stops' });
      await nav.getByRole('link', { name: 'Projects' }).click();
      for (const project of projects) {
        await projectsNav.getByRole('link', { name: project.title, exact: true }).click();
        await expect(page).toHaveURL(new RegExp(`#${project.id}$`));
        const article = page.locator(`#${project.id}`);
        const scene = article.locator('.trip-scene');
        const car = scene.locator('.trip-car');
        await expect(car).toBeInViewport({ ratio: .95 });
        await expect.poll(() => scene.locator('img').evaluateAll(
          images => images.every(image => (image as HTMLImageElement).naturalWidth > 0),
        )).toBe(true);
        const carBox = (await car.boundingBox())!;
        const navBox = (await nav.boundingBox())!;
        const copyBox = (await article.locator('.trip-project-copy').boundingBox())!;
        expect(carBox.y + carBox.height).toBeLessThan(navBox.y);
        expect(carBox.y + carBox.height).toBeLessThan(copyBox.y);
        await expect(article.getByRole('heading', { name: project.title })).toBeAttached();
        await expect(article.locator('.project-tech-list li')).toHaveCount(project.stack.length);
        if (project.id === 'frutiger-aero' && (width === 390 || width === 844)) {
          await page.screenshot({ path: testInfo.outputPath('frutiger-road-trip.png') });
        }
      }
      await expect(page.locator('.camera-rig, .journey-track, canvas, audio')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      expect(desktopRequests).toEqual([]);
      expect(errors).toEqual([]);
    });
  });
}

test('mobile deep links, history, plain preference and desktop resize', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const project of projects) {
    await page.goto(`/#${project.id}`);
    await expect(page.locator(`#${project.id} .trip-car`)).toBeInViewport({ ratio: .95 });
  }
  const nav = page.getByRole('navigation', { name: content.controls.navigation });
  await nav.getByRole('link', { name: 'Contact' }).click();
  await expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute('aria-current', 'location');
  await page.goBack();
  await expect(page).toHaveURL(/#frutiger-aero$/);
  await expect(page.locator('#frutiger-aero .trip-car')).toBeInViewport();
  await page.goForward();
  await expect(page).toHaveURL(/#contact$/);

  await page.locator('#about').evaluate(element => element.scrollIntoView());
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'location');
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.getByRole('link', { name: content.about.resume })).toHaveAttribute('href', content.about.resumeUrl);
  await page.getByRole('button', { name: 'Plain mode' }).click();
  await expect(page.locator('.plain-content #about')).toBeInViewport();
  await expect(page).toHaveURL(/#about$/);
  await page.reload();
  await expect(page.locator('.plain-content #about')).toBeInViewport();
  await page.getByRole('button', { name: 'Road Trip' }).click();
  await expect(page.locator('.trip-content #about')).toBeInViewport();

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('.camera-rig .dash-scene')).toBeVisible();
  await expect(page.locator('.road-trip')).toHaveCount(0);
  await expect(page).toHaveURL(/#about$/);
});
