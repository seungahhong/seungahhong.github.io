/**
 * 한글/영문 혼합 본문의 읽기 시간(분)을 추정한다.
 * - CJK 문자: 분당 약 500자
 * - 영문/숫자 단어: 분당 약 200단어
 * 코드펜스/인라인코드는 제외한다. 최소 1분.
 */
const CJK = /[ㄱ-힝一-鿿぀-ヿ]/g;

export function readingTime(content: string): number {
  const text = content.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ');

  const cjkCount = (text.match(CJK) || []).length;
  const wordCount = (text.replace(CJK, ' ').match(/[A-Za-z0-9]+/g) || [])
    .length;

  const minutes = Math.ceil(cjkCount / 500 + wordCount / 200);
  return Math.max(1, minutes);
}
