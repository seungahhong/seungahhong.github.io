import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getDictionary } from '@/lib/i18n';
import Sidebar from '@/components/home/Sidebar';
import { makePostMeta } from '@/lib/__test__/fixtures/post-meta';
import type { PopularPost } from '@/lib/popular';

/**
 * AC-9.1 / AC-9.2 / AC-9.4 / AC-9.5 / AC-9.6 — 인기 글 Top 5 위젯.
 *
 * R9는 "부분충족"으로 기록된 요구다 — `data/popular.json`이 비어 있어
 * 실제 화면은 최신순 폴백이다. 그래서 **폴백 상태와 충족 상태를 둘 다**
 * 여기서 고정한다. 충족 상태(AC-9.4)는 저장소 데이터로는 재현할 수 없지만
 * props를 통제할 수 있는 이 계층에서는 만들 수 있다 —
 * popular.json이 복구되기 전에 렌더 경로를 미리 검증해 두는 셈이다.
 *
 * API 경계: HTTP 호출 없음. SearchTrigger만 컨텍스트 의존이라 모듈 double.
 */

vi.mock('@/components/search/SearchTrigger', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
}));

const dict = getDictionary('ko');

function popularPost(
  slug: string,
  title: string,
  views: number | null,
): PopularPost {
  return { ...makePostMeta({ slug, title }), views };
}

const categories = [{ category: '개발', count: 3 }];
const tags = [{ tag: 'React', count: 2 }];

function renderSidebar(popular: PopularPost[]) {
  render(
    <Sidebar
      locale="ko"
      dict={dict}
      popular={popular}
      categories={categories}
      tags={tags}
    />,
  );
}

/** 인기 글 위젯 섹션(제목으로 찾는다). */
function popularSection(): HTMLElement | null {
  const heading = screen.queryByText(dict.home.popular);
  return heading?.closest('section') ?? null;
}

describe('Sidebar 인기 글 — 폴백 상태 @regression', () => {
  it('AC-9.1 조회수가 없으면(views=null) 조회수 숫자를 표시하지 않는다 @smoke', () => {
    // popular.json이 비었을 때 실제로 화면에 뜨는 상태.
    renderSidebar([
      popularPost('a', '최신 글1', null),
      popularPost('b', '최신 글2', null),
    ]);

    const section = popularSection();
    expect(section).not.toBeNull();
    expect(within(section!).queryByText(/조회/)).toBeNull();
  });

  it('AC-9.1 폴백이어도 순위 번호는 01부터 매긴다', () => {
    renderSidebar([
      popularPost('a', '최신 글1', null),
      popularPost('b', '최신 글2', null),
    ]);
    const section = popularSection()!;
    expect(within(section).getByText('01')).toBeInTheDocument();
    expect(within(section).getByText('02')).toBeInTheDocument();
  });

  it('AC-9.2 위젯 제목은 조회수 유무와 무관하게 "인기 글" 라벨이다', () => {
    // 라벨과 실제 정렬 기준의 불일치(RK1)를 사실로 고정한다 —
    // 라벨을 상태에 따라 바꾸도록 고치면 이 테스트가 알려준다.
    renderSidebar([popularPost('a', '최신 글', null)]);
    expect(screen.getByText(dict.home.popular)).toBeInTheDocument();
  });
});

describe('Sidebar 인기 글 — 충족 상태 @regression', () => {
  it('AC-9.4 조회수가 있으면 compact 표기로 함께 보여준다', () => {
    renderSidebar([
      popularPost('a', '인기 글1', 1234),
      popularPost('b', '인기 글2', 320),
    ]);
    const section = popularSection()!;
    // ko는 K가 아니라 "천".
    expect(
      within(section).getByText(new RegExp(`1\\.2천 ${dict.home.views}`)),
    ).toBeInTheDocument();
    expect(
      within(section).getByText(new RegExp(`320 ${dict.home.views}`)),
    ).toBeInTheDocument();
  });

  it('AC-9.4 받은 순서를 그대로 순위로 쓴다', () => {
    // 정렬 자체는 popular.ts 소관 — 위젯은 순서를 재배치하지 않아야 한다.
    renderSidebar([
      popularPost('a', '1위 글', 900),
      popularPost('b', '2위 글', 100),
    ]);
    const items = within(popularSection()!).getAllByRole('listitem');
    expect(within(items[0]).getByText('1위 글')).toBeInTheDocument();
    expect(within(items[1]).getByText('2위 글')).toBeInTheDocument();
  });

  it('AC-9.5 조회수가 섞여 있으면 없는 항목만 숫자를 숨긴다', () => {
    renderSidebar([
      popularPost('a', '실측 글', 500),
      popularPost('b', '폴백 글', null),
    ]);
    const items = within(popularSection()!).getAllByRole('listitem');
    expect(within(items[0]).getByText(/500/)).toBeInTheDocument();
    expect(within(items[1]).queryByText(/조회/)).toBeNull();
  });

  it('en 로케일에서는 K 표기와 영어 단위를 쓴다', () => {
    const en = getDictionary('en');
    render(
      <Sidebar
        locale="en"
        dict={en}
        popular={[popularPost('a', 'Popular', 1234)]}
        categories={categories}
        tags={tags}
      />,
    );
    expect(
      screen.getByText(new RegExp(`1\\.2K ${en.home.views}`)),
    ).toBeInTheDocument();
  });
});

describe('Sidebar 인기 글 — 빈 상태 @regression', () => {
  it('AC-9.6 인기 글이 0편이면 위젯 섹션 자체를 렌더하지 않는다', () => {
    renderSidebar([]);
    expect(screen.queryByText(dict.home.popular)).toBeNull();
  });

  it('AC-9.6 인기 글이 없어도 카테고리·태그 위젯은 남는다', () => {
    // 위젯 하나가 비었다고 사이드바 전체가 사라지면 안 된다.
    renderSidebar([]);
    expect(screen.getByText(dict.home.categories)).toBeInTheDocument();
  });
});
