import { test, expect } from '@playwright/test';

/**
 * AC-1.3, AC-5.1 ~ AC-5.2, AC-6.2, AC-13.1 — 로케일 전환과 폴백.
 *
 * push-down 노트: 전환 로직의 세부(같은 로케일 클릭 시 무이동, 쿼리·해시
 * 미유지 등)는 LanguageSwitcher 통합 테스트로 내렸다. 여기 남긴 것은
 * "실제 라우팅과 정적 산출물이 맞물리는가"라는 E2E만의 질문이다.
 *
 * 모드: @e2e-mock
 */

test.describe('i18n routing', () => {
  test(
    'AC-13.1 루트가 기본 로케일 /ko 로 이동한다',
    { tag: ['@smoke', '@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveURL(/\/ko\/?$/);
    },
  );

  test(
    'AC-5.1 언어를 바꾸면 UI 문구가 해당 언어로 바뀐다',
    { tag: ['@smoke', '@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/');
      await expect(
        page.getByRole('heading', { name: '최근 글' }),
      ).toBeVisible();

      await page.getByRole('button', { name: /EN/ }).click();
      await expect(page).toHaveURL(/\/en\/?$/);
      await expect(
        page.getByRole('heading', { name: 'Recent posts' }),
      ).toBeVisible();
    },
  );

  test(
    'AC-5.2 언어를 바꿔도 현재 경로가 유지된다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/about/');
      await page.getByRole('button', { name: /EN/ }).click();
      await expect(page).toHaveURL(/\/en\/about\/?$/);
    },
  );

  test(
    'AC-5.2 글 상세에서도 같은 글의 다른 언어로 간다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/posts/');
      await page.locator('article a').first().click();
      // 내비게이션이 끝나기 전에 url()을 읽으면 slug 자리에 'posts'가 잡힌다.
      await expect(page).toHaveURL(/\/ko\/posts\/.+\/$/);
      const slug = new URL(page.url()).pathname
        .split('/')
        .filter(Boolean)
        .pop();

      await page.getByRole('button', { name: /EN/ }).click();
      await expect(page).toHaveURL(new RegExp(`/en/posts/${slug}/?$`));
    },
  );

  test(
    'AC-1.3 en 목록이 ko 목록과 같은 편수를 보여준다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/posts/');
      const ko = await page.locator('article').count();

      await page.goto('/en/posts/');
      const en = await page.locator('article').count();

      // 번역 커버리지 100%가 깨지면 여기서 먼저 드러난다.
      expect(en).toBe(ko);
    },
  );

  test(
    'AC-6.2 번역이 있는 글에는 폴백 안내가 뜨지 않는다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/en/posts/');
      await page.locator('article a').first().click();
      await expect(page.getByText(/shown in its original Korean/i)).toHaveCount(
        0,
      );
    },
  );

  test(
    'html lang 속성이 로케일을 따른다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/');
      await expect(page.locator('html')).toHaveAttribute('lang', 'ko-KR');

      await page.goto('/en/');
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    },
  );
});
