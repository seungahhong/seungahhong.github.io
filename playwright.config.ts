import { defineConfig, devices } from '@playwright/test';

const isVideoRecord = process.env.PLAYWRIGHT_VIDEO === 'true';

export default defineConfig({
  // reporter: [['html', { outputFolder: './e2e/playwright/reports' }]], // html report
  timeout: 60 * 1000 * 3,
  use: {
    baseURL: 'https://seungahhong.github.io/',
    headless: true,
    ignoreHTTPSErrors: true,
    ...(isVideoRecord
      ? {
          video: 'retain-on-failure',
          contextOptions: {
            recordVideo: {
              dir: './e2e/playwright/videos',
            },
          },
        }
      : {}),
  },
  projects: [
    // 다양한 브라우저 테스트 미 구성
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
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
  testDir: 'e2e/playwright',
  testMatch: '*.test.ts',
  workers: 4,
});
