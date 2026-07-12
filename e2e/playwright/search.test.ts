import { test, expect } from '@playwright/test';

test.describe('search command palette (⌘K)', () => {
  test('opens with keyboard shortcut, filters and navigates', async ({
    page,
  }) => {
    await page.goto('/ko/');
    await page.keyboard.press('ControlOrMeta+k');

    const dialog = page.getByRole('dialog', { name: '검색' });
    await expect(dialog).toBeVisible();

    const input = dialog.getByRole('combobox');
    await input.fill('vite');
    await expect(dialog.getByText(/vite/i).first()).toBeVisible();

    await input.press('Enter');
    await expect(page).toHaveURL(/\/ko\/posts\/.*vite/i);
  });

  test('nav search button opens the dialog and Escape closes it', async ({
    page,
  }) => {
    await page.goto('/ko/');
    await page
      .getByRole('button', { name: '검색', exact: true })
      .first()
      .click();

    const dialog = page.getByRole('dialog', { name: '검색' });
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});
