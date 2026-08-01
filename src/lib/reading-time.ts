/**
 * 한글/영문 혼합 본문의 읽기 시간(분)을 추정한다.
 * - CJK 문자: 분당 약 500자
 * - 영문/숫자 단어: 분당 약 200단어
 * 코드펜스/인라인코드는 제외한다. 최소 1분.
 */
const CJK = /[ㄱ-힝一-鿿぀-ヿ]/g;

export function readingTime(content: string): number {
  const { cjk, words } = countUnits(content);
  const minutes = Math.ceil(cjk / 500 + words / 200);
  return Math.max(1, minutes);
}

/**
 * 구조화 데이터(BlogPosting.wordCount)용 분량 추정.
 * 한글에는 단어 경계가 없어 CJK는 글자 수를 그대로 더한다(읽기 시간과 같은 기준).
 */
export function wordCount(content: string): number {
  const { cjk, words } = countUnits(content);
  return cjk + words;
}

/** 코드(펜스·인라인)를 걷어낸 뒤 CJK 글자 수와 영문/숫자 단어 수를 센다. */
function countUnits(content: string): { cjk: number; words: number } {
  const text = content.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ');
  return {
    cjk: (text.match(CJK) || []).length,
    words: (text.replace(CJK, ' ').match(/[A-Za-z0-9]+/g) || []).length,
  };
}
