import { describe, expect, it } from 'vitest';
import { formatDate, formatViews, ogImagePath, siteConfig } from '@/lib/site';

/**
 * AC-18.6 / AC-9.4 / AC-10.5 (site 상수·포맷터 층)
 *
 * AC-18.6은 이 저장소에서 자동 게이트가 0건이던 항목이다(RK9).
 * `4d1f4573`에서 소유권 확인 메타 태그가 실제로 유실된 전례가 있어,
 * "배포 산출물에 태그가 있는가"는 E2E로, "설정에 값이 살아 있는가"는
 * 여기서 잡는다. 두 층 모두 필요하다 — 설정이 비면 E2E도 같이 무너진다.
 */
describe('siteConfig 계측 자산 @regression', () => {
  it('AC-18.6 검색엔진 소유권 확인 토큰 2종이 비어 있지 않다 @smoke', () => {
    expect(siteConfig.verification.google).toBeTruthy();
    expect(siteConfig.verification.naver).toBeTruthy();
    // 공백만 든 문자열도 "삭제된 것"과 같다.
    expect(siteConfig.verification.google.trim()).not.toBe('');
    expect(siteConfig.verification.naver.trim()).not.toBe('');
  });

  it('AC-18.6 소유권 토큰이 자리표시자가 아니다', () => {
    // 토큰을 지우는 대신 더미로 바꿔 넣는 실수를 잡는다.
    for (const token of [
      siteConfig.verification.google,
      siteConfig.verification.naver,
    ]) {
      expect(token).not.toMatch(/^(TODO|CHANGEME|xxx+|your-)/i);
      expect(token.length).toBeGreaterThan(16);
    }
  });

  it('GA4 측정 ID가 하나 이상이고 전부 G- 형식이다 @smoke', () => {
    expect(siteConfig.gaIds.length).toBeGreaterThan(0);
    for (const id of siteConfig.gaIds) {
      expect(id).toMatch(/^G-[A-Z0-9]+$/);
    }
  });

  it('GA4 측정 ID에 중복이 없다', () => {
    // 같은 ID를 두 번 config하면 히트가 중복 집계된다.
    expect(new Set(siteConfig.gaIds).size).toBe(siteConfig.gaIds.length);
  });

  it('AC-10.5 로케일별 OG 이미지 경로가 루트 절대 경로다', () => {
    expect(ogImagePath.ko).toBe('/og/ko.png');
    expect(ogImagePath.en).toBe('/og/en.png');
  });

  it('사이트 URL이 후행 슬래시 없는 절대 origin이다', () => {
    // absoluteUrl이 `${siteConfig.url}${pathname}` 로 붙이므로 여기 슬래시가 남으면 `//` 가 된다.
    expect(siteConfig.url).toMatch(/^https:\/\//);
    expect(siteConfig.url.endsWith('/')).toBe(false);
  });
});

describe('formatViews @regression', () => {
  it('AC-9.4 조회수를 로케일별 compact 표기로 축약한다', () => {
    // ko는 K가 아니라 "천"을 쓴다 — AC 문서의 예시(`1.2K`)는 en 기준이다.
    expect(formatViews(1234, 'ko')).toBe('1.2천');
    expect(formatViews(1234, 'en')).toBe('1.2K');
  });

  it('AC-9.4 네 자리 미만은 축약하지 않는다', () => {
    expect(formatViews(0, 'en')).toBe('0');
    expect(formatViews(999, 'en')).toBe('999');
    expect(formatViews(999, 'ko')).toBe('999');
  });

  it('AC-9.4 소수 첫째 자리까지만 남긴다', () => {
    // maximumFractionDigits: 1 — 1.25K가 아니라 1.3K.
    expect(formatViews(1250, 'en')).toBe('1.3K');
    expect(formatViews(1_000_000, 'en')).toBe('1M');
  });
});

describe('formatDate @regression', () => {
  it('로케일별 표시 형식으로 바꾼다', () => {
    expect(formatDate('2024-03-01', 'ko')).toBe('2024.03.01');
    expect(formatDate('2024-03-01', 'en')).toBe('03/01/2024');
  });

  it('형식이 어긋난 입력은 예외 없이 원본을 돌려준다', () => {
    // 프론트매터 date가 깨져도 목록 전체가 죽지 않아야 한다.
    expect(formatDate('2024-03', 'ko')).toBe('2024-03');
    expect(formatDate('', 'en')).toBe('');
  });
});
