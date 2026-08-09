import { describe, expect, it } from 'vitest';
import { readingTime } from '@/lib/reading-time';

describe('readingTime', () => {
  it('returns at least 1 minute for empty or tiny content', () => {
    expect(readingTime('')).toBe(1);
    expect(readingTime('안녕')).toBe(1);
  });

  it('scales with Korean content length', () => {
    const short = '가'.repeat(200);
    const long = '가'.repeat(2500);
    expect(readingTime(long)).toBeGreaterThan(readingTime(short));
    // 2500자 / 500 = 5분
    expect(readingTime(long)).toBe(5);
  });

  it('counts English words at ~200 wpm', () => {
    const words = Array.from({ length: 600 }, () => 'word').join(' ');
    // 600 / 200 = 3분
    expect(readingTime(words)).toBe(3);
  });

  it('ignores fenced code blocks', () => {
    const withCode =
      '가'.repeat(500) + '\n```\n' + 'x'.repeat(5000) + '\n```\n';
    // 코드 제외 시 500자/500 = 1분
    expect(readingTime(withCode)).toBe(1);
  });
});
