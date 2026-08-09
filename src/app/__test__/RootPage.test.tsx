import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RootPage, { metadata } from '@/app/page';

/**
 * AC-13.1 / AC-13.2 / AC-13.3 / AC-13.4 — 루트 진입 리다이렉트.
 *
 * 셋 다 카탈로그에서 "게이트 없음 · 미검증"이던 항목이다. 특히 AC-13.2(JS 비활성)와
 * AC-13.3(자동 이동 실패 시 수동 링크)은 E2E로 재현하기 번거로운 조건인데,
 * 실제로는 **정적 HTML에 무엇이 들어가는가**의 문제라 렌더 검증으로 충분하다.
 *
 * RedirectClient는 window.location.replace를 호출하므로 모듈 double로 바꾼다 —
 * jsdom에서 실제 내비게이션은 일어나지 않고, 여기서 확인할 것은
 * "올바른 target이 전달되는가"라는 배선이다.
 */

const redirectTargets: string[] = [];
vi.mock('@/components/layout/RedirectClient', () => ({
  default: ({ target }: { target: string }) => {
    redirectTargets.push(target);
    return null;
  },
}));

describe('RootPage 리다이렉트 배선 @regression', () => {
  it('AC-13.1 기본 로케일 경로를 클라이언트 리다이렉트에 넘긴다 @smoke', () => {
    redirectTargets.length = 0;
    render(<RootPage />);
    expect(redirectTargets).toEqual(['/ko/']);
  });

  it('AC-13.2 JS 없이도 이동하도록 meta refresh를 함께 심는다', () => {
    // 크롤러와 JS 비활성 브라우저가 기댈 유일한 수단이다.
    // React 19는 <meta>를 document.head로 호이스팅하므로 body가 아니라 head에서 찾는다.
    render(<RootPage />);
    const meta = document.head.querySelector('meta[http-equiv="refresh"]');
    expect(meta).not.toBeNull();
    expect(meta).toHaveAttribute('content', '0; url=/ko/');
  });

  it('AC-13.3 자동 이동이 모두 실패해도 누를 수 있는 링크가 남는다', () => {
    // meta refresh와 JS가 둘 다 막힌 환경에서 막다른 화면이 되지 않아야 한다.
    render(<RootPage />);
    const link = screen.getByRole('link');
    // 후행 슬래시는 고정하지 않는다 — next/link가 테스트 환경에서 정규화해
    // `/ko`로 렌더하고, 프로덕션 빌드에서는 trailingSlash 설정이 `/ko/`로 만든다.
    // AC가 요구하는 것은 "기본 로케일 루트로 가는 누를 수 있는 링크"다.
    expect(link.getAttribute('href')).toMatch(/^\/ko\/?$/);
    expect(link).toHaveTextContent(/홍승아 기술 블로그/);
  });

  it('AC-13.2 meta refresh 지연이 0초다', () => {
    // 지연이 있으면 빈 화면이 잠깐 보이고 이탈로 이어진다.
    render(<RootPage />);
    const content = document.head
      .querySelector('meta[http-equiv="refresh"]')
      ?.getAttribute('content');
    expect(content?.startsWith('0;')).toBe(true);
  });
});

describe('RootPage 색인 정책 @regression', () => {
  /**
   * 원래 이 페이지는 `noindex, nofollow`였다. 내용 없는 스텁이 검색 결과에 뜨는 것은
   * 막았지만, 외부 백링크와 서치 콘솔 속성 루트가 모두 `/`라서 그 신호가 통째로
   * 버려졌다. 지금은 canonical로 `/ko/`에 합친다 — 스텁이 노출되지 않는다는 목적은
   * 그대로 달성하면서 신호는 넘긴다.
   */
  it('AC-13.4 루트를 기본 로케일 홈으로 합치도록 canonical을 선언한다', () => {
    expect(metadata.alternates?.canonical).toBe(
      'https://seungahhong.github.io/ko/',
    );
  });

  it('AC-13.4 noindex를 함께 걸지 않는다(걸면 canonical 합치기가 무산된다)', () => {
    expect(metadata.robots).toBeUndefined();
  });

  it('AC-13.4 hreflang으로 두 로케일 홈을 함께 알린다', () => {
    expect(metadata.alternates?.languages).toEqual({
      ko: 'https://seungahhong.github.io/ko/',
      en: 'https://seungahhong.github.io/en/',
      'x-default': 'https://seungahhong.github.io/ko/',
    });
  });
});
