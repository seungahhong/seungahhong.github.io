---
layout: post
title: 미사용 의존성 제거
date: 2024-03-17
published: 2024-03-17
category: 개발
tags: ['performance']
comments: true
thumbnail: './assets/17/thumbnail.png'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# npm-check

## Installization

```tsx
npm install -g npm-check

npm-check
```

## 일괄 업데이트

```tsx
npm - check - u;
```

# yarn autoclean

## yarn autoclean 설명

- 패키지 종속성에서 불필요한 파일을 정리하고 제거(빌드와 상관없는 파일)

## yarn autoclean 명령어

```
// -I/--init
// .yarnclean파일이 없으면 생성하고 기본 항목을 추가합니다. 그런 다음 이 파일을 검토하고 편집하여 정리할 파일을 사용자 정의

yarn autoclean --init
```

## autoclean 활성화 조건

- yarn install
- yarn add
- yarn autoclean --force

## 기존 node_modules에서 autoclean 활성화 진행 시

- yarn autoclean --init
- yarn autoclean --force

# yarn-deduplicate

## yarn-deduplicate 설명

- yarn.lock 중복되는 패키지 제거/병합을 위한 명령어

## Installization

```tsx
yarn global add yarn-deduplicate

npx yarn-deduplicate yarn.lock
```

# 미사용 의존성 코드 제거 및 제한

- 사용하지 않는 패키지에 대한 삭제/제한을 두기 위해서 검색해서 삭제하거나 eslint 규칙으로 추가해서 추가 시 에러가 발생하도록 처리
  - rg 패키지: [https://github.com/BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep)

```tsx
// 명령어를 통한 전체 삭제
// rg 패키지를 사용하여 아래 명령어를 날려보자.
rg '(require\(|from\s+)(?:"|\')moment'

// eslint rules 추가
"no-restricted-imports": [
    "error",
    {
        name: "moment",
        message:
            "moment has been deprecated. use date-fns instead.",
    },
],
```

# 패키지 크기 조사 - 큰 용량 위주로 사용하지 않는 패키지 삭제

### 의존성 분석

- 전체 node_modules 크기 조사

```
du -sh node_modules
```

- 패키지별 분석

```
du -sh ./node_modules/* | sort -nr | grep '\dM.*'
```

## webpack-bundle-analyzer

```
# NPM
npm install --save-dev webpack-bundle-analyzer
# Yarn
yarn add -D webpack-bundle-analyzer

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```

# 참고페이지

- [자바스크립트 의존성 관리자(npm, yarn, pnpm)에서 보다 더 의존성 관리 잘하는 방법](https://yceffort.kr/2021/07/javascript-dependency-manager-dont-mange-dependencies)
