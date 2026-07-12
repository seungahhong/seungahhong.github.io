export default function ProseContent({ html }: { html: string }) {
  return (
    <div
      className="post-prose"
      // 콘텐츠는 신뢰된 로컬 마크다운을 빌드타임에 렌더한 결과다.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
