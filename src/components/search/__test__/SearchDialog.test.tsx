import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getDictionary } from '@/lib/i18n';
import SearchDialog from '@/components/search/SearchDialog';
import { makeSearchDoc, manyDocs, scoringDocs } from './fixtures/search-docs';

/**
 * AC-3.3 / AC-3.4 / AC-3.5 / AC-3.6 / AC-3.7 / AC-3.8 / AC-3.9
 *
 * 이 중 AC-3.3(Esc 포커스 복원)·AC-3.8(키보드 내비게이션 후 이동)은
 * 인수조건 카탈로그에서 "게이트 없음 · 미검증"이던 항목이다.
 * E2E로 올리면 느리고 깨지기 쉬워 여기(Integration)로 push-down했다.
 *
 * API 경계: 이 컴포넌트는 HTTP를 호출하지 않는다(정적 익스포트라 index가 props로 온다).
 * 유일한 외부 경계는 next/navigation 라우터 → 모듈 double.
 */

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: (...args: unknown[]) => push(...args) }),
}));

const dict = getDictionary('ko');

function renderDialog(index = scoringDocs, onClose = vi.fn()) {
  render(
    <SearchDialog index={index} locale="ko" dict={dict} onClose={onClose} />,
  );
  return { onClose };
}

beforeEach(() => {
  push.mockClear();
});

describe('SearchDialog 열림 상태 @regression', () => {
  it('AC-3.1 입력창이 포커스를 갖고 플레이스홀더가 사전 문구다 @smoke', () => {
    renderDialog();
    const input = screen.getByRole('combobox');
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute('placeholder', dict.nav.searchPlaceholder);
  });

  it('AC-3.4 입력이 비어 있으면 상위 문서를 최대 8건 보여준다', () => {
    renderDialog(manyDocs);
    // 검색어 최소 길이 조건이 없다 — 열자마자 목록이 있어야 한다.
    expect(screen.getAllByRole('option')).toHaveLength(8);
  });

  it('AC-3.5 매칭이 9건 이상이어도 결과가 8건을 넘지 않는다', async () => {
    const user = userEvent.setup();
    renderDialog(manyDocs);
    await user.type(screen.getByRole('combobox'), 'react');
    expect(screen.getAllByRole('option')).toHaveLength(8);
  });
});

describe('SearchDialog 스코어링 @regression', () => {
  it('AC-3.6 제목이 검색어로 시작하는 글이 발췌만 매칭된 글보다 위에 온다', async () => {
    const user = userEvent.setup();
    renderDialog(scoringDocs);
    await user.type(screen.getByRole('combobox'), 'react');

    const titles = screen
      .getAllByRole('option')
      .map(
        (li) =>
          within(li).getByText(/./, { selector: 'span.font-semibold' })
            .textContent,
      );
    // 100 → 50 → 30 → 20 → 8
    expect(titles).toEqual([
      'React basics',
      'Learning React',
      'Xray',
      'Yankee',
      'Zeta',
    ]);
  });

  it('AC-3.6 대소문자를 구분하지 않는다', async () => {
    const user = userEvent.setup();
    renderDialog(scoringDocs);
    await user.type(screen.getByRole('combobox'), 'REACT');
    expect(screen.getAllByRole('option').length).toBeGreaterThan(0);
  });

  it('점수가 0인 문서는 결과에서 빠진다', async () => {
    const user = userEvent.setup();
    renderDialog([
      makeSearchDoc({ slug: 'hit', title: 'React' }),
      makeSearchDoc({ slug: 'miss', title: 'Vue', category: 'Docs' }),
    ]);
    await user.type(screen.getByRole('combobox'), 'react');
    expect(screen.getAllByRole('option')).toHaveLength(1);
  });
});

describe('SearchDialog 결과 항목 @regression', () => {
  it('AC-3.7 카테고리·날짜·제목을 보여주고 태그가 있으면 #태그로 붙인다', () => {
    renderDialog([
      makeSearchDoc({
        slug: 'a',
        title: 'Alpha',
        category: '개발',
        tags: ['React', 'Next.js'],
        date: '2024-03-01',
      }),
    ]);
    const option = screen.getByRole('option');
    expect(within(option).getByText('개발')).toBeInTheDocument();
    expect(within(option).getByText('2024.03.01')).toBeInTheDocument();
    expect(within(option).getByText('Alpha')).toBeInTheDocument();
    expect(within(option).getByText(/#React\s+#Next\.js/)).toBeInTheDocument();
  });

  it('AC-3.7 태그가 없으면 태그 줄을 렌더하지 않는다', () => {
    renderDialog([makeSearchDoc({ slug: 'a', title: 'Alpha', tags: [] })]);
    expect(within(screen.getByRole('option')).queryByText(/^#/)).toBeNull();
  });
});

describe('SearchDialog 키보드 조작 @regression', () => {
  it('AC-3.8 ↓로 활성 항목을 옮기고 Enter로 그 글로 이동한다', async () => {
    const user = userEvent.setup();
    const { onClose } = renderDialog(scoringDocs);
    const input = screen.getByRole('combobox');
    await user.type(input, 'react');

    // 첫 항목이 활성 상태로 시작한다.
    expect(screen.getAllByRole('option')[0]).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.keyboard('{ArrowDown}');
    expect(screen.getAllByRole('option')[1]).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.keyboard('{Enter}');
    // 두 번째(=Learning React, slug title-contains)로 이동해야 한다.
    // AC-3.8 원문이 `/{로케일}/posts/{slug}` — 라우터에 넘기는 경로에는
    // 후행 슬래시가 없다(정적 산출물 요청 시 Next가 붙인다).
    expect(push).toHaveBeenCalledWith('/ko/posts/title-contains');
    expect(onClose).toHaveBeenCalled();
  });

  it('AC-3.8 ↑는 첫 항목 아래로 내려가지 않는다', async () => {
    const user = userEvent.setup();
    renderDialog(scoringDocs);
    await user.type(screen.getByRole('combobox'), 'react');
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(screen.getAllByRole('option')[0]).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('AC-3.8 ↓는 마지막 항목을 넘어가지 않는다', async () => {
    const user = userEvent.setup();
    renderDialog([makeSearchDoc({ slug: 'only', title: 'React only' })]);
    await user.type(screen.getByRole('combobox'), 'react');
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(screen.getByRole('option')).toHaveAttribute('aria-selected', 'true');
  });

  it('AC-3.3 Esc를 누르면 닫기 콜백이 불린다', async () => {
    const user = userEvent.setup();
    const { onClose } = renderDialog();
    await user.type(screen.getByRole('combobox'), '{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('AC-3.3 닫힐 때 열기 직전 요소로 포커스가 돌아온다', async () => {
    // 이 복원이 없으면 키보드 사용자는 팔레트를 닫는 순간 문서 처음으로 튕긴다.
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    expect(trigger).toHaveFocus();

    const { unmount } = render(
      <SearchDialog
        index={scoringDocs}
        locale="ko"
        dict={dict}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByRole('combobox')).toHaveFocus();

    unmount();
    expect(trigger).toHaveFocus();
    trigger.remove();
  });
});

describe('SearchDialog 빈 상태 @regression', () => {
  it('AC-3.9 매칭이 없으면 사전의 결과 없음 문구를 보여준다 @smoke', async () => {
    const user = userEvent.setup();
    renderDialog(scoringDocs);
    await user.type(screen.getByRole('combobox'), 'zzzzz없는검색어');
    expect(screen.getByText(dict.nav.noResults)).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('AC-3.9 en 로케일에서는 영어 결과 없음 문구가 나온다', async () => {
    const user = userEvent.setup();
    const en = getDictionary('en');
    render(
      <SearchDialog
        index={scoringDocs}
        locale="en"
        dict={en}
        onClose={vi.fn()}
      />,
    );
    await user.type(screen.getByRole('combobox'), 'zzzzz');
    expect(screen.getByText(en.nav.noResults)).toBeInTheDocument();
  });
});

describe('SearchDialog 닫기 경로 @regression', () => {
  it('배경을 클릭하면 닫힌다', async () => {
    const user = userEvent.setup();
    const { onClose } = renderDialog();
    await user.click(screen.getByRole('presentation'));
    expect(onClose).toHaveBeenCalled();
  });

  it('대화상자 내부 클릭은 닫지 않는다', async () => {
    const user = userEvent.setup();
    const { onClose } = renderDialog();
    await user.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('열려 있는 동안 배경 스크롤을 잠그고 닫을 때 되돌린다', () => {
    const before = document.body.style.overflow;
    const { unmount } = render(
      <SearchDialog
        index={scoringDocs}
        locale="ko"
        dict={dict}
        onClose={vi.fn()}
      />,
    );
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe(before);
  });
});
