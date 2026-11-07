---
layout: post
title: ecmascript
date: 2023-08-15
published: 2023-08-15
category: JavaScript·웹
tags: ['javascript']
comments: true,
thumbnail: './assets/15/thumbnail.jpeg'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# ES2024(ES15)

**ES2024에 추가된 기능들**

[ECMAScript® 2024 Language Specification](https://tc39.es/ecma262/)

ECMAScript 2024, the 15th edition, added facilities for resizing and transferring ArrayBuffers and SharedArrayBuffers; added a new RegExp **`/v`** flag for creating RegExps with more advanced features for working with sets of strings; and introduced the **`Promise.withResolvers`** convenience method for constructing Promises, the **`Object.groupBy`** and **`Map.groupBy`** methods for aggregating data, the **`Atomics.waitAsync`** method for asynchronously waiting for a change to shared memory, and the **`String.prototype.isWellFormed`** and **`String.prototype.toWellFormed`** methods for checking and ensuring that strings contain only well-formed Unicode.

**Promise.withResolvers**

[tc39/proposal-promise-with-resolvers](https://github.com/tc39/proposal-promise-with-resolvers)

[Promise.withResolvers() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers)

Promise 확장 방법 중 하나로 새로운 `Promise` 인스턴스와 해당 Promise의 해결(resolve) 및 거부(reject) 함수를 반환합니다

```tsx
// Promise.withResolvers()다음 코드와 정확히 동일합니다
let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});

// 스트림을 비동기 반복 가능으로 변환
async function* readableToAsyncIterable(stream) {
  let { promise, resolve, reject } = Promise.withResolvers();
  stream.on('error', error => reject(error));
  stream.on('end', () => resolve());
  stream.on('readable', () => resolve());

  while (stream.readable) {
    await promise;
    let chunk;
    while ((chunk = stream.read())) {
      yield chunk;
    }
    ({ promise, resolve, reject } = Promise.withResolvers());
  }
}

// Promise가 아닌 생성자에서 withResolvers() 호출
class NotPromise {
  constructor(executor) {
    // The "resolve" and "reject" functions behave nothing like the native
    // promise's, but Promise.withResolvers() just returns them, as is.
    executor(
      value => console.log('Resolved', value),
      reason => console.log('Rejected', reason),
    );
  }
}

const { promise, resolve, reject } = Promise.withResolvers.call(NotPromise);
resolve('hello');
```

**proposal-array-grouping**

[tc39/proposal-array-grouping](https://github.com/tc39/proposal-array-grouping)

배열의 아이템을 객체/Map 형식으로 그룹화 해주는 함수

```tsx
const array = [1, 2, 3, 4, 5];

// `Object.groupBy` groups items by arbitrary key.
// In this case, we're grouping by even/odd keys
Object.groupBy(array, (num, index) => {
  return num % 2 === 0 ? 'even' : 'odd';
});
// =>  { odd: [1, 3, 5], even: [2, 4] }

// `Map.groupBy` returns items in a Map, and is useful for grouping
// using an object key.
const odd = { odd: true };
const even = { even: true };
Map.groupBy(array, (num, index) => {
  return num % 2 === 0 ? even : odd;
});
// =>  Map { {odd: true}: [1, 3, 5], {even: true}: [2, 4] }
```

**Atomics.waitAsync**

[tc39/proposal-atomics-wait-async](https://github.com/tc39/proposal-atomics-wait-async)

[Atomics.waitAsync() - JavaScript | MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Atomics/waitAsync)

[ArrayBuffer/SharedArrayBuffer](http://hacks.mozilla.or.kr/2017/11/a-cartoon-intro-to-arraybuffers-and-sharedarraybuffers/)

정적 메서드는 공유 메모리 위치에서 비동기적으로 대기하고 Promise를 반환하는 함수

- 참고로 위 메소드는 Int32Array 혹은 BigInt64Array에서만 동작

```tsx
const sab = new SharedArrayBuffer(1024);
const int32 = new Int32Array(sab);

// 읽기 스레드가 0이 될 것으로 예상되는 위치 0에서 기대하며, 1000ms 대기합니다.
// result.value은 프로미스입니다.
const result = Atomics.waitAsync(int32, 0, 0, 1000);
// { async: true, value: Promise {<pending>} }

// 읽기 스레드 또는 다른 스레드에서 메모리 위치 0이 호출되고 이행 결과 "ok" 문자열을 확인
Atomics.notify(int32, 0);
// { async: true, value: Promise {<fulfilled>: 'ok'} }
```

**RegExp `/v` flag**

[tc39/proposal-regexp-v-flag](https://github.com/tc39/proposal-regexp-v-flag)

정규표현식의 패턴 매칭을 통해 유니코드 이모지를 /u flag 값으로 검색이 가능하지만, 조합된 이모지 코드값으로는 검색이 가능하도록 /v flag 값 설정 추가

```tsx
// Unicode defines a character property named “Emoji”.
const re = /^\p{Emoji}$/u;

// Match an emoji that consists of just 1 code point:
re.test('⚽'); // '\u26BD'
// → true ✅

// Match an emoji that consists of multiple code points:
re.test('👨🏾‍⚕️'); // '\u{1F468}\u{1F3FE}\u200D\u2695\uFE0F'
// → false ❌

const re = /^\p{RGI_Emoji}$/v;

// Match an emoji that consists of just 1 code point:
re.test('⚽'); // '\u26BD'
// → true ✅

// Match an emoji that consists of multiple code points:
re.test('👨🏾‍⚕️'); // '\u{1F468}\u{1F3FE}\u200D\u2695\uFE0F'
// → true ✅
```

**올바른 형식의 유니코드 문자열**

- [문자열 메서드 .isWellFormed()](https://exploringjs.com/js/book/ch_strings.html#qref-String.prototype.isWellFormed)는 자바스크립트 문자열이 *올바른 형식*이고 [론 서로게이트(lone surrogate)](https://exploringjs.com/js/book/ch_unicode.html#unicode-lone-surrogate)를 포함하고 있지 않은지 검사합니다.
- [문자열 메서드 .toWellFormed()](https://exploringjs.com/js/book/ch_strings.html#qref-String.prototype.isWellFormed)는 론 서로게이트를 코드 유닛 0xFFFD로 교체한 문자열의 복사본을 반환합니다(0xFFFD는 같은 수의 코드 포인트를 나타내며 이름은 "대체 문자" 입니다). 따라서 결괏값은 올바른 형식입니다.

surrogates 란?

- 유니코드에서 surrogate는 기본 다국어 평면(Basic Multilingual Plane, BMP)에 속하지 않는 문자를 나타내기 위해 사용되는 코드 포인트입니다.

```tsx
high surrogate: U+D800 ~ U+DBFF
log surrogate: U+DC00 ~ U+DFFF
```

lone surrogate란?

- 서로게이트 페어에서 하나만 남은 경우를 가리킨다. 고위 서로게이트가 있고, 저위 서로게이트가 없거나, 그 반대의 경우를 의미한다. 이러한 상황은 올바른 UTF-16 표현이 아니며, 유효한 문자를 나타내지 않는다.파일 전송이나 텍스트 처리 중에 문제가 발생할 수 있다.
- unicode 표준은 이러한 상황을 처리하는 규칙을 제공하고 있다.

surrogates 문자열을 유니코드 대체 문자 U+FFFD로 대체되는 `[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)`문자열을 반환 처리

- surrogates 문자열은 항상 `leading`과 `trailing`이 pair로 이루어져야 하지만, 쌍을 이루지 않을 경우에는 오류가 발생하고, 서버와 통신으로 문자열 전달 시 오류가 발생함으로 꼭 toWellFormed로 변경해서 보내야함.

```tsx
const strings = [
  // Lone leading surrogate
  'ab\uD800',
  'ab\uD800c',
  // Lone trailing surrogate
  '\uDFFFab',
  'c\uDFFFab',
  // Well-formed
  'abc',
  'ab\uD83D\uDE04c',
];

for (const str of strings) {
  console.log(str.toWellFormed());
}
// Logs:
// "ab�"
// "ab�c"
// "�ab"
// "c�ab"
// "abc"
// "ab😄c"

const illFormed = 'https://example.com/search?q=\uD800';

try {
  encodeURI(illFormed);
} catch (e) {
  console.log(e); // URIError: URI malformed
}

console.log(encodeURI(illFormed.toWellFormed())); // "https://example.com/search?q=%EF%BF%BD"
```

# ES2023(ES14)

**ES2023에 추가된 기능들**

[ECMAScript® 2024 Language Specification](https://tc39.es/ecma262/)

ECMAScript 2023, the 14th edition, introduced the `toSorted`, `toReversed`, `with`, `findLast`, and `findLastIndex` methods on `Array.prototype` and `TypedArray.prototype`, as well as the `toSpliced` method on `Array.prototype`; added support for `#!` comments at the beginning of files to better facilitate executable ECMAScript files; and allowed the use of most Symbols as keys in weak collections.

**Array find from last**

[tc39/proposal-array-find-from-last](https://github.com/tc39/proposal-array-find-from-last)

배열의 값을 뒤로부터 찾을 수 있는 기능이 추가되었습니다.

findLast, findLastIndex

```tsx
const array = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }];

array.find(n => n.value % 2 === 1); // { value: 1 }
array.findIndex(n => n.value % 2 === 1); // 0

// ======== Before the proposal ===========

// find
[...array].reverse().find(n => n.value % 2 === 1); // { value: 3 }

// findIndex
array.length - 1 - [...array].reverse().findIndex(n => n.value % 2 === 1); // 2
array.length - 1 - [...array].reverse().findIndex(n => n.value === 42); // should be -1, but 4

// ======== In the proposal ===========
// find
array.findLast(n => n.value % 2 === 1); // { value: 3 }

// findIndex
array.findLastIndex(n => n.value % 2 === 1); // 2
array.findLastIndex(n => n.value === 42); // -1
```

**Change Array by Copy**

[tc39/proposal-change-array-by-copy](https://github.com/tc39/proposal-change-array-by-copy)

자바스크립트에서 배열을 변경 시 기존 배열을 얕은 복사하다보니 기존 배열이 변경되는 API들이 있는데요, 해당 API에 대한 깊은 복사(새로운 배열 객체)를 해주는 API들이 추가되었습니다.

함수형 프로그래밍의 불변성(Immutable) 개념이 적용된 사례인거 같네요

Array.prototype.toReversed() -> Array<br />
Array.prototype.toSorted(compareFn) -> Array<br />
Array.prototype.toSpliced(start, deleteCount, ...items) -> Array<br />
Array.prototype.with(index, value) -> Array<br />
TypedArray.prototype.toReversed() -> TypedArray<br />
TypedArray.prototype.toSorted(compareFn) -> TypedArray<br />
TypedArray.prototype.with(index, value) -> TypedArray<br />

- **toReversed**

기존 배열의 순서를 역전해 새로운 배열을 만들어 전달한다

```tsx
const sequence = [1, 2, 3];
sequence.toReversed(); // => [3, 2, 1]
sequence; // => [1, 2, 3]
```

- **toSorted( compare function )**

비교 함수를 넣어 새로운 배열을 반환한다(default: 오름차순)

```tsx
const sequence = [3, 2, 3];
sequence.toSorted(); // => [1, 2, 3]
sequence; // => [3, 2, 1]

const outOfOrder = new Uint8Array([3, 1, 2]);
outOfOrder.toSorted(); // => Uint8Array [1, 2, 3]
outOfOrder; // => Uint8Array [3, 1, 2]
```

- **toSpliced( start, delectCnt, ...item )**

배열의 요소 삭제 또는 교체

```tsx
const sequence = [1, 2, 3];
sequence.toSliced(0, 1); // => [2, 3]
sequence; // => [1, 2, 3];
```

- **with( index, value )**

배열의 인덱스 요소 value 교체

```tsx
const correctionNeeded = [1, 1, 3];
correctionNeeded.with(1, 2); // => [1, 2, 3]
correctionNeeded; // => [1, 1, 3]
```

- **Symbols as WeakMap keys**

[tc39/proposal-symbols-as-weakmap-keys](https://github.com/tc39/proposal-symbols-as-weakmap-keys)

제목에서 파악이 가능하듯이 WeakMap에 키에 Symbol을 넣을 수 있습니다. 2022까지는 문자(string)만 넣을 수 있었습니다.

```tsx
const weak = new WeakMap();

// Pun not intended: being a symbol makes it become a more symbolic key
const key = Symbol('my ref');
const someObject = {
  /* data data data */
};

weak.set(key, someObject);
```

**Hashbang Grammar**

[tc39/proposal-hashbang](https://github.com/tc39/proposal-hashbang)

Javascript 파일이 CLI에서 실행될 경우 HashBang(#!) 기호와 해당 라인이 무시됩니다. 단, 소소코드의 시작 부분에만 유효합니다.

```tsx
#!/usr/bin/env node
// in the Script Goal
'use strict';
console.log(1);

#!/usr/bin/env node
// in the Module Goal
export {};
console.log(1);
```

# ES2022(ES13)

- ES2022에 추가된 기능들
  [https://tc39.es/ecma262/](https://tc39.es/ecma262/)

- Class Fields

- babel 세팅

```jsx
npm install --save-dev @babel/plugin-proposal-private-property-in-object

webpack.config.js
{
  "plugins": ["@babel/plugin-proposal-private-property-in-object"]
}

// babel.config.json
{
  "assumptions": {
    "privateFieldsAsProperties": true,
    "setPublicClassFields": true
  }
}
```

- Class Public Instance Fields & Private Instance Fields

ES2015 이후로, 우리는 생성자를 통해 필드를 정의할 수 있었습니다. 일반적으로 클래스 메서드 외부에서 액세스하면 안 되는 필드에는 밑줄이 붙습니다. 하지만 이는 클래스를 사용하는 사람들을 막지 못했습니다.

```jsx
// ES2022 이전
class a {
  constructor() {
    this.size = 0;
  }
}

class b extends a {
  constructor() {
    super();
    this.color = 'red';
    this._clicked = false;
  }
}

const button = new ColorButton();
// Public fields can be accessed and changed by anyone
button.color = 'blue';

console.log(button._clicked);
button._clicked = true; // noop!!

// 이 기능의 첫번째 부분은 클래스 내의 필드를 좀 더 명확하게 정의할 수 있게 해줍니다.
// 생성자 내에 정의하는 대신, 클래스의 최상단 레벨에 정의할 수 있습니다.
// 두번째 부분은, private 필드를 좀 더 안전하게 숨길 수 있습니다.
// 밑줄을 붙이는 기존의 방식과 달리 필드 이름 앞에 '#'을 붙여 외부의 액세스를 방지할 수 있습니다.
class a {
  #size = 0;
}

class b extends a {
  color = 'red';
  #clicked = false;

  setClick(flag) {
    this.#clicked = true;
  }

  getClick() {
    return this.#clicked;
  }
}
```

- Private instance methods and accessors

클래스의 몇몇 메소드나 변수는 클래스 내부적으로 기존에 의도했던 기능들을 수행해야 하는 중요도를 가지면서 외부에서 접근할 수 없어야 합니다. 이를 방지하기 위해, 메소드나 접근자 앞에 '#'을 붙일 수 있습니다.

```jsx
class Banner extends HTMLElement {
  // Private variable that cannot be reached directly from outside, but can be modified by the methods inside:

  #slogan = "Hello there!"
  #counter = 0

  // private getters and setters (accessors):

  get #slogan() {return #slogan.toUpperCase()}
  set #slogan(text) {this.#slogan = text.trim()}

  get #counter() {return #counter}
  set #counter(value) {this.#counter = value}

  constructor() {
    super();
    this.onmouseover = this.#mouseover.bind(this);
  }

  // private method:
  #mouseover() {
    this.#counter = this.#counter++;
    this.#slogan = `Hello there! You've been here ${this.#counter} times.`
  }
}
```

- Static class fields and private static methods

정적 필드나 메소드는 프로토타입 내에서만 존재하도록 하는 데 있어 유용하지만, 주어진 클래스의 모든 인스턴스에 대해서는 그렇지 않습니다. 당신은 이 필드와 메소드들이 클래스 내에서만 액세스할 수 있도록 허용할 수 있습니다.

```jsx
class Circle {
  // ES2015 이후로, 우리는 필드를 클래스 자체에 정의함으로서 정적 필드를 정의했습니다.
  static #PI = 3.14

  static #calculateArea(radius) {
    return #PI * radius * radius
  }

  static calculateProperties(radius) {
    return {
      radius: radius,
      area: #calculateArea(radius)
    }
  }

}

// Public static method, outputs {radius: 10, area: 314}
console.log(Circle.calculateProperties(10))

// SyntaxError - Private static field
console.log(Circle.PI)

// SyntaxError - Private static method
console.log(Circle.calculateArea(5))
```

- Ergonomic brand checks for Private Fields

public 필드에 대해, 클래스의 존재하지 않는 필드에 접근을 시도하면 `undefined`가 반환됩니다. 반면에, private 필드는 `undefined`대신 예외를 발생시킵니다.

이를 방지하기 위해 `in` 키워드를 사용해 private 속성/메소드를 체크할 수 있습니다.

```javascript
class VeryPrivate {
  constructor() {
    super();
  }

  #variable;
  #method() {}
  get #getter() {}
  set #setter(text) {
    this.#variable = text;
  }

  static isPrivate(obj) {
    return (
      #variable in obj && #method in obj && #getter in obj && #setter in obj
    );
  }
}

const b = new VeryPrivate();
console.log(VeryPrivate.isPrivate(b));
```

- RegExp Match Indices

원본 입력에서 전체 일치의 위치에 대해 꽤 많은 정보를 제공하지만 하위 문자열 일치의 인덱스에 대한 정보는 부족합니다. 새로운 `/d` 를 사용하면, 일치한 그룹에 대해 시작, 끝 위치를 얻을 수 있습니다

```javascript
// v2022 이전
const str = 'Ingredients: cocoa powder, cocoa butter, other stuff';
const regex = /(cocoa) ([a-z]+)/g;
const matches = [...str.matchAll(regex)];

// 0: "cocoa powder", 1: "cocoa", 2: "powder"
// index: 13
// input: "Ingredients: cocoa powder, cocoa butter, other stuff"
console.log(matches[0]);

// 0: "cocoa butter", 1: "cocoa", 2: "butter"
// index: 27
// input: "Ingredients: cocoa powder, cocoa butter, other stuff"
console.log(matches[1]);

// vs2022 이후
const str = 'Ingredients: cocoa powder, cocoa butter, other stuff';
const regex = /(cocoa) ([a-z]+)/dg;
const matches = [...str.matchAll(regex)];

// 0: "cocoa powder", 1: "cocoa", 2: "powder"
// index: 13
// input: "Ingredients: cocoa powder, cocoa butter, other stuff"
// indices: [[13,25],[13,18],[19,25]]
console.log(matches[0]);

// 0: "cocoa butter", 1: "cocoa", 2: "butter"
// index: 27
// input: "Ingredients: cocoa powder, cocoa butter, other stuff"
// indices: [[27,39],[27,32],[33,39]]
console.log(matches[1]);
```

- Top-level await

이 기능 이전에는, await은 오직 async 함수 내에서만 사용할 수 있었습니다. 이는 모듈 최상단에서 await을 쓸 수 없다는 문제가 존재합니다.

이제 `await`은 모듈 최상단에서 사용할 수 있으며, import, fallback 등을 만들 때 매우 유용합니다.

[https://github.com/tc39/proposal-top-level-await](https://github.com/tc39/proposal-top-level-await)

```javascript
// Dynamic dependency pathing
const strings = await import(`/i18n/${navigator.language}`);

// Resource initialization
const connection = await dbConnector();

// Dependency fallbacks
let jQuery;
try {
  jQuery = await import('https://cdn-a.com/jQuery');
} catch {
  jQuery = await import('https://cdn-b.com/jQuery');
}
```

# ES2021(ES12)

- String.prototype.replaceAll

```javascript
// 현재는 전역 정규식(/regexp/g)을 사용하지 않고서는 문자열에서 부분 문자열을 대체할 수 있는 방법은 없다.
const fruits = '🍎+🍐+🍓+';
const fruitsWithBanana = fruits.replace(/\+/g, '🍌');
console.log(fruitsWithBanana); //🍎🍌🍐🍌🍓🍌

//새로 replaceAll 메서드가 String 프로토타입에 추가되었다.
const fruits = '🍎+🍐+🍓+';
const fruitsWithBanana = fruits.replaceAll('+', '🍌');
console.log(fruitsWithBanana); //🍎🍌🍐🍌🍓🍌
```

- Promise.any

프라미스 중 하나가 이행되는 즉시 응답을 준다. 단, promise 모두가 에러일 경우 AggregateError를 주게 된다.

```javascript
const promise1 = Promise.reject(0);
const promise2 = new Promise((resolve, reject) =>
  setTimeout(reject, 100, 'quick'),
);
const promise3 = new Promise((resolve, reject) =>
  setTimeout(resolve, 500, 'slow'),
);

const promises = [promise1, promise2, promise3];

Promise.any(promises)
  .then(value => console.log(value))
  .catch(e => {
    console.log(e);
  });
// slow

const promise1 = Promise.reject(0);
const promise2 = new Promise((resolve, reject) =>
  setTimeout(reject, 100, 'quick'),
);
const promise3 = new Promise((resolve, reject) =>
  setTimeout(reject, 500, 'slow'),
);

const promises = [promise1, promise2, promise3];

Promise.any(promises)
  .then(value => console.log(value))
  .catch(e => {
    console.log(e);
  });
// AggregateError: All promises were rejected
```

- Promise.any vs Promise.race vs Promise.all vs Promise.allSettled

공통점: ES2017 이후 병렬처리

```javascript
// Promise.all
// 배열 안 프라미스가 모두 처리되면 새로운 프라미스가 이행
// 결과값을 담은 배열이 새로운 프라미스가 리턴
Promise.all([
  new Promise(resolve => setTimeout(() => resolve(1), 3000)), // 1
  new Promise(resolve => setTimeout(() => resolve(2), 2000)), // 2
  new Promise(resolve => setTimeout(() => resolve(3), 1000)), // 3
]).then(data => console.log(data)); // [1, 2, 3]

// 프라미스가 거부되면서 Promise.all 전체가 거부되고, .catch가 실행
Promise.all([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
  new Promise((resolve, reject) =>
    setTimeout(() => reject(new Error('에러 발생!')), 2000),
  ),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000)),
]).catch(err => console.log(err)); // Error: 에러 발생!

// Promise.allSettled
// 프라미스가 거부되더라도 모든 프라미스가 처리될 때까지 기다립니다.
Promise.allSettled([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
  new Promise((resolve, reject) =>
    setTimeout(() => reject(new Error('에러 발생!')), 2000),
  ),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000)),
]).then(data => console.log(data));
// result
// 0: {status: 'fulfilled', value: 1}
// 1: {status: 'rejected', reason: Error: 에러 발생! at <anonymous>:3:60 at i (https://www.notion.so/890-97af8b4e61b9aaf1ef78.js:1…}
// 2: {status: 'fulfilled', value: 3}

// Promise.race
// 가장 먼저 처리되는 프라미스의 결과(혹은 에러)를 반환합니다.(성공, 실패와 상관없음)
Promise.race([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
  new Promise((resolve, reject) =>
    setTimeout(() => reject(new Error('에러 발생!')), 2000),
  ),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000)),
])
  .then(data => console.log(data))
  .catch(err => console.error(err)); // 1

// Promise.any
// 가장 먼저 처리되는 프라미스의 결과를 반환합니다. 단, 실패 처리는 모든 Promise가 실패한 경우 AggregateError 발생시킨다.
Promise.any([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
  new Promise((resolve, reject) =>
    setTimeout(() => reject(new Error('에러 발생!')), 100),
  ),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000)),
])
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

- 논리 할당 연산자

논리 할당 연산자는 논리 연산자와 할당 표현식을 결합한다. 두가지 새로운 연산자가 있다.

```javascript
// Or Or Equals
|   a   |   b   | a ||= b |      a (연산 후)     |
| true  | true  |   true  |        true         |
| true  | false |   true  |        true         |
| false | true  |   true  |        true         |
| false | false |   false |        false        |
a ||= b
// 아래와 동일
a || (a = b);
// And And Equals
|   a   |   b   | a &&= b |      a (연산 후)     |
| true  | true  |   true  |        true         |
| true  | false |   false |        false        |
| false | true  |   false |        false        |
| false | false |   false |        false        |
a &&= b
// 아래와 동일
a && (a = b);
```

- 숫자 구분자

```javascript
1_000_000_000; // 1,000,000,000(10억)
const amount = 1_234_500; // 1,234,500
```

- WeakRef, FinalizationRegistry

`WeakRef` 객체에는 *target* 또는 *referent*라고 하는 객체에 대한 약한 참조가 포함된다. 객체에 대한 *약한 참조*는 가비지 컬렉터에서 객체를 회수하는 것을 방지하지 않는 참조이다.

FinalizationRegistry는 레지스트리에 등록된 객체가 *회수*(가비지 컬렉션)될 때 *정리 콜백*(_종료자_)을 호출하도록 요청하는 방법을 제공한다.

콜백을 전달하는 registry를 만든다. (GC 메모리 해제 → FinalizationRegistry callback 호출)

```javascript
<div id="counter"></div>;

const finalizer = new FinalizationRegistry(args => console.log(args));

class Counter {
  constructor(element) {
    // DOM 요소에 대한 약한 참조 기억
    this.ref = new WeakRef(element);
    // this.ref1 = element; // 참조를 넘길경우 메모리 해제 X
    this.start();
  }

  start() {
    if (this.timer) {
      return;
    }

    this.count = 0;

    const tick = () => {
      // 여전히 존재하는 경우 약한 참조에서 요소를 가져옵니다.
      const element = this.ref.deref();
      //   const element1 = this.ref1; // 참조를 넘길경우 메모리 해제 X
      if (element) {
        element.textContent = ++this.count;
      } else {
        // 더 이상 존재하지 않는 요소
        console.log('The element is gone.');
        this.stop();
        this.ref = null;
      }
    };

    tick();
    this.timer = setInterval(tick, 1000);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = 0;
    }
  }
}

const counter = new Counter(document.getElementById('counter'));
setTimeout(() => {
  document.getElementById('counter').remove(); // element 삭제 시 WeakRef에 의해서 GC에 의해서 해제
}, 5000);

finalizer.register(document.getElementById('counter'), 'GC Memory Release');
```

[https://blog.shiren.dev/2021-08-30/](https://blog.shiren.dev/2021-08-30/)

[https://runebook.dev/ko/docs/javascript/global_objects/weakref](https://runebook.dev/ko/docs/javascript/global_objects/weakref)

# ES2020(ES11)

- globalThis

예전에는 브라우저의 전역객체는 window였고 Node.js의 전역객체는 global이었습니다. 둘이 달라서 분기처리를 해줘야 했던 경우가 많았는데 이제는 globalThis라는 것으로 통일되었습니다. 물론 기존 window나 global도 존재합니다.

```javascript
// 브라우저에서는
globalThis === window; // true

// 노드에서는
globalThis === global; // true
```

- optional chaining

자바스크립트에서 가장 많이 보는 에러가 cannot read property X of undefined 또는 cannot read property Y of undefined입니다.

```javascript
// 이를 방지하기 위해서
if (a) {
  if (a.b) {
    console.log(a.b.c);
  }
}
// 또는
console.log(a && a.b && a.b.c);

// optional chaining a.b가 없는경우 undefined 리턴됨
console.log(a?.b?.c);
```

- Nullish Coalescing Operator

null이나 undefined일 때만 b를 반환합니다.

```javascript
0 || 'A'; // A
0 ?? 'A'; // 0

0 ? 0 : 'A'; // A
0 ?? 'A'; // 0
```

- Dynamic Import

파일 import를 동적으로 할 수 있게 되었습니다.

```javascript
import config from './config.js';

if(response) {
age = config.age;
}

if(response) {
import('./config.js') // promise를 동적으로 리턴
.then(config => {
age = config.age;
console.log(config);
}
}
```

- Promise.allSettled

Promise.all()은 모든 작업이 성공(reslove)해야 실행되는 특징과 달리 Promise.allSettled()은 도중에 실패(reject)되더라도 모든 실행을 할 수 있습니다.

```javascript
const p1 = new Promise((resolve, reject) => resolve("p1, resolved"));
const p2 = new Promise((resolve, reject) => resolve("p2, resolved"));
const p3 = new Promise((resolve, reject) => reject("p3, rejected"));

Promise.all([p1, p2, p3])
.then(response => console.log(response))
.catch(err => {
console.log(err);
});
/_
console.log(response)
{status: "fulfilled", value: "p1, resolved"}
{status: "fulfilled", value: "p2, resolved"}
{status: "rejected", reason: "p3, rejected"}
_/

Promise.allSettled([p1, p2, p3])
.then(response => console.log(response))
.catch(err => {
console.log(err);
});
/_
console.log(err);
p3, rejected
_/
```

- 참고사이트

<a href="https://gomugom.github.io/ecmascript-proposals-1-intro/" target="_blank" style="font-size=30px; color: #4dabf7; text-decoration:underline;">https://gomugom.github.io/ecmascript-proposals-1-intro/</a>
<a href="https://junhobaik.github.io/es2016-es2020/" target="_blank" style="font-size=30px; color: #4dabf7; text-decoration:underline;">https://junhobaik.github.io/es2016-es2020/</a>
<a href="https://ui.toast.com/fe-guide/ko_ES5-TO-ES6/" target="_blank" style="font-size=30px; color: #4dabf7; text-decoration:underline;">https://ui.toast.com/fe-guide/ko_ES5-TO-ES6/</a>
<a href="https://www.zerocho.com/category/ECMAScript/post/5eae7480e70c21001f3e7956" target="_blank" style="font-size=30px; color: #4dabf7; text-decoration:underline;">https://www.zerocho.com/category/ECMAScript/post/5eae7480e70c21001f3e7956</a>

# ES2019(ES10)

- String.trimStart() & trimEnd()

문자열의 앞이나 뒤의 공백을 제거한다.
앞을 제거하는 trimStart와 뒤를 제거하는 trimEnd가 있다.

```javascript
const s = ' hello world';
const e = '! ';

console.log(s + e + ';');
// " hello world! ;"

console.log(s.trimStart() + e.trimEnd() + ';');
// "hello world!;"
```

- Optional Catch Binding

catch 매개변수 없이도 catch 블록을 사용할 수 있습니다.

```javascript
// Before ES2019
try {
  // some code
} catch (err) {
  // error handling code
}

// After ES2019
try {
  // some code
} catch {
  // error handling code
}
```

- Object.fromEntries()

객체를 entries로 배열로 만들었다면 fromEntries로 다시 객체로 만들 수 있다는 이야기입니다. entires를 이해했다면 간단하게 아래 예제를 통해 알 수 있습니다.

```javascript
const obj1 = { name: 'Jhon', age: 24 };

const entries = Object.entries(obj1);
console.log(entries); // [["name", "Jhone"], ["age", 24]]

const fromEntries = Object.fromEntries(entries);
console.log(fromEntries); // {name: "Jhon", age: 24}
```

- Array.flat() & flatMap()

flat 메소드는 배열안의 배열을 쉽게 합칠 수 있게 됩니다.

```javascript
const arr = [1, 2, 3];

const map = arr.map(v => [v]);
const flatMap = arr.flatMap(v => [v]);

console.log(map); // [[1], [2], [3]]
console.log(map.flat()); // [1, 2, 3]

console.log(flatMap); // [1, 2, 3]
```

# ES2018(ES9)

- Rest/Spread Properties

기존의 배열에서 사용하던 rest/spread를 객체에서도 사용가능하게 되었습니다.

```javascript
// Spread
const obj1 = { one, two, ...others };
console.log(obj); // {one: 1, two: 2, three: 3, four: 4, five: 5}

const person1 = {
  name: 'hong',
  age: 33,
};

const person2 = {
  name1: 'park',
  age1: 33,
};

console.log({ ...person1, ...person2 });
// {name: "hong", age: 33, name1: "park", age1: 33}

const friends = ['choi', 'kim'];
const newfriends = [...friends, 'seyoung'];

console.log(newfriends);
// ["choi", "kim", "seyoung"]

const choi = {
  username: 'choi',
};

console.log({ ...choi, password: '**_123_**' });
//{username: "choi", password: "**_123_**"}

// Rest
const { one, two, ...others } = { one: 1, two: 2, three: 3, four: 4, five: 5 };
console.log(one, two, others); // 1 2 {three: 3, four: 4, five: 5}

const user1 = {
  NAME: 'hong',
  age: 36,
  password: '**123',
};

// const 변수를 새로만들듯이 새로운 변수를 세팅
const rename = ({ NAME: name, ...rest }) => ({ name, ...rest });

console.log(rename(user1));
```

- Promise.prototype.finally()

then, catch, finally에서 Promise는 기존에 then과 catch만 가능했으나 이제 finally도 추가되었습니다.

```javascript
// resolve, reject이 호출되더라도 finally를 무조건 한번은 타도록 되어있음
const p1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 3000, 'before finally');
})
  .then(value => console.log(value))
  .catch(err => console.log(err))
  .finally(() => console.log('call finally'));
```

- Asynchronous iteration

비동기 이터러블 객체를 순회하는 것이 가능해졌습니다.

```javascript
for await (const req of requests) {
  console.log(req);
}
```

# ES2017(ES8)

- String padding

최대 길이보다 짧은 문자열에 대해서 그 여백에 지정한 문자열을 반복하여 채우는 메소드이다.
padStart는 문자열의 좌측에 여백을 지정하며, padEnd는 그 반대이다.
두 메소드 모두 maxLength보다 긴 문자열에 대해서는 동작하지 않는다.

String.prototype.padStart(maxLength[, padString])
String.prototype.padEnd(maxLength[, padString])

```javascript
'abc'.padStart(10); // " abc" (두번째 파라미터 생략시 빈 문자열로 채운다)
'abc'.padStart(10, '12'); // "1212121abc"
'abc'.padStart(5, '1234567'); // "12abc"
'abcde'.padStart(3, '12'); // "abcde"
'abc'.padEnd(10); // "abc " (두번째 파라미터 생략시 빈 문자열로 채운다)
'abc'.padEnd(10, '12'); // "abc1212121"
'abc'.padEnd(5, '1234567'); // "abc12"
'abcde'.padEnd(3, '12'); // "abcde"
```

- Object.values / Object.entries

Object.values(object)
Object.entries(obj)

```javascript
const obj = { a: 1, b: 2, c: 3 };
console.log(Object.keys(obj)); // [ "a", "b", "c" ]
console.log(Object.values(obj)); // [ 1, 2, 3 ]
console.log(Object.entries(obj)); // [ ["a", 1], ["b", 2], ["c", 3] ]
```

- Object.getOwnPropertyDescriptors

getOwnPropertyDescriptor는 인자로 객체와 속성명을 전달해 해당 속성의 속성 설명자를 반환하는 메소드입니다.

Object.getOwnPropertyDescriptor(obj, prop)

getOwnPropertyDescriptors는 속성명을 전달하지 않고 객체만 전달함으로 객체내의 모든 속성에 대한 속성 설명자를 반환합니다.

Object.getOwnPropertyDescriptor(obj)

```javascript
const obj1 = { name: 'Jhon', age: 24 };

console.log(Object.getOwnPropertyDescriptor(obj1, 'name'));
// Object {value: "Jhon", writable: true, enumerable: true, configurable: true}

console.log(Object.getOwnPropertyDescriptors(obj1));
// Object {
// name: {value: "Jhon", writable: true, enumerable: true, configurable: true},
// age: {value: 24, writable: true, enumerable: true, configurable: true}
// }
```

- Trailing commas

함수의 마지막 매개변수와 인자에도 콤마를 넣을 수 있습니다.

const foo = (a, b, c,) => {}

- async/await

```javascript
// promise를 사용하게 되면 사용자가 얻고자하는 값이 여러개 일경우 then/then/then을 호출하게 되어서 코드가 복잡해진다.
const getMoviesPromise = () => {
  fetch('https://yts.am/api/v2/list_movies.json')
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(err => console.log(err));
};

const getMoviesAsync = async () => {
  const response = await fetch('https://yts.lt/api/v2/list_movies.json');
  const json = await response.json();
  console.log(json);
};

getMoviesAsync();
```

- Async Awaite(try catch finally)

```javascript
const getMoviesAsync = async () => {
  try {
    const response = await fetch('https://yts.lt/api/v2/list_movies.json');
    const json = await response.json();
    console.log(json);
  } catch (e) {
    console.log(`Error ${e}`);
  } finally {
    console.log('we are done');
  }
};

getMoviesAsync();
```

- Paraller Async Await

```javascript
const getMoviesAsync = async () => {
  try {
    const [moviesRespose, suggestionResponse] = await Promise.all([
      fetch('https://yts.lt/api/v2/list_movies.json'),
      fetch('https://yts.lt/api/v2/movie_suggestions.json'),
    ]);
    const [movies, suggestion] = await Promise.all([
      moviesRespose.json(),
      suggestionResponse.json(),
    ]);
    console.log(movies);
    console.log(suggestion);
  } catch (e) {
    console.log(`Error ${e}`);
  } finally {
    console.log('we are done');
  }
};

getMoviesAsync();
```

# ES2016(ES7)

- Array.prototype.includes

배열 내장 함수 includes가 추가되었습니다.
아이템이 존재하는지 boolean 값으로 반환

Array.prototype.includes(searchElement, ?fromindex);

```javascript
// before ES2016
console.log([1, 2, 3].indexOf(4)); // -1

// after ES2016
console.log([1, 2, 3].includes(2)); // true
console.log([1, 2, 3].includes(4)); // false
console.log([1, 2, NaN].includes(NaN)); // true
console.log([1, 2, -0].includes(+0)); // true
console.log([1, 2, +0].includes(-0)); // true
console.log(['a', 'b', 'c'].includes('a')); // true
console.log(['a', 'b', 'c'].includes('a', 1)); // false
```

- Exponentiation operator

다른 프로그래밍 언어들에서 일반적으로 사용되는 문법을 도입하였다.
x \*\* y는 x의 y제곱을 의미하며, 이는 Math.pow(x, y)와 완전히 동일하다.

number \*\* number

```javascript

// before ES2016
console.log(Math.pow(2, 3)); // true

// after ES2016
console.log(2 ** 3); // 8 ( === 2 _ 2 _ 2 )
let a = 3;
a **= 4;
console.log(a); // 81 ( === a _ a _ a \* a )
10 ** -1; // 0.1
2.5 ** 2; // 6.25
3 ** 2.5; // 15.588457268119896
2 ** 3 ** 2; // 512
2 ** (3 ** 2); // 512
(2 ** 3) \*\* 2; // 64

```

# ES2015(ES6)

- let, const의 장점

````javascript
function sayHello(name) {
if (!name) {
let errorMessage = '"name" parameter should be non empty String.';

    alert(errorMessage);

}

console.log('Hello, ' + name + '!');
console.log(errorMessage); // ReferenceError
}

// 값 수정
let foo = 'foo';
foo = 'foo2'; // OK - 값 수정이 가능하다.

const bar = 'bar';
bar = 'bar2'; // Type error - bar 변수는 상수이므로 값 수정이 불가능하다.

// 선언, 초기화
const baz2; // Type error - const로 선언한 변수는 선언과 동시에 초기화 해야한다.

let baz; // OK - let으로 선언한 변수는 선언과 동시에 초기화할 필요 없다.
baz = 'baz';

// const 변수의 프로퍼티 값 수정
const foo2 = {
bar2: 'bar'
};

foo2.bar2 = 'bar2'; // OK - foo2의 프로퍼티는 수정이 가능하다.
```

 * 화살표 함수(Arrow function)

```javascript
const sum = (a, b) => {
return a + b;
};
````

- 클래스(Class)

* Instroduction classes

```javascript
const MakeUser = {
  userName: 'hong',
  sayHello: function () {
    console.log(`hello, this is ${this.userName}`);
  },
};

// class와 그냥 객체의 차이점은 new로 할당할 경우에만 instance를 생성한다는 것이다.(MakeUser를 객체를 만들어서 리턴한 것이다.)
class User {
  constructor(name) {
    this.userName = name;
  }

  sayHello() {
    console.log(`hello, this is ${this.userName}`);
  }
}

const user1 = new User('hong');
const user2 = new User('seungah');

const user3 = MakeUser;

console.log(user1.sayHello());
console.log(user2.sayHello());
console.log(user3.sayHello());
```

- Extending classes

```javascript
class User {
  constructor({ name }) {
    this.userName = name;
  }

  sayHello() {
    console.log(`hello, this is ${this.userName}`);
  }
}

// 자식 생성자가 있는경우 super 키워드가 없으면 상속받은 부모 생성자 호출이 불가능하다.
class Admin extends User {
  constructor({ name, superAdmin }) {
    super({ name });
    this.superAdmin = superAdmin;
  }
  sayAdmin() {
    console.log(
      `admin, this is ${this.userName} superAdmin : ${this.superAdmin}`,
    );
  }
}

const admin = new Admin({ name: 'hong', superAdmin: true });
admin.sayHello();
admin.sayAdmin();
```

- WTF is this

```javascript
class Counter {
this.plusButton.addEventListener("click", this.increase);
this.minusButton.addEventListener("click", this.descrease);

// ctrl eventHandler callback 호출의 this는 ctrl자체를 가리킨다.(여기선 button)
// 수정전
increase() {
consoloe.log(this);
}

descrease() {
consoloe.log(this);
}

// 수정후(lexical scope this를 가지고 있습니다.??)
increase = () => {
consoloe.log(this);
}

descrease = () => {
consoloe.log(this);
}
}
```

- 개선된 객체 리터럴(Object literal)

```javascript
// before ES2015
var dog = {
  name: 'Lycos',
  bark: function () {
    console.log('Woof! Woof!');
  },
};

dog.bark(); // 'Woof! Woof!';

var iPhone = '아이폰';
var iPad = '아이패드';
var iMac = '아이맥';

var appleProducts = {
  iPhone: iPhone,
  iPad: iPad,
  iMac: iMac,
};

// after ES2015

const dog = {
  name: 'Lycos',
  bark() {
    console.log('Woof! Woof!');
  },
};

dog.bark(); // 'Woof! Woof!';

const iPhone = '아이폰';
const iPad = '아이패드';
const iMac = '아이맥';

const appleProducts = { iPhone, iPad, iMac };
```

- 템플릿 리터럴(Template literal)

```javascript
// before es2015
let sayHello1 = (aName = 'hong') => 'hello ' + aName;
console.log(sayHello1());

// after es2015
let sayHello2 = (aName = 'hong') => `hello ${aName}`;
console.log(sayHello2());

console.log(`hello ${100 * 100}`);

const add = (prev, next) => prev + next;
console.log(`prev plus next : ${add(3, 4)}`);
```

- 디스트럭처링(Destructuring)

* Object Destructuring

```javascript
// 비구조화 할당
const settings = {
  noti: {
    follow: true,
    alerts: true,
    unfollow: false,
  },
  color: {
    theme: 'dark',
  },
};

const {
  noti: { data = 'init', unfollow } = {},
  color: { theme },
} = settings;
console.log(unfollow, theme, data);
```

- Array Destructuring

```javascript
const days = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'];

// 이전
// const Mon = days[0];
// const Tue = days[1];
// const Wen = days[2];
// const Thu = days[3];
// const Fri = days[4];
// const Sat = days[5];
// const Sun = days[6];

// 이후
const [Mon, Tue, Wen, Thu, Fri, Sat, Sun = 'Sun'] = days;
console.log(Mon, Tue, Wen, Thu, Fri, Sat, Sun);
```

- 함수 매개변수의 디폴트 값 설정

```javascript
const sayName = (name = 'World') => {
  console.log(`Hello, ${name}!`);
};

sayName(); // "Hello, World!"
```

```javascript
function sayHello(aName = 'hong') {
  return 'Hello ' + aName;
}

console.log(sayHi());
```

- 기존 JS6이전에는 aName이 undefined 여부를 체크한 이후에 다시 값을 세팅해야했는데, 인자에 대한 초기값 세팅이 가능해졌다.
  예) let defalutName = aName || "hong"

* Rest 파라미터, Spread 표현식

* Spread

```javascript
// Spread object/Array unpack
const number = [1, 2, 3, 4];
const alpha = ['a', 'b', 'c'];

console.log([...number, ...alpha]);
//[1, 2, 3, 4, "a", "b", "c"]
```

- Rest

```javascript
const bestfriends = (one, ...friendsRest) =>
  console.log(`my best friends : ${one}, friends rest : ${friendsRest}`);

bestfriends('kim', 'choi', 'seyoung');
```

- Rest & Spread Destructure

```javascript
// object 삭제 & 정리할경우 유용
const user = {
  name: 'hong',
  age: 36,
  password: '**123',
};

const ignorepwd = ({ password, ...rest }) => rest;

console.log(ignorepwd(user));

// object를 만들어서 return 할 경우 () 감싸줘야한다.
const setCountry = ({ country = 'kr', ...rest }) => ({ country, ...rest }); // ({country, ...rest}) spread 문법사용

console.log(setCountry(user));
```

- 제너레이터(Generator)

함수의 흐름을 특정 구간에 멈춰놓았다가 다시 실행할 수 있다.
결과값을 여러번 내보낼 수 있다.
Generator 문법이 나오면서 redux-saga, rsjx등 여러 라이브러리가 나오게 되었음

```javascript
function\* gen() {
yield 1;
yield 2;
yield 3;
yield 4;
}

const g = gen();

console.log(g.next().value); // 1
console.log(g.next().value); // 2
console.log(g.next().value); // 3
console.log(g.next().value); // 4
console.log(g.next().value); // undefined

// next를 수행하면서 각각 여러 동작들을 순서에 맞게 처리가능
function\* listPeople() {
// 1. 동작
yield 'hong';
// 2. 동작
yield 'kim';
// 3. 동작
yield 'choi';
// 4. 동작
yield 'park';
};

function\* friendTeller() {
for(const friend of friends) {
yield friend;
}
}

const friends = ['hong', 'kim', 'choi', 'park'];
const friendLooper = friendTeller();

const listG = listPeople();
listG.next();
//{value: "hong", done: false}
listG.next();
//{value: "kim", done: false}
listG.next();
//{value: "choi", done: false}
listG.next();
//{value: "park", done: false}
listG.next();
//{value: undefined, done: true}

```

- 프로미스(Promise)

* create promises

```javascript
// async function
const newPromise = new Promise((resolve, reject) => {
  setTimeout(resolve, 3000, 'I am new Promise');
});

console.log(newPromise);

setInterval(console.log, 1000, newPromise);
```

- using promises

```javascript
const newPromise = new Promise((resolve, reject) => {
  setTimeout(resolve, 3000, 'I am new Promise');
});

// resolve : then, reject : catch 호출이며 단 하나만 호출이 된다.
newPromise
  .then(value => console.log(value))
  .catch(err => console.log(`error ${err}`));
```

- chaining promises

```javascript
const newPromise = new Promise((resolve, reject) => {
resolve(2);
});

const timesTwo = number => number \* 2;

newPromise
.then(timesTwo)
.then(timesTwo)
.then(timesTwo)
.then(timesTwo)
.then(timesTwo)
.then(timesTwo)
.then(lastnumber => console.log(lastnumber));
```

- promises all/race

```javascript
const f1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 3000, 'first');
});

const f2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 5000, 'secode');
});

const f3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 7000, 'third');
});

// Promise.all 시간과 상관없이 순서에 맞게 값을 제공해준다.
const fall = Promise.all([f1, f2, f3]);
fall.then(values => console.log(values));

// Promise.race f1,f2,f3중 가장먼저 resolve, reject 되는 내용의 결과값을 제공해준다.
const frace = Promise.race([f1, f2, f3]);
fall.then(values => console.log(values));
```

- 모듈(ES Module)

* Named export

Named export는 한 파일에서 여러 번 할 수 있다. Named export를 통해 내보낸 것 들은 추후 다른 모듈에서 내보낼 때와 같은 이름으로 import 해야 한다.

```javascript
export const student = 'Park';
export const student2 = 'Ted';

const student3 = 'Abby';
export {student3};

import {student, student2, student3} from 'students.js';
import {student as park, student2 as ted, student3 as abby} from 'students.js';
import \* as students from 'students.js';

```

- Default export

반면에 Default export는 한 스크립트 파일당 한 개만 사용할 수 있다. 그리고 export default의 뒤에는 표현식만 허용되므로 var, let, const등의 키워드는 사용하지 못한다.

이렇게 내보낸 객체들은 모듈들에서 접근할 수 있다. 그렇다면 지금부터는 모듈에서 export 한 객체들을 가져오는 import문을 살펴보자.

```javascript
export default 'Jack';

import jack from 'studentJack';
```

# ES5 (2009)

배열에 forEach, map, filter, reduce, some, every와 같은 메소드 지원
Object에 대한 getter / setter 지원

```javascript
var person = {
  firstName: 'Hong',
  lastName: 'SeungAh',

  get fullName() {
    return this.firstName + ' ' + this.lastName;
  },

  set fullName(name) {
    var words = name.toString().split(' ');
    this.firstName = words[0] || '';
    this.lastName = words[1] || '';
  },
};

person.fullName = 'Hong SeungAh';
console.log(person.firstName); // Hong
console.log(person.lastName); // SeungAh

// defineProperty 속성추가가능
var person = {
  firstName: 'Hong',
  lastName: 'SeungAH',
};

Object.defineProperty(person, 'fullName', {
  get: function () {
    return this.firstName + ' ' + this.lastName;
  },
  set: function (name) {
    var words = name.split(' ');
    this.firstName = words[0] || '';
    this.lastName = words[1] || '';
  },
});
```

# ES3 (1999)

우리가 흔히 말하는 자바스크립트.
자바스크립트 strict 모드 지원 (더 깐깐한? 문법 검사를 한다.)
JSON 지원 ( 과거에는 XML을 사용하다가, json이 뜨면서 지원하게 됨 )

- HTML Fragments

```javascript
// JS6이전
let text1 = 'HELLO HONG';
let body = document.body;
let div = document.createElement('div');
let h1 = document.createElement('h1');
h1.innerText = text1;
div.appendChild(h1);
body.innerHTML = div.innerHTML;

// JS6이후
let text1 = 'HELLO HONG';
let body = document.body;
let div = `
  <div>
    <h1>${text1}</h1>
  </div>
`;
body.innerHTML = div;
```

- More String Implovements

```javascript
const isEmail = email => email.includes('@');
console.log(isEmail('gmm117@naver.com'));

const lastNumber = '2519';
console.log(`${'*'.repeat(3)}-${'*'.repeat(4)}-${lastNumber}`);

const name = 'hong';
console.log(name.startsWith('o'));
console.log(name.endsWith('g'));
```

- Array

* Array.of, Array.from

```javascript
Array.of(1, 2, 3, false, 'hong');
// Array.from => array-like object(HTMLCollection등등) 를 array 만들어줌
```

- Array.find

```javascript
const friendEmails = ['a@gmail.com', 'b@naver.com', 'c@daum.net'];

const target = friendEmails.find(friend => friend.includes('gmail.com'));
console.log(target);

const targetIdx = friendEmails.findIndex(friend =>
  friend.includes('gmail.com'),
);
console.log(targetIdx);

friendEmails.fill('*'.repeat(5), 0, 2);
console.log(friendEmails);
// value : 배열을 채울 값, start 시작인덱스, end 끝인덱스(숫자의 -1인덱스))
```

- For ... of

```javascript
const friends = ['kim', 'choi', 'seyoung', 'duhyun'];

// 잘못된 length의 array에 접근시 undefined가 나오는 문제는 생긴다.(ex: i<20)
for (let i = 0; i < friends.length; ++i) {
  console.log(`my best friends ${i}, ${friends[i]}`);
}

const myFriends = (friend, i) => console.log(`my best friends ${i}, ${friend}`);

friends.forEach(myFriends);

// const, let 선언 가능(forEach에 비해서)
//
for (const friend of friends) {
  console.log(`my best friends ${friend}`);
}

for (const str of 'Helloo this is string') {
  console.log(`${str}`);
}
```

- fetch

```javascript
// fetch의 return값을 promise를 리턴하도록 되어있음
fetch('https://yts.am/api/v2/list_movies.json')
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(err => console.log(err));
```

- Symbol

```javascript
// uniquie함을 보장해준다.
const info = {
  [Symbol('hong')]: {
    age: 35,
  },
  [Symbol('hong')]: {
    age: 30,
  },
  hello: 'bye',
};

// key에 대한 privacy 보장
Object.keys(info);
Object.getOwnPropertySymbols(info); // private을 보장하지 않는다.
```

- Sets

```javascript
// Sets
// 중복된 값을 저장하지 않는다.
const userset = new Set([1, 2, 3, 4, 5, 6, 7, 7, 7, 7, 8]);
userset.has(9);
userset.delete(4);
userset.clear();
userset.add('hi');
userset.size;
userset.keys(); // return iterator
```

- WeakSet

```javascript
// weakset은 number, text 저장 불가능(단지 objects와 함께 동작)
// weakset은 has,add,delete 정도만 가지고 있는 작은 set이다.
// weakset에 넣은 objects를 가리키는 것이 없다면 garbage collection에 의해서 지워진다(약하게 붙들려 있다고 가정)
const weakSet = new WeakSet();
weakSet.add({ hi: true });
```

- Map

```javascript
// map도 weakmap 존재
const map = new Map();
map.set('age', 35);
map.entries();
map.has('age');
map.get('age');
map.set('age', 1111); // 덮어쓰기 가능
```

- Proxies

```javascript
// 속성조회,할당등에 대한 행위에 대한 사용자의 커스텀 동작을 정의할 떄 사용
const userObj = {
  username: 'hong',
  age: 36,
  password: 1234,
};

const userObj = {
  username: 'hong',
  age: 36,
  password: 1234,
};

const userFilter = {
  get: (target, prop, recevier) => {
    return prop === 'password' ? `${'*'.repeat(5)}` : target[prop];
  },
  set: () => {
    console.log('call set function');
  },
};

const filteredUser = new Proxy(userObj, userFilter);
undefined;
filteredUser.password;
// "*****"
filteredUser.age;
// 36
filteredUser.username;
// "hong"
```
