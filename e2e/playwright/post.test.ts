import { test, expect } from '@playwright/test';

const KNOWN_POST = '/ko/posts/2026-07-05-meta-harness/';

test.describe('post detail (AC-5, AC-6.2)', () => {
  test('known post renders prose, headings and TOC', async ({ page }) => {
    await page.goto(KNOWN_POST);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'meta-harness',
    );
    await expect(page.locator('.post-prose')).toBeVisible();
    // 본문에 코드블록(shiki)과 제목이 렌더됨
    await expect(page.locator('.post-prose pre').first()).toBeVisible();
    // 데스크톱 TOC
    await expect(page.getByRole('navigation', { name: '목차' })).toBeVisible();
  });

  test('breadcrumb and prev/next navigation exist', async ({ page }) => {
    await page.goto(KNOWN_POST);
    await expect(
      page.getByRole('navigation', { name: 'breadcrumb' }),
    ).toBeVisible();
    await expect(
      page.getByRole('navigation', { name: /이전 글|다음 글/ }),
    ).toBeVisible();
  });

  test('clicking a TOC item scrolls to the section', async ({ page }) => {
    await page.goto(KNOWN_POST);
    const firstTocLink = page.locator('.toc-list a').first();
    const href = await firstTocLink.getAttribute('href');
    expect(href).toMatch(/^#/);
    await firstTocLink.click();
    await expect.poll(() => decodeURIComponent(page.url())).toContain(href!);
  });
});
