import { test, expect } from '@playwright/test';

// 태그 칩은 .tag-pill(::before "#"는 CSS)이라 접근명 대신 텍스트로 선택한다.
// 텍스트는 "react4" 형태 → /^react\d/ 로 react-router와 구분.
const reactChip = (page: import('@playwright/test').Page) =>
  page.locator('button.tag-pill').filter({ hasText: /^react\d/ });

test.describe('tag filter (tags page)', () => {
  test('?tag= preselects the matching chip on load', async ({ page }) => {
    await page.goto('/ko/tags/?tag=react');
    await expect(reactChip(page)).toHaveAttribute('aria-pressed', 'true');
  });

  test('clicking a tag chip updates the URL and toggles off', async ({
    page,
  }) => {
    await page.goto('/ko/tags/');

    await reactChip(page).click();
    await expect(page).toHaveURL(/tag=react/);
    await expect(reactChip(page)).toHaveAttribute('aria-pressed', 'true');

    // 같은 태그 재클릭 → 해제(파람 제거)
    await reactChip(page).click();
    await expect(page).toHaveURL(/\/ko\/tags\/(\?)?$/);
  });

  test('tag link from a post card lands on the tags page preselected', async ({
    page,
  }) => {
    await page.goto('/ko/');
    await page.locator('a[href*="/tags/?tag="]').first().click();
    await expect(page).toHaveURL(/\/ko\/tags\/\?tag=/);
  });
});
