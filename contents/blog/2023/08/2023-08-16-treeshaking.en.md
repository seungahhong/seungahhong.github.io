---
layout: post
title: Tree Shaking
date: 2023-08-16
published: 2023-08-16
category: Development
tags: ['performance']
comments: true,
thumbnail: './assets/16/thumbnail.jpeg'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

## Overview

An optimization technique that **removes unnecessary code**, much like shaking a tree to knock off its dead branches.

- When using Webpack version 4 or higher, basic tree shaking is provided out of the box for ES6 modules (modules that use `import` and `export`).
- React applications created with Create React App also use Webpack, so tree shaking is possible there as well.

```tsx
// Import all the array utilities!
import arrayUtils from 'array-utils';

// import 문을 사용하여 ES6 모듈의 특정 부분만을 가져오는 방법을 사용
// Import only some of the utilities!
import { unique, implode, explode } from 'array-utils';
```

## **Tree Shaking Configuration**

If you check the [webpack official documentation](https://v4.webpack.js.org/guides/tree-shaking), there are four things you need to do to set up tree shaking.

- Use the ES6 module format (e.g., import / export)
- Prevent compilation to CommonJS (using settings such as @babel/preset-env)
- Use the sideEffects property in package.json
- Use webpack production mode

# **React Tree Shaking**

## **Export the modules you want to expose**

- If you export each module you want to expose individually and import it into the components that need it, tree shaking becomes possible.
  - A natural question: does tree shaking still work when things are configured using re-export syntax?
  - The conclusion is yes, it does. Why? Because starting from webpack 4, the `providedExports` optimization setting defaults to `true` during production builds, so webpack analyzes the syntax at build time and applies optimizations.

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

## **Configuring the Babelrc file**

Babel is a **library that transpiles JavaScript syntax into ES5 syntax** so that it remains **compatible even with older browsers**, and it is an essential tool for web applications. However, when the **[babel-preset-env](https://babeljs.io/docs/plugins/preset-env/)** package is used during transpilation, it automatically converts ES6 syntax to CommonJS, which makes tree shaking impossible.

To prevent this, you need to add a setting in `.babelrc` that stops the conversion to `commonjs`.

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

## **Configuring sideEffects**

For **code that may cause side effects**, Webpack **excludes it from tree shaking even if it is unused**.

Setting `sideEffects` in the `package.json` file tells Webpack that no side effects will occur across the entire application, so it is safe to perform tree shaking.

If you would rather not add it to `package.json`, you can configure it using `module.rules`.]

[Allow app authors to force libraries into sideEffects: false` · Issue #6065 · webpack/webpack](https://github.com/webpack/webpack/issues/6065#issuecomment-351060570)

However, when using css-loader or importing files directly in JS, necessary information can sometimes be dropped, so be sure to add such files to the sideEffects array.

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

## **Using modules that use ES6 syntax**

Since Webpack only supports tree shaking for modules that manage dependencies as ES Modules, tree shaking is not supported when using libraries that follow the ES5/CommonJS spec.

Let me compare lodash and lodash-es, which always come up when optimizing performance.

- lodash-es: [pick.js](https://github.com/lodash/lodash/blob/master/pick.js)
  - Uses ES Modules (uses export, import), sideEffects: false
- lodash: [pick.js](https://github.com/lodash/lodash/blob/4.17.11-npm/pick.js), [package.json](https://github.com/lodash/lodash/blob/4.17.11-npm/package.json)
  - Uses CommonJS

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

# **References**

[Watch out for Tree Shaking when using React imports](https://velog.io/@exafe1009/React-Import-사용시-Tree-Shaking-에-주의하자)

[Understanding Tree Shaking in Webpack 4](https://huns.me/development/2265)

[🍃 Tree Shaking](https://velog.io/@wlwl99/트리-쉐이킹-Tree-Shaking)

[[React] Optimizing with Tree Shaking](https://jforj.tistory.com/166)
