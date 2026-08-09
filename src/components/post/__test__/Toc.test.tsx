import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Toc from '@/components/post/Toc';
import type { TocHeading } from '@/types';

/**
 * AC-7.1 / AC-7.2 / AC-7.3 / AC-7.7 — 목차.
 *
 * AC-7.3(스크롤에 따라 활성 항목 전환)은 IntersectionObserver 임계값 때문에
 * "임계는 판정 범위 밖"으로 적힌 항목이다. 여기서는 관찰자 콜백을 직접 주입해
 * **임계와 무관하게** 전환 로직만 검증한다 — 임계값을 굳히지 않으면서
 * "보이는 것 중 가장 위 heading이 활성이 된다"는 규칙은 지킬 수 있다.
 */

type ObserverCallback = (entries: unknown[]) => void;
let capturedCallback: ObserverCallback | null = null;
const disconnect = vi.fn();
const observe = vi.fn();

class FakeIntersectionObserver {
  constructor(callback: ObserverCallback) {
    capturedCallback = callback;
  }
  observe = observe;
  disconnect = disconnect;
  unobserve = vi.fn();
  takeRecords = () => [];
  root = null;
  rootMargin = '';
  thresholds = [];
}

const headings: TocHeading[] = [
  { id: 'intro', text: '들어가며', depth: 2 },
  { id: 'body', text: '본론', depth: 2 },
  { id: 'deep', text: '세부', depth: 3 },
];

/** heading 요소를 실제 DOM에 넣어 observer가 붙을 대상을 만든다. */
function mountHeadingTargets() {
  for (const h of headings) {
    const el = document.createElement('h2');
    el.id = h.id;
    document.body.appendChild(el);
  }
}

function entry(id: string, isIntersecting: boolean, top: number) {
  return {
    isIntersecting,
    boundingClientRect: { top },
    target: { id },
  };
}

beforeEach(() => {
  capturedCallback = null;
  observe.mockClear();
  disconnect.mockClear();
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  mountHeadingTargets();
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

describe('Toc 렌더 @regression', () => {
  it('AC-7.1 제목과 모든 heading 항목을 렌더한다 @smoke', () => {
    render(<Toc headings={headings} title="목차" />);
    expect(
      screen.getByRole('navigation', { name: '목차' }),
    ).toBeInTheDocument();
    for (const h of headings) {
      expect(screen.getByRole('link', { name: h.text })).toBeInTheDocument();
    }
  });

  it('AC-7.2 각 항목이 해당 heading의 #슬러그로 링크된다', () => {
    render(<Toc headings={headings} title="목차" />);
    expect(screen.getByRole('link', { name: '본론' })).toHaveAttribute(
      'href',
      '#body',
    );
  });

  it('heading 깊이를 data-depth로 남겨 들여쓰기 근거를 준다', () => {
    render(<Toc headings={headings} title="목차" />);
    const deep = screen.getByRole('link', { name: '세부' }).closest('li');
    expect(deep).toHaveAttribute('data-depth', '3');
  });

  it('AC-7.7 heading이 하나도 없으면 아무것도 렌더하지 않는다', () => {
    // 목차 자리만 덩그러니 남으면 본문 폭이 줄어든 채 빈 칸이 된다.
    const { container } = render(<Toc headings={[]} title="목차" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('AC-7.7 heading이 없으면 관찰자를 아예 만들지 않는다', () => {
    render(<Toc headings={[]} title="목차" />);
    expect(observe).not.toHaveBeenCalled();
  });
});

describe('Toc 활성 항목 전환 @regression', () => {
  it('AC-7.3 화면에 보이는 heading 중 가장 위쪽이 활성이 된다', () => {
    render(<Toc headings={headings} title="목차" />);
    expect(capturedCallback).not.toBeNull();

    act(() => {

      capturedCallback!([
      entry('body', true, 300),
      entry('deep', true, 120), // 더 위쪽
    ]);

    });

    const deep = screen.getByRole('link', { name: '세부' }).closest('li');
    expect(deep).toHaveAttribute('data-active', 'true');
  });

  it('AC-7.3 화면 밖 heading은 활성 후보에서 제외된다', () => {
    render(<Toc headings={headings} title="목차" />);
    act(() => {
      capturedCallback!([
      entry('intro', false, 10), // 가장 위지만 보이지 않음
      entry('body', true, 200),
    ]);
    });

    expect(
      screen.getByRole('link', { name: '본론' }).closest('li'),
    ).toHaveAttribute('data-active', 'true');
    expect(
      screen.getByRole('link', { name: '들어가며' }).closest('li'),
    ).toHaveAttribute('data-active', 'false');
  });

  it('AC-7.3 보이는 heading이 하나도 없으면 직전 활성을 유지한다', () => {
    // 섹션 사이 여백을 지날 때 활성 표시가 깜빡이면 안 된다.
    render(<Toc headings={headings} title="목차" />);
    act(() => {
      capturedCallback!([entry('body', true, 100)]);
    });
    act(() => {
      capturedCallback!([entry('body', false, -100)]);
    });

    expect(
      screen.getByRole('link', { name: '본론' }).closest('li'),
    ).toHaveAttribute('data-active', 'true');
  });

  it('모든 heading 요소를 관찰 대상으로 등록한다', () => {
    render(<Toc headings={headings} title="목차" />);
    expect(observe).toHaveBeenCalledTimes(headings.length);
  });

  it('언마운트 시 관찰자를 정리한다', () => {
    const { unmount } = render(<Toc headings={headings} title="목차" />);
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
