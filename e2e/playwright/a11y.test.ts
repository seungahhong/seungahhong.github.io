import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = [
  { name: 'home', path: '/ko/' },
  { name: 'posts', path: '/ko/posts/' },
  { name: 'tags', path: '/ko/tags/' },
  { name: 'about', path: '/ko/about/' },
  { name: 'post detail', path: '/ko/posts/2026-07-05-meta-harness/' },
];

test.describe('automated accessibility (axe, WCAG 2 A/AA)', () => {
  for (const { name, path } of PAGES) {
    test(`${name} has no serious/critical violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const serious = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      );
      expect(
        serious,
        serious.map((v) => `${v.id}: ${v.help}`).join('\n'),
      ).toEqual([]);
    });
  }
});
