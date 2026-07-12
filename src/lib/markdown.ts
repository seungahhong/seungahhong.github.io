import { unified, type Plugin } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import GithubSlugger from 'github-slugger';
import path from 'node:path';
import type { Element, Root } from 'hast';
import type { TocHeading } from '@/types';

/** 마크다운 인라인 문법을 제거해 순수 텍스트를 만든다(제목/발췌용). */
export function stripMdInline(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 콘텐츠 상대 이미지 경로(./assets/..)를 정적 서빙 경로(/blog-assets/<relDir>/..)로 치환한다.
 * 절대경로(http, /, data:)는 그대로 둔다.
 */
export function rewriteAssetSrc(src: string, relDir: string): string {
  if (!src) return src;
  if (
    /^(https?:)?\/\//.test(src) ||
    src.startsWith('/') ||
    src.startsWith('data:')
  ) {
    return src;
  }
  const resolved = path.posix.normalize(path.posix.join(relDir, src));
  return '/blog-assets/' + resolved.replace(/^\/+/, '');
}

/**
 * 마크다운 소스에서 h1~h3 제목을 뽑아 TOC를 만든다.
 * id는 github-slugger로 생성해 rehype-slug 결과와 일치시킨다(문서 순서 dedup 동일).
 */
export function extractHeadings(markdown: string): TocHeading[] {
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];
  let inFence = false;
  for (const raw of markdown.split('\n')) {
    if (/^\s*(```|~~~)/.test(raw)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(raw);
    if (!match) continue;
    const depth = match[1].length;
    const text = stripMdInline(match[2]);
    if (!text) continue;
    headings.push({ id: slugger.slug(text), text, depth });
  }
  return headings;
}

/** 목록 카드용 발췌문(기본 160자). */
export function makeExcerpt(content: string, max = 160): string {
  const text = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/[*_`~#|]/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

function hastText(node: Element): string {
  let out = '';
  for (const child of node.children) {
    if (child.type === 'text') out += child.value;
    else if (child.type === 'element') out += hastText(child);
  }
  return out;
}

// 본문 제목을 한 단계 내린 뒤(h1→h2 …) 수집하므로, 렌더된 레벨 → TOC 깊이 매핑.
const HEADING_DEPTH: Record<string, number> = { h2: 1, h3: 2, h4: 3 };

const HEADING_LEVEL: Record<string, number> = {
  h1: 1,
  h2: 2,
  h3: 3,
  h4: 4,
  h5: 5,
};

/**
 * 본문 제목을 한 단계 강등한다(h1→h2 … h5→h6).
 * 포스트 제목(PostHeader)이 유일한 h1이 되도록 해 단일 h1 · 올바른 제목 계층을 보장한다.
 */
const rehypeShiftHeadings: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'element', (node: Element) => {
    const level = HEADING_LEVEL[node.tagName];
    if (level) node.tagName = `h${level + 1}`;
  });
};

/** rehype-slug 이후, 렌더된 hast에서 정확한 id로 제목을 수집한다. */
const rehypeCollectHeadings: Plugin<[TocHeading[]], Root> = (acc) => (tree) => {
  visit(tree, 'element', (node: Element) => {
    const depth = HEADING_DEPTH[node.tagName];
    if (!depth) return;
    const id = node.properties?.id;
    if (typeof id !== 'string') return;
    const text = hastText(node).trim();
    if (text) acc.push({ id, text, depth });
  });
};

/** 이미지/자산 링크의 상대경로를 정적 경로로 치환한다. */
const rehypeRewriteAssets: Plugin<[string], Root> = (relDir) => (tree) => {
  visit(tree, 'element', (node: Element) => {
    if (!node.properties) return;
    if (node.tagName === 'img' && typeof node.properties.src === 'string') {
      node.properties.src = rewriteAssetSrc(node.properties.src, relDir);
    }
    if (node.tagName === 'a' && typeof node.properties.href === 'string') {
      const href = node.properties.href;
      if (href.startsWith('./assets/') || href.startsWith('assets/')) {
        node.properties.href = rewriteAssetSrc(href, relDir);
      }
    }
  });
};

export interface RenderResult {
  html: string;
  headings: TocHeading[];
}

/** 마크다운 본문 → 안전한 HTML + 정확한 TOC. 코드블록은 shiki로 라이트/다크 하이라이팅. */
export async function renderMarkdown(
  content: string,
  relDir: string,
): Promise<RenderResult> {
  const headings: TocHeading[] = [];
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeShiftHeadings)
    .use(rehypeSlug)
    .use(rehypeCollectHeadings, headings)
    .use(rehypeAutolinkHeadings, {
      behavior: 'append',
      properties: {
        className: ['heading-anchor'],
        ariaHidden: 'true',
        tabIndex: -1,
      },
    })
    .use(rehypePrettyCode, {
      // 고대비 변형: WCAG AA를 만족하는 코드 토큰 색상
      theme: {
        light: 'github-light-high-contrast',
        dark: 'github-dark-high-contrast',
      },
      keepBackground: false,
    })
    .use(rehypeRewriteAssets, relDir)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return { html: String(file), headings };
}
