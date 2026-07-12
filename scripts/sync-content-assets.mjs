// contents/blog 하위의 모든 정적 자산(이미지 등, .md 제외)을 정적 서빙 경로(public/blog-assets)로
// 구조 그대로 복사한다. 글마다 자산 디렉토리 이름이 제각각(assets/, images/, files/ …)이라
// 특정 이름만 복사하지 않고 .md가 아닌 모든 파일을 미러링한다.
//
// 마크다운 본문/썸네일의 상대경로(./assets/DD/x.png, ./images/DD/x.png 등)는 렌더링 시
// /blog-assets/<연>/<월>/<원본 상대경로> 로 치환된다(src/lib/markdown.ts 참고).
//
// - 콘텐츠(contents/)는 git에 커밋되어 있고, public/blog-assets는 파생물이라 gitignore된다.
// - 빌드/개발 시작 전(predev/prebuild)에 실행된다.
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'contents', 'blog');
const OUT_DIR = path.join(ROOT, 'public', 'blog-assets');

/** .md가 아닌 모든 파일을 CONTENT_DIR 기준 상대경로 그대로 OUT_DIR로 복사한다. */
async function mirrorAssets(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return 0;
  }
  let copied = 0;
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      copied += await mirrorAssets(full);
    } else if (entry.isFile() && !/\.md$/i.test(entry.name)) {
      const rel = path.relative(CONTENT_DIR, full);
      const dest = path.join(OUT_DIR, rel);
      await mkdir(path.dirname(dest), { recursive: true });
      await cp(full, dest);
      copied += 1;
    }
  }
  return copied;
}

async function main() {
  if (!existsSync(CONTENT_DIR)) {
    console.warn(`[sync-assets] contents/blog 없음: ${CONTENT_DIR}`);
    return;
  }
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const copied = await mirrorAssets(CONTENT_DIR);
  console.log(
    `[sync-assets] ${copied}개 자산 파일 동기화 완료 -> ${path.relative(ROOT, OUT_DIR)}`,
  );
}

main().catch((err) => {
  console.error('[sync-assets] 실패:', err);
  process.exit(1);
});
