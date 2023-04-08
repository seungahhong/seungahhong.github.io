---
layout: post
title: FE 개발 프로세스
date: 2023-01-01
published: 2023-01-01
category: 개발
tags: ['process']
comments: true,
thumbnail: './assets/01/thumbnail.png'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# 사전 작업

## 1. 기획 및 디자인 검토

- 와이어프레임 및 디자인 시안 검토
- 디자인 시안에 대한 공통 컴포넌트화 설계 및 공유
- 마케팅 수집 체크

## 2. API 검토 및 피드백

- API 인터페이스 검토 및 FE 피드백 전달
  - [https://sanghaklee.tistory.com/57](https://sanghaklee.tistory.com/57)

## 3. 개발 개요 작성

- 기획안, 와이어프레임, 디자인 시안, API 명세서, 일정(배포, QA), 담당자 정리
- 개발에 필요한 내용들에 대한 정리
  - 개발(업무) 목록, 메인브랜치, 개발 담당자

## 4. 도입 기술 검토

- 상태 관리, 개발 언어, 스토리북, 테스트
  - 개발언어
    - VanillaJS, Typescript, React
  - 상태관리
    - 클라이언트: Redux, Mobx, ContextAPI 등..
      - [https://material-debt-c1c.notion.site/FE-0bbd0e51f3784ee1b477515dd19d608b](https://www.notion.so/FE-0bbd0e51f3784ee1b477515dd19d608b)
    - 서버: React-query, SWR 등..
      - [https://material-debt-c1c.notion.site/FE-0bfcc3f53777429b9d713476ceeeefed](https://www.notion.so/FE-0bfcc3f53777429b9d713476ceeeefed)
  - 테스트
    - 단위 테스트, 통합 테스트
      - [https://seungahhong.github.io/blog/2022/07/2022-07-24-jest/](https://seungahhong.github.io/blog/2022/07/2022-07-24-jest/)
    - E2E 테스트
      - [https://seungahhong.github.io/blog/2022/08/2022-08-07-cypress/](https://seungahhong.github.io/blog/2022/08/2022-08-07-cypress/)
  - Storybook: [https://seungahhong.github.io/blog/2022/03/2022-03-19-storybook/](https://seungahhong.github.io/blog/2022/03/2022-03-19-storybook/)
  - MSW API 연동: [https://seungahhong.github.io/blog/2022/07/2022-07-25-msw/](https://seungahhong.github.io/blog/2022/07/2022-07-25-msw/)

## 5. 표준 지정

- 도입 기술 검토한 내용을 바탕으로 개발 표준 논의
  - 도입 기술에 대한 표준 지정
  - 개발 문서 정리
    - JSDoc, TSDoc
    - 협업을 위한 문서 정리: notion, wiki

## 6. 개발 일정 산정

- 설계안 작성
- 개선 업무
- 화면 컴포넌트 개발
  - 스토리북 단위 개발 일정
- API 연동작업
  - BE API 인터페이스 공유, MSW 연동
  - 실 API 배포 및 연동 일정
- 테스트
  - API, 상태관리, 화면 단위, 리액트 유닛테스트
  - e2e 테스트
- 실 개발
  - 개발 모듈/화면 별로 일정
  - 코드 리뷰/공유 일정
- 후속 작업
  - 성능 측정, 문서 정리 등
- 체크사항
  - 기획/디자인 완료 일정 체크
  - API 인터페이스, 실 API 배포 일정 체크
  - 작업 브랜치, 테스트 환경 체크
  - QA 일정 체크
  - → QA(2주 전) → FE(컴포넌트 개발) → BE API 연동(2주 전 완료) → FE(개발완료)

# 실 개발

## 1. 선행 개발

- 설계안 작성
  - 기획/디자인/BE 논의 후 프로젝트에 맞는 설계안 작성
    - 공통 컴포넌트 단위 설계안 작성: 기획/디자인에 공유 차원
  - 설계안 작성
    - gliffy, plantuml
  - 폴더 구조
- 개선 업무
  - 레거시 개선 업무
    - 복잡한 기존 업무 개선
  - 디자인/라이브러리 최신화
  - 최신 기술 반영(JS → TS 등..)
- 화면 컴포넌트 개발
  - 기획/디자이너와 협업을 위한 스토리북 단위 개발
  - 컴포넌트 단위, 화면 전체에 대한 스토리북 작성
- Mock API 개발
  - API 인터페이스를 바탕으로 한 모킹 API 개발
- 빌드 및 배포
  - 작업물에 대한 빌드 및 배포 프로세스 작업

## 2. 개발 진행

- 공통 컴포넌트 도출
  - 공통으로 사용 가능한 컴포넌트 부터 먼저 개발 진행
- 실 개발
  - 설계안을 바탕으로 한 개발
  - 스토리북(화면/공통 컴포넌트)
  - 테스트
    - 단위테스트, 통합테스트
    - e2e 테스트
  - 협업
    - 코드 리뷰
  - 성능 개선

# 후속작업

## 1. 개발 테스트

- 개발 코드 테스트
  - 서버 상태에 따른 테스트 환경 준비여부 체크(BE와 협업)
- 크로스 브라우징 테스트
  - [https://www.lambdatest.com/](https://www.lambdatest.com/)
  - [https://www.browserling.com/](https://www.browserling.com/)
  - IE, 크롬, 사파리, 오페라 등등
- 테스트 환경 배포
  - 서버와 영향범위가 겹칠 경우 백엔드 배포 이후에 FE 배포 진행
  - 코드나 화면이 겹치는 프로젝트가 있는경우 머지작업 진행(코드 충돌 해결)

## 2. QA 진행 및 배포

- QA 배포환경 공유 및 배포일자/시간 확인
- QA 완료일자 체크

## 3. 성능측정

- Lighthouse, WebPageTest, 웹 접근성 툴, 크롬 개발자 도구등을 통한 성능측정
  - 웹접근성, 라이트하우스, 로딩/반응성 시간측정, 렌더링 최적화 등
  - 개선 작업
    - 성능 개선: Lighthouse
      - FCP(First Content Paint)
      - SI(Speed Index)
      - LCP(Largest Contentful Paint)
      - TTI(Time to Interaction)
      - TBT(Total Blocking Time)
    - 웹접근성 개선
      - Lighthouse 웹접근성
      - 스토리북 addon: [https://storybook.js.org/addons/@storybook/addon-a11y](https://storybook.js.org/addons/@storybook/addon-a11y)
      - openwax: [https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=chae-yul&logNo=221187023938](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=chae-yul&logNo=221187023938)
    - 렌더링 최적화
      - React.memo, useMemo, useCallback

## 4. 개발 회고

- 좋았던 점, 아쉬웠던 점, 개선해야 할 점에 대한 개발 회고 진행

## 5. 문서 정리

- 산출물 기반 FE 표준 개선/제안/공유 (FE 도입)
- 공통 컴포넌트 도출 후 디자인 시스템에 이관 작업
- 개발 프로세스 수정 제안 작업(개발 진행 하면서 개발 프로세스에 아쉬운 점, 개선할 점 정리)

## 6. 후속과제

- 리팩토링/ 개발 이후 후속 과제 정리
