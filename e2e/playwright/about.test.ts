import { test, expect } from '@playwright/test';

/**
 * AC-11.1 ~ AC-11.5 — About(채용 담당자·협업 상대 접점).
 *
 * 이 스펙도 **게이트 공백을 메우려고 새로 만든 것**이다. About은 2차 사용자에게
 * 유일한 진입면인데 카탈로그상 AC-11.x 전부가 "게이트 없음 · 수동"이었다.
 *
 * AC-11.4(FAQ 치환값)는 특히 중요하다 — 문서 안에서 73(원문)과 146(원문+번역)이
 * 혼동되던 값이라, 화면에 어느 쪽이 나가는지 고정해 둘 필요가 있다.
 *
 * 모드: @e2e-mock — 외부 API 호출 없음.
 */

test.describe('about page', () => {
  test(
    'AC-11.1 프로필 이미지·이름·소개가 보인다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/about/');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('img[src*="profile"]').first()).toBeVisible();
    },
  );

  test(
    'AC-11.2 기술 스택이 8개 그룹으로 나뉘어 있다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/about/');
      // 스킬 섹션은 h2(관심 기술) 아래 h3 그룹으로 구성된다.
      // FAQ도 h3를 쓰므로 섹션으로 범위를 좁혀야 한다.
      const section = page
        .locator('section')
        .filter({ has: page.getByRole('heading', { name: '관심 기술' }) });
      await expect(section.getByRole('heading', { level: 3 })).toHaveCount(8);
    },
  );

  test(
    'AC-11.3 GitHub·Portfolio·LinkedIn·Notion·Email 5개 경로를 제공한다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/about/');

      for (const pattern of [
        /github\.com/,
        /vercel\.app/,
        /linkedin\.com/,
        /notion\.site/,
      ]) {
        await expect(
          page
            .locator(`a[href*="${pattern.source.replace(/\\/g, '')}"]`)
            .first(),
        ).toBeVisible();
      }

      // Email은 mailto: 라 별도로 본다.
      const mail = page.locator('a[href^="mailto:"]').first();
      await expect(mail).toBeVisible();
      await expect(mail).toHaveAttribute('href', /^mailto:.+@.+/);
    },
  );

  test(
    'AC-11.3 외부 링크는 새 탭으로 열린다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/about/');
      const external = page.locator('a[href^="https://"]');
      const count = await external.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i += 1) {
        await expect(external.nth(i)).toHaveAttribute('target', '_blank');
      }
    },
  );

  test(
    'AC-11.4 FAQ 답변의 자리표시자가 실제 값으로 치환된다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/about/');
      const body = await page.locator('main').innerText();

      // 치환되지 않은 자리표시자가 그대로 노출되면 안 된다.
      expect(body).not.toMatch(/\{\{?\s*(count|year|postCount)\s*\}?\}/);

      // 편수는 한국어 원문 기준(75)이지 원문+번역(150)이 아니다.
      expect(body).toMatch(/\b75\b/);
      expect(body).toMatch(/\b2020\b/);
    },
  );

  test(
    'AC-11.5 en 로케일에서 영어 라벨로 같은 구성을 보여준다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/en/about/');
      for (const label of ['Intro', 'Skills', 'Links']) {
        await expect(
          page.getByRole('heading', { name: label, exact: true }),
        ).toBeVisible();
      }
      await expect(
        page.getByRole('heading', { name: 'Frequently asked questions' }),
      ).toBeVisible();
      await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
    },
  );
});
