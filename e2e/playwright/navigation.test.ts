import { test, expect } from '@playwright/test';

test.describe('navigation & layout', () => {
  test('home renders hero, recent feed and sidebar @smoke', async ({
    page,
  }) => {
    await page.goto('/ko/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: '최근 글' })).toBeVisible();
    await expect(page.locator('article').first()).toBeVisible();
    // 사이드바 위젯
    await expect(
      page.getByRole('heading', { name: 'Top 5 인기 글' }),
    ).toBeVisible();
  });

  test('nav links navigate and mark the active page', async ({ page }) => {
    await page.goto('/ko/');
    await page.getByRole('link', { name: '포스트', exact: true }).click();
    await expect(page).toHaveURL(/\/ko\/posts\/?$/);
    await expect(
      page.getByRole('link', { name: '포스트', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
  });

  test('mobile burger opens and closes the drawer (AC-3.2)', async ({
    page,
  }) => {
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
  });

  test('skip link is reachable by keyboard (AC a11y)', async ({ page }) => {
    await page.goto('/ko/');
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('link', { name: '본문으로 건너뛰기' }),
    ).toBeFocused();
  });
});
