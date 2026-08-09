import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { getDictionary } from '@/lib/i18n';
import TagsExplorer from '@/components/tags/TagsExplorer';
import { makePostMeta } from '@/lib/__test__/fixtures/post-meta';

/**
 * AC-4.1 ~ AC-4.4, AC-4.7, AC-4.9 — 태그 필터와 URL 상태.
 *
 * useQueryParam은 실제 location/history를 쓰므로 mock하지 않는다.
 * jsdom의 진짜 URL을 움직여야 "URL에 상태가 남는가"라는 AC를 검증할 수 있고,
 * 훅을 double로 바꿔치면 그 질문 자체가 사라진다.
 *
 * API 경계: HTTP 호출 없음(정적 익스포트 — posts/tags가 props로 온다).
 */

const dict = getDictionary('ko');

const posts = [
  makePostMeta({ slug: 'a', title: 'React 글', tags: ['React'] }),
  makePostMeta({ slug: 'b', title: 'Next 글', tags: ['Next.js'] }),
  makePostMeta({ slug: 'c', title: '둘 다', tags: ['React', 'Next.js'] }),
];
const tags = [
  { tag: 'React', count: 2 },
  { tag: 'Next.js', count: 2 },
];

function setUrl(search = '') {
  window.history.replaceState(null, '', `/ko/tags/${search}`);
}

function renderExplorer() {
  render(<TagsExplorer locale="ko" dict={dict} posts={posts} tags={tags} />);
}

/** 카드 제목만 뽑는다 — 목록에 실제로 남은 글을 본다. */
function visibleTitles(): string[] {
  return posts
    .map((p) => p.title)
    .filter((title) => screen.queryByText(title) !== null);
}

beforeEach(() => {
  setUrl();
});

describe('TagsExplorer 필터 적용 @regression', () => {
  it('AC-4.1 태그 칩을 누르면 URL에 ?tag= 가 남고 제목이 #태그로 바뀐다 @smoke', async () => {
    const user = userEvent.setup();
    renderExplorer();

    await user.click(screen.getByRole('button', { name: /React/ }));

    expect(window.location.search).toBe('?tag=React');
    expect(
      screen.getByRole('heading', { level: 1, name: /React/ }),
    ).toBeInTheDocument();
  });

  it('AC-4.1 필터된 글 수를 함께 보여준다', async () => {
    const user = userEvent.setup();
    renderExplorer();
    await user.click(screen.getByRole('button', { name: /React/ }));
    // React 태그를 가진 글은 2편.
    expect(screen.getByText(`2${dict.tags.postCount}`)).toBeInTheDocument();
  });

  it('AC-4.1 해당 태그를 가진 글만 남는다', async () => {
    const user = userEvent.setup();
    renderExplorer();
    await user.click(screen.getByRole('button', { name: /^React/ }));
    expect(visibleTitles()).toEqual(['React 글', '둘 다']);
  });

  it('활성 칩에 aria-pressed=true가 붙는다', async () => {
    const user = userEvent.setup();
    renderExplorer();
    await user.click(screen.getByRole('button', { name: /^React/ }));
    expect(screen.getByRole('button', { name: /^React/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});

describe('TagsExplorer 필터 해제 @regression', () => {
  it('AC-4.2 같은 칩을 다시 누르면 ?tag= 가 사라지고 전체로 돌아온다', async () => {
    const user = userEvent.setup();
    renderExplorer();
    const chip = screen.getByRole('button', { name: /^React/ });

    await user.click(chip);
    expect(window.location.search).toBe('?tag=React');

    await user.click(chip);
    expect(window.location.search).toBe('');
    expect(visibleTitles()).toHaveLength(3);
  });

  it('AC-4.3 필터 해제 버튼으로도 해제된다', async () => {
    const user = userEvent.setup();
    renderExplorer();
    await user.click(screen.getByRole('button', { name: /^React/ }));

    await user.click(
      screen.getByRole('button', { name: new RegExp(dict.tags.clearFilter) }),
    );
    expect(window.location.search).toBe('');
    expect(visibleTitles()).toHaveLength(3);
  });

  it('AC-4.3 필터가 없으면 해제 버튼이 보이지 않는다', () => {
    renderExplorer();
    expect(
      screen.queryByRole('button', { name: new RegExp(dict.tags.clearFilter) }),
    ).toBeNull();
  });
});

describe('TagsExplorer URL 복원 @regression', () => {
  it('AC-4.4 ?tag= 가 붙은 URL로 진입하면 필터가 복원된다 @smoke', () => {
    setUrl('?tag=Next.js');
    renderExplorer();

    expect(
      screen.getByRole('heading', { level: 1, name: /Next\.js/ }),
    ).toBeInTheDocument();
    expect(visibleTitles()).toEqual(['Next 글', '둘 다']);
  });

  it('AC-4.7 존재하지 않는 태그 값이면 전체 목록을 보여준다', () => {
    // 오래된 링크나 오타로 들어와도 빈 화면이 되지 않아야 한다.
    setUrl('?tag=존재하지않는태그');
    renderExplorer();
    expect(visibleTitles()).toHaveLength(3);
  });

  it('AC-4.7 존재하지 않는 태그일 때는 필터 해제 버튼도 안 보인다(관측된 갭)', () => {
    // 전용 안내 문구가 없는 현재 계약을 그대로 고정한다 —
    // "왜 필터가 안 걸렸는지" 알려주는 UI가 생기면 이 테스트가 알려준다.
    setUrl('?tag=없는태그');
    renderExplorer();
    expect(
      screen.queryByRole('button', { name: new RegExp(dict.tags.clearFilter) }),
    ).toBeNull();
  });
});

describe('TagsExplorer 히스토리 동작(관측된 갭) @regression', () => {
  it('AC-4.9 필터 변경이 히스토리 항목을 남기지 않는다', async () => {
    // replaceState를 쓰므로 뒤로가기로 이전 필터에 돌아갈 수 없다.
    // 이건 현재 계약이며, pushState로 바꾸면 이 테스트가 빨개져 알려준다.
    const user = userEvent.setup();
    renderExplorer();
    const before = window.history.length;

    await user.click(screen.getByRole('button', { name: /^React/ }));
    await user.click(screen.getByRole('button', { name: /Next\.js/ }));

    expect(window.history.length).toBe(before);
    expect(window.location.search).toBe('?tag=Next.js');
  });
});
