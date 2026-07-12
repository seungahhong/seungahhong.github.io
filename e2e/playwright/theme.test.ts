import { test, expect } from '@playwright/test';

test.describe('theme toggle (AC-2)', () => {
  test('toggles light↔dark and persists across reload', async ({ page }) => {
    await page.goto('/ko/');
    const html = page.locator('html');
    const toggle = page.getByRole('button', { name: '테마 전환' });

    const before = await html.getAttribute('data-theme');
    await toggle.click();
    const after = await html.getAttribute('data-theme');
    expect(after).not.toBe(before);
    expect(['light', 'dark']).toContain(after);

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', String(after));
  });

  test('respects prefers-color-scheme: dark on first visit (AC-2.2)', async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: 'dark' });
    const page = await context.newPage();
    await page.goto('/ko/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await context.close();
  });
});
