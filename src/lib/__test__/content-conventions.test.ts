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

function frontmatterOf(file: string): { category: string; tags: string[] } {
  const { data } = matter(fs.readFileSync(file, 'utf8'));
  return {
    category: String(data.category ?? ''),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
  };
}

function categoryOf(file: string): string {
  return frontmatterOf(file).category;
}

/**
 * 카테고리 표기 — 한국어 → 영문 짝(NFR9). 새 글은 이 중 하나를 고른다.
 * 카테고리는 "무엇에 관한 글인가"라는 주제 축 하나만 표현한다.
 */
const CATEGORY_EN: Record<string, string> = {
  'AI 엔지니어링': 'AI Engineering', // LLM·RAG·에이전트·하네스·Claude 활용 기법
  '조직·프로세스': 'Teams & Process', // 개발 프로세스, 팀·조직의 AI 도입과 거버넌스
  React: 'React', // React 본체와 라우터·폼·스타일링 등 React 전용 라이브러리
  상태관리: 'State Management',
  프레임워크: 'Frameworks', // Next.js·Gatsby·Svelte·TanStack Start
  '빌드·도구': 'Build & Tooling', // 번들러·패키지 매니저·개발 도구
  성능: 'Performance',
  테스트: 'Testing',
  'JavaScript·웹': 'JavaScript & Web', // 언어·런타임·브라우저 플랫폼
  'CS·시스템': 'CS & Systems', // 웹 밖의 C/C++·WinAPI·DB·파일 포맷
  '주간 릴리스': 'Weekly Releases', // 「이번 주 패키지 릴리스 정리」 연재
};

/**
 * 태그 어휘 — 한국어 → 영문 짝. 태그는 카테고리를 가로지르는 기술·개념만 둔다.
 * - 카테고리 이름을 되풀이하는 태그(예: 상태관리·테스트·성능·AI)는 두지 않는다.
 * - 한 편에만 붙을 태그는 만들지 않는다 — 그 글의 제목과 다를 바가 없다.
 * - 기술 이름은 소문자(react·nextjs), 약어·고유명은 원래 표기(LLM·MCP·Claude),
 *   한국어 개념 태그는 붙여 쓴다(서버상태). 영문 개념 태그는 kebab-case.
 * 새 태그가 정말 필요하면 여기에 짝을 추가한다.
 */
const TAG_EN: Record<string, string> = {
  // AI
  Claude: 'Claude',
  LLM: 'LLM',
  RAG: 'RAG',
  MCP: 'MCP',
  에이전트: 'agents',
  하네스: 'harness',
  스킬: 'skills',
  컨텍스트엔지니어링: 'context-engineering',
  스펙: 'spec',
  코드품질: 'code-quality',
  AI도입: 'ai-adoption',
  SDLC: 'SDLC',
  // React·상태관리·프레임워크
  react: 'react',
  'react-router': 'react-router',
  'react-hook-form': 'react-hook-form',
  css: 'css',
  Flux: 'Flux',
  Atomic: 'Atomic',
  서버상태: 'server-state',
  tanstack: 'tanstack',
  nextjs: 'nextjs',
  // 빌드·테스트
  vite: 'vite',
  번들러: 'bundler',
  패키지매니저: 'package-manager',
  단위테스트: 'unit-testing',
  E2E: 'E2E',
  UI: 'UI',
  // 언어·웹
  javascript: 'javascript',
  typescript: 'typescript',
  nodejs: 'nodejs',
  graphql: 'graphql',
  API: 'API',
  브라우저: 'browser',
  컴파일러: 'compiler',
  보안: 'security',
  windows: 'windows',
  // 횡단
  마이그레이션: 'migration',
};

/** NFR9가 정한 로케일별 category 표기 집합. */
const KO_CATEGORIES = new Set(Object.keys(CATEGORY_EN));
const EN_CATEGORIES = new Set(Object.values(CATEGORY_EN));

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

  it('한국어 원문과 영문 번역의 category가 같은 짝이다', () => {
    const mismatches = koSources
      .map((ko) => {
        const en = ko.replace(/\.md$/, '.en.md');
        return {
          file: path.relative(process.cwd(), ko),
          expected: CATEGORY_EN[categoryOf(ko)],
          actual: fs.existsSync(en) ? categoryOf(en) : null,
        };
      })
      .filter(
        (entry) => entry.actual !== null && entry.actual !== entry.expected,
      );

    expect(mismatches).toEqual([]);
  });
});

/**
 * 태그 어휘 규약 — 태그가 다시 동의어·대소문자 변형·1회용으로 불어나지 않게 막는다.
 * (2026-11-07 정리 전에는 72개 중 44개가 한 편에만 붙어 있었고 mcp/MCP,
 * test/테스트, 상태관리/state management/State Management가 섞여 있었다.)
 */
describe('프론트매터 tags 어휘 규약 @regression', () => {
  it('한국어 원문의 태그가 어휘에 속한다', () => {
    const violations = koSources.flatMap((file) =>
      frontmatterOf(file)
        .tags.filter((tag) => !(tag in TAG_EN))
        .map((tag) => ({ file: path.relative(process.cwd(), file), tag })),
    );
    expect(violations).toEqual([]);
  });

  it('영문 번역의 태그가 한국어 원문 태그의 짝과 순서까지 같다', () => {
    const mismatches = koSources
      .map((ko) => {
        const en = ko.replace(/\.md$/, '.en.md');
        return {
          file: path.relative(process.cwd(), en),
          expected: frontmatterOf(ko).tags.map((tag) => TAG_EN[tag] ?? tag),
          actual: fs.existsSync(en) ? frontmatterOf(en).tags : null,
        };
      })
      .filter(
        (entry) =>
          entry.actual !== null &&
          entry.actual.join('|') !== entry.expected.join('|'),
      );
    expect(mismatches).toEqual([]);
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
