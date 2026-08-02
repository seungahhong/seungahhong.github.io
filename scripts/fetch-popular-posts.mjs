// GA4 Data API에서 최근 N일 글별 페이지뷰를 받아 data/popular.json으로 굽는다.
// 사이드바 "인기 글 Top 5"가 이 파일을 정렬 기준으로 쓴다(src/lib/popular.ts).
//
// - 빌드 경로에 있지 않다. 빌드는 커밋된 data/popular.json만 읽으므로 네트워크 없이도 성공한다.
//   이 스크립트는 CI 크론(.github/workflows/refresh-popular.yml)에서만 돌고, 결과가 바뀌면 커밋된다.
// - 공식 클라이언트(@google-analytics/data)는 gRPC/gax 의존성이 무거워 REST + JWT로 직접 호출한다.
// - ko/en은 같은 글의 번역본이므로 슬러그 기준으로 조회수를 합산한다.
//
// 필요한 환경변수
//   GA_PROPERTY_ID          GA4 속성 ID(숫자 9자리). 측정 ID(G-...)가 아니다.
//   GA_SERVICE_ACCOUNT_KEY  서비스 계정 JSON 키. 원문 JSON 또는 base64 인코딩 모두 허용.
//   GA_RANGE_DAYS           (선택) 집계 기간, 기본 90일.
import { createSign } from 'node:crypto';
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'contents', 'blog');
const OUT_FILE = path.join(ROOT, 'data', 'popular.json');
const DEFAULT_RANGE_DAYS = 90;
const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';

/**
 * `/ko/posts/2024-03-18-pnpm/` → `2024-03-18-pnpm`.
 * 로케일 프리픽스·트레일링 슬래시·쿼리스트링을 모두 흡수하고, 글 상세가 아니면 null.
 */
export function slugFromPagePath(pagePath) {
  const pathOnly = String(pagePath ?? '').split(/[?#]/)[0];
  const match = /^\/(?:ko|en)\/posts\/([^/]+)\/?$/.exec(pathOnly);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

/**
 * GA 행({ pagePath, views })을 슬러그 기준으로 합산한다.
 * knownSlugs에 없는 슬러그(삭제된 글, 크롤러가 만든 유령 경로)는 버린다.
 */
export function aggregateViews(rows, knownSlugs) {
  const totals = new Map();
  for (const { pagePath, views } of rows) {
    const slug = slugFromPagePath(pagePath);
    if (!slug || !knownSlugs.has(slug)) continue;
    const count = Number(views);
    if (!Number.isFinite(count) || count <= 0) continue;
    totals.set(slug, (totals.get(slug) ?? 0) + count);
  }
  return [...totals.entries()]
    .map(([slug, views]) => ({ slug, views }))
    .sort((a, b) => b.views - a.views || a.slug.localeCompare(b.slug));
}

/** contents/blog 하위 마크다운 파일명에서 슬러그 집합을 만든다(`.en.md` 번역본은 같은 슬러그). */
async function collectKnownSlugs(dir = CONTENT_DIR, out = new Set()) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (entry.name === 'assets') continue;
      await collectKnownSlugs(path.join(dir, entry.name), out);
    } else if (entry.isFile() && /\.md$/i.test(entry.name)) {
      out.add(entry.name.replace(/\.md$/i, '').replace(/\.(ko|en)$/, ''));
    }
  }
  return out;
}

/** base64로 감싼 시크릿도 받아 준다(깃허브 시크릿에 줄바꿈 포함 JSON을 넣기 번거로워서). */
function parseCredentials(raw) {
  const text = raw.startsWith('{')
    ? raw
    : Buffer.from(raw, 'base64').toString('utf-8');
  const credentials = JSON.parse(text);
  if (!credentials.client_email || !credentials.private_key) {
    throw new Error(
      '서비스 계정 키에 client_email 또는 private_key가 없습니다.',
    );
  }
  return credentials;
}

/** 서비스 계정 JWT를 만들어 OAuth 액세스 토큰으로 교환한다. */
async function getAccessToken(credentials) {
  const now = Math.floor(Date.now() / 1000);
  const encode = (value) =>
    Buffer.from(JSON.stringify(value)).toString('base64url');
  const unsigned = [
    encode({ alg: 'RS256', typ: 'JWT' }),
    encode({
      iss: credentials.client_email,
      scope: SCOPE,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  ].join('.');

  const signature = createSign('RSA-SHA256')
    .update(unsigned)
    .sign(credentials.private_key, 'base64url');

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  });
  if (!res.ok) {
    throw new Error(
      `액세스 토큰 발급 실패 (${res.status}): ${await res.text()}`,
    );
  }
  return (await res.json()).access_token;
}

/** 글 상세 경로만 골라 pagePath별 페이지뷰를 받아 온다. */
async function runReport(token, propertyId, rangeDays) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: `${rangeDays}daysAgo`, endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        dimensionFilter: {
          filter: {
            fieldName: 'pagePath',
            stringFilter: {
              matchType: 'FULL_REGEXP',
              value: '^/(ko|en)/posts/[^/]+/?$',
            },
          },
        },
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 5000,
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`runReport 실패 (${res.status}): ${await res.text()}`);
  }
  const body = await res.json();
  return (body.rows ?? []).map((row) => ({
    pagePath: row.dimensionValues?.[0]?.value ?? '',
    views: row.metricValues?.[0]?.value ?? '0',
  }));
}

async function readExisting() {
  try {
    return JSON.parse(await readFile(OUT_FILE, 'utf-8'));
  } catch {
    return null;
  }
}

export async function main() {
  const propertyId = process.env.GA_PROPERTY_ID?.trim();
  const rawKey = process.env.GA_SERVICE_ACCOUNT_KEY?.trim();
  const rangeDays = Number(process.env.GA_RANGE_DAYS) || DEFAULT_RANGE_DAYS;

  // 설정이 없는 환경(로컬·포크)에서는 커밋된 데이터를 그대로 두고 조용히 끝낸다.
  if (!propertyId || !rawKey) {
    console.warn(
      '[popular] GA_PROPERTY_ID / GA_SERVICE_ACCOUNT_KEY가 없어 건너뜁니다. 기존 data/popular.json을 유지합니다.',
    );
    return;
  }

  const token = await getAccessToken(parseCredentials(rawKey));
  const rows = await runReport(token, propertyId, rangeDays);
  const knownSlugs = await collectKnownSlugs();
  const items = aggregateViews(rows, knownSlugs);

  // 조회수가 하나도 안 잡히면(계측 직후·API 이상) 기존 데이터를 덮어쓰지 않는다.
  if (items.length === 0) {
    console.warn(
      `[popular] 최근 ${rangeDays}일 조회수 데이터가 비어 있어 기존 파일을 유지합니다. (GA 행 ${rows.length}건)`,
    );
    return;
  }

  const existing = await readExisting();
  const unchanged =
    existing?.rangeDays === rangeDays &&
    JSON.stringify(existing?.items) === JSON.stringify(items);
  if (unchanged) {
    console.log('[popular] 변경 없음 — 파일을 그대로 둡니다.');
    return;
  }

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(
    OUT_FILE,
    `${JSON.stringify(
      {
        updatedAt: new Date().toISOString().slice(0, 10),
        rangeDays,
        items,
      },
      null,
      2,
    )}\n`,
    'utf-8',
  );
  const total = items.reduce((sum, item) => sum + item.views, 0);
  console.log(
    `[popular] ${items.length}개 글 / 총 ${total} 조회수 → data/popular.json`,
  );
}

const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  main().catch((error) => {
    console.error(`[popular] ${error.message}`);
    process.exit(1);
  });
}
