import { test, expect } from '@playwright/test';

test.describe('category filter (sidebar → posts)', () => {
  test('?category= preselects the matching pill on the posts page', async ({
    page,
  }) => {
    await page.goto('/ko/posts/?category=tools');

    await expect(page.getByRole('button', { name: /tools/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByRole('button', { name: /전체/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  test('clicking a sidebar category navigates with it preselected', async ({
    page,
  }) => {
    await page.goto('/ko/');
    await page.locator('a[href*="category=tools"]').click();

    await expect(page).toHaveURL(/\/ko\/posts\/\?category=tools/);
    await expect(page.getByRole('button', { name: /tools/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test('clicking a pill updates the URL query param (and 전체 clears it)', async ({
    page,
  }) => {
    await page.goto('/ko/posts/');

    await page.getByRole('button', { name: /^개발/ }).click();
    await expect(page).toHaveURL(/category=(%EA%B0%9C%EB%B0%9C|개발)/);
    await expect(page.getByRole('button', { name: /^개발/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await page.getByRole('button', { name: /전체/ }).click();
    await expect(page).toHaveURL(/\/ko\/posts\/(\?)?$/);
  });
});
