import { test, expect } from '@playwright/test';

// test-layering-harness 생성 — AC-07(카드→상세 라우팅), AC-49(헤더 Home/About 내비)
// 오라클 = 기대 검증(행동): 카드 클릭 시 루트가 아닌 상세 경로로 이동하고 상세 헤더가 보인다;
//          데스크톱 헤더의 About/Home 링크가 각각 /about, / 로 향하고 About 클릭 시 /about 으로 이동.
// 근거: PostItem.tsx:99(카드=Link to={link}), Header.tsx:194-199(Home/About Link). Header는 >1024px에서만 노출.

const CARD = 'a:has(img[alt="Post Item Image"])';

test.describe('내비게이션 (AC-07, AC-49)', () => {
  test('AC-07 · 포스트 카드 클릭 시 상세 경로로 이동', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/');
    const firstCard = page.locator(CARD).first();
    await firstCard.waitFor();

    const href = await firstCard.getAttribute('href');
    expect(href).toBeTruthy();

    await firstCard.click();
    await page.waitForURL((url) => url.pathname !== '/');
    expect(new URL(page.url()).pathname).not.toBe('/');
    await expect(page.locator('h1').first()).toBeVisible(); // 상세 헤더 렌더
  });

  test('AC-49 · 데스크톱 헤더 Home/About 내비게이션', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    const home = page.getByRole('link', { name: 'Home', exact: true }).first();
    const about = page.getByRole('link', { name: 'About', exact: true }).first();
    await expect(home).toHaveAttribute('href', /^\/$/);
    await expect(about).toHaveAttribute('href', /^\/about\/?$/); // Gatsby 표준 trailing slash 허용

    await about.click();
    await page.waitForURL(/\/about\/?$/);
    expect(new URL(page.url()).pathname.replace(/\/$/, '')).toBe('/about');
  });
});
