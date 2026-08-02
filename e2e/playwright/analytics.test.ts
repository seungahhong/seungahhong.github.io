import { test, expect } from '@playwright/test';

test.describe('google analytics (gtag.js)', () => {
  test('loads the GA4 script on every page', async ({ page }) => {
    await page.goto('/ko/');

    await expect(
      page.locator('script[src*="googletagmanager.com/gtag/js"]'),
    ).toHaveCount(1);
  });

  test('does not send hits from non-production hosts', async ({ page }) => {
    await page.goto('/ko/');

    // 로컬(out/ 서빙)에서는 호스트 가드에 막혀 config 커맨드가 나가지 않아야 한다.
    const commands = await page.evaluate(() => {
      const dataLayer =
        (window as unknown as { dataLayer?: IArguments[] }).dataLayer ?? [];
      return dataLayer.map((entry) => String(entry[0]));
    });

    expect(commands).not.toContain('config');
  });
});
