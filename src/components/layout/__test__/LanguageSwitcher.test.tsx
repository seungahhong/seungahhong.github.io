import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

/**
 * AC-5.1 ~ AC-5.6 — 언어 전환 시 경로 유지.
 *
 * AC-5.3(같은 로케일 클릭 시 무변화)은 카탈로그에서 "게이트 없음 · 미검증"이었다.
 * AC-5.5/AC-5.6은 "쿼리·해시가 유지되지 않는다"는 **관측된 갭**인데,
 * 갭이라도 현재 계약이므로 기대로 고정한다 — 나중에 유지되도록 고치면
 * 이 테스트가 빨개져서 "동작이 바뀌었다"고 알려준다.
 *
 * API 경계: HTTP 호출 없음. next/navigation만 모듈 double.
 */

const push = vi.fn();
let pathname = '/ko/posts/sample/';

vi.mock('next/navigation', () => ({
  usePathname: () => pathname,
  useRouter: () => ({ push: (...args: unknown[]) => push(...args) }),
}));

function renderSwitcher(locale: 'ko' | 'en' = 'ko') {
  render(<LanguageSwitcher locale={locale} label="언어 선택" />);
}

beforeEach(() => {
  push.mockClear();
  pathname = '/ko/posts/sample/';
});

describe('LanguageSwitcher 경로 유지 @regression', () => {
  it('AC-5.1 글 상세에서 EN을 누르면 같은 글의 영어 경로로 간다 @smoke', async () => {
    const user = userEvent.setup();
    renderSwitcher('ko');
    await user.click(screen.getByRole('button', { name: /EN/ }));
    expect(push).toHaveBeenCalledWith('/en/posts/sample/');
  });

  it('AC-5.2 about에서 KO를 누르면 한국어 about으로 간다', async () => {
    const user = userEvent.setup();
    pathname = '/en/about/';
    renderSwitcher('en');
    await user.click(screen.getByRole('button', { name: /KO/ }));
    expect(push).toHaveBeenCalledWith('/ko/about/');
  });

  it('AC-5.1 목록 경로도 세그먼트만 바꾼다', async () => {
    const user = userEvent.setup();
    pathname = '/ko/posts/';
    renderSwitcher('ko');
    await user.click(screen.getByRole('button', { name: /EN/ }));
    expect(push).toHaveBeenCalledWith('/en/posts/');
  });
});

describe('LanguageSwitcher 활성 상태 @regression', () => {
  it('AC-5.3 현재 로케일 버튼에 aria-pressed=true가 붙는다', () => {
    renderSwitcher('ko');
    expect(screen.getByRole('button', { name: /KO/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: /EN/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('AC-5.3 현재 로케일을 다시 눌러도 이동하지 않는다', async () => {
    // 같은 경로로 push하면 스크롤이 튀고 히스토리가 지저분해진다.
    const user = userEvent.setup();
    renderSwitcher('ko');
    await user.click(screen.getByRole('button', { name: /KO/ }));
    expect(push).not.toHaveBeenCalled();
  });

  it('스크린리더용 언어 이름을 함께 노출한다', () => {
    renderSwitcher('ko');
    // "KO"만으로는 무슨 언어인지 알 수 없어 sr-only 라벨을 덧붙인다.
    expect(screen.getByRole('button', { name: /한국어/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /English/ })).toBeInTheDocument();
  });

  it('그룹 라벨이 전달된 label을 쓴다', () => {
    renderSwitcher('ko');
    expect(
      screen.getByRole('group', { name: '언어 선택' }),
    ).toBeInTheDocument();
  });
});

describe('LanguageSwitcher 미유지 경계(관측된 갭) @regression', () => {
  it('AC-5.5 쿼리스트링은 전환 후 유지되지 않는다', async () => {
    // usePathname()이 쿼리를 포함하지 않으므로 `?tag=React`가 사라진다.
    // 이건 현재 계약이며, 유지하도록 바꾸면 이 테스트가 알려준다.
    const user = userEvent.setup();
    pathname = '/ko/tags/';
    renderSwitcher('ko');
    await user.click(screen.getByRole('button', { name: /EN/ }));
    expect(push).toHaveBeenCalledWith('/en/tags/');
    expect(push).not.toHaveBeenCalledWith(expect.stringContaining('?'));
  });

  it('AC-5.6 해시도 전환 후 유지되지 않는다', async () => {
    const user = userEvent.setup();
    pathname = '/ko/posts/sample/';
    renderSwitcher('ko');
    await user.click(screen.getByRole('button', { name: /EN/ }));
    expect(push).not.toHaveBeenCalledWith(expect.stringContaining('#'));
  });
});
