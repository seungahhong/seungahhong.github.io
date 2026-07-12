---
layout: post
title: TypeScript 7.0
date: 2026-07-14
published: 2026-07-14
category: 개발
tags: ['typescript']
comments: true
thumbnail: './assets/14/thumbnail.png'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# TypeScript 7.0 출시: Go로 다시 쓴 네이티브 컴파일러

TypeScript 7.0이 공식 출시되었습니다. 이번 메이저 버전의 핵심은 **컴파일러를 Go 언어로 완전히 다시 이식(native port)** 한 것입니다. 10년 넘게 JavaScript로 작성되어 온 `tsc`를 네이티브 코드로 옮기면서, 대규모 프로젝트에서 **8~12배 빠른 빌드**와 **최대 26% 낮은 메모리 사용량**을 달성했습니다. 기존 구현과의 타입 검사 호환성은 그대로 유지됩니다.

## 📋 목차

1. [배경: 왜 Go로 다시 썼나](#배경-왜-go로-다시-썼나)
2. [성과: 벤치마크 수치](#성과-벤치마크-수치)
3. [실제 도입 사례](#실제-도입-사례)
4. [병렬화 제어 플래그](#병렬화-제어-플래그)
5. [언어 및 동작 변경사항](#언어-및-동작-변경사항)
6. [TypeScript 6.0 전환 및 설정 변경](#typescript-60-전환-및-설정-변경)
7. [마이그레이션 가이드](#마이그레이션-가이드)
8. [에디터 및 툴링](#에디터-및-툴링)
9. [향후 로드맵](#향후-로드맵)

## 배경: 왜 Go로 다시 썼나

TypeScript는 그동안 JavaScript로 구현되어 왔습니다. 이 방식은 이식성과 생태계 통합 측면에서 장점이 컸지만, 대규모 코드베이스에서는 타입 검사와 빌드 속도가 점점 병목이 되었습니다. 팀은 **한 자릿수 배수가 아닌 order-of-magnitude(자릿수 단위) 성능 향상**을 목표로 컴파일러를 Go로 다시 이식하기로 결정했습니다.

이식은 "가능한 한 원본에 충실하게(as faithfully as possible)" 진행되었습니다. 즉, 기존 컴파일러의 구조와 로직을 그대로 보존하면서 다음과 같은 네이티브 언어의 이점을 얻는 방향입니다.

- **네이티브 코드 속도** — 컴파일된 Go 바이너리는 인터프리터 방식의 JavaScript보다 빠르게 실행됩니다.
- **공유 메모리 기반 멀티스레딩** — JavaScript의 단일 스레드 이벤트 루프 제약 없이 타입 검사와 파일 처리를 병렬화할 수 있습니다.
- **크로스 플랫폼 최적화** — Parcel의 C++ 파일 워처를 Go로 이식하여 플랫폼별 파일 감시 성능을 개선했습니다.

새로운 코드베이스임에도 Go 구현과 원본 구현 간의 결과는 일관되고 호환됩니다.

## 성과: 벤치마크 수치

### 빌드 시간

실제 오픈소스 코드베이스 기준으로 측정한 결과입니다.

| 프로젝트   | TS 6    | TS 7   | 개선 배수 |
| ---------- | ------- | ------ | --------- |
| VSCode     | 125.7초 | 10.6초 | 11.9x     |
| Sentry     | 139.8초 | 15.7초 | 8.9x      |
| Bluesky    | 24.3초  | 2.8초  | 8.7x      |
| Playwright | 12.8초  | 1.47초 | 8.7x      |
| Tldraw     | 11.2초  | 1.46초 | 7.7x      |

기본 설정에서 **8~12배** 빨라지며, `--checkers 8` 옵션을 적용하면 일부 프로젝트에서 **최대 16.7배**까지 향상됩니다.

### 메모리 사용량

빌드 시 총 메모리 사용량도 대체로 감소했습니다.

| 프로젝트   | TS 6  | TS 7  | 개선     |
| ---------- | ----- | ----- | -------- |
| VSCode     | 5.2GB | 4.2GB | -18%     |
| Sentry     | 4.9GB | 4.6GB | -6%      |
| Bluesky    | 1.8GB | 1.3GB | -26%     |
| Playwright | 1.0GB | 0.9GB | -11%     |
| Tldraw     | 0.6GB | 0.5GB | -15%     |

### 에디터 응답성

VSCode 코드베이스에서 에러가 있는 파일을 여는 시간이 약 **17.5초 → 1.3초 미만**으로, 13배 이상 빨라졌습니다. 언어 서버 안정성도 개선되어 **실패 명령 80% 감소**, **크래시 60% 감소**를 기록했습니다.

## 실제 도입 사례

TypeScript 7.0은 10년 이상 축적된 수만 개의 기존 테스트와 GitHub 상위 프로젝트에 대한 자동 회귀 검사를 거쳤고, 여러 대기업에서 실사용 검증을 마쳤습니다.

- **Slack** — 머지 큐 대기 시간 40% 단축, CI 타입 검사가 7.5분 → 1.25분으로 감소. 이전에는 언어 서버 부하로 로컬 타입 검사가 "거의 사용 불가능" 수준이었다고 합니다.
- **Vanta** — 주요 프로젝트에서 최대 9배 빠른 빌드.
- **Microsoft News Services** — CI 빌드 대기 시간이 월 약 400시간 절감.
- **Canva** — 언어 서비스 에러 감지가 약 58초 → 4.8초로 단축.
- **PowerBI** — 엔지니어들이 에디터 경험을 "생명을 구하는(life-saving)" 수준이라고 평가.

## 병렬화 제어 플래그

Go 이식의 가장 큰 이점 중 하나가 진짜 멀티스레딩입니다. 이를 제어하는 플래그가 추가되었습니다.

### `--checkers` — 타입 검사 병렬화

```bash
# 기본값은 4개의 타입 검사 워커
tsc --checkers 8
```

- 기본값: 4개 워커
- 1 ~ N까지 설정 가능 (값이 클수록 메모리 사용량 증가)
- 멀티코어 환경에서 큰 폭의 속도 향상

### `--builders` — 프로젝트 참조 병렬화

```bash
# 모노레포에서 프로젝트 참조 빌드를 병렬화
tsc --build --checkers 4 --builders 4
```

- `--build`(프로젝트 참조 빌드)와 함께 동작
- `--checkers`와 곱셈 효과 — 위 예시는 최대 16개의 타입 검사기가 동시에 실행됩니다.

### `--singleThreaded` — 단일 스레드 모드

```bash
tsc --singleThreaded
```

디버깅, TypeScript 6과의 성능 비교, 리소스가 제한된 환경에서 모든 병렬화를 비활성화합니다.

### 개선된 watch 모드

`--watch` 모드는 Parcel의 파일 워처를 Go로 이식하여 새로 구현되었습니다. Go 표준 라이브러리의 크로스 플랫폼 파일 감시 한계와 순수 폴링 방식의 오버헤드를 해소하여, 개발 사이클 중 리소스 소비를 크게 줄였습니다.

## 언어 및 동작 변경사항

### 유니코드 코드 포인트 보존

템플릿 리터럴 타입이 이제 유니코드 코드 포인트를 자연스럽게 보존합니다.

```typescript
type HeadTail<S> = S extends `${infer Head}${infer Tail}` ? [Head, Tail] : never;
type Result = HeadTail<'😀abc'>;
// 7.0:   ["😀", "abc"]
// 이전:  ["\ud83d", "\ude00abc"]
```

이로써 템플릿 리터럴 추론이 `for...of` 순회 및 스프레드 구문과 동일하게 동작합니다.

### JavaScript 지원 재정비

`.js` 파일 분석 방식이 `.ts` 파일과 일관되도록 정리되었습니다. 주요 변경점은 다음과 같습니다.

- 값(value)을 타입 자리에 사용할 수 없음 → `typeof`를 사용
- `@enum` 자동 인식 제거
- 단독 `?`를 타입으로 쓸 수 없음 → `any` 사용
- `@class`가 생성자를 만들지 않음
- 후위 `!`(non-null assertion) 미지원
- 타입 이름에 `@typedef` 태그 필요 (인접 배치 방식 폐지)
- 클로저 스타일 함수 구문 및 프로토타입 재할당 특수 처리 폐지

## TypeScript 6.0 전환 및 설정 변경

### 6.x와의 병행 실행

TypeScript 7.0은 출시 시점에 공개 API를 제공하지 않으며, API 지원은 **7.1**부터 제공됩니다. 그동안 typescript-eslint, Volar 등 프로그래밍 방식 API에 의존하는 도구를 위해 `@typescript/typescript6` 호환 패키지를 함께 제공하여 두 버전을 병행할 수 있습니다.

```json
{
  "devDependencies": {
    "typescript": "npm:@typescript/typescript6@^6.0.2"
  }
}
```

> 나이틀리 빌드는 `@typescript/native-preview`에서 표준 `typescript@next` 태그로 이동했습니다.

### 새로운 기본값 (6.0 계승)

TypeScript 7.0은 TypeScript 6.0에서 도입된 새 기본값을 그대로 채택합니다.

| 옵션                            | 기본값                     |
| ------------------------------- | -------------------------- |
| `strict`                        | `true`                     |
| `module`                        | `esnext`                   |
| `target`                        | 최신 안정 ECMAScript 버전  |
| `noUncheckedSideEffectImports`  | `true`                     |
| `stableTypeOrdering`            | `true` (변경 불가)         |
| `rootDir`                       | `./`                       |
| `types`                         | `[]` (명시적 선언 필요)    |

외부 `@types` 패키지를 사용하는 프로젝트는 이제 `tsconfig.json`에 명시적으로 선언해야 합니다.

### 제거된 기능 (이제 하드 에러)

- `target: es5` 미지원
- `downlevelIteration` 제거
- `moduleResolution: node / node10` 제거 → `nodenext` 또는 `bundler` 사용
- `moduleResolution: classic` 제거
- `module: amd / umd / system / none` 제거
- `baseUrl` 미지원 → `paths` 사용
- `esModuleInterop`, `allowSyntheticDefaultImports`는 반드시 `true`
- 네임스페이스 `module` 키워드 사용 금지
- import assert(`assert`)를 `with` 키워드로 대체
- `skipDefaultLibCheck`가 더 이상 `/// <reference no-default-lib />`를 존중하지 않음

## 마이그레이션 가이드

### 1단계: 설치

```bash
npm install -D typescript
npx tsc --version
```

### 2단계: tsconfig 점검

새 기본값에 맞춰 설정을 정리합니다. 특히 `types: []`가 기본이 되었으므로, 전역으로 사용하던 `@types` 패키지를 명시합니다.

```jsonc
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler", // node/node10 제거됨
    "esModuleInterop": true,
    "types": ["node"] // 이제 명시 필요
    // "baseUrl": "./",   // 제거 → paths 사용
    // "target": "es5",   // 미지원
  }
}
```

### 3단계: 병행 실행 준비 (에디터/툴링용)

Vue·Astro·Svelte 등 프로그래밍 방식 API에 의존하는 도구를 위해 6.0을 함께 설치합니다.

```json
{
  "devDependencies": {
    "typescript6": "npm:@typescript/typescript6@^6.0.2"
  }
}
```

CLI 타입 검사(`tsc`)는 TypeScript 7로, 에디터 지원은 TypeScript 6.0으로 유지하는 하이브리드 구성이 가능합니다.

### 4단계: 병렬화 옵션 튜닝

```bash
# 멀티코어 CI에서 워커 수 상향
tsc --checkers 8

# 모노레포 프로젝트 참조 빌드 병렬화
tsc --build --checkers 4 --builders 4
```

## 에디터 및 툴링

### VS Code

Visual Studio Marketplace에서 전용 **TypeScript 7 확장**을 설치할 수 있습니다. 설치 시 기본으로 활성화되며, 명령 팔레트에서 "Disable/Enable TypeScript 7 Language Server"로 전환할 수 있습니다.

### Visual Studio

최신 버전은 워크스페이스 설정에 따라 별도 조작 없이 TypeScript 7을 자동 활성화합니다.

### LSP 기반 언어 서버

새 언어 서버는 **LSP(Language Server Protocol)** 위에 구축되어 에디터 전반에서 멀티스레드 요청 처리가 가능합니다. 자동 import, 확장형 hover, inlay hint, code lens, go-to-source-definition, JSX 링크드 에디팅/태그 완성, 시맨틱 하이라이팅, import 정렬, 미사용 import 제거 등이 지원됩니다.

### 임베디드 언어의 한계

Vue, MDX, Astro, Svelte, Angular 템플릿은 아직 안정적인 프로그래밍 방식 API가 없어 TypeScript 7을 활용할 수 없습니다. Volar 등은 여전히 TypeScript 6.0에 의존하므로, **CLI는 TS 7 / 에디터는 TS 6.0** 조합을 권장합니다. 이 제약은 7.1의 API 지원으로 해소될 예정입니다.

## 향후 로드맵

7.0 출시로 팀은 다시 기능 개발에 집중합니다.

- **TypeScript 7.1** — 생태계를 위한 프로그래밍 방식 API 제공
- 3~4개월 주기의 정기 릴리스
- 성능 최적화 및 개발 편의성(ergonomics) 개선 지속

## 마무리

TypeScript 7.0은 단순한 기능 추가가 아니라, **컴파일러 실행 기반을 JavaScript에서 Go로 옮긴 근본적 전환**입니다. 8~12배 빠른 빌드와 낮은 메모리 사용량을 제공하면서도 타입 검사 호환성은 유지합니다.

**주요 체크리스트:**

- ✅ `npm install -D typescript`로 설치, `npx tsc --version` 확인
- ✅ `types: []` 기본값에 맞춰 `@types` 명시 선언
- ✅ 제거된 옵션 정리 (`es5`, `baseUrl`, `node/node10`, `classic` 등)
- ✅ 에디터·임베디드 언어 도구용으로 `@typescript/typescript6` 병행 설치
- ✅ 멀티코어 환경에서 `--checkers` / `--builders`로 병렬화 튜닝

자세한 내용은 [공식 발표 글](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)을 참조하세요.
