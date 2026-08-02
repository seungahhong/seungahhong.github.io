import { test, expect, type Page } from '@playwright/test';

/**
 * gtag 스크립트 태그가 DOM에 붙을 때까지 기다린다.
 *
 * `next/script`의 afterInteractive라 태그는 하이드레이션 이후에 주입된다. 정적 HTML에는
 * `<link rel="preload">`만 들어 있으므로, `page.goto` 직후 DOM을 한 번만 읽으면 느린
 * 머신에서 아무것도 못 찾는다(CPU 6배 스로틀에서 재현). 자동 재시도가 있는 로케이터
 * 단언으로 먼저 기다린 뒤에 스냅샷을 떠야 한다.
 */
async function waitForGtagScripts(page: Page) {
  await expect(
    page.locator('script[src*="googletagmanager.com/gtag/js"]'),
  ).toHaveCount(1);
  await expect(page.locator('script#ga4-init')).toHaveCount(1);
}

test.describe('google analytics (gtag.js)', () => {
  test('loads the GA4 script on every page', async ({ page }) => {
    await page.goto('/ko/');

    await expect(
      page.locator('script[src*="googletagmanager.com/gtag/js"]'),
    ).toHaveCount(1);
  });

  test('does not send hits from non-production hosts', async ({ page }) => {
    await page.goto('/ko/');
    // 초기화 스크립트가 실행된 뒤에 봐야 한다. 주입 전에 읽으면 dataLayer가 비어 있어
    // 호스트 가드와 무관하게 통과해 버린다.
    await waitForGtagScripts(page);

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
   * 구글에 실제 요청을 보내므로, 404(=ID가 없음)만 실패로 보고 그 밖의 비정상 응답이나
   * 통신 실패는 배포를 막지 않도록 건너뛴다.
   */
  test('configured GA4 measurement IDs are alive', async ({
    page,
    request,
  }) => {
    await page.goto('/ko/');
    await waitForGtagScripts(page);

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
          { timeout: 15_000 },
        );
      } catch {
        test.skip(
          true,
          `googletagmanager 접속 실패 — ${id} 검증을 건너뜁니다.`,
        );
        return;
      }

      const status = response.status();

      // 삭제된 속성만이 404를 준다. 이 경우에만 배포를 막는다.
      expect(
        status,
        `측정 ID ${id}의 gtag.js가 404를 반환했습니다. ` +
          '삭제된 속성이면 gtag.js가 차단되어 모든 수집이 멈춥니다.',
      ).not.toBe(404);

      // 429·5xx 같은 나머지 비정상 응답은 구글 쪽 사정이므로 배포 게이트로 삼지 않는다.
      if (status !== 200) {
        test.skip(
          true,
          `측정 ID ${id}의 gtag.js가 ${status}를 반환해 검증을 건너뜁니다.`,
        );
        return;
      }

      expect(
        response.headers()['content-type'] ?? '',
        `측정 ID ${id}의 응답이 자바스크립트가 아닙니다.`,
      ).toContain('javascript');
    }
  });
});
