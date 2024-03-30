---
layout: post
title: Tree Shaking
date: 2023-08-16
published: 2023-08-16
category: 개발
tags: ['performance']
comments: true,
thumbnail: './assets/16/thumbnail.jpeg'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

## 개요

나무를 흔들어 잔가지를 털어내듯 **불필요한 코드를 제거**하는 최적화 작업

- Webpack 4버전 이상을 사용하는 경우에는 ES6 모듈을 대상으로 기본적인 트리쉐이킹을 제공한다.(`import`, `export`를 사용하는 모듈)
- Create React App을 통해 만든 React 애플리케이션도 Webpack을 사용하고 있기 때문에 트리쉐이킹이 가능하다.

```tsx
// Import all the array utilities!
import arrayUtils from 'array-utils';

// import 문을 사용하여 ES6 모듈의 특정 부분만을 가져오는 방법을 사용
// Import only some of the utilities!
import { unique, implode, explode } from 'array-utils';
```

## **Tree Shaking 설정**

[webpack 공식 문서](https://v4.webpack.js.org/guides/tree-shaking)를 확인해보면 tree shaking 설정을 위해 해 줘야 되는 행동은 4가지가 있습니다.

- ES6 모듈 포맷 사용 (ex, import / export)
- commonjs로 컴파일되는 것 방지하기 (@babel/preset-env 설정 등을 이용)
- package.json에 sideEffects 속성 사용
- webpack production mode 사용

# **React Tree Shaking**

## **내보낼 모듈에 대해서는 export 하기**

- 내보낼 모듈에 대해서는 각각 export 하고 필요로한 컴포넌트에 import 할 경우 tree shaking이 가능합니다.
  - 그렇다면 궁금한 점?? re-export 구문으로 설정되어 있는 경우에도 tree shaking이 가능할까?
  - 결론은 됩니다. 그 이유는?? webpack 4 이후부터는 production 빌드 시 optimization 설정 중 providedExports 기본값이 true로 설정됨에 따라서 webpack 빌드 시 구문을 분석해서 최적화 처리를 해줍니다.

```tsx
// TreeShaking
export { default as Test1 } from './Test1';
export { default as Test2 } from './Test2';

// App.tsx
import * as TreeShaking from './TreeShaking';
import { Test1 } from './TreeShaking';
// Test1만 사용할 경우라도 tree shaking 처리해줌.

function App() {
  return (
    <div>
      {/* <TreeShaking.Test1></TreeShaking.Test1> */}
      <Test1></Test1>
    </div>
  );
}
```

## **Babelrc 파일 설정하기**

Babel은 JavaScript 문법을 **구 버전 브라우저에서도 호환**이 가능하도록 **ES5 문법으로 변환해주는 라이브러리**로써, 웹 어플리케이션에 꼭 필요한 필수 도구입니다. 단, 트랜스파일링 진행 시 사용되는 **[babel-preset-env](https://babeljs.io/docs/plugins/preset-env/)** 패키지 사용 시 es6 문법을 자동으로 commonjs 변환해서 트리쉐이킹 처리를 불가능하게 됩니다.

이를 방지하기 위해서 `.babelrc`에서 `commonjs`로 변환하지 못하도록 설정을 추가해 줘야 합니다.

```tsx
{
  "presets": [
    ["env", {
      "modules": false
    }]
  ]
}

// modules 값을 false로 설정하면 ES5 문법으로 변환하는 것을 막고,
// 반대로 true로 설정하면 항상 ES5 문법으로 변환한다.

```

## **sideEffects 설정하기**

Webpack은 **사이드 이펙트를 일으킬 수 있는 코드**의 경우, **사용하지 않는 코드라도 트리쉐이킹에서 제외**시킨다.

`package.json` 파일에서 `sideEffects`를 설정하여, 애플리케이션 전체에서 사이드 이펙트가 발생하지 않을 것이니 트리쉐이킹을 해도 된다고 Webpack 알려주는 용도

`package.json`에 추가하고 싶지 않으면, `module.rules`를 활용하여 설정할 수 있다.]

[Allow app authors to force libraries into sideEffects: false` · Issue #6065 · webpack/webpack](https://github.com/webpack/webpack/issues/6065#issuecomment-351060570)

단, css-loader 사용하거나 직접 js에서 import로 파일을 가져올 경우 필요한 정보도 빠지는 경우가 생김으로 꼭 sideeffects 배열에 추가해주도록 한다.

```tsx
// package.json
{
  "name": "tree-shaking",
  "version": "1.0.0",
  "sideEffects": false
}

// 특정 파일에서는 사이드 이펙트가 발생하지 않도록 설정할 경우
// package.json
{
  "name": "tree-shaking",
  "version": "1.0.0",
  "sideEffects": ["./src/components/index.js"]
}

// webpack 설정(module.rolues 사용)
module.exports = {
  module: {
    rules: [
      {
		    include: path.resolve("node_modules", "lodash"),
		    sideEffects: false
				// sideEffects: ["./src/some-side-effectful-file.js", "*.css", "*.scss"]]
		  }
    ],
  },
};

```

## **ES6 문법을 사용하는 모듈 사용**

Webpack이 ES Module로 의존성을 관리하는 모듈만 Tree Shaking 기능이 지원됨으로, ES5/CommonJS 스펙을 가진 라이브러리 사용 시 TreeShaking이 미지원 된다.

성능 최적화 진행 시 매번 거론되는 lodash, lodash-es에 대해서 비교해보겠습니다.

- lodash-es: [pick.js](https://github.com/lodash/lodash/blob/master/pick.js)
  - ES Module 사용(export, import 사용), sideEffects: false
- lodash: [pick.js](https://github.com/lodash/lodash/blob/4.17.11-npm/pick.js), [package.json](https://github.com/lodash/lodash/blob/4.17.11-npm/package.json)
  - CommonJS 사용

```tsx
// lodash/pick.js

//// lodash-es
import basePick from './.internal/basePick.js';

function pick(object, ...paths) {
  return object == null ? {} : basePick(object, paths);
}

export default pick;

//// lodash
var basePick = require('./_basePick'),
  flatRest = require('./_flatRest');

var pick = flatRest(function (object, paths) {
  return object == null ? {} : basePick(object, paths);
});

module.exports = pick;
```

```
// package.json
//// lodash-es
{
  "name": "lodash",
  ...
  "sideEffects": false,
  ...
}

//// lodash
// sideEffects 속성 미적용(왜?? CommonJS 지원하고 있기에 sideEffects 적용해도 TreeShaking이 지원되지 않는다)

```

# **참고페이지**

[React Import 사용시 Tree Shaking 에 주의하자](https://velog.io/@exafe1009/React-Import-사용시-Tree-Shaking-에-주의하자)

[Webpack 4의 Tree Shaking에 대한 이해](https://huns.me/development/2265)

[🍃 트리 쉐이킹 (Tree Shaking)](https://velog.io/@wlwl99/트리-쉐이킹-Tree-Shaking)

[[React] Tree Shaking으로 최적화하기](https://jforj.tistory.com/166)
