# 사용자 스토리 — 홍승아 기술 블로그 (as-is 회귀 기준)

> **문서 성격**: 신규 기능 스토리가 아니라, **현재 배포된 제품이 이미 제공 중인 동작**을 사용자 관점으로 서술한 회귀 기준(regression baseline)이다. 수용기준은 지금 사이트/저장소에서 제3자가 그대로 재현·판정할 수 있는 조건으로만 쓴다.
> **기준 시점**: 2026-08-03 / **기준 리비전**: `develop` @ `269db294` (변경 내역은 PRD §0 리비전 이력 참조)
> **역할**: 한국어권 개발자 / 영어권 개발자 / 채용 담당자·협업 상대 / 운영자(저자) / 후속 작업자
> **부분충족 표기**: R9·R16은 "현재 실제로 관측되는 동작"과 "충족 상태로 가기 위한 조건"을 별도 시나리오로 분리했다.
> **INVEST S(Small) 판정 규칙**: `covers` 태그가 2개 이상이거나 독립 관심사가 3개 이상이면 **S=X로 표기한다** — 요구 경계를 지키기 위해 분할하지 않는 경우에도 표기는 X다. 규칙이 없으면 같은 상황에 다른 값이 붙어 자가점검이 재현 불가능해진다.
> **적대적 검증 반영**: 본 판은 `adversarial-review.md`의 결함 24건을 반영한 것이다. 추가된 수용기준에는 어떤 결함(D#)에 대응하는지 표기했다.

## A. 읽기·탐색 (독자)

### S1 (covers: R1)

- **스토리**: 한국어권 개발자로서 축적된 글을 최신순 목록으로 훑고 싶다, 왜냐하면 어떤 주제가 최근에 정리됐는지부터 확인하는 것이 진입 비용이 가장 낮기 때문이다.
- **수용기준**
  - Given 사이트가 배포된 상태 When `/ko/posts/`에 진입한다 Then 글 카드가 게시일 내림차순으로 나열되고, 같은 게시일 카드끼리는 제목 오름차순으로 나열된다.
  - Given `/ko/posts/` When 카드 하나를 본다 Then 카테고리·제목·발췌·태그·예상 읽기 시간(`N분`)이 함께 표시된다.
  - Given `/en/posts/` When 목록을 연다 Then 한국어 목록과 동일한 편수의 카드가 영어 UI 라벨(`Posts` / `N min read`)로 표시된다.
  - Given 홈(`/ko/`) When 진입한다 Then "최근 글" 영역과 "전체 보기 →" 링크가 표시되고, 링크는 `/ko/posts/`로 이동한다.
  - Given 목록 카드를 클릭한다 When 이동이 끝난다 Then `/{로케일}/posts/{slug}/` 상세 화면이 표시된다.
  - **(도달성 — D5 재발 방지)** Given 사이트맵에 실린 모든 글 상세 URL When 각각을 요청한다 Then 전부 200이며 not-found 화면이 아니다. <sup>목록에 뜨는 것과 상세가 열리는 것은 다른 문제다 — 기준 리비전에서 71편 중 5편이 목록에는 있고 상세는 soft 404였다.</sup>
  - **(빈 상태 — D14로 전제를 재현 가능하게 좁힘)** Given `/ko/posts/?category=존재하지않는값` When 진입한다 Then 목록 영역이 비어 보이고 전용 빈 상태 문구는 표시되지 않는다. <sup>실측 카테고리 분포가 `개발 69 / 문서 1 / 도구 1`이라 "필터 결과 0건"은 실제 카테고리로는 도달할 수 없다.</sup>
- **INVEST**: I=O / N=O / V=O / E=O / S=O / T=O

### S2 (covers: R2)

- **스토리**: 한국어권 개발자로서 글 상세에서 코드와 표가 제대로 렌더된 본문을 읽고 싶다, 왜냐하면 기술 글은 코드블록이 깨지면 그 자체로 재사용 가치가 사라지기 때문이다.
- **수용기준**
  - **(D13 합격선 명시)** Given 코드블록이 포함된 글 상세 When 본문을 본다 Then 코드블록 내부에 서로 다른 `--shiki-light`/`--shiki-dark` 값을 가진 `<span>`이 2개 이상 존재한다. <sup>shiki(rehype-pretty-code)는 inline `color`가 아니라 CSS 변수로 라이트·다크 색을 함께 싣는다 — 처음엔 `color`로 적었다가 실행에서 0건이 나와 바로잡았다.</sup>
  - Given GFM 문법(표·체크리스트·취소선)이 포함된 글 When 본문을 본다 Then 마크다운 원문 기호가 아니라 렌더된 표/목록으로 표시된다.
  - Given 글 본문의 heading When 해당 heading 위에 마우스를 올린다 Then 평소 보이지 않던 `#` 앵커가 나타나고, 클릭하면 URL 끝에 해당 heading의 `#슬러그`가 붙는다.
  - Given 같은 제목의 heading이 2개 이상 있다 When 각 앵커를 클릭한다 Then 서로 다른 `#슬러그`(중복 시 접미사 부여)로 이동한다.
  - **(접근성 경계 — 관측된 사실)** Given 키보드만 사용 When Tab으로 본문을 순회한다 Then heading 앵커(`#`)에는 포커스가 도달하지 않는다(마우스 hover 전용). <sup>이 사실은 UG4의 판정 범위 밖 예외로 PRD §2.1·가정 A7에 등록되어 있다.</sup>
- **INVEST**: I=O / N=O / V=O / E=O / S=O / T=O

### S3 (covers: R3)

- **스토리**: 한국어권 개발자로서 ⌘K 한 번으로 검색 팔레트를 열어 원하는 글을 찾고 싶다, 왜냐하면 71편이 쌓인 상태에서 목록을 스크롤하는 것보다 한 번의 조작이 빠르기 때문이다.
- **수용기준**
  - Given 임의의 페이지 When `⌘K`(또는 `Ctrl+K`)를 누른다 Then 검색 팔레트가 열리고 입력창에 포커스가 있으며 플레이스홀더가 `포스트, 태그 검색…`(en: `Search posts, tags…`)으로 표시된다.
  - Given 팔레트가 열린 상태 When `⌘K`를 다시 누른다 Then 팔레트가 닫힌다.
  - Given 팔레트가 열린 상태 When `Esc`를 누른다 Then 팔레트가 닫히고 포커스가 열기 직전 요소로 돌아간다.
  - Given 팔레트가 열린 직후 입력이 비어 있다 When 결과 영역을 본다 Then 결과가 최대 8건 표시된다(검색어 최소 길이 조건 없음).
  - Given 매칭 문서가 9건 이상인 검색어 When 입력한다 Then 결과는 8건을 넘지 않는다.
  - Given 어떤 글의 제목이 검색어로 시작하고 다른 글은 발췌에만 검색어를 포함한다 When 그 검색어를 입력한다 Then 제목이 검색어로 시작하는 글이 발췌만 매칭된 글보다 위에 표시된다.
  - Given 결과 항목 When 항목을 본다 Then 카테고리 칩·게시일·제목이 표시되고, 태그가 있으면 `#태그` 형태로 함께 표시된다.
  - Given 결과가 표시된 상태 When `↓`/`↑`로 활성 항목을 옮기고 `Enter`를 누른다 Then `/{로케일}/posts/{slug}`로 이동하고 팔레트가 닫힌다.
  - **(빈 상태)** Given 어떤 글도 매칭되지 않는 문자열 When 입력한다 Then `검색 결과가 없습니다.`(en: `No results found.`)가 표시된다.
  - Given 데스크톱 폭 When 헤더의 검색 버튼(또는 사이드바 검색 박스)을 클릭한다 Then 동일한 팔레트가 열린다.
- **INVEST**: I=O / N=O / V=O / E=O / **S=X**(독립 관심사 4개 — 팔레트 개폐·포커스 복원 / 스코어링 랭킹 / 키보드 내비게이션 / 빈 상태·진입점. R3가 단일 요구라 분할하지 않되 규칙대로 X 표기) / T=O

### S4 (covers: R4, NFR3)

- **스토리**: 한국어권 개발자로서 카테고리·태그로 목록을 좁히고 그 상태의 URL을 공유하고 싶다, 왜냐하면 "이 주제 글 모음"을 링크 하나로 전달하고 싶기 때문이다.
- **수용기준**
  - Given `/ko/tags/` When 태그 칩 하나를 클릭한다 Then 주소창이 `/ko/tags/?tag={태그}`로 바뀌고, 제목이 `#{태그}`로 바뀌며 `N개의 글`(en: `N posts`)이 함께 표시된다.
  - Given 태그가 활성인 상태 When 같은 칩을 다시 클릭한다 Then `?tag=` 파라미터가 사라지고 전체 목록으로 돌아간다.
  - Given 태그가 활성인 상태 When `필터 해제`(en: `Clear filter`) 버튼을 클릭한다 Then 필터가 해제된다.
  - Given `/ko/tags/?tag={유효한 태그}` URL When 새 탭에서 직접 진입하거나 새로고침한다 Then 해당 태그로 필터된 목록이 복원된다.
  - Given `/ko/posts/` When 카테고리 칩을 클릭한다 Then 주소창이 `?category=` 파라미터로 바뀌고, `전체`(en: `All`) 칩을 누르면 해제된다. 활성 칩에는 `aria-pressed`가 부여된다.
  - **(NFR3)** Given `/ko/tags/React` 같은 per-tag 경로 When 직접 진입한다 Then 해당 정적 경로는 존재하지 않고 404 화면이 표시된다.
  - **(잘못된 값 — 관측된 갭)** Given `/ko/tags/?tag=존재하지않는값` When 진입한다 Then 필터가 적용되지 않은 전체 목록이 표시되고, `필터 해제` 버튼과 전용 안내 문구는 표시되지 않는다.
  - **(로딩 중 — 관측된 갭)** Given `?tag=`가 붙은 URL When 페이지를 새로 로드한다 Then 하이드레이션 이전에 전체 목록이 잠시 보인 뒤 필터된 목록으로 바뀐다.
  - **(히스토리 — 관측된 갭)** Given 태그 A → 태그 B 순으로 클릭했다 When 뒤로가기를 누른다 Then 태그 A 상태로 돌아가지 않는다.
- **INVEST**: I=O / N=O / V=O / E=O / **S=X**(covers 2개 + 관심사 3개: 태그 필터 / 카테고리 필터 / URL 상태 복원) / T=O

### S5 (covers: R5)

- **스토리**: 영어권 개발자로서 읽던 글에서 언어만 바꾸고 싶다, 왜냐하면 언어 전환이 홈으로 튕기면 읽던 자리를 다시 찾아야 하기 때문이다.
- **수용기준**
  - Given `/ko/posts/{slug}/` When 헤더의 `EN` 버튼을 클릭한다 Then `/en/posts/{slug}/`로 이동하고 같은 글의 영어 화면이 표시된다.
  - Given `/en/about/` When `KO` 버튼을 클릭한다 Then `/ko/about/`으로 이동한다.
  - Given 현재 로케일이 `ko` When `KO` 버튼을 클릭한다 Then 화면이 변하지 않는다(활성 버튼은 `aria-pressed=true`).
  - Given 언어를 전환한 직후 When 뒤로가기를 누른다 Then 전환 전 언어의 같은 경로로 돌아간다.
  - **(경계 — 관측된 갭)** Given `/ko/tags/?tag=React` When `EN`을 클릭한다 Then `/en/tags/`로 이동하며 `?tag=` 필터가 유지되지 않는다.
  - **(경계 — 관측된 갭)** Given `/ko/posts/{slug}/#어떤섹션` When `EN`을 클릭한다 Then 해시가 유지되지 않고 글 최상단이 표시된다.
- **INVEST**: I=O / N=O / V=O / E=O / S=O / T=O

### S6 (covers: R6, NFR6)

- **스토리**: 영어권 개발자로서 영어 번역이 아직 없는 글도 빈 화면 대신 원문으로라도 읽고 싶다, 왜냐하면 접근 자체가 막히는 것보다 "원문이라는 사실을 알고 읽는" 편이 낫기 때문이다.
- **수용기준**
  - **(현재 상태)** Given 기준 리비전 When `find contents/blog -name '*.md' | wc -l`와 `find contents/blog -name '*.en.md' | wc -l`을 실행한다 Then 각각 142와 71이며, 한국어 원문과 영어 번역이 71:71로 같다.
  - **(현재 상태)** Given 번역 커버리지 100% When `/en`의 임의 글 상세를 연다 Then 폴백 안내 박스가 표시되지 않는다.
  - **(폴백 발동 조건)** Given 어떤 글에 `slug.en.md`가 없다 When `/en/posts/{slug}/`를 연다 Then 한국어 본문이 렌더되고, 제목·메타 아래 태그 위에 `This article is currently shown in its original Korean.` 박스가 표시된다.
  - **(폴백 발동 조건)** Given 동일 상황 When `/ko/posts/{slug}/`를 연다 Then 안내 박스는 표시되지 않는다.
- **INVEST**: I=O / N=O / V=O / E=O / **S=X**(covers 2개) / T=X(폴백 시나리오는 현재 데이터로 재현 불가 — 판정하려면 `.en.md`를 임시 제거한 로컬 빌드 필요)

### S7 (covers: R7)

- **스토리**: 한국어권 개발자로서 긴 글에서 내 위치를 알고 다음 글로 이어가고 싶다, 왜냐하면 스크롤만 남은 긴 기술 글은 중간에 이탈하기 쉽기 때문이다.
- **수용기준**
  - Given 데스크톱 폭(lg 이상)의 글 상세 When 화면을 본다 Then 우측에 `목차`(en: `Contents`) 컬럼이 sticky로 표시된다.
  - Given 목차가 표시된 상태 When 목차 항목을 클릭한다 Then URL 끝에 `#슬러그`가 붙고 해당 heading 위치로 이동한다.
  - **(D13 임계 범위 명시)** Given 글을 스크롤한다 When 해당 heading이 뷰포트 상단에 도달한다 Then 목차의 활성 항목이 그 섹션으로 바뀐다. <sup>정확한 IntersectionObserver 임계(threshold/rootMargin)는 이 기준의 판정 범위 밖이다 — 경계값에서 결과가 갈리므로 합·불 근거로 쓰지 않는다.</sup>
  - Given 글 상세 When 아래로 스크롤한다 Then 뷰포트 최상단의 진행률 막대가 좌에서 우로 길어진다.
  - Given 글 상세 When 본문 하단을 본다 Then `이전 글`(en: `Previous`)과 `다음 글`(en: `Next`) 영역이 제목과 함께 표시된다.
  - **(경계)** Given 목록의 가장 최신 글 When 본문 하단을 본다 Then 없는 쪽 자리는 카드 없이 비어 있고 반대쪽은 제자리에 표시된다.
  - **(경계)** Given heading이 하나도 없는 글 When 상세를 연다 Then 목차 영역이 렌더되지 않는다.
  - Given 글 상세 When 제목 위를 본다 Then `홈 / 포스트 / {카테고리} / {글 제목}` 브레드크럼이 표시되고, 마지막 항목에 `aria-current="page"`가 부여된다.
  - Given 글 헤더 When 메타 줄을 본다 Then 작성자·게시일과 함께 예상 읽기 시간(`N분` / `N min read`)이 표시된다.
  - **(접근성 — 관측된 사실)** Given 스크린리더 사용 When 페이지를 읽는다 Then 진행률 막대는 `aria-hidden`이라 읽히지 않는다. <sup>UG4의 판정 범위 밖 예외로 PRD §2.1·가정 A7에 등록.</sup>
- **INVEST**: I=O / N=O / V=O / E=O / **S=X**(독립 관심사 4개: 목차 / 진행률 / 이전·다음 / 브레드크럼·메타) / T=O

### S8 (covers: R8)

- **스토리**: 한국어권 개발자로서 라이트/다크 테마를 골라 두고 재방문에도 그대로 쓰고 싶다, 왜냐하면 매번 다시 고르는 것은 긴 글을 읽는 환경에서 반복 비용이기 때문이다.
- **수용기준**
  - Given 임의의 페이지 When `테마 전환`(en: `Toggle theme`) 버튼을 클릭한다 Then `<html>`의 `data-theme` 값이 직전과 다른 값으로 바뀌고, 그 값은 `light` 또는 `dark` 중 하나다.
  - Given 테마를 전환한 직후 When 새로고침한다 Then `data-theme`이 전환 직후 값과 같게 유지된다.
  - **(첫 방문 경계)** Given 저장된 선택이 없는 새 브라우저 컨텍스트에서 OS가 다크 모드다 When 처음 진입한다 Then `data-theme="dark"`로 표시된다.
- **INVEST**: I=O / N=O / V=O / E=O / S=O / T=O

## B. 인기 글 (부분충족)

### S9 (covers: R9, NFR2)

- **스토리**: 한국어권 개발자로서 홈 사이드바에서 많이 읽힌 글 Top 5를 보고 싶다, 왜냐하면 처음 방문한 블로그에서 무엇부터 읽을지 고르는 기준이 필요하기 때문이다.
- **수용기준**
  - **(현재 실제 동작 — 부분충족)** Given 기준 리비전의 `data/popular.json`이 `{"updatedAt": null, "rangeDays": 90, "items": []}`이다 When 홈 사이드바의 `Top 5 인기 글`(en: `Top 5 popular`) 위젯을 본다 Then 항목 5개가 표시되고 그 순서는 최신 글 5편과 같으며, 어느 항목에도 조회수 숫자(`조회` / `views`)가 표시되지 않는다.
  - **(라벨과 실제의 불일치 — 관측된 사실)** Given 위 상태 When 위젯 제목을 읽는다 Then 제목은 `Top 5 인기 글`이지만 실제 정렬 기준은 조회수가 아니라 최신순이다.
  - **(NFR2 — D13 관찰 수단 명시)** Given 네트워크 접근이 차단된 환경 When `pnpm build`를 실행한다 Then 빌드가 exit 0으로 성공하고 빌드 로그에 네트워크 오류가 없다. <sup>"외부 API 호출 없음"의 직접 관찰 수단이 없으므로 이 조건으로 갈음한다. 차단 수준(DNS/프록시/전면)은 판정에 영향을 주지 않아야 한다.</sup>
  - **(충족 상태로 가기 위한 조건)** Given `updatedAt`이 `null`이 아니고 `items`가 비어 있지 않다 When 배포 후 홈 사이드바를 본다 Then 항목이 조회수 내림차순으로 정렬되고 각 항목에 compact 표기 조회수(예: `1.2K 조회`)가 표시되며, 그 순서가 최신 글 5편의 순서와 다르다.
  - **(부분 데이터 경계)** Given `items`에 조회수가 잡힌 글이 5편 미만이다 When 위젯을 본다 Then 부족한 자리는 최신순으로 채워지고 그 항목에는 조회수 숫자가 표시되지 않는다.
  - **(빈 상태 경계)** Given 발행된 글이 0편이다 When 홈을 연다 Then 인기 글 위젯 섹션 자체가 렌더되지 않는다.
- **INVEST**: I=X(충족 시나리오가 S15의 `refresh-popular` 복구에 의존) / N=O / V=O / E=O / **S=X**(covers 2개) / T=O

## C. 발견성 — 검색엔진·AI 크롤러

### S10 (covers: R10, R11)

- **스토리**: 운영자(저자)로서 검색엔진과 AI 크롤러가 사이트 구조와 글 메타데이터를 기계 판독하게 하고 싶다, 왜냐하면 같은 문제를 겪는 개발자의 검색·AI 검색 결과에 걸리는 것이 이 블로그의 목표 중 하나이기 때문이다.
- **수용기준**
  - Given 배포된 사이트 When `/sitemap.xml`을 연다 Then 홈·`/posts`·`/tags`·`/about` 4개 섹션과 전체 글 상세 URL이 `ko`·`en` 두 로케일 분량으로 절대 URL(후행 슬래시 포함)로 포함되어 있다.
  - **(D4 — HEAD 신규 불변식)** Given `/sitemap.xml` When 모든 `<loc>`을 수집한다 Then 전부 `/`로 끝난다.
  - **(D4 — HEAD 신규 불변식)** Given 사이트맵의 각 URL When 해당 페이지의 canonical `href`를 본다 Then 절대 URL이며 사이트맵의 대응 `<loc>`과 **문자 단위로 동일하다**. <sup>기존의 "canonical이 존재한다" AC만으로는 값이 상대 경로로 되돌아가 사이트맵과 어긋나도 전부 합격한다. `seo.test.ts`가 이 불변식의 게이트다.</sup>
  - Given `/ko/posts/{slug}/`의 HTML When `<head>`를 본다 Then canonical 링크와 `hreflang="ko"`·`"en"`·`"x-default"` 대체 링크가 존재한다.
  - **(D23)** Given 임의 페이지의 HTML When Open Graph 메타를 본다 Then `og:image`가 로케일별 이미지(`/og/ko.png` 또는 `/og/en.png`, **실측 1200×630**)를 가리키고 `twitter:card`가 `summary_large_image`이며, **해당 이미지 URL이 200으로 응답한다**. <sup>"가리킨다"까지만 요구하면 파일이 삭제돼도 합격한다.</sup>
  - Given 각 화면의 HTML When `application/ld+json` 블록을 수집한다 Then 홈에 `WebSite`·`Blog`, `/posts`와 `/tags`에 `CollectionPage`, `/about`에 `ProfilePage`·`FAQPage`, 글 상세에 `BlogPosting`이 있고, 글 상세·섹션 페이지 모두에 `BreadcrumbList`가 있어 **최상위 `@type` 기준 7종**이 모두 관측된다. <sup>중첩 타입(`Person`·`ItemList`·`ListItem`·`Question`·`Answer`)은 계수에서 제외한다 — 전수로 읽으면 판정이 갈린다.</sup>
  - Given 배포된 사이트 When `/robots.txt`를 연다 Then `User-agent: *`에 대한 `Allow: /`가 있고, AI 크롤러 22종(GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Googlebot, Bingbot, Applebot, Applebot-Extended, meta-externalagent, Amazonbot, DuckAssistBot, YouBot, cohere-ai, CCBot, Diffbot, Timpibot)이 명시 허용되며 `Disallow` 규칙은 없다.
  - Given `/robots.txt` When 파일 끝을 본다 Then `Sitemap:` 줄이 사이트의 `/sitemap.xml` 절대 URL을 가리킨다.
- **INVEST**: I=O / N=O / V=O / E=O / **S=X**(covers 2개 + 관심사 다수: sitemap·canonical 불변식 / hreflang / OG / JSON-LD / robots) / T=O

## D. 채용·협업 접점

### S11 (covers: R12)

- **스토리**: 채용 담당자·협업 상대로서 About 한 화면에서 이 사람이 누구이고 무엇을 다루며 어떻게 연락하는지 파악하고 싶다, 왜냐하면 이력을 확인하는 데 쓸 수 있는 시간이 길지 않기 때문이다.
- **수용기준**
  - Given `/ko/about/` When 화면 상단을 본다 Then 프로필 이미지·이름·한 줄 소개가 표시된다.
  - Given `/ko/about/` When `관심 기술`(en: `Skills`) 섹션을 본다 Then 그룹이 8개(언어 / 프레임워크·런타임 / 상태관리·데이터 / 빌드·툴링 / 테스트 / 스타일링 / AI·LLM / 기타) 표시되고 각 그룹 아래 항목 칩이 나열된다.
  - Given `/ko/about/` When `링크`(en: `Links`) 섹션을 본다 Then GitHub·Portfolio·LinkedIn·Notion·Email 5개 경로가 표시되고, Email은 `mailto:` 링크이며 나머지는 새 탭으로 열린다.
  - **(D13 치환 값 확정)** Given `/ko/about/` When `자주 묻는 질문` 섹션을 본다 Then 글 편수 자리에 **71**이, 시작 연도 자리에 **2020**이 표시된다. <sup>"실제 값으로 치환"만으로는 판정 불가였다 — 문서 안에 71(한국어 원문)과 142(원문+번역)가 공존하기 때문이다. 이 AC는 71이 정답임을 확정한다.</sup>
  - Given `/en/about/` When 화면을 본다 Then 동일 구성이 영어 라벨(`Intro` / `Skills` / `Links` / `Frequently asked questions`)로 표시된다.
- **INVEST**: I=O / N=O / V=O / E=O / S=O / T=O

## E. 접근성·진입 경로

### S12 (covers: R13, NFR5)

- **스토리**: 키보드·스크린리더를 쓰는 개발자로서 헤더 내비게이션을 건너뛰고 바로 본문으로 가고 싶다, 왜냐하면 매 페이지마다 같은 내비게이션을 순회하는 것이 반복 비용이기 때문이다.
- **수용기준**
  - Given 페이지를 처음 로드한 상태 When `Tab`을 한 번 누른다 Then `본문으로 건너뛰기`(en: `Skip to content`) 링크가 화면 좌상단에 보이는 상태로 포커스를 받는다.
  - Given 해당 링크에 포커스가 있다 When `Enter`를 누른다 Then `id="main-content"`인 `<main>` 위치로 이동한다.
  - Given 포커스가 그 링크를 벗어난다 When 화면을 본다 Then 링크가 다시 보이지 않는 상태로 돌아간다.
  - **(NFR5)** Given `/ko/`, `/ko/posts/`, `/ko/tags/`, `/ko/about/`, `/ko/posts/2026-07-05-meta-harness/` 5개 페이지 When axe를 `wcag2a`·`wcag2aa`·`wcag21a`·`wcag21aa` 태그로 실행한다 Then `impact`가 `serious` 또는 `critical`인 위반이 0건이다.
  - **(판정 범위 명시)** Given 위 실행 결과 When 나머지 위반을 본다 Then `moderate`·`minor` 위반은 이 기준의 합·불 판정에 포함되지 않는다. 또한 **axe가 포착하지 못하는 hover 전용 상호작용도 판정 범위 밖이다**(알려진 예외 2건은 S2·S7, 가정 A7).
- **INVEST**: I=O / N=O / V=O / E=O / **S=X**(covers 2개) / T=O

### S13 (covers: R14)

- **스토리**: 한국어권 개발자로서 도메인 루트만 입력해도 읽을 수 있는 화면에 도달하고 싶다, 왜냐하면 로케일 경로를 외워서 입력하는 방문자는 없기 때문이다.
- **수용기준**
  - Given 브라우저 When 사이트 루트 `/`에 진입한다 Then `/ko/`로 이동한다.
  - **(JS 비활성 경계)** Given JavaScript가 비활성화된 브라우저 When `/`에 진입한다 Then `<meta http-equiv="refresh" content="0; url=/ko/">`에 의해 `/ko/`로 이동한다.
  - **(폴백 경계)** Given 자동 이동이 동작하지 않는 환경 When `/`의 화면을 본다 Then `/ko/`로 가는 텍스트 링크가 표시되어 수동으로 이동할 수 있다.
  - Given `/`의 HTML When robots 메타를 본다 Then `noindex, nofollow`가 지정되어 있다.
- **INVEST**: I=O / N=O / V=O / E=O / S=O / T=O

### S14 (covers: R15)

- **스토리**: 한국어권 개발자로서 잘못된 링크로 들어와도 막다른 화면에 갇히지 않고 싶다, 왜냐하면 오래된 링크가 외부에 남아 있을 수 있기 때문이다.
- **수용기준**
  - Given 존재하지 않는 경로(예: `/ko/posts/없는-슬러그/`) When 진입한다 Then `404` 표기와 `페이지를 찾을 수 없습니다` 제목, `요청하신 페이지가 존재하지 않거나 이동되었습니다.` 설명이 표시된다.
  - Given 404 화면 When 링크를 클릭한다 Then `홈으로 돌아가기` 링크가 `/ko`로 이동시킨다.
  - **(로케일 경계 — 관측된 사실)** Given `/en/` 하위의 존재하지 않는 경로 When 진입한다 Then 404 화면의 문구가 영어가 아니라 한국어로 표시되고, 이동 링크도 `/ko`만 제공된다.
  - **(레이아웃 경계 — 관측된 사실)** Given 404 화면 When 화면 전체를 본다 Then 공통 헤더·푸터·검색 진입점이 표시되지 않는다.
  - **(오탐 방지 — D5)** Given 실제로 존재하는 글의 상세 URL When 진입한다 Then 404 화면이 표시되지 않는다. <sup>404 화면이 잘 뜨는 것과 정상 글이 404로 새는 것은 별개다 — 후자가 기준 리비전에서 5편 발생했다.</sup>
- **INVEST**: I=O / N=O / V=O / E=O / S=O / T=O

## F. 운영 (부분충족 포함)

### S15 (covers: R16)

- **스토리**: 운영자(저자)로서 GA4 조회수 스냅샷이 손대지 않아도 매일 한 번 갱신되게 하고 싶다, 왜냐하면 1인 운영에서 수동 갱신은 곧 갱신 중단을 뜻하기 때문이다.
- **수용기준**
  - Given `.github/workflows/refresh-popular.yml` When 스케줄을 확인한다 Then `0 18 * * *`(UTC) = 매일 03:00 KST 1회 실행이며 `workflow_dispatch` 수동 실행도 가능하다.
  - Given 워크플로가 실행되어 `data/popular.json`이 직전 커밋과 동일하다 When 실행 로그를 본다 Then 커밋 스텝과 PR 생성 스텝이 모두 건너뛰어진다.
  - Given 워크플로가 실행되어 `data/popular.json`이 변경되었다 When 실행 로그와 저장소를 본다 Then `data/popular.json`만 담긴 커밋이 `develop`에 푸시되고, `master` 대상 PR이 생성된다.
  - **(중복 방지 경계)** Given `develop → master` 열린 PR이 이미 있다 When 워크플로가 변경을 감지한다 Then 새 PR을 만들지 않고 종료한다.
  - **(현재 실제 상태 — 부분충족)** Given 기준 리비전 When `data/popular.json`을 연다 Then `updatedAt`이 `null`이고 `items`가 비어 있어, 최근에 성공적으로 갱신된 결과가 관측되지 않는다.
  - **(충족 상태로 가기 위한 조건)** Given `GA_PROPERTY_ID`·`GA_SERVICE_ACCOUNT_KEY`·`ACCESS_TOKEN` 시크릿이 유효하다 When 워크플로를 수동 실행한다 Then 실행이 성공하고 `updatedAt`이 `null`이 아니게 되며 `items`가 비어 있지 않다.
- **INVEST**: I=O / N=O / V=O / E=O / S=O / T=X(시크릿 유효성이 확인되지 않아 "충족 조건" 시나리오는 현재 판정 불가 — 가정 기반)

### S16 (covers: NFR1, NFR2, NFR8)

- **스토리**: 후속 작업자로서 서버 없이 정적 산출물만으로 사이트가 서빙되고, 네트워크 없이도 빌드가 재현되며, 툴체인이 고정되어 있길 원한다, 왜냐하면 런타임 가정이나 버전 드리프트가 있으면 내 환경에서 재현되지 않기 때문이다.
- **수용기준**
  - Given 저장소 When `next.config.ts`를 확인한다 Then `output: 'export'`, `images.unoptimized: true`, `trailingSlash: true`가 설정되어 있고 `basePath`는 설정되어 있지 않다.
  - **(D13 판정 절차 명시)** Given `pnpm build` 실행 후 When `out/`을 본다 Then `.html`과 정적 자산만 존재하고 서버 진입점(`server.js`, `.next/server` 등)이 없으며 `.nojekyll`이 포함된다.
  - **(NFR2 — D11 재배치)** Given 네트워크 접근이 차단된 환경 When `pnpm build`를 실행한다 Then 빌드가 exit 0으로 성공한다. <sup>NFR2는 인기 글 위젯만이 아니라 마크다운 파이프라인·이미지 동기화·shiki 전체에 걸리는 빌드 전역 제약이다. S9(부분충족 스토리)에만 매달려 있던 것을 여기에 병기했다 — S9의 AC는 기존 매트릭스 보존을 위해 그대로 둔다.</sup>
  - Given `package.json` When 버전 고정을 확인한다 Then `packageManager`가 `pnpm@10.33.0`, `engines.node`가 `>=20.9.0`으로 지정되어 있다.
  - Given `.github/workflows/` When Node 설정을 확인한다 Then 두 워크플로 모두 Node 20을 사용하고 의존성은 `--frozen-lockfile`로 설치된다.
- **INVEST**: I=O / N=O / V=O / E=O / **S=X**(covers 3개) / T=O

### S17 (covers: NFR4, NFR10)

- **스토리**: 후속 작업자로서 품질 게이트를 전부 통과한 변경만 배포되길 원한다, 왜냐하면 리뷰어가 1인뿐인 환경에서 자동 게이트가 사실상 유일한 안전망이기 때문이다.
- **수용기준**
  - **(D9 관찰 대상 교체)** Given `.github/workflows/deploy.yml` When 잡 스텝 **내 실행 명령**을 확인한다 Then `pnpm lint` → `pnpm typecheck` → `pnpm test`(Vitest) → `pnpm build` → `pnpm e2e`(Playwright) 순이며(**lint·typecheck는 `Lint & typecheck` 한 스텝 안에서 순차 실행**), E2E 앞에 `Install Playwright browser` 스텝이 있고, 발행 스텝은 이들 뒤에 온다. <sup>"잡 스텝 5개"로 읽으면 실측과 불일치한다 — 5단계는 명령 기준이다.</sup>
  - Given 5단계 중 하나가 실패한다 When 워크플로 실행 결과를 본다 Then 발행 스텝에 도달하지 않고 `gh-pages` 브랜치가 갱신되지 않는다.
  - Given 5단계가 모두 통과한다 When 발행 스텝을 본다 Then `out/` 디렉터리가 `gh-pages` 브랜치로 발행된다.
  - **(NFR10 — D2 수치 교체 + 판정 명령 병기)** Given 저장소 When `ls e2e/playwright/*.test.ts | wc -l`을 실행한다 Then **10**이며 파일은 a11y, analytics, category, i18n, navigation, post, search, **seo**, tag, theme이다. When `grep -chE '^[[:space:]]*test\(' e2e/playwright/*.test.ts`의 합을 구한다 Then **27**이며, a11y 1건이 5개 페이지로 루프 확장되어 **실행 기준 31건**이다. <sup>판정 명령을 AC에 박아 두는 이유: 직전 판이 9/24/28로 스테일한 채 "전량 통과"를 단언해 회귀 기준이 스스로 거짓 알람을 냈다.</sup>
  - **(NFR10 — D20 Vitest 병기)** Given 저장소 When `find src -name '*.test.ts' | wc -l`을 실행한다 Then **20**이며(lib 11 + 컴포넌트 9), `scripts/` 1건을 더하면 21파일·190케이스다. <sup>E2E는 파일 수까지 회귀 기준으로 고정하면서 유닛 테스트는 사라져도 신호가 없던 비대칭을 메운다.</sup>
  - **(NFR10)** Given 기준 리비전 When `pnpm e2e`를 실행한다 Then 60건이 전량 통과한다. <sup>2026-08-03 실제 실행으로 확인했다(60 passed).</sup>
- **INVEST**: I=O / N=O / V=O / E=O / **S=X**(covers 2개) / T=O

### S18 (covers: NFR7)

- **스토리**: 운영자(저자)로서 계측 자산이 실수로 죽었을 때 배포 전에 알아채고 싶다, 왜냐하면 측정 ID가 죽으면 조회수가 전면 유실되어 인기 글과 성공지표가 동시에 무너진 전례가 있기 때문이다.
- **수용기준**
  - Given 배포 산출물 When `analytics` E2E가 실행된다 Then DOM에서 gtag 로더의 `?id=` 값과 인라인 초기화 스크립트의 `config` 값을 추출해 실제 측정 ID를 얻는다.
  - Given 추출된 측정 ID When `https://www.googletagmanager.com/gtag/js?id={ID}`를 실제 요청한다 Then 응답이 `404`가 아니어야 하며, `200`인 경우 `content-type`에 `javascript`가 포함된다.
  - **(실패 조건)** Given 측정 ID가 삭제되어 응답이 `404`다 When 게이트가 실행된다 Then 테스트가 실패해 배포가 진행되지 않는다.
  - **(외부 장애 경계 — 관측된 사실)** Given 응답이 `429`/`5xx`이거나 요청 자체가 실패한다 When 게이트가 실행된다 Then 테스트는 실패가 아니라 skip 처리되어 배포를 막지 않는다. **이 경우의 결과는 "확인됨"이 아니라 "미확인"이며 SM4 ④의 충족 근거로 쓰지 않는다**(가정 A8).
  - **(D13 정의·관찰 수단 명시)** Given `location.hostname`이 `seungahhong.github.io`가 아니다 When 페이지를 연다 Then `googletagmanager.com` / `www.google-analytics.com`으로의 요청이 브라우저 네트워크 기록 기준 0건이다.
  - **(D3 — 게이트 신설 대상. 현재 미충족)** Given 배포 산출물의 임의 페이지 HTML When `<head>`를 본다 Then `name="google-site-verification"`과 `name="naver-site-verification"` 메타 태그가 각각 1개씩 존재하고 `content` 값이 비어 있지 않다. <sup>**현재 이 조건을 검증하는 자동 게이트는 없다**(`grep -rn "verification\|naver" e2e/` = 0건). `4d1f4573`에서 이미 한 번 유실된 전력이 있는 자산이므로 RK9로 등록했다. 이 AC는 "현재 통과 중"이 아니라 "게이트가 있어야 하는 조건"이다.</sup>
- **INVEST**: I=O / N=O / V=O / E=O / S=O / T=O

### S19 (covers: NFR9)

- **스토리**: 운영자(저자)로서 정해진 파일 배치대로만 글을 두면 목록·번역·라우팅·이미지가 알아서 잡히길 원한다, 왜냐하면 발행 때마다 등록 절차를 따로 밟으면 발행 자체가 밀리기 때문이다.
- **수용기준**
  - Given `contents/blog/YYYY/MM/{slug}.md` 파일을 추가한다 When 빌드 후 목록을 본다 Then 해당 글이 한국어 목록에 게시일 위치대로 나타나고 `/ko/posts/{slug}/` 경로가 생성된다.
  - Given 같은 위치에 `{slug}.en.md`를 추가한다 When 빌드 후 `/en/posts/{slug}/`를 연다 Then 영어 본문이 렌더되고 번역 폴백 안내가 표시되지 않는다.
  - **(D5 — 목록이 아니라 상세까지 확인)** Given 파일명에 `.0`이나 `+` 같은 로케일이 아닌 특수 표기가 포함된다(예: `2025-06-29-vite6.0.md`, `2020-02-17-c-c++.md`) When 목록과 상세를 본다 Then 그 조각이 로케일로 오인되지 않고 한국어 글로 처리되며, **`/ko/posts/{slug}/`가 not-found가 아닌 실제 본문(제목 일치)으로 200 응답한다**. <sup>직전 판은 "목록을 본다"까지만 요구해, 상세가 soft 404인 5편을 통과시켰다.</sup>
  - Given `contents/blog/**/assets/` 아래의 파일 When 목록을 본다 Then 글 목록에 포함되지 않는다.
  - **(D12 — 서빙 관점. `assets/`는 제외 대상인 동시에 서빙 대상이다)** Given `contents/blog/YYYY/MM/assets/` 아래 이미지를 참조하는 글 When 빌드 후 해당 글 상세를 연다 Then 이미지 `src`가 `/blog-assets/...`로 치환되어 200으로 로드된다. <sup>`public/blog-assets`는 gitignore된 파생물이라, 동기화가 깨지면 **커밋 diff에 아무 흔적 없이** 전 글의 이미지가 사라진다(RK10).</sup>
  - **(경로 형식 — 확정된 실제 동작)** Given `contents/blog/아무곳/x.md`처럼 `YYYY/MM/` 형식을 따르지 않는 경로에 `.md` 파일을 둔다 When 빌드 후 목록을 본다 Then **그 글도 목록에 포함된다** — 수집 대상은 `contents/blog` 하위의 `.md` 파일 전체이며 `assets/`와 비-`.md`만 제외된다. `YYYY/MM/` 배치는 코드가 강제하는 규칙이 아니라 저자가 지키는 관례다.
  - **(D21 — 값 규약. 현재 예외 1건)** Given 한국어 원문 전체 When 프론트매터 `category` 값을 집계한다 Then 로케일별 표기 집합(ko: `개발`·`문서`)에 속해야 한다. **2026-08-03 해소** — ko `tools` 1편을 `도구`로 수정하고 집합을 ko {개발·문서·도구} / en {Development·Docs·Tools}로 확정했다. `content-conventions.test.ts`가 이 규약의 게이트다.
- **INVEST**: I=O / N=O / V=O / E=O / S=O / T=O

### S20 (covers: NFR11)

- **스토리**: 운영자(저자)로서 사람이 상시 응대해야 하는 기능 없이 블로그를 유지하고 싶다, 왜냐하면 1인 운영에서 모더레이션 부담이 생기면 발행 자체가 멈추기 때문이다.
- **수용기준**
  - Given 배포된 사이트의 모든 화면 When 화면을 본다 Then 댓글 입력창·구독 폼·로그인 등 사용자 입력을 수집하거나 응대를 요구하는 UI가 존재하지 않는다.
  - Given 사이트 When 사용자 접점을 확인한다 Then 외부 연락 경로는 About의 정적 링크(GitHub/Portfolio/LinkedIn/Notion/Email)뿐이며 사이트 내 저장이 발생하지 않는다.
  - **(잔존 자산 — 관측된 사실)** Given 글 프론트매터에 `comments` 필드가 존재한다 When 렌더된 화면을 본다 Then 이 필드를 사용하는 UI가 없어 화면에 아무 영향이 없다(사문화 상태).
- **(D16 — 이동됨)** 직전 판의 마지막 수용기준("모더레이션이 필요한 기능은 도입 전 별도 판단 항목으로 분류되어 이월된다")은 **제품 관찰로 판정 불가한 프로세스 약속**이라 수용기준에서 제거하고 PRD 가정 **A9** 및 §7 인계 사항으로 옮겼다. 정보 손실은 없으며, 그 결과 이 스토리의 T 판정이 회복된다.
- **INVEST**: I=O / N=O / V=O / E=O / S=O / T=O

## 요구↔스토리 커버리지 요약

### 기능 요구 (R)

| 요구 | 커버 스토리 | 상태 |
|---|---|---|
| R1 글 목록 최신순 | S1 | 충족(도달성 AC 추가) |
| R2 마크다운·shiki·앵커 heading | S2 | 충족 |
| R3 ⌘K 검색 상위 8건 | S3 | 충족 |
| R4 카테고리·태그 필터 + URL 상태 | S4 | 충족(뒤로가기 복원·잘못된 값 안내는 갭으로 명시) |
| R5 언어 전환 시 경로 유지 | S5 | 충족(경로 세그먼트 한정 — 쿼리·해시 미유지 명시) |
| R6 번역 폴백 + 안내 문구 | S6 | 충족(현재 커버리지 100%라 폴백 경로 미발동) |
| R7 목차·진행률·이전다음·브레드크럼 | S7 | 충족 |
| R8 라이트·다크 테마 유지 | S8 | 충족 |
| R9 인기 글 Top 5 | S9 | **부분충족** — 현재 최신순, 충족 조건 시나리오 분리 |
| R10 sitemap·canonical·hreflang·OG·JSON-LD 7종 | S10 | 충족(canonical↔sitemap 불변식 AC 추가) |
| R11 robots AI 크롤러 22종 | S10 | 충족 |
| R12 About 프로필·기술스택·연락 | S11 | 충족 |
| R13 본문 건너뛰기 링크 | S12 | 충족 |
| R14 루트 → 기본 로케일 | S13 | 충족 |
| R15 404 화면 | S14 | 충족(오탐 방지 AC 추가) |
| R16 GA4 스냅샷 일 1회 자동 갱신 | S15 | **부분충족** — 워크플로 존재, 산출물 공백 |

### 비기능 요구 (NFR)

| 요구 | 커버 스토리 | 상태 |
|---|---|---|
| NFR1 정적 산출물만으로 동작 | S16 | 충족 |
| NFR2 네트워크 없이 빌드 + 폴백 | S9, **S16** | 충족(빌드 전역 제약으로 S16에 병기) |
| NFR3 태그 = 쿼리 기반 클라이언트 필터 | S4 | 충족 |
| NFR4 배포 게이트 5단계(명령 기준) | S17 | 충족 |
| NFR5 axe serious·critical 0건 | S12 | 충족(판정 범위 한계 명시) |
| NFR6 번역 커버리지 100% | S6 | 충족 (71:71) |
| NFR7 계측 자산 생존 검증 | S18 | **부분충족** — GA4는 게이트 있음, **소유권 확인 메타 태그는 게이트 0건**(RK9) |
| NFR8 런타임·툴체인 고정 | S16 | 충족 |
| NFR9 콘텐츠 규약(배치 관례 + 이미지 동기화 + 값 규약) | S19 | 충족 — 2026-08-03 예외 해소(ko `tools`→`도구`) |
| NFR10 E2E 11스펙·선언 56·실행 60 + Vitest 21스펙·190케이스 | S17 | 충족(2026-08-03 실행 확인) |
| NFR11 1인 운영 전제 | S20 | 충족 |

**요구 태그 기준 미커버: 0건** — R1~R16, NFR1~NFR11 전부가 최소 1개 스토리로 커버된다.

> **단, 이 수치를 과신하지 말 것.** 적대적 검증은 "미커버 0건"이 **행 집합이 좁아서 나온 수치**임을 지적했다 — PRD §3.1 In 항목 중 4개가 애초에 요구로 승격되지 않아 매트릭스에 행이 없었다. 본 판에서 그 4개(소유권 확인 메타 → NFR7·S18 / 이미지 동기화 → NFR9·S19 / canonical↔sitemap 불변식 → R10·S10 / Vitest 규모 → NFR10·S17)를 요구·AC로 승격해 행을 만들었다. 다음 검증에서도 같은 질문을 먼저 하라: **"매트릭스에 없는 항목이 In 범위에 남아 있는가?"**

## 관측된 갭 목록 (스토리에 사실대로 기재 — 별도 결정 대상)

- S4: 필터 URL이 히스토리를 남기지 않아 뒤로가기로 이전 필터 복귀 불가 / 잘못된 `?tag=` 값에 전용 안내 없음 / 하이드레이션 전 전체 목록 깜빡임
- S5: 언어 전환 시 쿼리스트링·해시 미유지
- S14: 404가 항상 한국어이며 공통 레이아웃 밖
- S2·S7: heading 앵커 키보드 도달 불가, 진행률바 `aria-hidden` (UG4 판정 범위 밖 — 가정 A7)
- S9: `Top 5 인기 글` 라벨과 실제 정렬 기준(최신순) 불일치 (PRD RK1·A5와 동일 건)
- S1: 필터 결과 0건일 때 빈 상태 문구 없음
- S18: 검색엔진 소유권 확인 메타 태그 — 설정 값은 `site.test.ts`가 지키지만 **배포 산출물 HTML 검증은 여전히 게이트 없음** (RK9 부분 해소)
- S19: `public/blog-assets` 동기화가 gitignore된 파생물이라 깨져도 diff에 흔적 없음 (RK10) — **`assets.test.ts`로 게이트 신설(2026-08-03)**. category 값 예외 1건은 `도구`로 수정해 해소
