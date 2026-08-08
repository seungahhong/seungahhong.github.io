# 인수조건 카탈로그 — 홍승아 기술 블로그 (as-is 회귀 기준)

> **문서 성격**: `user-stories.md`의 스토리 20건에 흩어져 있는 수용기준 **120개**를 안정 ID(`AC-n.m`)로 추출한 참조용 카탈로그다. 내용의 원본(single source of truth)은 `user-stories.md`이며, 이 문서는 **ID·추적·게이트 상태를 위한 색인**이다. 문구가 어긋나면 `user-stories.md`가 우선한다.
> **기준 시점**: 2026-08-03 / **기준 리비전**: `develop` @ `269db294`
> **용도**: QA 인계, 테스트 계층화(방법론×계층 배치), 회귀 판정, 게이트 공백 식별.
>
> **갱신 이력**
> - 2026-08-02 최초 작성 — 120개 AC 추출, 게이트 공백 식별
> - **2026-08-03 게이트 반영** — test-layering 작업으로 Unit 4·Integration 10·E2E 11 스펙을 추가·재작성했다. 79개 행의 판정 수단·상태를 실제 매핑으로 갱신했고, "판정 수단 없음"이 **31건(26%) → 12건(10%)** 으로 줄었다.

## 표기 규약

**ID**: `AC-{스토리번호}.{스토리 내 순번}` — 스토리 S7의 세 번째 수용기준은 `AC-7.3`. **번호는 재배열하지 않는다** — 항목이 삭제되면 결번으로 남기고, 추가는 뒤에 붙인다. 참조 안정성이 조밀한 번호보다 중요하다.

**판정 수단** 열의 값과 그 의미:

| 값 | 의미 |
|---|---|
| `자동(계층): {파일}` | 해당 스펙이 이 AC를 자동 검증한다. 2026-08-03 갱신분은 **AC-ID를 테스트 제목에 직접 박아 넣고 작성한 것**이라 매핑이 추정이 아니다(`grep 'AC-3.8' -r src e2e`로 확인 가능). 그 이전부터 있던 항목 중 파일 단위로만 대응하는 것은 계층 표기 없이 `자동: {파일}`로 남겼다 |
| `게이트 없음` | 이 조건을 검증하는 자동 테스트가 저장소에 없음이 **확인된** 항목 |
| `수동` | 사람이 브라우저·콘솔·저장소를 직접 확인해야 판정 가능 |
| `저장소 실측` | 파일 카운트·grep 등 명령 한 줄로 판정 가능 |

**상태** 열의 값:

| 값 | 의미 |
|---|---|
| `충족` | 기준 리비전에서 참으로 관측됨 |
| `부분충족` | 조건부로만 참이거나, 라벨과 실제가 어긋남 |
| `게이트 공백` | 조건 자체는 참이나 이를 지키는 자동 검증이 없음 |
| `재현 불가` | 현재 데이터·환경에서 전제 조건에 도달할 수 없음 |
| `미검증` | 이 문서 작성 시 실행·확인하지 않음(숫자·판정을 발명하지 않기 위해 명시) |
| `관측된 갭` | 의도한 동작이 아니지만 현재 이렇게 동작함이 사실로 기록된 항목 |

**커버**: 이 AC가 근거가 되는 PRD 요구 식별자.

---

## S1 — 글 목록 최신순 열람 (covers R1)

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-1.1 | Given 배포된 상태 / When `/ko/posts/` 진입 / Then 게시일 내림차순, 동일 게시일은 제목 오름차순 | R1 | 자동(E2E): `navigation.test.ts` | 충족 |
| AC-1.2 | Given `/ko/posts/` / When 카드 하나를 봄 / Then 카테고리·제목·발췌·태그·읽기 시간(`N분`) 표시 | R1 | 자동(E2E): `navigation.test.ts` | 충족 |
| AC-1.3 | Given `/en/posts/` / When 목록을 엶 / Then 동일 편수 카드가 영어 라벨(`Posts` / `N min read`)로 표시 | R1 | 자동(E2E): `i18n.test.ts` | 충족 |
| AC-1.4 | Given 홈(`/ko/`) / When 진입 / Then "최근 글" 영역 + "전체 보기 →" 링크가 `/ko/posts/`로 이동 | R1 | 자동(E2E): `navigation.test.ts` | 충족 |
| AC-1.5 | Given 목록 카드 클릭 / When 이동 완료 / Then `/{로케일}/posts/{slug}/` 상세 표시 | R1 | 자동(E2E): `navigation.test.ts` | 충족 |
| AC-1.6 | **(도달성)** Given 사이트맵의 모든 글 상세 URL / When 각각 요청 / Then 전부 200이며 not-found 화면이 아님 | R1 | 자동(E2E): `seo.test.ts` | 충족 |
| AC-1.7 | **(빈 상태)** Given `/ko/posts/?category=존재하지않는값` / When 진입 / Then 목록이 비어 보이고 전용 빈 상태 문구 없음 | R1 | 자동(Integration): `PostsExplorer.test.tsx` | 관측된 갭(기대로 고정) |

## S2 — 본문 렌더 품질 (covers R2)

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-2.1 | Given 코드블록 포함 글 / When 본문을 봄 / Then 코드블록 내부에 서로 다른 `--shiki-light`/`--shiki-dark` 값을 가진 `<span>`이 2개 이상 (shiki는 inline `color`가 아니라 CSS 변수로 라이트·다크 색을 함께 싣는다) | R2 | 자동(E2E): `post.test.ts` | 충족 |
| AC-2.2 | Given GFM 문법(표·체크리스트·취소선) 포함 글 / When 본문을 봄 / Then 원문 기호가 아니라 렌더된 표·목록 | R2 | 자동(E2E): `post.test.ts` · 자동(Unit): `markdown` | 충족 |
| AC-2.3 | Given 본문 heading / When 마우스를 올림 / Then `#` 앵커가 나타나고 클릭 시 URL 끝에 `#슬러그` 부착 | R2 | 자동(E2E): `post.test.ts` | 충족 |
| AC-2.4 | Given 동일 제목 heading 2개 이상 / When 각 앵커 클릭 / Then 서로 다른 `#슬러그`(중복 시 접미사)로 이동 | R2 | 자동(E2E): `post.test.ts` | 충족 |
| AC-2.5 | **(접근성 경계)** Given 키보드만 사용 / When Tab으로 순회 / Then heading 앵커에 포커스가 도달하지 않음(hover 전용) | R2 | 게이트 없음 · 수동 | 관측된 갭 (UG4 판정 범위 밖 — 가정 A7) |

## S3 — ⌘K 검색 팔레트 (covers R3)

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-3.1 | Given 임의 페이지 / When `⌘K`(`Ctrl+K`) / Then 팔레트가 열리고 입력창 포커스, 플레이스홀더 `포스트, 태그 검색…`(en: `Search posts, tags…`) | R3 | 자동(Integration): `SearchProvider.test.tsx` · 자동(E2E): `search.test.ts` | 충족 |
| AC-3.2 | Given 팔레트 열림 / When `⌘K` 재입력 / Then 닫힘 | R3 | 자동(Integration): `SearchProvider.test.tsx` | 충족 |
| AC-3.3 | Given 팔레트 열림 / When `Esc` / Then 닫히고 포커스가 열기 직전 요소로 복귀 | R3 | 자동(Integration): `SearchDialog.test.tsx` | 충족 |
| AC-3.4 | Given 팔레트 열린 직후 입력 비어 있음 / When 결과 영역을 봄 / Then 결과 최대 8건(최소 길이 조건 없음) | R3 | 자동(Integration): `SearchDialog.test.tsx` | 충족 |
| AC-3.5 | Given 매칭 9건 이상인 검색어 / When 입력 / Then 결과가 8건을 넘지 않음 | R3 | 자동(Integration): `SearchDialog.test.tsx` | 충족 |
| AC-3.6 | Given 제목이 검색어로 시작하는 글 vs 발췌만 매칭된 글 / When 검색 / Then 제목 시작 글이 위에 표시 | R3 | 자동(Integration): `SearchDialog.test.tsx` | 충족 |
| AC-3.7 | Given 결과 항목 / When 항목을 봄 / Then 카테고리 칩·게시일·제목 표시, 태그 있으면 `#태그` 병기 | R3 | 자동(Integration): `SearchDialog.test.tsx` | 충족 |
| AC-3.8 | Given 결과 표시됨 / When `↓`/`↑` 이동 후 `Enter` / Then `/{로케일}/posts/{slug}`로 이동하고 팔레트 닫힘 | R3 | 자동(Integration): `SearchDialog.test.tsx` | 충족 |
| AC-3.9 | **(빈 상태)** Given 매칭 0건 문자열 / When 입력 / Then `검색 결과가 없습니다.`(en: `No results found.`) | R3 | 자동(Integration): `SearchDialog.test.tsx` · 자동(E2E): `search.test.ts` | 충족 |
| AC-3.10 | Given 데스크톱 폭 / When 헤더 검색 버튼(또는 사이드바 검색 박스) 클릭 / Then 동일 팔레트가 열림 | R3 | 자동(E2E): `search.test.ts` | 충족 |

## S4 — 카테고리·태그 필터와 URL 상태 (covers R4, NFR3)

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-4.1 | Given `/ko/tags/` / When 태그 칩 클릭 / Then `?tag={태그}`로 바뀌고 제목이 `#{태그}`, `N개의 글`(en: `N posts`) 표시 | R4 | 자동(Integration): `TagsExplorer.test.tsx` · 자동(E2E): `filters.test.ts` | 충족 |
| AC-4.2 | Given 태그 활성 / When 같은 칩 재클릭 / Then `?tag=` 제거되고 전체 목록 | R4 | 자동(Integration): `TagsExplorer.test.tsx` | 충족 |
| AC-4.3 | Given 태그 활성 / When `필터 해제`(en: `Clear filter`) 클릭 / Then 필터 해제 | R4 | 자동(Integration): `TagsExplorer.test.tsx` | 충족 |
| AC-4.4 | Given `?tag={유효 태그}` URL / When 새 탭 진입 또는 새로고침 / Then 필터된 목록 복원 | R4 | 자동(Integration): `TagsExplorer.test.tsx` | 충족 |
| AC-4.5 | Given `/ko/posts/` / When 카테고리 칩 클릭 / Then `?category=`로 바뀌고 `전체`(en: `All`)로 해제 가능, 활성 칩에 `aria-pressed` | R4 | 자동(Integration): `PostsExplorer.test.tsx` · 자동(E2E): `filters.test.ts` | 충족 |
| AC-4.6 | **(NFR3)** Given `/ko/tags/React` 같은 per-tag 경로 / When 직접 진입 / Then 정적 경로가 없어 404 표시 | NFR3 | 자동(E2E): `filters.test.ts` | 충족 |
| AC-4.7 | **(잘못된 값)** Given `?tag=존재하지않는값` / When 진입 / Then 전체 목록이 표시되고 `필터 해제`·안내 문구 없음 | R4 | 자동(Integration): `TagsExplorer.test.tsx` | 관측된 갭(기대로 고정) |
| AC-4.8 | **(로딩 중)** Given `?tag=` URL / When 새로 로드 / Then 하이드레이션 전 전체 목록이 잠시 보인 뒤 필터 적용 | R4 | 게이트 없음 · 수동 | 관측된 갭 |
| AC-4.9 | **(히스토리)** Given 태그 A → B 클릭 / When 뒤로가기 / Then 태그 A 상태로 돌아가지 않음 | R4 | 자동(Integration): `TagsExplorer.test.tsx` | 관측된 갭(기대로 고정) |

## S5 — 언어 전환 시 경로 유지 (covers R5)

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-5.1 | Given `/ko/posts/{slug}/` / When `EN` 클릭 / Then `/en/posts/{slug}/`로 이동, 같은 글의 영어 화면 | R5 | 자동(Integration): `LanguageSwitcher.test.tsx` · 자동(E2E): `i18n.test.ts` | 충족 |
| AC-5.2 | Given `/en/about/` / When `KO` 클릭 / Then `/ko/about/`로 이동 | R5 | 자동(Integration): `LanguageSwitcher.test.tsx` · 자동(E2E): `i18n.test.ts` | 충족 |
| AC-5.3 | Given 현재 로케일 `ko` / When `KO` 클릭 / Then 화면 불변(활성 버튼 `aria-pressed=true`) | R5 | 자동(Integration): `LanguageSwitcher.test.tsx` | 충족 |
| AC-5.4 | Given 언어 전환 직후 / When 뒤로가기 / Then 전환 전 언어의 같은 경로로 복귀 | R5 | 게이트 없음 · 수동 | 미검증 |
| AC-5.5 | **(경계)** Given `/ko/tags/?tag=React` / When `EN` 클릭 / Then `/en/tags/`로 이동하며 `?tag=` 미유지 | R5 | 자동(Integration): `LanguageSwitcher.test.tsx` | 관측된 갭(기대로 고정) |
| AC-5.6 | **(경계)** Given `/ko/posts/{slug}/#섹션` / When `EN` 클릭 / Then 해시 미유지, 글 최상단 표시 | R5 | 자동(Integration): `LanguageSwitcher.test.tsx` | 관측된 갭(기대로 고정) |

## S6 — 번역 폴백 + 안내 문구 (covers R6, NFR6)

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-6.1 | Given 기준 리비전 / When `find contents/blog -name '*.md' \| wc -l` 및 `-name '*.en.md'` 실행 / Then 각각 142, 71 (원문:번역 = 71:71) | NFR6 | 자동(Unit): `content-conventions.test.ts` | 충족 |
| AC-6.2 | Given 커버리지 100% / When `/en` 임의 글 상세 / Then 폴백 안내 박스 미표시 | R6 | 자동(E2E): `i18n.test.ts` | 충족 |
| AC-6.3 | **(폴백 발동)** Given `slug.en.md` 없음 / When `/en/posts/{slug}/` / Then 한국어 본문 + `This article is currently shown in its original Korean.` 박스 | R6 | 게이트 없음 | **재현 불가** — 커버리지 100%라 전제에 도달 불가. 판정하려면 `.en.md`를 임시 제거한 로컬 빌드 필요 |
| AC-6.4 | **(폴백 발동)** Given 동일 상황 / When `/ko/posts/{slug}/` / Then 안내 박스 미표시 | R6 | 게이트 없음 | **재현 불가**(AC-6.3과 동일 사유) |

## S7 — 읽기 보조 (covers R7)

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-7.1 | Given 데스크톱 폭(lg 이상) 글 상세 / When 화면을 봄 / Then 우측 `목차`(en: `Contents`) 컬럼이 sticky | R7 | 자동(Integration): `Toc.test.tsx` · 자동(E2E): `post.test.ts` | 충족 |
| AC-7.2 | Given 목차 표시됨 / When 항목 클릭 / Then URL 끝에 `#슬러그` 부착 + 해당 위치로 이동 | R7 | 자동(Integration): `Toc.test.tsx` | 충족 |
| AC-7.3 | Given 스크롤 / When heading이 뷰포트 상단 도달 / Then 목차 활성 항목이 그 섹션으로 변경. **정확한 IntersectionObserver 임계는 판정 범위 밖** | R7 | 자동(Integration): `Toc.test.tsx`(콜백 주입) | 충족 — 임계값은 판정 범위 밖 |
| AC-7.4 | Given 글 상세 / When 아래로 스크롤 / Then 최상단 진행률 막대가 좌→우로 길어짐 | R7 | 자동(Integration): `ReadingProgress.test.tsx` | 충족 |
| AC-7.5 | Given 글 상세 / When 본문 하단 / Then `이전 글`(en: `Previous`)·`다음 글`(en: `Next`) 영역이 제목과 함께 표시 | R7 | 자동(E2E): `post.test.ts` | 충족 |
| AC-7.6 | **(경계)** Given 가장 최신 글 / When 본문 하단 / Then 없는 쪽 자리는 카드 없이 비고 반대쪽은 제자리 | R7 | 게이트 없음 · 수동 | 미검증 |
| AC-7.7 | **(경계)** Given heading이 없는 글 / When 상세를 엶 / Then 목차 영역 미렌더 | R7 | 자동(Integration): `Toc.test.tsx` | 충족 |
| AC-7.8 | Given 글 상세 / When 제목 위 / Then `홈 / 포스트 / {카테고리} / {제목}` 브레드크럼, 마지막 항목에 `aria-current="page"` | R7 | 자동(E2E): `post.test.ts` | 충족 |
| AC-7.9 | Given 글 헤더 / When 메타 줄 / Then 작성자·게시일 + 읽기 시간(`N분` / `N min read`) | R7 | 자동(E2E): `post.test.ts` | 충족 |
| AC-7.10 | **(접근성)** Given 스크린리더 / When 페이지를 읽음 / Then 진행률 막대는 `aria-hidden`이라 읽히지 않음 | R7 | 자동(Integration): `ReadingProgress.test.tsx` | 관측된 갭(기대로 고정) |

## S8 — 테마 전환·유지 (covers R8)

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-8.1 | Given 임의 페이지 / When `테마 전환`(en: `Toggle theme`) 클릭 / Then `<html>`의 `data-theme`이 직전과 다른 값(`light`\|`dark`)으로 변경 | R8 | 자동(Integration): `ThemeToggle.test.tsx` · 자동(E2E): `theme.test.ts` | 충족 |
| AC-8.2 | Given 전환 직후 / When 새로고침 / Then `data-theme`이 전환 직후 값 유지 | R8 | 자동(E2E): `theme.test.ts` | 충족 |
| AC-8.3 | **(첫 방문)** Given 저장된 선택 없음 + OS 다크 모드 / When 첫 진입 / Then `data-theme="dark"` | R8 | 자동(E2E): `theme.test.ts` | 충족 |

## S9 — 인기 글 Top 5 (covers R9, NFR2) — **부분충족**

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-9.1 | Given `data/popular.json`이 `{updatedAt: null, rangeDays: 90, items: []}` / When 홈 사이드바 `Top 5 인기 글`(en: `Top 5 popular`) 위젯 / Then 항목 5개가 최신 글 5편과 같은 순서로 표시되고 조회수 숫자 없음 | R9 | 자동(Integration): `Sidebar.test.tsx` | 부분충족(현재 실제 동작) |
| AC-9.2 | Given 위 상태 / When 위젯 제목을 읽음 / Then 제목은 `Top 5 인기 글`이나 실제 정렬 기준은 최신순 | R9 | 자동(Integration): `Sidebar.test.tsx` | 관측된 갭(기대로 고정) |
| AC-9.3 | **(NFR2)** Given 네트워크 차단 환경 / When `pnpm build` / Then exit 0으로 성공, 빌드 로그에 네트워크 오류 없음 | NFR2 | 수동 | 미검증(차단 환경 재현 필요) |
| AC-9.4 | **(충족 조건)** Given `updatedAt ≠ null` 이고 `items` 비어 있지 않음 / When 배포 후 사이드바 / Then 조회수 내림차순 정렬 + compact 조회수(예: `1.2K 조회`) 표시, 최신 5편과 순서 다름 | R9 | 자동(Integration): `Sidebar.test.tsx` · 자동(Unit): `site.test.ts` | 렌더 경로 충족 / 데이터 미달성 |
| AC-9.5 | **(부분 데이터)** Given 조회수 잡힌 글 5편 미만 / When 위젯 / Then 부족분은 최신순으로 채워지고 그 항목엔 조회수 미표시 | R9 | 자동(Integration): `Sidebar.test.tsx` · 자동(Unit): `popular` | 충족 |
| AC-9.6 | **(빈 상태)** Given 발행 글 0편 / When 홈 / Then 인기 글 위젯 섹션 자체 미렌더 | R9 | 자동(Integration): `Sidebar.test.tsx` · 자동(Unit): `popular` | 충족 |

## S10 — 검색엔진·AI 크롤러 판독 (covers R10, R11)

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-10.1 | Given 배포된 사이트 / When `/sitemap.xml` / Then 홈·`/posts`·`/tags`·`/about` 4개 섹션 + 전체 글 상세가 ko·en 두 로케일 분량 절대 URL(후행 슬래시)로 포함 | R10 | 자동(E2E): `seo.test.ts` | 충족 |
| AC-10.2 | Given `/sitemap.xml` / When 모든 `<loc>` 수집 / Then 전부 `/`로 끝남 | R10 | 자동(E2E): `seo.test.ts` | 충족 |
| AC-10.3 | Given 사이트맵의 각 URL / When canonical `href` 확인 / Then 절대 URL이며 대응 `<loc>`과 **문자 단위 동일** | R10 | 자동(E2E): `seo.test.ts` · 자동(Unit): `routes` | 충족 |
| AC-10.4 | Given `/ko/posts/{slug}/` HTML / When `<head>` / Then canonical + `hreflang="ko"`·`"en"`·`"x-default"` 대체 링크 존재 | R10 | 자동(E2E): `seo.test.ts` · 자동(Unit): `routes` | 충족 |
| AC-10.5 | Given 임의 페이지 HTML / When OG 메타 / Then `og:image`가 `/og/{ko\|en}.png`(실측 1200×630)를 가리키고 `twitter:card`가 `summary_large_image`이며 **이미지 URL이 200 응답** | R10 | 자동(Unit): `metadata.test.ts`·`site.test.ts`(경로·크기·카드) / **200 응답은 게이트 없음** | 부분 게이트 |
| AC-10.6 | Given 각 화면 HTML / When `application/ld+json` 수집 / Then 홈 `WebSite`·`Blog`, `/posts`·`/tags` `CollectionPage`, `/about` `ProfilePage`·`FAQPage`, 상세 `BlogPosting`, 상세·섹션 `BreadcrumbList` → **최상위 `@type` 7종**(중첩 타입 제외) | R10 | 자동(Unit): `jsonld.test.ts` | 충족 |
| AC-10.7 | Given 배포된 사이트 / When `/robots.txt` / Then `User-agent: *`에 `Allow: /`, AI 크롤러 **22종** 명시 허용, `Disallow` 없음 | R11 | 저장소 실측(`robots.ts` `AI_CRAWLERS`) | 충족(이름까지 일치 확인) |
| AC-10.8 | Given `/robots.txt` / When 파일 끝 / Then `Sitemap:` 줄이 `/sitemap.xml` 절대 URL을 가리킴 | R11 | 저장소 실측 | 충족 |

## S11 — About 접점 (covers R12)

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-11.1 | Given `/ko/about/` / When 상단 / Then 프로필 이미지·이름·한 줄 소개 표시 | R12 | 자동(E2E): `about.test.ts` | 충족 |
| AC-11.2 | Given `/ko/about/` / When `관심 기술`(en: `Skills`) / Then 그룹 8개(언어 / 프레임워크·런타임 / 상태관리·데이터 / 빌드·툴링 / 테스트 / 스타일링 / AI·LLM / 기타) + 각 그룹 항목 칩 | R12 | 자동(E2E): `about.test.ts` | 충족 |
| AC-11.3 | Given `/ko/about/` / When `링크`(en: `Links`) / Then GitHub·Portfolio·LinkedIn·Notion·Email 5개, Email은 `mailto:`, 나머지는 새 탭 | R12 | 자동(E2E): `about.test.ts` | 충족 |
| AC-11.4 | Given `/ko/about/` / When `자주 묻는 질문` / Then 글 편수 자리에 **71**, 시작 연도 자리에 **2020** 표시 | R12 | 자동(E2E): `about.test.ts` | 충족 |
| AC-11.5 | Given `/en/about/` / When 화면 / Then 동일 구성이 영어 라벨(`Intro`·`Skills`·`Links`·`Frequently asked questions`)로 표시 | R12 | 자동(E2E): `about.test.ts` | 충족 |

## S12 — 본문 건너뛰기·접근성 (covers R13, NFR5)

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-12.1 | Given 페이지 첫 로드 / When `Tab` 1회 / Then `본문으로 건너뛰기`(en: `Skip to content`) 링크가 좌상단에 보이며 포커스 획득 | R13 | 자동(E2E): `navigation.test.ts` | 충족 |
| AC-12.2 | Given 해당 링크 포커스 / When `Enter` / Then `id="main-content"`인 `<main>`으로 이동 | R13 | 자동(E2E): `navigation.test.ts` | 충족 |
| AC-12.3 | Given 포커스가 링크를 벗어남 / When 화면 / Then 링크가 다시 숨김 상태로 복귀 | R13 | 게이트 없음 · 수동 | 미검증 |
| AC-12.4 | **(NFR5)** Given `/ko/`, `/ko/posts/`, `/ko/tags/`, `/ko/about/`, `/ko/posts/2026-07-05-meta-harness/` / When axe를 `wcag2a`·`wcag2aa`·`wcag21a`·`wcag21aa`로 실행 / Then `serious`·`critical` 위반 0건 | NFR5 | 자동(E2E): `a11y.test.ts` | 충족 |
| AC-12.5 | **(판정 범위)** Given 위 결과 / When 나머지 위반 / Then `moderate`·`minor`는 합·불에 미포함. **axe가 못 잡는 hover 전용 상호작용도 범위 밖**(예외 2건: AC-2.5, AC-7.10) | NFR5 | — (범위 선언) | 선언 |

## S13 — 루트 진입 (covers R14)

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-13.1 | Given 브라우저 / When 루트 `/` 진입 / Then `/ko/`로 이동 | R14 | 자동(Integration): `RootPage.test.tsx` · 자동(E2E): `i18n.test.ts` | 충족 |
| AC-13.2 | **(JS 비활성)** Given JS 비활성 브라우저 / When `/` 진입 / Then `<meta http-equiv="refresh" content="0; url=/ko/">`로 이동 | R14 | 자동(Integration): `RootPage.test.tsx` | 충족 |
| AC-13.3 | **(폴백)** Given 자동 이동 불가 환경 / When `/` 화면 / Then `/ko/`로 가는 텍스트 링크로 수동 이동 가능 | R14 | 자동(Integration): `RootPage.test.tsx` | 충족 |
| AC-13.4 | Given `/` HTML / When robots 메타 / Then `noindex, nofollow` 지정 | R14 | 자동(Integration): `RootPage.test.tsx` | 충족 |

## S14 — 404 화면 (covers R15)

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-14.1 | Given 존재하지 않는 경로 / When 진입 / Then `404` 표기 + `페이지를 찾을 수 없습니다` + `요청하신 페이지가 존재하지 않거나 이동되었습니다.` | R15 | 자동(E2E): `navigation.test.ts` | 충족 |
| AC-14.2 | Given 404 화면 / When 링크 클릭 / Then `홈으로 돌아가기`가 `/ko`로 이동 | R15 | 자동(E2E): `navigation.test.ts` | 충족 |
| AC-14.3 | **(로케일 경계)** Given `/en/` 하위 없는 경로 / When 진입 / Then 문구가 영어가 아닌 한국어, 이동 링크도 `/ko`만 | R15 | 게이트 없음 · 수동 | 관측된 갭 |
| AC-14.4 | **(레이아웃 경계)** Given 404 화면 / When 전체 / Then 공통 헤더·푸터·검색 진입점 미표시 | R15 | 게이트 없음 · 수동 | 관측된 갭 |
| AC-14.5 | **(오탐 방지)** Given 실제 존재하는 글 상세 URL / When 진입 / Then 404 화면이 표시되지 않음 | R15 | 자동(E2E): `seo.test.ts` | 충족 |

## S15 — GA4 스냅샷 자동 갱신 (covers R16) — **부분충족**

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-15.1 | Given `refresh-popular.yml` / When 스케줄 확인 / Then `0 18 * * *`(UTC) = 매일 03:00 KST + `workflow_dispatch` 가능 | R16 | 저장소 실측 | 충족 |
| AC-15.2 | Given 실행 후 `data/popular.json`이 직전과 동일 / When 로그 / Then 커밋·PR 스텝 모두 건너뜀 | R16 | 게이트 없음 · 수동(Actions 로그) | 미검증 |
| AC-15.3 | Given 실행 후 파일 변경됨 / When 로그·저장소 / Then `data/popular.json`만 담긴 커밋이 `develop`에 푸시되고 `master` 대상 PR 생성 | R16 | 게이트 없음 · 수동 | 미검증 |
| AC-15.4 | **(중복 방지)** Given `develop → master` 열린 PR 존재 / When 변경 감지 / Then 새 PR 생성 없이 종료 | R16 | 저장소 실측(워크플로 스크립트) | 충족 |
| AC-15.5 | **(현재 상태)** Given 기준 리비전 / When `data/popular.json` / Then `updatedAt: null`, `items: []` — 최근 성공 갱신이 관측되지 않음 | R16 | 저장소 실측 | **부분충족**(RK1) |
| AC-15.6 | **(충족 조건)** Given `GA_PROPERTY_ID`·`GA_SERVICE_ACCOUNT_KEY`·`ACCESS_TOKEN` 유효 / When 수동 실행 / Then 성공하고 `updatedAt ≠ null`, `items` 비어 있지 않음 | R16 | 수동 | **미검증** — 시크릿 유효성 미확인 |

## S16 — 정적 산출물·빌드 재현성·툴체인 (covers NFR1, NFR2, NFR8)

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-16.1 | Given 저장소 / When `next.config.ts` / Then `output: 'export'`, `images.unoptimized: true`, `trailingSlash: true`이고 `basePath` 미설정 | NFR1 | 저장소 실측 | 충족 |
| AC-16.2 | Given `pnpm build` 후 / When `out/` / Then `.html`·정적 자산만 존재, 서버 진입점(`server.js`, `.next/server`) 없음, `.nojekyll` 포함 | NFR1 | 게이트 없음 · 수동 | 미검증 |
| AC-16.3 | **(NFR2 전역)** Given 네트워크 차단 환경 / When `pnpm build` / Then exit 0으로 성공 | NFR2 | 수동 | 미검증 |
| AC-16.4 | Given `package.json` / When 버전 고정 / Then `packageManager: pnpm@10.33.0`, `engines.node: >=20.9.0` | NFR8 | 저장소 실측 | 충족 |
| AC-16.5 | Given `.github/workflows/` / When Node 설정 / Then 두 워크플로 모두 Node 20 + `--frozen-lockfile` | NFR8 | 저장소 실측 | 충족 |

## S17 — 배포 게이트·회귀 안전망 (covers NFR4, NFR10)

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-17.1 | Given `deploy.yml` / When 잡 스텝 **내 실행 명령** 확인 / Then `pnpm lint` → `pnpm typecheck` → `pnpm test` → `pnpm build` → `pnpm e2e` 순(lint·typecheck는 `Lint & typecheck` 한 스텝 안), E2E 앞에 `Install Playwright browser` 스텝, 발행은 그 뒤 | NFR4 | 저장소 실측 | 충족 |
| AC-17.2 | Given 5단계 중 하나 실패 / When 실행 결과 / Then 발행 스텝 미도달, `gh-pages` 미갱신 | NFR4 | 저장소 실측(잡 의존) | 충족 |
| AC-17.3 | Given 5단계 모두 통과 / When 발행 스텝 / Then `out/`이 `gh-pages`로 발행 | NFR4 | 저장소 실측 | 충족 |
| AC-17.4 | **(판정 명령 병기)** Given 저장소 / When `ls e2e/playwright/*.test.ts \| wc -l` / Then **11**(a11y·about·analytics·assets·filters·i18n·navigation·post·search·seo·theme). When `grep -chE '^[[:space:]]*test\(' e2e/playwright/*.test.ts` 합 / Then **56**, a11y 1건이 5페이지로 확장되어 **실행 60건** | NFR10 | 저장소 실측 | 충족(2026-08-03 실측) |
| AC-17.5 | Given 저장소 / When `find src -name '*.test.*' \| wc -l` / Then **20**(lib 11 + 컴포넌트 9). `scripts/` 1건을 더하면 21파일·190케이스 | NFR10 | 저장소 실측 | 충족(2026-08-03 실측) |
| AC-17.6 | Given 기준 리비전 / When `pnpm e2e` 실행 / Then 31건 전량 통과 | NFR10 | 수동(실행 완료 2026-08-03) | 충족 — 60건 전량 통과 |

## S18 — 계측 자산 생존 (covers NFR7) — **부분충족**

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-18.1 | Given 배포 산출물 / When `analytics` E2E 실행 / Then DOM의 gtag 로더 `?id=`와 인라인 `config` 값에서 실제 측정 ID 추출 | NFR7 | 자동: `analytics.test.ts` | 충족 |
| AC-18.2 | Given 추출된 측정 ID / When `https://www.googletagmanager.com/gtag/js?id={ID}` 실제 요청 / Then 응답이 `404`가 아니며, `200`이면 `content-type`에 `javascript` 포함 | NFR7 | 자동: `analytics.test.ts` | 충족 |
| AC-18.3 | **(실패 조건)** Given 측정 ID 삭제로 `404` / When 게이트 실행 / Then 테스트 실패 → 배포 중단 | NFR7 | 자동: `analytics.test.ts` | 충족 |
| AC-18.4 | **(외부 장애 경계)** Given 응답 `429`/`5xx` 또는 요청 실패 / When 게이트 실행 / Then skip 처리되어 배포를 막지 않음. **이 결과는 "확인됨"이 아니라 "미확인"이며 SM4 ④의 충족 근거로 쓰지 않음** | NFR7 | 자동: `analytics.test.ts` | 관측된 사실 (가정 A8) |
| AC-18.5 | Given `location.hostname`이 `seungahhong.github.io`가 아님 / When 페이지를 엶 / Then `googletagmanager.com`·`www.google-analytics.com`으로의 요청이 브라우저 네트워크 기록 기준 0건 | NFR7 | 자동(E2E): `analytics.test.ts` | 충족 |
| AC-18.6 | Given 배포 산출물 임의 페이지 HTML / When `<head>` / Then `name="google-site-verification"`·`name="naver-site-verification"` 메타가 각 1개씩 존재하고 `content`가 비어 있지 않음 | NFR7 | 자동(Unit): `site.test.ts`(설정 값) · **배포 산출물 HTML 검증은 여전히 게이트 없음** | 부분 게이트 — RK9 일부 해소 |

## S19 — 콘텐츠 규약 (covers NFR9)

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-19.1 | Given `contents/blog/YYYY/MM/{slug}.md` 추가 / When 빌드 후 목록 / Then 게시일 위치대로 나타나고 `/ko/posts/{slug}/` 생성 | NFR9 | 자동: Vitest `posts.test.ts` | 충족 |
| AC-19.2 | Given 같은 위치에 `{slug}.en.md` 추가 / When `/en/posts/{slug}/` / Then 영어 본문 렌더 + 폴백 안내 미표시 | NFR9 | 자동: Vitest `posts.test.ts` | 충족 |
| AC-19.3 | **(상세까지 확인)** Given 파일명에 `.0`·`+` 등 특수 표기(`2025-06-29-vite6.0.md`, `2020-02-17-c-c++.md`) / When 목록과 상세 / Then 로케일로 오인되지 않고, **`/ko/posts/{slug}/`가 not-found가 아닌 실제 본문(제목 일치)으로 200 응답** | NFR9 | 자동: `seo.test.ts` · Vitest `routes.test.ts` | 충족 (`269db294`에서 확보) |
| AC-19.4 | Given `contents/blog/**/assets/` 하위 파일 / When 목록 / Then 글 목록에 미포함 | NFR9 | 자동: Vitest `posts.test.ts` | 충족 |
| AC-19.5 | **(서빙 관점)** Given `assets/` 아래 이미지를 참조하는 글 / When 빌드 후 상세 / Then 이미지 `src`가 `/blog-assets/...`로 치환되어 200 로드 | NFR9 | 자동(E2E): `assets.test.ts` | 충족 — RK10 해소 |
| AC-19.6 | **(경로 형식)** Given `contents/blog/아무곳/x.md` / When 빌드 후 목록 / Then **그 글도 포함됨** — 수집 대상은 `contents/blog` 하위 `.md` 전체, `assets/`·비-`.md`만 제외. `YYYY/MM/`는 코드가 강제하지 않는 관례 | NFR9 | 저장소 실측(`deriveSlugAndLocale`) | 충족(실제 동작 기준 확정) |
| AC-19.7 | **(값 규약)** Given 한국어 원문 전체 / When `category` 집계 / Then 로케일 표기 집합(ko: `개발`·`문서`)에 속해야 함 | NFR9 | 자동(Unit): `content-conventions.test.ts` | 충족 — ko `tools`→`도구` 수정으로 해소 |

## S20 — 1인 운영 전제 (covers NFR11)

| ID | 조건·행동·결과 | 커버 | 판정 수단 | 상태 |
|---|---|---|---|---|
| AC-20.1 | Given 배포된 사이트 모든 화면 / When 화면 / Then 댓글 입력창·구독 폼·로그인 등 입력 수집·응대 요구 UI가 없음 | NFR11 | 게이트 없음 · 수동 | 충족 |
| AC-20.2 | Given 사이트 / When 사용자 접점 확인 / Then 외부 연락 경로는 About의 정적 링크뿐이며 사이트 내 저장 없음 | NFR11 | 게이트 없음 · 수동 | 충족 |
| AC-20.3 | **(잔존 자산)** Given 프론트매터에 `comments` 필드 존재 / When 렌더된 화면 / Then 이를 사용하는 UI가 없어 화면에 영향 없음(사문화) | NFR11 | 저장소 실측(grep 미사용 확인) | 충족(관측된 사실. RK5) |

> **결번 없음.** 직전 판 S20의 4번째 수용기준("모더레이션 필요 기능은 도입 전 별도 판단으로 이월")은 제품 관찰로 판정 불가한 프로세스 약속이라 AC로 채번하지 않고 PRD 가정 **A9** 및 §7 인계 사항으로 이관했다.

---

## 집계

### 요구별 AC 분포

| 요구 | AC | 개수 |
|---|---|---|
| R1 | AC-1.1 ~ AC-1.7 | 7 |
| R2 | AC-2.1 ~ AC-2.5 | 5 |
| R3 | AC-3.1 ~ AC-3.10 | 10 |
| R4 | AC-4.1 ~ AC-4.5, AC-4.7 ~ AC-4.9 | 8 |
| R5 | AC-5.1 ~ AC-5.6 | 6 |
| R6 | AC-6.2 ~ AC-6.4 | 3 |
| R7 | AC-7.1 ~ AC-7.10 | 10 |
| R8 | AC-8.1 ~ AC-8.3 | 3 |
| R9 | AC-9.1, AC-9.2, AC-9.4 ~ AC-9.6 | 5 |
| R10 | AC-10.1 ~ AC-10.6 | 6 |
| R11 | AC-10.7, AC-10.8 | 2 |
| R12 | AC-11.1 ~ AC-11.5 | 5 |
| R13 | AC-12.1 ~ AC-12.3 | 3 |
| R14 | AC-13.1 ~ AC-13.4 | 4 |
| R15 | AC-14.1 ~ AC-14.5 | 5 |
| R16 | AC-15.1 ~ AC-15.6 | 6 |
| NFR1 | AC-16.1, AC-16.2 | 2 |
| NFR2 | AC-9.3, AC-16.3 | 2 |
| NFR3 | AC-4.6 | 1 |
| NFR4 | AC-17.1 ~ AC-17.3 | 3 |
| NFR5 | AC-12.4, AC-12.5 | 2 |
| NFR6 | AC-6.1 | 1 |
| NFR7 | AC-18.1 ~ AC-18.6 | 6 |
| NFR8 | AC-16.4, AC-16.5 | 2 |
| NFR9 | AC-19.1 ~ AC-19.7 | 7 |
| NFR10 | AC-17.4 ~ AC-17.6 | 3 |
| NFR11 | AC-20.1 ~ AC-20.3 | 3 |

**총 120건. 미커버 요구 0건** — R1~R16·NFR1~NFR11 전부가 최소 1개 AC를 가진다.

### 게이트 공백 — 2026-08-03 처리 결과

| AC | 이전 상태 | 현재 |
|---|---|---|
| **AC-19.5** 이미지 동기화 | 게이트 없음(RK10) | **해소** — `assets.test.ts`가 `/blog-assets/` 치환과 200 로드를 검증 |
| **AC-19.7** category 표기 규약 | 미충족 1건(ko `tools`) | **해소** — 콘텐츠를 `도구`로 수정, 집합을 ko {개발·문서·도구} / en {Development·Docs·Tools}로 확정 |
| **AC-18.6** 소유권 확인 메타 | 게이트 없음(RK9) | **부분 해소** — `site.test.ts`가 설정 값(존재·비어있지 않음·자리표시자 아님)을 지킨다. **배포 산출물 HTML에 실제로 태그가 실렸는지는 여전히 게이트 없음** |
| **AC-10.5** OG 이미지 | 200 응답 미검증 | **부분 게이트** — 경로·크기(1200×630)·`summary_large_image`는 `metadata.test.ts`가 지킨다. 이미지 URL 200 응답은 여전히 게이트 없음 |
| **AC-9.2 / AC-9.4** 인기 글 | 라벨↔실제 불일치 | **미해소(의도)** — 렌더 경로는 `Sidebar.test.tsx`가 양쪽(폴백·충족) 다 고정했으나, `data/popular.json`이 비어 있는 상태 자체는 M2의 몫이다 |
| **AC-15.5 / AC-15.6** 크론 갱신 | 미검증 | **미해소** — 시크릿 유효성 확인이 필요하고 저장소 밖 작업이다 |

### 판정 수단이 없는 AC (수동·미검증) — 12건

`AC-2.5`(heading 앵커 hover 전용) · `AC-4.8`(하이드레이션 깜빡임) · `AC-5.4`(전환 후 뒤로가기) · `AC-7.6`(이전/다음 한쪽 없음) · `AC-9.3`·`AC-16.3`(네트워크 차단 빌드) · `AC-12.3`(스킵 링크 재숨김) · `AC-14.3`·`AC-14.4`(404 로케일·레이아웃) · `AC-15.2`·`AC-15.3`(워크플로 분기) · `AC-16.2`(`out/` 구성)

**12건 = 전체의 10%** (이전 31건 26%). 남은 것들은 성격이 갈린다 — `AC-4.8`·`AC-12.3`처럼 **타이밍·포커스 전환이라 관찰 비용이 큰 것**, `AC-9.3`·`AC-16.2`처럼 **빌드 환경을 통제해야 하는 것**, `AC-15.2`·`AC-15.3`처럼 **GitHub Actions 실행이 있어야 판정되는 것**. 앞의 둘은 자동화 여지가 있고, 마지막은 저장소 밖이다.

### 재현 불가 AC

`AC-6.3` · `AC-6.4` — 번역 커버리지가 100%라 폴백 경로의 전제에 도달할 수 없다. 판정하려면 `.en.md`를 임시 제거한 로컬 빌드가 필요하다. **커버리지가 깨지는 순간 이 두 AC가 안전망으로 발동하므로, 재현 불가가 곧 무의미를 뜻하지는 않는다.**

### 실행 검증 완료

`AC-17.6`(E2E 전량 통과)은 2026-08-03에 실제로 실행해 **60건 전량 통과**를 확인했다 — 더 이상 미검증이 아니다. `@e2e-live` 레시피(`pnpm test:e2e:live`)도 실행해 GA4 측정 ID 생존을 확인했다(`AC-18.2`).

---

## 이 문서를 쓰는 방법

- **회귀 판정**: 변경 후 영향받는 요구(R#/NFR#)를 찾고 → 요구별 AC 분포표에서 해당 AC를 꺼내 → 판정 수단대로 확인한다.
- **테스트 계획 인계**: "판정 수단이 없는 AC" 31건이 자동화 대상 후보다. 계층 배치는 별도 절차(`/test-layering-harness` 등)의 몫이다.
- **문구 수정**: 이 문서가 아니라 `user-stories.md`를 고치고 여기 반영한다. 원본은 스토리 문서다.
- **ID 유지**: 항목을 지울 때 번호를 당기지 않는다. 결번으로 남긴다.
