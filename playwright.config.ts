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
  /**
   * CI에서 한 번 재시도한다. 감추기 위해서가 아니라 가르기 위해서다 —
   * 재시도로 통과하면 Playwright가 flaky로 따로 표시해 주고, 진짜로 깨진
   * 테스트는 두 번 다 실패해 그대로 배포를 막는다.
   */
  retries: process.env.CI ? 1 : 0,
  /**
   * `line`만 쓰면 실패한 테스트 이름이 잡 로그 안에만 남아, 로그 열람 권한이
   * 없으면 무엇이 깨졌는지 알 수 없다(실제로 겪었다). `github` 리포터가
   * 실패를 파일·라인 주석으로 올려 주고, `html`은 아티팩트로 올려 재현에 쓴다.
   */
  reporter: process.env.CI
    ? [['github'], ['line'], ['html', { open: 'never' }]]
    : 'list',
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
