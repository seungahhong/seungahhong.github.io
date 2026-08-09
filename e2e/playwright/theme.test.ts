import { test, expect } from '@playwright/test';

/**
 * AC-8.1 ~ AC-8.3 — 테마 전환·유지.
 *
 * push-down 노트: "무엇을 무엇으로 반전하는가"라는 계산은 ThemeToggle
 * 통합 테스트로 내렸다. 여기 남긴 둘은 **브라우저 없이는 검증할 수 없는 것**이다 —
 * 재방문 시 유지(저장소 + 초기 스크립트)와 OS 선호 반영.
 *
 * 모드: @e2e-mock
 */

test.describe('theme', () => {
  test(
    'AC-8.1 AC-8.2 테마를 바꾸면 새로고침 후에도 유지된다',
    { tag: ['@smoke', '@regression', '@e2e-mock'] },
    async ({ page }) => {
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
    },
  );

  test(
    'AC-8.3 첫 방문에 OS 다크 모드를 따른다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ browser }) => {
      // 저장된 선택이 없는 새 컨텍스트 — 통합 테스트로는 재현할 수 없는 조건이다.
      const context = await browser.newContext({ colorScheme: 'dark' });
      const page = await context.newPage();
      await page.goto('/ko/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await context.close();
    },
  );

  test(
    'AC-8.3 OS 라이트 모드면 라이트로 시작한다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ browser }) => {
      const context = await browser.newContext({ colorScheme: 'light' });
      const page = await context.newPage();
      await page.goto('/ko/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
      await context.close();
    },
  );
});
