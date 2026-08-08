import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import matter from 'gray-matter';

/**
 * AC-19.7 / AC-6.1 — 콘텐츠 규약을 저장소 실물에 대고 검증한다.
 *
 * ⚠️ 오라클 주의: 여기 기대값은 "현재 콘텐츠가 이렇다"가 아니라
 * "NFR9/NFR6이 요구하는 상태"다. 현재 상태를 그대로 굳히면(implementation
 * snapshot) 규약 이탈이 영원히 초록으로 남는다.
 *
 * 실제로 이 테스트는 처음 작성했을 때 AC-19.7에서 실패했고, 그 실패가
 * 콘텐츠 결함(한국어 글에 영문 소문자 `tools`)을 드러냈다. 아래 §category
 * 블록의 주석에 해소 경위를 남겨 두었다.
 */

const BLOG_ROOT = path.join(process.cwd(), 'contents/blog');

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return entry.name === 'assets' ? [] : walk(full);
    }
    return entry.isFile() && entry.name.endsWith('.md') ? [full] : [];
  });
}

const allMarkdown = walk(BLOG_ROOT);
const koSources = allMarkdown.filter((f) => !f.endsWith('.en.md'));
const enSources = allMarkdown.filter((f) => f.endsWith('.en.md'));

function categoryOf(file: string): string {
  return String(matter(fs.readFileSync(file, 'utf8')).data.category ?? '');
}

/** NFR9가 정한 로케일별 category 표기 집합. */
const KO_CATEGORIES = new Set(['개발', '문서', '도구']);
const EN_CATEGORIES = new Set(['Development', 'Docs', 'Tools']);

describe('번역 커버리지 @regression', () => {
  it('AC-6.1 한국어 원문 편수와 영문 번역 편수가 같다 @smoke', () => {
    expect(enSources).toHaveLength(koSources.length);
  });

  it('AC-6.1 모든 한국어 원문에 짝이 되는 .en.md가 있다', () => {
    // 편수만 같고 짝이 어긋나는 경우를 잡는다.
    const missing = koSources.filter(
      (ko) => !fs.existsSync(ko.replace(/\.md$/, '.en.md')),
    );
    expect(missing).toEqual([]);
  });
});

/**
 * AC-19.7 — 해소됨(2026-08-03).
 *
 * 이전 판에서는 `2020-04-12-webtools`의 한국어 category가 `tools`라 규약을
 * 벗어났고, 결정이 나기 전이라 skip으로 두었다. 한국어 콘텐츠는 `도구`로
 * 고치고 표기 집합을 ko {개발·문서·도구} / en {Development·Docs·Tools}로
 * 확정해 skip을 해제했다.
 *
 * en의 `Tools`는 처음부터 en 표기 관례(제목 대문자)에 맞았으므로 그대로 두었다 —
 * 어긋난 것은 한국어 집합에 영문 소문자 토큰이 섞인 쪽뿐이었다.
 */
describe('프론트매터 category 표기 규약 @regression', () => {
  it('AC-19.7 한국어 원문의 category가 ko 표기 집합에 속한다', () => {
    const violations = koSources
      .map((file) => ({
        file: path.relative(process.cwd(), file),
        category: categoryOf(file),
      }))
      .filter((entry) => !KO_CATEGORIES.has(entry.category));

    expect(violations).toEqual([]);
  });

  it('AC-19.7 영문 번역의 category가 en 표기 집합에 속한다', () => {
    const violations = enSources
      .map((file) => ({
        file: path.relative(process.cwd(), file),
        category: categoryOf(file),
      }))
      .filter((entry) => !EN_CATEGORIES.has(entry.category));

    expect(violations).toEqual([]);
  });
});

describe('콘텐츠 배치 규약 @regression', () => {
  it('모든 글에 title과 date 프론트매터가 있다', () => {
    const broken = allMarkdown.filter((file) => {
      const { data } = matter(fs.readFileSync(file, 'utf8'));
      return !data.title || !data.date;
    });
    expect(broken.map((f) => path.relative(process.cwd(), f))).toEqual([]);
  });

  it('date가 YYYY-MM-DD 형식이다', () => {
    const broken = allMarkdown.filter((file) => {
      const raw = matter(fs.readFileSync(file, 'utf8')).data.date;
      // gray-matter가 따옴표 없는 날짜를 Date로 파싱하므로 두 형태를 모두 허용한다.
      const text =
        raw instanceof Date ? raw.toISOString().slice(0, 10) : String(raw);
      return !/^\d{4}-\d{2}-\d{2}$/.test(text);
    });
    expect(broken.map((f) => path.relative(process.cwd(), f))).toEqual([]);
  });
});
