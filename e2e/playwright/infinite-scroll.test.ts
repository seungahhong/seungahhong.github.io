import { test, expect } from '@playwright/test';

// test-layering-harness 생성 — AC-13 (무한 스크롤 실동작 여정)
// 오라클 = 기대 검증(행동): 아래로 스크롤하면 카드가 더 로드되고(최소 1회 증가), 카드 수는 줄지 않는다(단조 비감소).
// 근거: useInfinityScroll.tsx(센티넬 교차 시 count 증가) + PostItem.tsx:99-105(카드=img[alt="Post Item Image"] 포함 링크).
// 주의: baseURL=프로덕션(동적 데이터) → 정확 개수·상한 도달은 데이터 의존이라 assert하지 않음(로컬 gatsby develop 권장).

const CARD = 'a:has(img[alt="Post Item Image"])';

test.describe('무한 스크롤 (AC-13)', () => {
  test('아래로 스크롤하면 카드 수가 증가하고 줄지 않는다', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/');
    await page.locator(CARD).first().waitFor();

    const count = () => page.locator(CARD).count();
    let maxSeen = await count();
    expect(maxSeen).toBeGreaterThan(0);

    let increased = false;
    for (let i = 0; i < 12; i++) {
      // mobile WebKit은 mouse.wheel 미지원 → window.scrollBy로 스크롤(센티넬 교차 동일 트리거)
      await page.evaluate(() => window.scrollBy(0, 6000));
      await page.waitForTimeout(700);
      const cur = await count();
      expect(cur).toBeGreaterThanOrEqual(maxSeen); // 단조 비감소(카드가 사라지지 않음)
      if (cur > maxSeen) increased = true;
      maxSeen = cur;
    }
    expect(increased).toBe(true); // 스크롤로 더 로드됨(무한 스크롤 동작)
  });
});
