import { test, expect } from '@playwright/test';

// test-layering-harness 생성 — SEO 메타 그룹 (AC-74/75/76/77/78)
// 대상: 배포된 prod 아티팩트(react-helmet-async 클라이언트 주입 → Playwright JS 실행으로 검증).
// 오라클 근거: Template.tsx(메타 정의) + gatsby-config.js(siteMetadata) 의 기대 상수.

const SITE_DESCRIPTION = '홍승아 기술 블로그에 오신걸 환영합니다.';
const SITE_TITLE = '홍승아 기술 블로그';

test.describe('SEO meta — 사이트 인증 (AC-77)', () => {
  test('google/naver site-verification 메타가 지정 코드로 유지된다', async ({ page }) => {
    await page.goto('/');

    const google = await page
      .locator('meta[name="google-site-verification"]')
      .getAttribute('content');
    const naver = await page
      .locator('meta[name="naver-site-verification"]')
      .getAttribute('content');

    expect(google).toBe('DafIPWtLpIjdEIuERhMFfutDl2IoaF8b6CQTBYF6qsQ');
    expect(naver).toBe('ab246841529a97bcf76ac7ed42d5a5c457a381bc');
  });
});

test.describe('SEO meta — description (AC-74)', () => {
  test('description·og:description·twitter:description가 사이트 설명과 일치', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/');

    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    const og = await page.locator('meta[property="og:description"]').getAttribute('content');
    const tw = await page.locator('meta[name="twitter:description"]').getAttribute('content');

    expect(desc).toBe(SITE_DESCRIPTION);
    expect(og).toBe(SITE_DESCRIPTION);
    expect(tw).toBe(SITE_DESCRIPTION);
  });
});

test.describe('SEO meta — og:image/twitter:image URL 형식 (AC-75)', () => {
  // 오라클 = 기대 검증: 소셜 이미지 URL은 host 뒤 '//'(이중 슬래시) 없는 절대 URL이어야 한다.
  // 코드(Template.tsx:81 `${url}${src}`)는 siteUrl 끝 '/' + src 시작 '/' 로 이중 슬래시를 만들 수 있다 → 있으면 FAIL(버그 노출).
  test('og:image·twitter:image가 이중 슬래시 없는 절대 URL이다', async ({ page }) => {
    await page.goto('/');

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    const twImage = await page.locator('meta[name="twitter:image"]').getAttribute('content');

    for (const url of [ogImage, twImage]) {
      expect(url).toBeTruthy();
      // https://seungahhong.github.io/ 로 시작하고, 그 뒤 첫 문자가 슬래시가 아니어야(이중 슬래시 아님) 함
      expect(url).toMatch(/^https:\/\/seungahhong\.github\.io\/[^/]/);
    }
  });
});

test.describe('SEO meta — 정적 상수 세트 (AC-76)', () => {
  test('og:type/og:site_name/twitter:card/twitter:site/twitter:creator 상수', async ({ page }) => {
    await page.goto('/');

    expect(await page.locator('meta[property="og:type"]').getAttribute('content')).toBe('website');
    expect(await page.locator('meta[property="og:site_name"]').getAttribute('content')).toBe(SITE_TITLE);
    expect(await page.locator('meta[name="twitter:card"]').getAttribute('content')).toBe('summary');
    expect(await page.locator('meta[name="twitter:site"]').getAttribute('content')).toBe('seungah.hong');
    expect(await page.locator('meta[name="twitter:creator"]').getAttribute('content')).toBe('seungah.hong');
  });
});

test.describe('SEO meta — viewport/Content-Type (AC-78)', () => {
  // 안정화 완료 — 기존 flaky 원인: react-helmet-async의 메타 주입이 hydration 이후 발생하는데
  //  테스트가 goto 직후(주입 전) DOM을 즉시 조회해 경쟁했다. 배포본에는 Gatsby 정적 viewport와
  //  helmet 주입 viewport 2개가 공존하므로, 특정 태그의 '부착'을 web-first 자동 재시도로 대기시켜 해결한다.
  test('viewport와 Content-Type 메타가 기대값으로 존재', async ({ page }) => {
    await page.goto('/');

    // helmet이 주입하는 viewport(initial-scale=1.0) 태그가 붙을 때까지 자동 재시도 대기 → 경쟁 제거
    await expect(
      page.locator('meta[name="viewport"][content="width=device-width, initial-scale=1.0"]'),
    ).toBeAttached();

    // Content-Type 역시 helmet 주입분이 붙을 때까지 대기 후 값 검증
    await expect(page.locator('meta[http-equiv="Content-Type"]').first()).toHaveAttribute(
      'content',
      'text/html;charset=UTF-8',
    );
  });
});
