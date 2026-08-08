import { render } from '@testing-library/react';
import { act } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import ReadingProgress from '@/components/post/ReadingProgress';

/**
 * AC-7.4 / AC-7.10 — 읽기 진행률 막대.
 *
 * AC-7.10("스크린리더에 읽히지 않는다")은 접근성 **갭**으로 기록된 항목이지만,
 * 진행률 막대는 장식이라 aria-hidden이 오히려 올바른 선택이다.
 * 갭으로 남은 건 "대체 수단이 없다"는 점이므로, 여기서는 현재 계약
 * (aria-hidden 유지)을 고정하고 대체 수단 논의는 문서에 남긴다.
 */

function setScrollGeometry({
  scrollHeight,
  clientHeight,
  scrollTop,
}: {
  scrollHeight: number;
  clientHeight: number;
  scrollTop: number;
}) {
  const doc = document.documentElement;
  Object.defineProperty(doc, 'scrollHeight', {
    value: scrollHeight,
    configurable: true,
  });
  Object.defineProperty(doc, 'clientHeight', {
    value: clientHeight,
    configurable: true,
  });
  Object.defineProperty(doc, 'scrollTop', {
    value: scrollTop,
    configurable: true,
    writable: true,
  });
}

function bar(container: HTMLElement): HTMLElement {
  return container.querySelector('.reading-progress i') as HTMLElement;
}

afterEach(() => {
  // 다음 테스트가 이전 기하 정보를 물려받지 않도록 되돌린다.
  for (const prop of ['scrollHeight', 'clientHeight', 'scrollTop']) {
    delete (document.documentElement as unknown as Record<string, unknown>)[
      prop
    ];
  }
});

describe('ReadingProgress 진행률 계산 @regression', () => {
  it('AC-7.4 문서 맨 위에서는 0%다', () => {
    setScrollGeometry({ scrollHeight: 2000, clientHeight: 1000, scrollTop: 0 });
    const { container } = render(<ReadingProgress />);
    expect(bar(container).style.width).toBe('0%');
  });

  it('AC-7.4 스크롤하면 비율만큼 막대가 길어진다 @smoke', () => {
    setScrollGeometry({ scrollHeight: 2000, clientHeight: 1000, scrollTop: 0 });
    const { container } = render(<ReadingProgress />);

    // 스크롤 가능 높이 1000 중 500 → 50%
    setScrollGeometry({
      scrollHeight: 2000,
      clientHeight: 1000,
      scrollTop: 500,
    });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(bar(container).style.width).toBe('50%');
  });

  it('AC-7.4 문서 끝에서는 100%다', () => {
    setScrollGeometry({ scrollHeight: 2000, clientHeight: 1000, scrollTop: 0 });
    const { container } = render(<ReadingProgress />);

    setScrollGeometry({
      scrollHeight: 2000,
      clientHeight: 1000,
      scrollTop: 1000,
    });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(bar(container).style.width).toBe('100%');
  });

  it('AC-7.4 과다 스크롤(바운스)에도 100%를 넘지 않는다', () => {
    setScrollGeometry({ scrollHeight: 2000, clientHeight: 1000, scrollTop: 0 });
    const { container } = render(<ReadingProgress />);

    setScrollGeometry({
      scrollHeight: 2000,
      clientHeight: 1000,
      scrollTop: 1500,
    });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(bar(container).style.width).toBe('100%');
  });

  it('스크롤할 곳이 없는 짧은 글에서는 0%로 둔다', () => {
    // scrollable이 0이면 0으로 나눠 NaN%가 되기 쉬운 자리다.
    setScrollGeometry({ scrollHeight: 800, clientHeight: 800, scrollTop: 0 });
    const { container } = render(<ReadingProgress />);
    expect(bar(container).style.width).toBe('0%');
  });

  it('창 크기가 바뀌어도 다시 계산한다', () => {
    setScrollGeometry({ scrollHeight: 2000, clientHeight: 1000, scrollTop: 0 });
    const { container } = render(<ReadingProgress />);

    setScrollGeometry({
      scrollHeight: 2000,
      clientHeight: 1000,
      scrollTop: 250,
    });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(bar(container).style.width).toBe('25%');
  });
});

describe('ReadingProgress 접근성 @regression', () => {
  it('AC-7.10 진행률 막대는 aria-hidden이라 스크린리더에 읽히지 않는다', () => {
    const { container } = render(<ReadingProgress />);
    expect(container.querySelector('.reading-progress')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('접근성 트리에 노출되는 요소를 만들지 않는다', () => {
    const { container } = render(<ReadingProgress />);
    // 장식 요소가 role을 갖게 되면 스크린리더 순회에 잡음이 된다.
    expect(container.querySelector('[role]')).toBeNull();
  });
});
