import { describe, expect, it } from 'vitest';
import {
  extractHeadings,
  makeExcerpt,
  renderMarkdown,
  rewriteAssetSrc,
  stripMdInline,
} from './markdown';

describe('rewriteAssetSrc', () => {
  it('rewrites relative ./assets paths to /blog-assets/<relDir>', () => {
    expect(rewriteAssetSrc('./assets/18/thumbnail.png', '2024/03')).toBe(
      '/blog-assets/2024/03/assets/18/thumbnail.png',
    );
  });

  it('rewrites bare assets/ paths too', () => {
    expect(rewriteAssetSrc('assets/1/x.png', '2020/01')).toBe(
      '/blog-assets/2020/01/assets/1/x.png',
    );
  });

  it('leaves absolute/remote/data URLs untouched', () => {
    expect(rewriteAssetSrc('https://x.dev/y.png', '2024/03')).toBe(
      'https://x.dev/y.png',
    );
    expect(rewriteAssetSrc('/already/abs.png', '2024/03')).toBe(
      '/already/abs.png',
    );
    expect(rewriteAssetSrc('data:image/png;base64,AAAA', '2024/03')).toBe(
      'data:image/png;base64,AAAA',
    );
  });
});

describe('stripMdInline', () => {
  it('removes links, images, code, emphasis and html', () => {
    // 태그는 제거하되 태그 안의 보이는 텍스트('h')는 남긴다(rehype-slug와 동일 규칙)
    expect(
      stripMdInline('**굵게** `코드` [링크](/x) ![img](/y.png) <b>h</b>'),
    ).toBe('굵게 코드 링크 h');
  });
});

describe('extractHeadings', () => {
  it('extracts h1~h3 with slug ids and depth, skipping code fences', () => {
    const md = [
      '# 서론',
      '',
      '## 배경 설명',
      '',
      '```',
      '## 코드 안 제목',
      '```',
      '',
      '### 세부 항목',
    ].join('\n');
    const headings = extractHeadings(md);
    expect(headings).toEqual([
      { id: '서론', text: '서론', depth: 1 },
      { id: '배경-설명', text: '배경 설명', depth: 2 },
      { id: '세부-항목', text: '세부 항목', depth: 3 },
    ]);
  });

  it('dedupes repeated heading ids in document order', () => {
    const headings = extractHeadings('## 반복\n\n## 반복');
    expect(headings.map((h) => h.id)).toEqual(['반복', '반복-1']);
  });
});

describe('makeExcerpt', () => {
  it('returns short text unchanged', () => {
    expect(makeExcerpt('짧은 소개 문장입니다.')).toBe('짧은 소개 문장입니다.');
  });

  it('truncates long text with an ellipsis within the limit', () => {
    const excerpt = makeExcerpt('가나다 '.repeat(100), 40);
    expect(excerpt.endsWith('…')).toBe(true);
    expect(excerpt.length).toBeLessThanOrEqual(41);
  });

  it('strips code fences and markdown syntax', () => {
    const excerpt = makeExcerpt(
      '# 제목\n\n본문 내용\n\n```js\nconst a=1;\n```',
    );
    expect(excerpt).not.toContain('#');
    expect(excerpt).not.toContain('const');
    expect(excerpt).toContain('본문 내용');
  });
});

describe('renderMarkdown', () => {
  it('renders headings with ids, highlights code, and rewrites asset paths', async () => {
    const md = [
      '# 제목',
      '',
      '본문 문단입니다.',
      '',
      '![썸네일](./assets/1/t.png)',
      '',
      '```js',
      'const a = 1;',
      '```',
    ].join('\n');
    const { html, headings } = await renderMarkdown(md, '2024/03');

    expect(headings[0]).toMatchObject({ id: '제목', text: '제목', depth: 1 });
    expect(html).toContain('id="제목"');
    expect(html).toContain('/blog-assets/2024/03/assets/1/t.png');
    expect(html).toContain('<pre');
  }, 30000);
});
