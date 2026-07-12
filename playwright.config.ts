import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;
const baseURL = `http://localhost:${PORT}`;

/**
 * 정적 익스포트 산출물(out/)을 그대로 서빙해 실제 배포와 동일하게 검증한다.
 * 사전에 `pnpm build`로 out/이 생성되어 있어야 한다.
 */
export default defineConfig({
  testDir: 'e2e/playwright',
  testMatch: '*.test.ts',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI ? 'line' : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `pnpm exec serve out -l ${PORT}`,
    url: `${baseURL}/ko/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
