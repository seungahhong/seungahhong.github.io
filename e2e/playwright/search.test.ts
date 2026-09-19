import { test, expect, type Page } from '@playwright/test';

/**
 * AC-3.1, AC-3.9, AC-3.10 — 검색 팔레트(표면).
 *
 * push-down 노트: 스코어링 순위(AC-3.6)·키보드 내비게이션(AC-3.8)·
 * 포커스 복원(AC-3.3)·결과 상한(AC-3.4/3.5)은 전부
 * SearchDialog 통합 테스트로 내렸다 — 브라우저를 띄우지 않고도
 * 더 정확하게, 더 많은 경우를 볼 수 있는 것들이다.
 *
 * 여기 남긴 건 "실제 페이지에서 팔레트가 열리고 실제 글로 이동하는가"뿐이다.
 *
 * 모드: @e2e-mock
 */

/**
 * ⌘K 리스너는 hydration 이후 useEffect에서 붙는다. `goto` 직후 바로 누르면
 * 리스너가 아직 없어 키 입력이 버려질 수 있다(인덱스가 커질수록 hydration이
 * 늦어져 CI에서 실제로 깨졌다). 열릴 때까지 다시 누르되, 이미 열려 있으면
 * 누르지 않는다 — 단축키가 토글이라 다시 누르면 닫혀 버린다.
 */
async function openWithShortcut(page: Page) {
  const dialog = page.getByRole('dialog', { name: '검색' });
  await expect(async () => {
    if (!(await dialog.isVisible())) {
      await page.keyboard.press('ControlOrMeta+k');
    }
    await expect(dialog).toBeVisible({ timeout: 1_000 });
  }).toPass();
  return dialog;
}

test.describe('search command palette (surface)', () => {
  test(
    'AC-3.1 ⌘K로 팔레트가 열린다',
    { tag: ['@smoke', '@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/');
      await openWithShortcut(page);
    },
  );

  test(
    'AC-3.1 검색해서 실제 글로 이동한다',
    { tag: ['@smoke', '@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/');
      const dialog = await openWithShortcut(page);
      const input = dialog.getByRole('combobox');
      await input.fill('vite');
      await expect(dialog.getByText(/vite/i).first()).toBeVisible();

      await input.press('Enter');
      await expect(page).toHaveURL(/\/ko\/posts\/.*vite/i);
    },
  );

  test(
    'AC-3.10 헤더 검색 버튼으로도 열리고 Escape로 닫힌다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/');
      await page
        .getByRole('button', { name: '검색', exact: true })
        .first()
        .click();

      const dialog = page.getByRole('dialog', { name: '검색' });
      await expect(dialog).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
    },
  );

  test(
    'AC-3.9 매칭이 없으면 결과 없음 문구를 보여준다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/');
      const dialog = await openWithShortcut(page);
      await dialog.getByRole('combobox').fill('zzzz-no-such-post-zzzz');
      await expect(dialog.getByText('검색 결과가 없습니다.')).toBeVisible();
    },
  );
});
