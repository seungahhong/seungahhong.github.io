---
layout: post
title: 이번 주 패키지 릴리스 정리 — 2026-11-16
date: 2026-11-16
published: 2026-11-16
category: 주간 릴리스
tags: []
comments: true
thumbnail: './assets/16/thumbnail.png'
github: ''
---

## ✍️ 한 줄 요약

Grafana 12.4.15가 이전 유지보수 라인에 CVE 8건 보안 수정을 내보냈고, FastAPI 0.163.0은 의존성마다 동시 실행 수를 제한하는 `Depends(max_concurrency=...)`를 추가했습니다.

## 이번 주 한눈에 보기

기간은 2026-11-09 ~ 2026-11-16(KST)입니다. 직전 글(2026-11-14)과 기간이 대부분 겹치기 때문에, 그 글에서 이미 다룬 버전은 다시 넣지 않고 그 뒤에 새로 확인한 릴리스만 정리했습니다. 그 결과 추적 중인 87개 패키지 가운데 4개의 새 변경점을 확인했습니다.

이번 주도 GitHub 릴리스 페이지를 읽을 수 없어, CHANGELOG나 저장소 안 릴리스 노트가 있는 패키지는 그 파일을 읽었습니다. React Native Skia는 릴리스 노트가 없어 새 태그까지의 변경 이력(커밋 제목)을 읽고 정리했으며, `릴리스 공지`를 `없음`으로 표시했고 breaking change(기존 코드를 고쳐야 하는 변경) 여부는 확인하지 못했습니다.

| 패키지 | 버전 | 릴리스 공지 | 변경점 |
|---|---|---|---|
| FastAPI | 0.163.1 · 0.163.0 | [있음](https://github.com/fastapi/fastapi/blob/master/docs/en/docs/release-notes.md) | `Depends(max_concurrency=...)` 추가, OpenAPI 계산 필드 수정 |
| Grafana | 12.4.15 | [있음](https://github.com/grafana/grafana/blob/main/CHANGELOG.md) | 12.4 라인 보안 수정 CVE 8건 |
| Biome | v2.6.8 | [있음](https://github.com/biomejs/biome/blob/main/packages/@biomejs/biome/CHANGELOG.md) | nursery 규칙 대거 추가, 타입 추론·린트 성능 개선 |
| React Native Skia | v3.10.2 · v2.15.5 · v2.15.4 · v2.15.3 | 없음 | 프레임 페이싱·`<Text>` 렌더 개선, 2.x 백포트 |

## 패키지별 변경 내용

### FastAPI 0.163.1 · 0.163.0

Python 웹 프레임워크입니다.

**무엇이 바뀌었나** — 0.163.0은 `Depends(max_concurrency=...)`를 추가해, 특정 의존성이 동시에 몇 개까지 실행될 수 있는지 제한할 수 있게 했습니다. 외부 API나 DB 연결처럼 한꺼번에 몰리면 곤란한 자원을 의존성으로 감싸 쓰고 있다면 별도 세마포어 코드 없이 동시 실행 수를 묶을 수 있습니다. 0.163.1은 응답 모델 안에 중첩된 계산 필드(computed field)가 있을 때 OpenAPI 문서가 잘못 만들어지던 문제를 고쳤습니다.

**업그레이드할 때 확인할 점** — 새 옵션은 쓰는 곳에만 영향을 주는 추가 기능입니다. 직전 글에서 다룬 0.162.6의 Python 3.10 지원 중단은 이 버전에도 그대로 적용되니, 아직 3.10이라면 Python부터 올려야 합니다.

릴리스 공지: [release-notes](https://github.com/fastapi/fastapi/blob/master/docs/en/docs/release-notes.md)

### Grafana 12.4.15

메트릭 대시보드입니다.

**무엇이 바뀌었나** — 직전 글에서 다룬 13.x 라인과 같은 날 나온 12.4 유지보수 라인 릴리스로, CVE-2026-102589, CVE-2026-106472, CVE-2026-106475, CVE-2026-107365, CVE-2026-107509, CVE-2026-111000, CVE-2026-81843, CVE-2026-82014 보안 수정 8건을 담았습니다. CHANGELOG에는 번호만 있고 무엇이 위험했는지는 적혀 있지 않습니다. 2026년 시간대 변경을 반영하도록 moment-timezone도 올렸습니다.

**업그레이드할 때 확인할 점** — 아직 12.4 라인을 운영 중이라면 12.4.15로 올리세요. 각 CVE의 영향 범위는 공식 보안 공지로 확인해야 합니다.

릴리스 공지: [CHANGELOG](https://github.com/grafana/grafana/blob/main/CHANGELOG.md)

### Biome v2.6.8

프론트엔드 툴체인(포매터·린터)입니다.

**무엇이 바뀌었나** — `noBufferConstructor`, `noDynamicRequire`, `noMisusedSpread`, `useSpyOn`, `noTailwindRestrictedClasses`와 Vue·YAML용 규칙 등 nursery(실험 단계) 규칙이 대거 추가됐습니다. 타입 추론이 `typeof`·동등 비교 뒤의 타입 좁히기와 `T extends U ? X : Y` 같은 조건부 타입을 계산하게 돼, 타입 정보를 쓰는 규칙의 오탐이 줄어듭니다. 억제 주석이 없는 파일의 린트는 최대 61% 빨라졌고, HTML 포매터가 주석을 두 번 찍거나 Svelte 블록 뒤 주석을 지우던 문제 등 여러 버그가 고쳐졌습니다.

**업그레이드할 때 확인할 점** — 새 규칙은 nursery라 켜지 않으면 영향이 없습니다. 다만 GritQL 플러그인 파일 이름에 쓸 수 없는 문자가 있으면 이제 오류가 나니, 플러그인을 쓴다면 파일 이름을 확인하세요.

릴리스 공지: [CHANGELOG](https://github.com/biomejs/biome/blob/main/packages/@biomejs/biome/CHANGELOG.md)

### React Native Skia v3.10.2 · v2.15.5 · v2.15.4 · v2.15.3

React Native용 2D 그래픽 라이브러리입니다.

**무엇이 바뀌었나** — 변경 이력상 v3.10.2는 캔버스의 프레임을 하나의 스케줄러로 맞춰 그리고 Android에서 GPU용 화면 표시를 붙잡아 두도록 고쳤으며, `<Text>`를 캐시된 텍스트 블롭으로 그리고 iOS의 CAMetalLayer 색 공간 지정을 메인 스레드로 옮겼습니다. 2.x 라인(v2.15.3~v2.15.5)은 3.x의 수정 사항을 백포트한 릴리스로, 웹 개선, iOS 캔버스 크기 반올림, Android TextureView 버퍼 처리, 폐기된 캔버스의 프레임 유지 등이 들어갔습니다.

**업그레이드할 때 확인할 점** — 변경 이력만 읽은 정리라 breaking change 여부는 확인하지 못했습니다. 아직 2.x를 쓰고 있다면 같은 메이저 안의 v2.15.5로 올려 수정 사항을 받을 수 있습니다.

릴리스 공지: 없음

## 마무리

변경점을 읽지 못해 본문에서 뺀 릴리스 3건(생략)은 Istio 1.32.0, Flutter 3.50.0, Obsidian v1.15.1로, 직전 글에서와 같은 이유(저장소 안에서 읽을 수 있는 변경 설명이 없거나 변경 이력으로 내용을 정리할 수 없음)입니다.

확인 실패 11개는 세션 네트워크에서 호스트가 막혀(`getaddrinfo ENOTFOUND`) 읽지 못한 공식 사이트 기반 소스입니다. Expo SDK, GraalVM, JDK, Android, Boundary, Cursor, GitButler, Manus, Swift, Ubuntu, Xcode입니다.

확인 방식: npm/PyPI/git 태그 기반 (GitHub 릴리스 본문 미접근)
