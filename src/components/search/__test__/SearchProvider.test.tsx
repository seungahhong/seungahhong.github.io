import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { getDictionary } from '@/lib/i18n';
import SearchProvider from '@/components/search/SearchProvider';
import { scoringDocs } from './fixtures/search-docs';

/**
 * AC-3.1 / AC-3.2 — ⌘K(Ctrl+K) 전역 단축키.
 *
 * 팔레트를 여닫는 건 SearchDialog가 아니라 SearchProvider의 전역 keydown이다.
 * AC-3.10(헤더 버튼으로도 열림)은 SearchTrigger가 이 컨텍스트의 open()을 부르는
 * 구조라, 여기서 컨텍스트 계약이 성립하는지까지 확인한다.
 */

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const dict = getDictionary('ko');

function renderProvider() {
  render(
    <SearchProvider index={scoringDocs} locale="ko" dict={dict}>
      <div>children</div>
    </SearchProvider>,
  );
}

describe('SearchProvider 단축키 @regression', () => {
  it('AC-3.1 ⌘K로 팔레트가 열린다 @smoke', async () => {
    const user = userEvent.setup();
    renderProvider();
    expect(screen.queryByRole('dialog')).toBeNull();

    await user.keyboard('{Meta>}k{/Meta}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('AC-3.1 Ctrl+K로도 열린다(비 macOS)', async () => {
    const user = userEvent.setup();
    renderProvider();
    await user.keyboard('{Control>}k{/Control}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('AC-3.1 대문자 K(Shift 동반)로도 열린다', async () => {
    const user = userEvent.setup();
    renderProvider();
    await user.keyboard('{Meta>}{Shift>}K{/Shift}{/Meta}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('AC-3.2 열린 상태에서 다시 누르면 닫힌다', async () => {
    const user = userEvent.setup();
    renderProvider();

    await user.keyboard('{Meta>}k{/Meta}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Meta>}k{/Meta}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('수식키 없는 k는 팔레트를 열지 않는다', async () => {
    // 본문에서 그냥 k를 타이핑했다고 팔레트가 뜨면 안 된다.
    const user = userEvent.setup();
    renderProvider();
    await user.keyboard('k');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('자식은 팔레트 상태와 무관하게 항상 렌더된다', async () => {
    const user = userEvent.setup();
    renderProvider();
    expect(screen.getByText('children')).toBeInTheDocument();
    await user.keyboard('{Meta>}k{/Meta}');
    expect(screen.getByText('children')).toBeInTheDocument();
  });

  it('언마운트되면 전역 keydown 리스너를 제거한다', async () => {
    // 리스너가 남으면 라우트 이동마다 누적돼 ⌘K가 여러 번 토글된다.
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(
      <SearchProvider index={scoringDocs} locale="ko" dict={dict}>
        <div />
      </SearchProvider>,
    );
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeSpy.mockRestore();
  });
});
