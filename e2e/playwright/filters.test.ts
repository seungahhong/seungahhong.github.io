import { test, expect } from '@playwright/test';

/**
 * AC-4.1, AC-4.5, AC-4.6 — 태그·카테고리 필터(표면).
 *
 * 통합 노트: 이전에는 tag.test.ts와 category.test.ts로 나뉘어 있었는데,
 * 둘 다 같은 요구(R4/NFR3)의 같은 메커니즘(쿼리 기반 클라이언트 필터)을
 * 검증하고 있어 한 스펙으로 합쳤다.
 *
 * push-down 노트: 토글·해제 버튼·URL 복원·잘못된 값 처리(AC-4.2/4.3/4.4/4.7)는
 * TagsExplorer·PostsExplorer 통합 테스트로 내렸다. 여기 남긴 건 실제 라우팅과
 * 정적 산출물이 맞물리는 지점, 그리고 per-tag 정적 경로 부재(NFR3)다.
 *
 * 모드: @e2e-mock
 */

// 태그 칩은 .tag-pill(::before "#"는 CSS)이라 접근명 대신 텍스트로 선택한다.
// 텍스트는 "react4" 형태 → /^react\d/ 로 react-router와 구분.
const reactChip = (page: import('@playwright/test').Page) =>
  page.locator('button.tag-pill').filter({ hasText: /^react\d/ });

test.describe('tag filter', () => {
  test(
    'AC-4.1 태그 칩을 누르면 URL에 ?tag= 가 남는다',
    { tag: ['@smoke', '@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/tags/');
      await reactChip(page).click();
      await expect(page).toHaveURL(/tag=react/);
      await expect(reactChip(page)).toHaveAttribute('aria-pressed', 'true');
    },
  );

  test(
    'AC-4.1 ?tag= 로 진입하면 해당 칩이 선택된 채로 복원된다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/tags/?tag=react');
      await expect(reactChip(page)).toHaveAttribute('aria-pressed', 'true');
    },
  );

  test(
    'AC-4.1 글 카드의 태그 링크가 필터된 태그 페이지로 간다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/');
      await page.locator('a[href*="/tags/?tag="]').first().click();
      await expect(page).toHaveURL(/\/ko\/tags\/\?tag=/);
    },
  );

  test(
    'NFR3 / AC-4.6 per-tag 정적 경로는 존재하지 않는다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      // 한글 디렉토리 익스포트 리스크를 피하려 쿼리 기반으로만 제공한다.
      await page.goto('/ko/tags/react/');
      await expect(page.getByText('404')).toBeVisible();
    },
  );
});

test.describe('category filter', () => {
  test(
    'AC-4.5 칩을 누르면 ?category= 가 URL에 남고 전체로 해제된다',
    { tag: ['@smoke', '@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/posts/');

      await page.getByRole('button', { name: /^개발/ }).click();
      await expect(page).toHaveURL(/category=(%EA%B0%9C%EB%B0%9C|개발)/);
      await expect(page.getByRole('button', { name: /^개발/ })).toHaveAttribute(
        'aria-pressed',
        'true',
      );

      await page.getByRole('button', { name: /전체/ }).click();
      await expect(page).toHaveURL(/\/ko\/posts\/(\?)?$/);
    },
  );

  test(
    'AC-4.5 ?category= 로 진입하면 해당 칩이 선택된 채로 복원된다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/posts/?category=도구');

      await expect(page.getByRole('button', { name: /도구/ })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await expect(page.getByRole('button', { name: /전체/ })).toHaveAttribute(
        'aria-pressed',
        'false',
      );
    },
  );

  test(
    'AC-4.5 사이드바 카테고리 링크가 필터된 목록으로 간다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ page }) => {
      await page.goto('/ko/');
      // 한글 카테고리라 href가 퍼센트 인코딩된다.
      await page.locator('a[href*="category=%EB%8F%84%EA%B5%AC"]').click();

      await expect(page).toHaveURL(/category=(%EB%8F%84%EA%B5%AC|도구)/);
      await expect(page.getByRole('button', { name: /도구/ })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    },
  );
});
