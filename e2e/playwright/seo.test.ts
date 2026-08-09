import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';

const SITE_ORIGIN = 'https://seungahhong.github.io';
const OUT_DIR = path.join(process.cwd(), 'out');

/** 사이트맵의 <loc> 목록(배포 절대 URL). */
async function sitemapLocs(request: APIRequestContext): Promise<string[]> {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

/**
 * 사이트맵 URL이 가리키는 페이지의 HTML.
 *
 * 로컬 정적 서버(`serve`)는 `2025-06-29-vite6.0/`처럼 이름에 `.`이 든 디렉토리에서
 * index.html 대신 디렉토리 목록을 돌려주고, index.html을 직접 요청하면 다시
 * 디렉토리로 301을 준다. GitHub Pages는 이 주소를 정상 서빙하므로(배포본에서 확인)
 * 서버가 목록을 준 경우에만 익스포트 산출물을 파일로 직접 읽어 검사한다.
 */
async function fetchPageHtml(
  request: APIRequestContext,
  loc: string,
): Promise<{ status: number; html: string }> {
  const pathname = loc.replace(SITE_ORIGIN, '');
  const response = await request.get(pathname);
  const html = await response.text();
  if (!html.includes('<title>Files within')) {
    return { status: response.status(), html };
  }
  const file = path.join(OUT_DIR, pathname, 'index.html');
  if (!fs.existsSync(file)) return { status: 404, html: '' };
  return { status: 200, html: fs.readFileSync(file, 'utf8') };
}

/**
 * 사이트맵 URL과 canonical이 어긋나면 크롤러 입장에선 사이트맵의 모든 주소가
 * "리다이렉트되는 URL"이 된다(GitHub Pages는 슬래시 없는 주소를 301로 넘긴다).
 * 실제 익스포트 산출물로 두 값이 문자 단위로 같은지 확인한다.
 */
test.describe('sitemap ↔ canonical 정합성', () => {
  test(
    'AC-10.2 사이트맵의 모든 URL이 슬래시로 끝난다',
    { tag: ['@smoke', '@regression', '@e2e-mock'] },
    async ({ request }) => {
      const locs = await sitemapLocs(request);
      expect(locs.length).toBeGreaterThan(0);
      expect(locs.filter((loc) => !loc.endsWith('/'))).toEqual([]);
    },
  );

  test(
    'AC-10.3 모든 사이트맵 URL의 canonical이 <loc>과 정확히 일치한다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ request }) => {
      const locs = await sitemapLocs(request);
      const mismatched: string[] = [];

      for (const loc of locs) {
        const { status, html } = await fetchPageHtml(request, loc);
        if (status !== 200) {
          mismatched.push(`${loc} → HTTP ${status}`);
          continue;
        }
        const canonical = html.match(
          /<link rel="canonical" href="([^"]+)"/,
        )?.[1];
        if (canonical !== loc) {
          mismatched.push(`${loc} → canonical=${canonical ?? '(없음)'}`);
        }
      }

      expect(mismatched).toEqual([]);
    },
  );

  /**
   * 슬러그가 라우트 파라미터로 오갈 때 인코딩이 어긋나면 페이지는 200을 주면서
   * not-found 본문을 렌더한다(soft 404). 그러면 제목·canonical이 레이아웃 기본값으로
   * 떨어지므로, 특수문자가 든 슬러그가 실제 글로 렌더되는지 직접 확인한다.
   */
  test(
    'AC-1.6 AC-14.5 AC-19.3 특수문자·점이 든 슬러그도 실제 글로 렌더된다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ request }) => {
      const cases = [
        { slug: '2020-02-17-c-c++', title: 'C/C++' },
        { slug: '2025-06-29-vite6.0', title: 'Vite 6.0' },
      ];

      for (const { slug, title } of cases) {
        const loc = `${SITE_ORIGIN}/ko/posts/${slug}/`;
        const { status, html } = await fetchPageHtml(request, loc);
        expect(status, `${slug} 응답 상태`).toBe(200);
        expect(html, `${slug} 제목`).toContain(`<title>${title} · `);
        expect(html, `${slug} canonical`).toContain(
          `<link rel="canonical" href="${loc}"/>`,
        );
      }
    },
  );
});

/**
 * Gatsby 시절 주소는 2020~2024년 내내 색인돼 있었는데 Next 마이그레이션이
 * 리다이렉트를 남기지 않아 전부 404가 됐다. 정적 호스팅이라 301을 못 쓰므로
 * canonical 스텁으로 새 주소에 합친다 — 여기서 검증할 것은 **크롤러가 받는 HTML**이다.
 * (매핑 자체의 완전성은 `src/lib/__test__/legacy-urls.test.ts`가 옛 배포본 목록에 대고 본다.)
 */
test.describe('Gatsby 옛 주소 → 현재 주소 합치기', () => {
  const cases = [
    {
      from: '/blog/2020/04/2020-04-12-webtools/',
      to: '/ko/posts/2020-04-12-webtools/',
    },
    // 퍼센트 인코딩되는 유일한 슬러그.
    {
      from: '/blog/2020/02/2020-02-17-c-c++/',
      to: '/ko/posts/2020-02-17-c-c++/',
    },
    // 마이그레이션에서 이름이 바뀐 글(RC → 정식 릴리스).
    {
      from: '/blog/2024/11/2024-11-24-react-v19-rc/',
      to: '/ko/posts/2024-12-05-react-v19/',
    },
    { from: '/about/', to: '/ko/about/' },
    { from: '/', to: '/ko/' },
  ];

  test(
    'AC-10.4 옛 주소가 200으로 살아 있고 canonical이 현재 주소를 가리킨다',
    { tag: ['@smoke', '@regression', '@e2e-mock'] },
    async ({ request }) => {
      const broken: string[] = [];

      for (const { from, to } of cases) {
        const { status, html } = await fetchPageHtml(
          request,
          `${SITE_ORIGIN}${from}`,
        );
        if (status !== 200) {
          broken.push(`${from} → HTTP ${status}`);
          continue;
        }
        const canonical = html.match(
          /<link rel="canonical" href="([^"]+)"/,
        )?.[1];
        if (canonical !== `${SITE_ORIGIN}${to}`) {
          broken.push(`${from} → canonical=${canonical ?? '(없음)'}`);
        }
      }

      expect(broken).toEqual([]);
    },
  );

  test(
    'AC-10.4 옛 주소에 noindex를 걸지 않는다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ request }) => {
      // noindex와 canonical을 함께 주면 noindex가 이겨서, 옛 주소에 쌓인 색인과
      // 백링크가 새 주소로 합쳐지지 않고 그대로 버려진다.
      const indexed: string[] = [];

      for (const { from } of cases) {
        const { html } = await fetchPageHtml(request, `${SITE_ORIGIN}${from}`);
        if (/<meta name="robots" content="[^"]*noindex/.test(html)) {
          indexed.push(from);
        }
      }

      expect(indexed).toEqual([]);
    },
  );

  test(
    'AC-10.4 JS 없이도 이동하도록 meta refresh를 심는다',
    { tag: ['@regression', '@e2e-mock'] },
    async ({ request }) => {
      for (const { from, to } of cases) {
        const { html } = await fetchPageHtml(request, `${SITE_ORIGIN}${from}`);
        expect(html, `${from} meta refresh`).toContain(
          `<meta http-equiv="refresh" content="0; url=${to}"/>`,
        );
      }
    },
  );
});
