/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test'

const isCI = !!process.env.CI
// No CI os testes rodam contra o build de produção (vite preview), que é o que vai ao ar.
const port = isCI ? 4173 : 5173
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${port}`

export default defineConfig({
  testDir: './tests',
  fullyParallel: !isCI,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: 'html',
  timeout: 60 * 1000,
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: 30000,
    actionTimeout: 15000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: isCI ? 'pnpm preview --strictPort' : 'pnpm dev',
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 120 * 1000,
  },
})
