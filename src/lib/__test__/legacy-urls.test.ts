import { describe, expect, it } from 'vitest';
import {
  LEGACY_SLUG_ALIASES,
  getLegacyBlogRoutes,
  resolveLegacySlug,
} from '@/lib/legacy-urls';

/**
 * 옛 주소 목록의 오라클은 "지금 코드가 뭘 만드는가"가 아니라
 * **2024-11-24 배포본(gh-pages `cb715e2b`)에 실제로 존재했던 URL**이다.
 * 이 57개가 2020~2024년 동안 Google에 색인돼 있었고, Next 마이그레이션 이후
 * 전부 404가 됐다. 현재 콘텐츠 트리에서 목록을 다시 뽑아 기대값으로 쓰면
 * 리다이렉트가 빠져도 초록으로 남으므로, 여기서는 값을 고정해 둔다.
 */
const INDEXED_LEGACY_PATHS = [
  '/2020/01/2020-01-01-pdf/',
  '/2020/02/2020-02-14-mssql/',
  '/2020/02/2020-02-16-winapi/',
  '/2020/02/2020-02-17-c-c++/',
  '/2020/04/2020-04-12-webtools/',
  '/2020/06/2020-06-28-concept/',
  '/2020/09/2020-09-12-fe-performance/',
  '/2021/12/2021-12-01-deno/',
  '/2021/12/2021-12-02-svelte/',
  '/2021/12/2021-12-30-redux/',
  '/2021/12/2021-12-31-mobx/',
  '/2022/01/2022-01-08-webassembly/',
  '/2022/01/2022-01-09-graphql/',
  '/2022/01/2022-01-10-RxJS/',
  '/2022/01/2022-01-16-typescript/',
  '/2022/02/2022-02-13-react17/',
  '/2022/03/2022-03-07-redux-saga/',
  '/2022/03/2022-03-12-react-router-v6/',
  '/2022/03/2022-03-19-storybook/',
  '/2022/03/2022-03-22-recoil/',
  '/2022/03/2022-03-26-redux-toolkit/',
  '/2022/03/2022-03-28-javascript/',
  '/2022/03/2022-03-29-canvas/',
  '/2022/03/2022-03-30-SWR/',
  '/2022/05/2022-05-30-form/',
  '/2022/05/2022-05-31-css-in-js/',
  '/2022/06/2022-06-08-react18/',
  '/2022/06/2022-06-14-jotai/',
  '/2022/07/2022-07-23-emotion/',
  '/2022/07/2022-07-24-jest/',
  '/2022/07/2022-07-25-msw/',
  '/2022/08/2022-08-07-cypress/',
  '/2022/12/2022-12-30-react-query/',
  '/2023/01/2023-01-01-fe-process/',
  '/2023/04/2023-04-02-playwright/',
  '/2023/06/2023-06-30-react-query-v4/',
  '/2023/07/2023-07-22-zustand/',
  '/2023/07/2023-07-23-react-query-v5/',
  '/2023/08/2023-08-15-ecmascript/',
  '/2023/08/2023-08-16-treeshaking/',
  '/2023/08/2023-08-25-nodejs/',
  '/2023/08/2023-08-26-react-hook-form-v7/',
  '/2023/08/2023-08-27-nextjs-v13/',
  '/2023/09/2023-09-10-react-state/',
  '/2023/09/2023-09-17-gatsby-v5/',
  '/2023/11/2023-11-26-react-hook-form-inside/',
  '/2024/01/2024-01-14-cors/',
  '/2024/01/2024-01-20-nextjs-v14-migration/',
  '/2024/01/2024-01-27-react-v18-migration/',
  '/2024/03/2024-03-17-remove-unused-dependencies/',
  '/2024/03/2024-03-18-pnpm/',
  '/2024/04/2024-04-28-esbuild/',
  '/2024/05/2024-05-12-development-improvements/',
  '/2024/10/2023-10-30-nextjs-v14/',
  '/2024/11/2024-11-16-vite/',
  '/2024/11/2024-11-23-nextjs-v15-migration/',
  '/2024/11/2024-11-24-react-v19-rc/',
] as const;

function toPath({
  year,
  month,
  slug,
}: {
  year: string;
  month: string;
  slug: string;
}): string {
  return `/${year}/${month}/${slug}/`;
}

describe('getLegacyBlogRoutes @regression', () => {
  const routes = getLegacyBlogRoutes();
  const paths = new Set(routes.map(toPath));

  it('색인돼 있던 옛 주소를 하나도 빠뜨리지 않는다 @smoke', () => {
    const missing = INDEXED_LEGACY_PATHS.filter((p) => !paths.has(p));
    expect(missing, `리다이렉트 없이 404로 남는 옛 주소`).toEqual([]);
  });

  it('같은 주소를 두 번 만들지 않는다', () => {
    // 익스포트 시 경로가 겹치면 어느 쪽이 남는지 보장할 수 없다.
    expect(paths.size).toBe(routes.length);
  });

  it('연/월은 네 자리·두 자리 숫자다', () => {
    for (const route of routes) {
      expect(route.year, toPath(route)).toMatch(/^\d{4}$/);
      expect(route.month, toPath(route)).toMatch(/^\d{2}$/);
    }
  });
});

describe('resolveLegacySlug @regression', () => {
  it('옛 주소를 현재 슬러그로 되돌린다 @smoke', () => {
    expect(resolveLegacySlug('2020', '04', '2020-04-12-webtools')).toBe(
      '2020-04-12-webtools',
    );
  });

  it('특수문자가 든 슬러그도 되돌린다', () => {
    // `c-c++`는 익스포트 경로가 퍼센트 인코딩되는 유일한 슬러그다.
    expect(resolveLegacySlug('2020', '02', '2020-02-17-c-c++')).toBe(
      '2020-02-17-c-c++',
    );
  });

  it('이름이 바뀐 글은 별칭으로 현재 글에 연결한다', () => {
    expect(resolveLegacySlug('2024', '11', '2024-11-24-react-v19-rc')).toBe(
      '2024-12-05-react-v19',
    );
  });

  it('별칭이 가리키는 글은 실제로 존재한다', () => {
    for (const [key, slug] of Object.entries(LEGACY_SLUG_ALIASES)) {
      const [year, month, ...rest] = key.split('/');
      expect(resolveLegacySlug(year, month, rest.join('/')), key).toBe(slug);
    }
  });

  it('연/월이 다르면 매칭하지 않는다', () => {
    // 아무 연월로나 같은 글에 닿으면 중복 URL이 무한히 늘어난다.
    expect(resolveLegacySlug('2021', '04', '2020-04-12-webtools')).toBeNull();
  });

  it('없는 글은 null이다', () => {
    expect(resolveLegacySlug('2020', '04', 'no-such-post')).toBeNull();
  });
});
