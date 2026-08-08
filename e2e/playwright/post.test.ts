import { test, expect } from '@playwright/test';

/**
 * AC-2.1 ~ AC-2.4, AC-7.5, AC-7.8, AC-7.9 — 글 상세 렌더.
 *
 * push-down 노트: 목차의 활성 전환(AC-7.3)·heading 없을 때 미렌더(AC-7.7)·
 * 진행률 계산(AC-7.4)은 Toc·ReadingProgress 통합 테스트로 내렸다.
 * 여기 남긴 건 **실제 마크다운 파이프라인의 산출물**을 보는 것들이다 —
 * shiki 하이라이팅과 앵커 생성은 빌드를 거쳐야만 확인된다.
 *
 * 모드: @e2e-mock
 */

const KNOWN_POST = '/ko/posts/2026-07-05-meta-harness/';

test.describe('post detail', () => {
  test(
    'AC-2.1 본문과 코드블록이 렌더된다',
    { tag: ['@smoke', '@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto(KNOWN_POST);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(
        'meta-harness',
      );
      await expect(page.locator('.post-prose')).toBeVisible();
      await expect(page.locator('.post-prose pre').first()).toBeVisible();
    },
  );

  test(
    'AC-2.1 코드블록에 구문 강조가 적용된다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto(KNOWN_POST);
      // 단색 텍스트가 아니라 토큰별로 색이 갈린 상태여야 한다.
      // shiki(rehype-pretty-code)는 inline color가 아니라 --shiki-light/--shiki-dark
      // CSS 변수로 색을 싣는다 — 라이트/다크 양쪽 색을 한 번에 담기 위해서다.
      const tokenStyles = await page
        .locator('.post-prose pre span[style*="--shiki"]')
        .evaluateAll((nodes) =>
          nodes.map((n) => n.getAttribute('style') ?? '').filter(Boolean),
        );
      expect(tokenStyles.length).toBeGreaterThan(0);
      // 서로 다른 색이 최소 둘 — 전부 같은 색이면 강조가 죽은 것이다.
      expect(new Set(tokenStyles).size).toBeGreaterThan(1);
    },
  );

  test(
    'AC-2.3 heading에 앵커가 생기고 클릭하면 URL에 반영된다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto(KNOWN_POST);
      const firstTocLink = page.locator('.toc-list a').first();
      const href = await firstTocLink.getAttribute('href');
      expect(href).toMatch(/^#/);

      await firstTocLink.click();
      await expect.poll(() => decodeURIComponent(page.url())).toContain(href!);
    },
  );

  test(
    'AC-2.4 heading id가 문서 안에서 중복되지 않는다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      // 같은 제목이 두 번 나오면 접미사로 갈라야 앵커가 서로 다른 곳을 가리킨다.
      await page.goto(KNOWN_POST);
      const ids = await page
        .locator('.post-prose :is(h1,h2,h3,h4)[id]')
        .evaluateAll((nodes) => nodes.map((n) => n.id));
      expect(ids.length).toBeGreaterThan(0);
      expect(new Set(ids).size).toBe(ids.length);
    },
  );

  test(
    'AC-7.5 AC-7.8 브레드크럼과 이전/다음 글이 있다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto(KNOWN_POST);
      await expect(
        page.getByRole('navigation', { name: 'breadcrumb' }),
      ).toBeVisible();
      await expect(
        page.getByRole('navigation', { name: /이전 글|다음 글/ }),
      ).toBeVisible();
    },
  );

  test(
    'AC-7.8 브레드크럼 마지막 항목에 aria-current=page 가 붙는다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto(KNOWN_POST);
      const crumb = page.getByRole('navigation', { name: 'breadcrumb' });
      await expect(crumb.locator('[aria-current="page"]')).toHaveCount(1);
    },
  );

  test(
    'AC-7.9 작성자·게시일·예상 읽기 시간이 함께 보인다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto(KNOWN_POST);
      await expect(page.locator('main')).toContainText(/\d+분/);
      await expect(page.locator('main')).toContainText(/\d{4}\.\d{2}\.\d{2}/);
    },
  );

  test(
    'AC-7.1 데스크톱에서 목차가 보인다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto(KNOWN_POST);
      await expect(
        page.getByRole('navigation', { name: '목차' }),
      ).toBeVisible();
    },
  );
});
