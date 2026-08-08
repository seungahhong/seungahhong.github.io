import { test, expect } from '@playwright/test';

/**
 * AC-19.5 — 콘텐츠 이미지 정적 동기화.
 *
 * 이 스펙은 **게이트 공백을 메우려고 새로 만든 것**이다(PRD RK10).
 * `scripts/sync-content-assets.mjs`가 `contents/blog/**​/assets/`를
 * `public/blog-assets/`로 복사하는데, 그 산출물은 gitignore된 파생물이다.
 * 즉 동기화가 깨지면 **커밋 diff에 아무 흔적 없이** 모든 글의 이미지가 사라진다.
 * 리뷰로는 절대 잡히지 않는 종류의 사고라 자동 게이트가 유일한 방어선이다.
 *
 * 모드: @e2e-mock — 외부 API를 호출하지 않고 배포 산출물(out/)만 검증한다.
 */

/** 이미지를 참조하는 글을 사이트맵에서 찾아 첫 번째를 쓴다. */
async function findPostWithAssetImage(
  request: import('@playwright/test').APIRequestContext,
  baseURL: string,
): Promise<{ url: string; src: string } | null> {
  const sitemap = await request.get(`${baseURL}/sitemap.xml`);
  const xml = await sitemap.text();
  const postUrls = [...xml.matchAll(/<loc>([^<]+\/ko\/posts\/[^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .slice(0, 40); // 전수를 뒤지면 느려진다 — 첫 40편이면 충분히 만난다.

  for (const url of postUrls) {
    const html = await (await request.get(url)).text();
    const match = html.match(/src="(\/blog-assets\/[^"]+)"/);
    if (match) return { url, src: match[1] };
  }
  return null;
}

test.describe('content assets sync', () => {
  test(
    'AC-19.5 이미지를 참조하는 글의 src가 /blog-assets/로 치환된다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ request, baseURL }) => {
      const found = await findPostWithAssetImage(request, baseURL!);

      // 이미지를 쓰는 글이 하나도 없다면 이 게이트는 의미가 없어진다.
      // 그 사실 자체를 실패로 알린다 — 조용히 통과시키면 공백이 되살아난다.
      expect(
        found,
        '/blog-assets/ 이미지를 참조하는 글을 찾지 못했습니다. ' +
          '동기화가 깨졌거나(sync-content-assets), 마크다운의 이미지 경로 규약이 바뀐 것입니다.',
      ).not.toBeNull();

      expect(found!.src).toMatch(/^\/blog-assets\//);
    },
  );

  test(
    'AC-19.5 치환된 이미지가 실제로 200으로 로드된다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ request, baseURL }) => {
      const found = await findPostWithAssetImage(request, baseURL!);
      expect(found).not.toBeNull();

      // 경로만 맞고 파일이 없으면(동기화 실패) 여기서 잡힌다.
      const response = await request.get(`${baseURL}${found!.src}`);
      expect(
        response.status(),
        `${found!.src} 가 ${response.status()} 를 반환했습니다. ` +
          'public/blog-assets 동기화 산출물이 빠졌을 수 있습니다.',
      ).toBe(200);

      const contentType = response.headers()['content-type'] ?? '';
      expect(contentType).toMatch(/^image\//);
    },
  );

  test(
    'AC-19.5 마크다운 원본의 상대 경로가 그대로 남아 있지 않다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ request, baseURL }) => {
      // `./assets/x.png` 같은 원본 경로가 남으면 브라우저에서 404가 난다.
      const found = await findPostWithAssetImage(request, baseURL!);
      expect(found).not.toBeNull();

      const html = await (await request.get(found!.url)).text();
      const proseImages = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(
        (m) => m[1],
      );
      const unresolved = proseImages.filter(
        (src) => src.includes('/assets/') && !src.startsWith('/blog-assets/'),
      );
      expect(
        unresolved,
        `치환되지 않은 이미지 경로: ${unresolved.join(', ')}`,
      ).toEqual([]);
    },
  );
});
