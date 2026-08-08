import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * AC-12.4 / AC-12.5 — 자동 접근성 검사(axe, WCAG 2 A/AA + 2.1).
 *
 * 판정 범위를 문서와 일치시킨다: serious·critical만 합·불 대상이고
 * moderate·minor는 아니다. 또한 axe는 **hover 전용 상호작용을 잡지 못한다** —
 * heading 앵커(AC-2.5)와 진행률 막대(AC-7.10)가 그 사각지대이며,
 * 그래서 이 게이트 통과가 UG4(키보드만으로 이용) 충족을 뜻하지는 않는다(가정 A7).
 *
 * 모드: @e2e-mock
 */

const PAGES = [
  { name: 'home', path: '/ko/' },
  { name: 'posts', path: '/ko/posts/' },
  { name: 'tags', path: '/ko/tags/' },
  { name: 'about', path: '/ko/about/' },
  { name: 'post detail', path: '/ko/posts/2026-07-05-meta-harness/' },
];

test.describe('automated accessibility (axe, WCAG 2 A/AA)', () => {
  for (const { name, path } of PAGES) {
    test(
      `AC-12.4 ${name} 에 serious/critical 위반이 없다`,
      { tag: ['@regression', '@e2e-mock'] },
      async ({ page }) => {
        await page.goto(path);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();

        // AC-12.5: moderate·minor는 판정에서 제외한다.
        const blocking = results.violations.filter(
          (v) => v.impact === 'serious' || v.impact === 'critical',
        );
        expect(
          blocking,
          blocking.map((v) => `${v.id}: ${v.help}`).join('\n'),
        ).toEqual([]);
      },
    );
  }

  test(
    'AC-12.5 en 로케일 홈도 같은 기준을 만족한다',
    { tag: ['@nightly', '@e2e-mock'] },
    async ({ page }) => {
      // ko 5개 페이지가 PR 게이트라면, 로케일 교차 검사는 야간으로 미룬다.
      await page.goto('/en/');
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      );
      expect(
        blocking,
        blocking.map((v) => `${v.id}: ${v.help}`).join('\n'),
      ).toEqual([]);
    },
  );
});
