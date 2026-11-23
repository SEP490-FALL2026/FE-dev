import { existsSync } from 'node:fs'
import { defineConfig, devices } from '@playwright/test'

// Credentials live in .env.e2e (ignored by git); see e2e/README.md for the variable names.
if (existsSync('.env.e2e')) process.loadEnvFile('.env.e2e')

const headless = process.env.E2E_HEADLESS === '1'
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:5173'

export default defineConfig({
  testDir: './e2e',
  // One browser at a time: the run is meant to be watched, and every role shares the same remote backend.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  // Each action waits 1-2 s on purpose (see e2e/support/actions.ts), so a flow takes minutes.
  timeout: 5 * 60_000,
  expect: { timeout: 15_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  globalSetup: './e2e/support/global-setup.ts',
  globalTeardown: './e2e/support/global-teardown.ts',
  outputDir: 'test-results',
  use: {
    baseURL,
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh',
    viewport: { width: 1440, height: 900 },
    headless,
    launchOptions: { slowMo: Number(process.env.E2E_SLOW_MO ?? 0) },
    actionTimeout: 20_000,
    navigationTimeout: 60_000,
    trace: 'retain-on-failure',
    video: 'on',
    screenshot: 'only-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } }],
  // Reuses the dev server when one is already listening on 5173 (strictPort in vite.config.ts).
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: 'npm run dev', url: baseURL, reuseExistingServer: true, timeout: 120_000 }
})
