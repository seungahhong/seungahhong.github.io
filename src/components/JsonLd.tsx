type JsonLdData = Record<string, unknown>;

/**
 * JSON-LD 구조화 데이터를 `<script type="application/ld+json">`로 렌더한다.
 * 값은 빌드 시점의 정적 데이터(사용자 입력 아님)이며, `<` 를 이스케이프해
 * `</script>` 조기 종료를 방어한다.
 */
export default function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
