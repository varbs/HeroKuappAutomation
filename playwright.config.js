import { defineConfig, devices } from '@playwright/test';

const uiUse = {
  baseURL: 'https://the-internet.herokuapp.com',
  trace: 'retain-on-failure',
  screenshot: 'retain-on-failure'
};
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  projects: [
    // UI tests, one project per browser
    {
      name: 'ui-chromium',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        ...uiUse
      },
    },
    {
      name: 'ui-firefox',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Firefox'],
        ...uiUse
      },
    },
    {
      name: 'ui-webkit',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop WebKit'],
        ...uiUse
      },
    },
    {
      name: 'ui-edge',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        ...uiUse
      },
    },
        {
      name: 'ui-chrome',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        ...uiUse
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://jsonplaceholder.typicode.com',
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});