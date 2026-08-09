import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import RedirectStub from '@/components/layout/RedirectStub';
import { defaultLocale } from '@/i18n/config';
import { getLegacyBlogRoutes, resolveLegacySlug } from '@/lib/legacy-urls';
import { getPostMeta } from '@/lib/posts';
import { absoluteUrl, decodeSlugParam, postPath } from '@/lib/routes';

/**
 * Gatsby 시절 글 주소 `/blog/<연>/<월>/<슬러그>/`를 현재 주소로 넘기는 스텁.
 * 자세한 배경은 `@/lib/legacy-urls` 참고.
 */
export function generateStaticParams() {
  return getLegacyBlogRoutes();
}

type LegacyParams = Promise<{ year: string; month: string; slug: string }>;

/** 옛 주소 → 현재 글 경로(`/ko/posts/<슬러그>/`). 대응하는 글이 없으면 null. */
function targetFor(year: string, month: string, slugParam: string) {
  const slug = resolveLegacySlug(year, month, decodeSlugParam(slugParam));
  return slug ? { slug, path: `${postPath(defaultLocale, slug)}/` } : null;
}

export async function generateMetadata({
  params,
}: {
  params: LegacyParams;
}): Promise<Metadata> {
  const { year, month, slug } = await params;
  const target = targetFor(year, month, slug);
  if (!target) return {};
  // canonical만 새 주소로 준다. noindex를 함께 걸면 noindex가 이겨서
  // 옛 주소에 쌓인 색인·백링크가 새 주소로 합쳐지지 않고 그냥 버려진다.
  return {
    title: getPostMeta(target.slug)?.title,
    alternates: { canonical: absoluteUrl(target.path) },
  };
}

export default async function LegacyBlogPostRedirect({
  params,
}: {
  params: LegacyParams;
}) {
  const { year, month, slug } = await params;
  const target = targetFor(year, month, slug);
  if (!target) notFound();
  return (
    <RedirectStub
      target={target.path}
      label={`${getPostMeta(target.slug)?.title ?? '글'} 페이지로 이동 →`}
    />
  );
}
