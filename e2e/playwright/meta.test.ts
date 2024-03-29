import { test, expect } from '@playwright/test';

const siteTitle = '홍승아 기술 블로그';

test.describe(`Index Page`, () => {
  test(`should have correct meta tags`, async ({ page }) => {
    await page.goto(`/`);

    await expect(page).toHaveTitle(siteTitle);

    const twitterTitle = await page
      .locator(`meta[name="twitter:title"]`)
      .getAttribute(`content`);
    const ogTitle = await page
      .locator(`meta[property="og:title"]`)
      .getAttribute(`content`);

    await expect(twitterTitle).toBe(siteTitle);
    await expect(ogTitle).toBe(siteTitle);
  });
});
