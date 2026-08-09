import { defaultLocale } from '@/i18n/config';
import { getAllPosts, getPostMeta } from '@/lib/posts';

/**
 * Gatsby 시절 글 주소는 `/blog/<연>/<월>/<슬러그>/`였다.
 * (`gatsby-source-filesystem`이 `contents/`를 루트로 잡았고 `createFilePath`가
 *  그 아래 상대 경로를 그대로 URL로 만들었다.)
 *
 * Next로 옮기면서 주소가 `/ko/posts/<슬러그>/`로 바뀌었는데 리다이렉트를 두지 않아
 * 2020~2024년에 색인돼 있던 57개 주소가 전부 404가 됐다. 마크다운 파일은 옮기지
 * 않았으므로 옛 주소는 지금 콘텐츠 트리에서 그대로 재현된다 — 57개 중 56개가
 * 이 규칙으로 일치하고, 나머지 하나만 아래 별칭으로 메운다.
 *
 * 정적 익스포트라 서버 301을 못 쓴다. 대신 옛 주소마다 canonical이 새 주소를
 * 가리키는 스텁을 만들어 색인과 백링크를 새 주소로 합친다.
 */

/** 마이그레이션 과정에서 슬러그가 바뀐 글. `<연>/<월>/<옛 슬러그>` → 현재 슬러그. */
export const LEGACY_SLUG_ALIASES: Record<string, string> = {
  // RC 시점에 쓴 글을 정식 릴리스 글로 합쳤다.
  '2024/11/2024-11-24-react-v19-rc': '2024-12-05-react-v19',
};

export interface LegacyBlogRoute {
  year: string;
  month: string;
  slug: string;
}

function toRoute(key: string): LegacyBlogRoute | null {
  const [year, month, ...rest] = key.split('/');
  const slug = rest.join('/');
  if (!year || !month || !slug) return null;
  return { year, month, slug };
}

function routeKey({ year, month, slug }: LegacyBlogRoute): string {
  return `${year}/${month}/${slug}`;
}

/** 정적 익스포트로 만들어 둘 옛 주소 목록. */
export function getLegacyBlogRoutes(): LegacyBlogRoute[] {
  const routes = new Map<string, LegacyBlogRoute>();
  for (const post of getAllPosts(defaultLocale)) {
    const route = toRoute(`${post.relDir}/${post.slug}`);
    if (route) routes.set(routeKey(route), route);
  }
  for (const key of Object.keys(LEGACY_SLUG_ALIASES)) {
    const route = toRoute(key);
    if (route) routes.set(key, route);
  }
  return [...routes.values()];
}

/** 옛 주소가 가리키던 현재 슬러그(대응하는 글이 없으면 null). */
export function resolveLegacySlug(
  year: string,
  month: string,
  slug: string,
): string | null {
  const alias = LEGACY_SLUG_ALIASES[`${year}/${month}/${slug}`];
  if (alias) return getPostMeta(alias) ? alias : null;
  const meta = getPostMeta(slug);
  // 연/월까지 맞아야 한다. 아무 연월로나 같은 글에 닿으면 중복 URL만 늘어난다.
  return meta && meta.relDir === `${year}/${month}` ? slug : null;
}
