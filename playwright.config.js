import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  expect: {timeout: 10000},
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', {open: 'never'}]] : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: {executablePath: process.env.E2E_CHROMIUM_PATH || undefined},
  },
  projects: [
    {name: 'escritorio', use: {...devices['Desktop Chrome'], viewport: {width: 1280, height: 850}}},
    {name: 'celular', use: {...devices['Pixel 7']}, grep: /@celular/},
  ],
});
