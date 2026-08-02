# CLAUDE.md

이 파일은 이 저장소에서 코드 작업을 할 때 Claude Code(claude.ai/code)에 지침을 제공합니다.

## 콘텐츠 규약

- `contents/blog/YYYY/MM/*.md` - 연/월별로 구성된 블로그 포스트
- 영문 번역본은 `slug.en.md` 컨벤션. 번역본이 없으면 한국어 원문으로 폴백
- `data/popular.json` - GA4 조회수 스냅샷(최근 90일, ko/en 합산). 커밋되며 빌드 시 읽는다.
  `.github/workflows/refresh-popular.yml`(매일 03:00 KST)이 갱신하고, 없거나 비어 있으면 최신순 폴백

## 비표준 명령어

나머지 명령어(dev/build/lint/typecheck/test/e2e/deploy)는 `package.json`의 scripts 참고.

```bash
# GA4 조회수 → data/popular.json 갱신 (인기 글 Top 5 정렬 기준)
# GA_PROPERTY_ID / GA_SERVICE_ACCOUNT_KEY 환경변수 필요. 평소엔 CI 크론이 실행한다.
pnpm fetch:popular
```

## 정적 익스포트 / 배포 특이사항

- GitHub Pages 사용자 사이트(https://seungahhong.github.io)라 basePath 불필요
- `public/.nojekyll`로 `_next` 디렉토리가 Jekyll에 무시되지 않도록 함
- 정적 익스포트 제약 때문에 태그 페이지는 per-tag 정적 라우트 대신 쿼리 기반 클라이언트 필터 사용(한글 디렉토리명 익스포트 리스크 회피)
- `pnpm deploy`는 `out/` 정적 익스포트를 `main` 브랜치에 배포한다
