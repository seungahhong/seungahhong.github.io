import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { getDictionary } from '@/lib/i18n';
import PostsExplorer from '@/components/posts/PostsExplorer';
import { makePostMeta } from '@/lib/__test__/fixtures/post-meta';

/**
 * AC-4.5, AC-1.7 — 카테고리 필터와 빈 상태.
 *
 * AC-1.7("필터 결과 0건")은 실제 카테고리 분포(개발 69 / 문서 1 / tools 1)로는
 * 도달할 수 없어 카탈로그에서 "재현 불가"로 표시됐던 항목이다.
 * 여기서는 props를 통제할 수 있으므로 그 전제를 실제로 만들 수 있다 —
 * E2E에서 불가능하던 검증을 계층을 내려 얻는다.
 */

const dict = getDictionary('ko');

const posts = [
  makePostMeta({ slug: 'a', title: '개발 글1', category: '개발' }),
  makePostMeta({ slug: 'b', title: '개발 글2', category: '개발' }),
  makePostMeta({ slug: 'c', title: '문서 글', category: '문서' }),
];
const categories = [
  { category: '개발', count: 2 },
  { category: '문서', count: 1 },
];

function setUrl(search = '') {
  window.history.replaceState(null, '', `/ko/posts/${search}`);
}

function renderExplorer(list = posts, cats = categories) {
  render(
    <PostsExplorer locale="ko" dict={dict} posts={list} categories={cats} />,
  );
}

function visibleTitles(list = posts): string[] {
  return list
    .map((p) => p.title)
    .filter((title) => screen.queryByText(title) !== null);
}

beforeEach(() => {
  setUrl();
});

describe('PostsExplorer 카테고리 필터 @regression', () => {
  it('AC-4.5 카테고리 칩을 누르면 ?category= 가 URL에 남는다 @smoke', async () => {
    const user = userEvent.setup();
    renderExplorer();
    await user.click(screen.getByRole('button', { name: /^개발/ }));
    expect(window.location.search).toBe('?category=%EA%B0%9C%EB%B0%9C');
  });

  it('AC-4.5 해당 카테고리 글만 남는다', async () => {
    const user = userEvent.setup();
    renderExplorer();
    await user.click(screen.getByRole('button', { name: /^문서/ }));
    expect(visibleTitles()).toEqual(['문서 글']);
  });

  it('AC-4.5 활성 칩에 aria-pressed=true가 붙는다', async () => {
    const user = userEvent.setup();
    renderExplorer();
    await user.click(screen.getByRole('button', { name: /^개발/ }));
    expect(screen.getByRole('button', { name: /^개발/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(
      screen.getByRole('button', { name: new RegExp(`^${dict.posts.all}`) }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('AC-4.5 전체 칩을 누르면 필터가 해제되고 파라미터가 사라진다', async () => {
    const user = userEvent.setup();
    renderExplorer();
    await user.click(screen.getByRole('button', { name: /^개발/ }));

    await user.click(
      screen.getByRole('button', { name: new RegExp(`^${dict.posts.all}`) }),
    );
    expect(window.location.search).toBe('');
    expect(visibleTitles()).toHaveLength(3);
  });

  it('AC-4.5 기본 활성은 전체다', () => {
    renderExplorer();
    expect(
      screen.getByRole('button', { name: new RegExp(`^${dict.posts.all}`) }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('칩에 각 카테고리 글 수를 함께 보여준다', () => {
    renderExplorer();
    expect(screen.getByRole('button', { name: '개발 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '문서 1' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: `${dict.posts.all} 3` }),
    ).toBeInTheDocument();
  });

  it('필터 그룹에 접근 가능한 라벨이 있다', () => {
    renderExplorer();
    expect(
      screen.getByRole('group', { name: dict.posts.filterByCategory }),
    ).toBeInTheDocument();
  });
});

describe('PostsExplorer URL 복원·잘못된 값 @regression', () => {
  it('AC-4.5 ?category= 가 붙은 URL로 진입하면 필터가 복원된다', () => {
    setUrl('?category=문서');
    renderExplorer();
    expect(visibleTitles()).toEqual(['문서 글']);
  });

  it('존재하지 않는 카테고리 값이면 전체로 되돌린다', () => {
    setUrl('?category=없는카테고리');
    renderExplorer();
    expect(visibleTitles()).toHaveLength(3);
    expect(
      screen.getByRole('button', { name: new RegExp(`^${dict.posts.all}`) }),
    ).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('PostsExplorer 빈 상태(관측된 갭) @regression', () => {
  it('AC-1.7 매칭 0건이면 카드가 하나도 없고 전용 안내 문구도 없다', () => {
    // 실제 콘텐츠로는 도달할 수 없는 전제라 E2E에서는 검증 불가였다.
    // 안내 문구가 생기면 이 테스트가 빨개져 "갭이 메워졌다"고 알려준다.
    const empty = [
      makePostMeta({ slug: 'x', title: '유일한 글', category: '개발' }),
    ];
    setUrl('?category=문서');
    renderExplorer(empty, [
      { category: '개발', count: 1 },
      { category: '문서', count: 0 },
    ]);

    expect(screen.queryByText('유일한 글')).toBeNull();
    expect(screen.queryByText(/결과가 없|비어|no results/i)).toBeNull();
  });

  it('글이 0편이어도 필터 칩은 렌더되고 개수는 0이다', () => {
    renderExplorer([], []);
    expect(
      screen.getByRole('button', { name: `${dict.posts.all} 0` }),
    ).toBeInTheDocument();
  });
});
