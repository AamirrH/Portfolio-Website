import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', timeout: 45000, expect: { timeout: 8000 }, workers: 1,
  use: { baseURL: 'http://127.0.0.1:5173', browserName: 'chromium', channel: 'msedge', headless: true, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  reporter: 'list', outputDir: '.qa/playwright'
});
