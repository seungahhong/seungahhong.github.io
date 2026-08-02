import { test, expect } from '@playwright/test';

test.describe('google analytics (gtag.js)', () => {
  test('loads the GA4 script on every page', async ({ page }) => {
    await page.goto('/ko/');

    await expect(
      page.locator('script[src*="googletagmanager.com/gtag/js"]'),
    ).toHaveCount(1);
  });

  test('does not send hits from non-production hosts', async ({ page }) => {
    await page.goto('/ko/');

    // 로컬(out/ 서빙)에서는 호스트 가드에 막혀 config 커맨드가 나가지 않아야 한다.
    const commands = await page.evaluate(() => {
      const dataLayer =
        (window as unknown as { dataLayer?: IArguments[] }).dataLayer ?? [];
      return dataLayer.map((entry) => String(entry[0]));
    });

    expect(commands).not.toContain('config');
  });

  /**
   * 삭제된 측정 ID를 잡는다.
   *
   * 실제로 겪은 장애: `gaIds`의 첫 ID가 삭제된 속성이라 gtag.js가 404(HTML)로 응답했고,
   * 크롬이 ERR_BLOCKED_BY_ORB로 차단해 gtag.js가 아예 실행되지 않았다. 그 결과 뒤따르던
   * 멀쩡한 ID의 히트까지 통째로 유실됐는데, 태그 존재만 보는 위 테스트는 이를 통과시켰다.
   *
   * 소스 상수가 아니라 산출물이 실제로 싣는 ID를 검사한다.
   * 구글에 실제 요청을 보내므로, 404(=ID가 없음)만 실패로 보고 통신 자체가 실패하면
   * 배포를 막지 않도록 건너뛴다.
   */
  test('configured GA4 measurement IDs are alive', async ({
    page,
    request,
  }) => {
    await page.goto('/ko/');

    const ids = await page.evaluate(() => {
      const found = new Set<string>();
      const loader = document.querySelector<HTMLScriptElement>(
        'script[src*="googletagmanager.com/gtag/js"]',
      );
      const loaderId = loader && new URL(loader.src).searchParams.get('id');
      if (loaderId) found.add(loaderId);
      const init = document.getElementById('ga4-init')?.textContent ?? '';
      for (const match of init.matchAll(/gtag\('config',\s*"([^"]+)"\)/g)) {
        found.add(match[1]);
      }
      return [...found];
    });

    expect(ids.length).toBeGreaterThan(0);

    for (const id of ids) {
      let response;
      try {
        response = await request.get(
          `https://www.googletagmanager.com/gtag/js?id=${id}`,
        );
      } catch {
        test.skip(
          true,
          `googletagmanager 접속 실패 — ${id} 검증을 건너뜁니다.`,
        );
        return;
      }

      expect(
        response.status(),
        `측정 ID ${id}의 gtag.js가 ${response.status()}를 반환했습니다. ` +
          '삭제된 속성이면 gtag.js가 차단되어 모든 수집이 멈춥니다.',
      ).toBe(200);
      expect(
        response.headers()['content-type'] ?? '',
        `측정 ID ${id}의 응답이 자바스크립트가 아닙니다.`,
      ).toContain('javascript');
    }
  });
});
