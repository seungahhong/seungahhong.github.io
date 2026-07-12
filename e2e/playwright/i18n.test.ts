import { test, expect } from '@playwright/test';

test.describe('i18n (AC-7)', () => {
  test('root redirects to default locale /ko (AC-7.3)', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/ko\/?$/);
  });

  test('language switch changes UI chrome text (AC-7.1)', async ({ page }) => {
    await page.goto('/ko/');
    await expect(page.getByRole('heading', { name: '최근 글' })).toBeVisible();

    await page.getByRole('button', { name: /EN/ }).click();
    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(
      page.getByRole('heading', { name: 'Recent posts' }),
    ).toBeVisible();
  });

  test('language switch preserves the current route', async ({ page }) => {
    await page.goto('/ko/about/');
    await page.getByRole('button', { name: /EN/ }).click();
    await expect(page).toHaveURL(/\/en\/about\/?$/);
  });
});
