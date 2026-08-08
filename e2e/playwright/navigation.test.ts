import { test, expect } from '@playwright/test';

/**
 * AC-1.1 ~ AC-1.5, AC-12.1 ~ AC-12.2, AC-14.1 ~ AC-14.2
 * — 목록 열람·내비게이션·스킵 링크·404.
 *
 * 재작성 노트: 이전 판은 AC 번호를 다른 체계(AC-3.2 등)로 참조하고 있어
 * 인수조건 카탈로그와 대조가 불가능했다. AC-ID를 현재 카탈로그에 맞춰
 * 다시 붙이고, Playwright 네이티브 태그로 스위트 소속을 실체화했다.
 *
 * 모드: @e2e-mock — 외부 API 호출 없이 배포 산출물(out/)만 검증한다.
 */

test.describe('navigation & layout', () => {
  test(
    'AC-1.4 홈에 히어로·최근 글·사이드바 위젯이 보인다',
    { tag: ['@smoke', '@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(
        page.getByRole('heading', { name: '최근 글' }),
      ).toBeVisible();
      await expect(page.locator('article').first()).toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'Top 5 인기 글' }),
      ).toBeVisible();
    },
  );

  test(
    'AC-1.4 상단 내비게이션이 이동하고 현재 페이지를 표시한다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/');
      await page.getByRole('link', { name: '포스트', exact: true }).click();
      await expect(page).toHaveURL(/\/ko\/posts\/?$/);
      await expect(
        page.getByRole('link', { name: '포스트', exact: true }),
      ).toHaveAttribute('aria-current', 'page');
    },
  );

  test(
    'AC-1.1 목록이 게시일 내림차순으로 나열된다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/posts/');
      // 카드의 날짜 표기(YYYY.MM.DD)만 뽑아 정렬이 유지되는지 본다.
      const texts = await page.locator('article').allInnerTexts();
      const dates = texts
        .map((t) => t.match(/\d{4}\.\d{2}\.\d{2}/)?.[0])
        .filter((d): d is string => Boolean(d));
      expect(dates.length).toBeGreaterThan(1);

      const sorted = [...dates].sort().reverse();
      expect(dates).toEqual(sorted);
    },
  );

  test(
    'AC-1.2 목록 카드에 제목과 예상 읽기 시간이 함께 보인다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/posts/');
      const card = page.locator('article').first();
      await expect(card.getByRole('heading')).toBeVisible();
      await expect(card).toContainText(/\d+분/);
    },
  );

  test(
    'AC-1.5 카드를 클릭하면 글 상세로 이동한다',
    { tag: ['@smoke', '@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/posts/');
      await page.locator('article a').first().click();
      await expect(page).toHaveURL(/\/ko\/posts\/.+\/$/);
      await expect(page.locator('.post-prose')).toBeVisible();
    },
  );

  test(
    '모바일 버거 메뉴가 열리고 닫힌다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 820 });
      await page.goto('/ko/');
      const burger = page.getByRole('button', { name: '메뉴 열기' });
      await expect(burger).toBeVisible();
      await burger.click();

      const drawer = page.locator('#mobile-menu');
      await expect(drawer).toBeVisible();
      await expect(drawer.getByRole('link', { name: 'About' })).toBeVisible();

      await page.getByRole('button', { name: '메뉴 닫기' }).click();
      await expect(drawer).toBeHidden();
    },
  );

  test(
    'AC-12.1 첫 Tab에 본문 건너뛰기 링크가 포커스를 받는다',
    { tag: ['@smoke', '@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/');
      await page.keyboard.press('Tab');
      await expect(
        page.getByRole('link', { name: '본문으로 건너뛰기' }),
      ).toBeFocused();
    },
  );

  test(
    'AC-12.2 건너뛰기 링크가 본문 위치로 이동시킨다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/#main-content$/);
      await expect(page.locator('#main-content')).toBeVisible();
    },
  );

  test(
    'AC-14.1 없는 경로는 404 화면을 보여준다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/posts/does-not-exist-slug/');
      await expect(page.getByText('404')).toBeVisible();
      await expect(page.getByText('페이지를 찾을 수 없습니다')).toBeVisible();
    },
  );

  test(
    'AC-14.2 404에서 홈으로 돌아가는 링크가 동작한다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/posts/does-not-exist-slug/');
      await page.getByRole('link', { name: /홈으로 돌아가기/ }).click();
      await expect(page).toHaveURL(/\/ko\/?$/);
    },
  );
});
