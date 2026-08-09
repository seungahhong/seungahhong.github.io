import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ThemeToggle from '@/components/layout/ThemeToggle';

/**
 * AC-8.1 — 테마 전환.
 *
 * ⚠️ 범위 한계를 분명히 한다: 이 컴포넌트는 `setTheme`을 호출할 뿐,
 * `<html data-theme>`을 실제로 바꾸는 건 next-themes다. 따라서
 * "새로고침해도 유지"(AC-8.2)와 "OS 다크면 dark로 시작"(AC-8.3)은
 * 여기서 검증되지 않는다 — 그 둘은 E2E(theme.test.ts) 소관이다.
 * 여기서 지키는 건 **현재 테마를 어떻게 읽어 무엇으로 반전하는가**다.
 *
 * API 경계: HTTP 호출 없음. next-themes만 모듈 double.
 */

const setTheme = vi.fn();
vi.mock('next-themes', () => ({
  useTheme: () => ({ setTheme: (...args: unknown[]) => setTheme(...args) }),
}));

function mockPrefersDark(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
}

beforeEach(() => {
  setTheme.mockClear();
  document.documentElement.removeAttribute('data-theme');
  mockPrefersDark(false);
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.documentElement.removeAttribute('data-theme');
});

describe('ThemeToggle 반전 @regression', () => {
  it('AC-8.1 현재가 light면 dark로 바꾼다 @smoke', async () => {
    const user = userEvent.setup();
    document.documentElement.setAttribute('data-theme', 'light');
    render(<ThemeToggle label="테마 전환" />);

    await user.click(screen.getByRole('button', { name: '테마 전환' }));
    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('AC-8.1 현재가 dark면 light로 바꾼다 @smoke', async () => {
    const user = userEvent.setup();
    document.documentElement.setAttribute('data-theme', 'dark');
    render(<ThemeToggle label="테마 전환" />);

    await user.click(screen.getByRole('button', { name: '테마 전환' }));
    expect(setTheme).toHaveBeenCalledWith('light');
  });

  it('data-theme이 아직 없으면 OS 선호를 현재값으로 삼는다', async () => {
    // 하이드레이션 직전처럼 속성이 비어 있을 때 잘못된 방향으로 튀지 않아야 한다.
    const user = userEvent.setup();
    mockPrefersDark(true);
    render(<ThemeToggle label="테마 전환" />);

    await user.click(screen.getByRole('button', { name: '테마 전환' }));
    expect(setTheme).toHaveBeenCalledWith('light');
  });

  it('data-theme이 없고 OS가 라이트면 dark로 바꾼다', async () => {
    const user = userEvent.setup();
    mockPrefersDark(false);
    render(<ThemeToggle label="테마 전환" />);

    await user.click(screen.getByRole('button', { name: '테마 전환' }));
    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('연속으로 누르면 매번 현재 DOM 상태를 다시 읽는다', async () => {
    // 내부 state를 캐싱하면 외부에서 테마가 바뀐 뒤 방향이 어긋난다.
    const user = userEvent.setup();
    document.documentElement.setAttribute('data-theme', 'light');
    render(<ThemeToggle label="테마 전환" />);
    const button = screen.getByRole('button', { name: '테마 전환' });

    await user.click(button);
    expect(setTheme).toHaveBeenLastCalledWith('dark');

    document.documentElement.setAttribute('data-theme', 'dark');
    await user.click(button);
    expect(setTheme).toHaveBeenLastCalledWith('light');
  });
});

describe('ThemeToggle 접근성 @regression', () => {
  it('버튼에 접근 가능한 이름과 title이 있다', () => {
    render(<ThemeToggle label="테마 전환" />);
    const button = screen.getByRole('button', { name: '테마 전환' });
    expect(button).toHaveAttribute('title', '테마 전환');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('장식용 아이콘은 스크린리더에서 숨긴다', () => {
    const { container } = render(<ThemeToggle label="테마 전환" />);
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
    for (const icon of icons) {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    }
  });
});
