---
layout: post
title: Removing Unused Dependencies
date: 2024-03-17
published: 2024-03-17
category: Development
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

## Batch Update

```tsx
npm - check - u;
```

# yarn autoclean

## What is yarn autoclean

- Cleans up and removes unnecessary files from package dependencies (files unrelated to the build)

## yarn autoclean Commands

```
// -I/--init
// .yarnclean파일이 없으면 생성하고 기본 항목을 추가합니다. 그런 다음 이 파일을 검토하고 편집하여 정리할 파일을 사용자 정의

yarn autoclean --init
```

## Conditions That Trigger autoclean

- yarn install
- yarn add
- yarn autoclean --force

## Enabling autoclean on an Existing node_modules

- yarn autoclean --init
- yarn autoclean --force

# yarn-deduplicate

## What is yarn-deduplicate

- A command for removing/merging duplicate packages in yarn.lock

## Installization

```tsx
yarn global add yarn-deduplicate

npx yarn-deduplicate yarn.lock
```

# Removing and Restricting Unused Dependency Code

- To delete or restrict unused packages, search for and remove them, or add an eslint rule so that using them raises an error
  - rg package: [https://github.com/BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep)

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

# Investigating Package Sizes - Remove Unused Packages, Prioritizing Large Ones

### Dependency Analysis

- Investigate the total node_modules size

```
du -sh node_modules
```

- Per-package analysis

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

# References

- [How to manage dependencies better with JavaScript dependency managers (npm, yarn, pnpm)](https://yceffort.kr/2021/07/javascript-dependency-manager-dont-mange-dependencies)
