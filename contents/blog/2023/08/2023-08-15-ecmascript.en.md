---
layout: post
title: ECMAScript
date: 2023-08-15
published: 2023-08-15
category: Development
tags: ['javascript']
comments: true,
thumbnail: './assets/15/thumbnail.jpeg'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# ES2024(ES15)

**Features added in ES2024**

[ECMAScript® 2024 Language Specification](https://tc39.es/ecma262/)

ECMAScript 2024, the 15th edition, added facilities for resizing and transferring ArrayBuffers and SharedArrayBuffers; added a new RegExp **`/v`** flag for creating RegExps with more advanced features for working with sets of strings; and introduced the **`Promise.withResolvers`** convenience method for constructing Promises, the **`Object.groupBy`** and **`Map.groupBy`** methods for aggregating data, the **`Atomics.waitAsync`** method for asynchronously waiting for a change to shared memory, and the **`String.prototype.isWellFormed`** and **`String.prototype.toWellFormed`** methods for checking and ensuring that strings contain only well-formed Unicode.

**Promise.withResolvers**

[tc39/proposal-promise-with-resolvers](https://github.com/tc39/proposal-promise-with-resolvers)

[Promise.withResolvers() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers)

One of the ways to extend Promises: it returns a new `Promise` instance along with that Promise's resolve and reject functions.

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

A function that groups the items of an array into an object/Map form.

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

A static method that waits asynchronously on a shared memory location and returns a Promise.

- Note that the method above only works with Int32Array or BigInt64Array.

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

**RegExp `/v` flag**

[tc39/proposal-regexp-v-flag](https://github.com/tc39/proposal-regexp-v-flag)

With regular expression pattern matching you can search for Unicode emoji using the `/u` flag, but the `/v` flag was added so that combined (composed) emoji code values can also be searched.

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

**Well-formed Unicode strings**

- [The string method .isWellFormed()](https://exploringjs.com/js/book/ch_strings.html#qref-String.prototype.isWellFormed) checks whether a JavaScript string is *well-formed* and does not contain any [lone surrogate](https://exploringjs.com/js/book/ch_unicode.html#unicode-lone-surrogate).
- [The string method .toWellFormed()](https://exploringjs.com/js/book/ch_strings.html#qref-String.prototype.isWellFormed) returns a copy of the string in which lone surrogates are replaced with the code unit 0xFFFD (0xFFFD represents an equal number of code points and is named the "replacement character"). As a result, the return value is well-formed.

What are surrogates?

- In Unicode, surrogates are code points used to represent characters that do not belong to the Basic Multilingual Plane (BMP).

```tsx
high surrogate: U+D800 ~ U+DBFF
log surrogate: U+DC00 ~ U+DFFF
```

What is a lone surrogate?

- It refers to a case where only one member of a surrogate pair remains. It means there is a high surrogate but no low surrogate, or vice versa. This situation is not a valid UTF-16 representation and does not represent a valid character. It can cause problems during file transfers or text processing.
- The Unicode standard provides rules for handling such situations.

Returns a `[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)` string in which surrogate strings are replaced with the Unicode replacement character U+FFFD.

- A surrogate string must always consist of a `leading` and `trailing` pair, but when they are not paired an error occurs. Since errors also occur when passing such strings to a server over communication, you must always convert them with toWellFormed before sending.

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
  'ab😄c',
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

**Features added in ES2023**

[ECMAScript® 2024 Language Specification](https://tc39.es/ecma262/)

ECMAScript 2023, the 14th edition, introduced the `toSorted`, `toReversed`, `with`, `findLast`, and `findLastIndex` methods on `Array.prototype` and `TypedArray.prototype`, as well as the `toSpliced` method on `Array.prototype`; added support for `#!` comments at the beginning of files to better facilitate executable ECMAScript files; and allowed the use of most Symbols as keys in weak collections.

**Array find from last**

[tc39/proposal-array-find-from-last](https://github.com/tc39/proposal-array-find-from-last)

The ability to search an array's values from the end was added.

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

In JavaScript, when you modify an array, some APIs shallow-copy the existing array, which ends up mutating the original array. APIs that perform a deep copy (returning a new array object) for those operations were added.

This looks like a case where the immutability concept from functional programming has been applied.

Array.prototype.toReversed() -> Array<br />
Array.prototype.toSorted(compareFn) -> Array<br />
Array.prototype.toSpliced(start, deleteCount, ...items) -> Array<br />
Array.prototype.with(index, value) -> Array<br />
TypedArray.prototype.toReversed() -> TypedArray<br />
TypedArray.prototype.toSorted(compareFn) -> TypedArray<br />
TypedArray.prototype.with(index, value) -> TypedArray<br />

- **toReversed**

Reverses the order of the existing array and returns a new array.

```tsx
const sequence = [1, 2, 3];
sequence.toReversed(); // => [3, 2, 1]
sequence; // => [1, 2, 3]
```

- **toSorted( compare function )**

Takes a compare function and returns a new array (default: ascending order).

```tsx
const sequence = [3, 2, 3];
sequence.toSorted(); // => [1, 2, 3]
sequence; // => [3, 2, 1]

const outOfOrder = new Uint8Array([3, 1, 2]);
outOfOrder.toSorted(); // => Uint8Array [1, 2, 3]
outOfOrder; // => Uint8Array [3, 1, 2]
```

- **toSpliced( start, delectCnt, ...item )**

Deletes or replaces elements of an array.

```tsx
const sequence = [1, 2, 3];
sequence.toSliced(0, 1); // => [2, 3]
sequence; // => [1, 2, 3];
```

- **with( index, value )**

Replaces the value of the element at the given array index.

```tsx
const correctionNeeded = [1, 1, 3];
correctionNeeded.with(1, 2); // => [1, 2, 3]
correctionNeeded; // => [1, 1, 3]
```

- **Symbols as WeakMap keys**

[tc39/proposal-symbols-as-weakmap-keys](https://github.com/tc39/proposal-symbols-as-weakmap-keys)

As you can tell from the title, you can use a Symbol as a key in a WeakMap. Up until 2022 only strings could be used.

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

When a JavaScript file is executed from the CLI, the HashBang (#!) symbol and that line are ignored. However, it is only valid at the very beginning of the source code.

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

- Features added in ES2022
  [https://tc39.es/ecma262/](https://tc39.es/ecma262/)

- Class Fields

- babel setup

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

Since ES2015, we have been able to define fields through the constructor. Typically, fields that should not be accessed outside class methods are prefixed with an underscore. However, this did not actually prevent users of the class from accessing them.

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

Some methods or variables in a class carry the importance of performing the internally intended functionality of the class, and must not be accessible from the outside. To prevent this, you can prefix a method or accessor with '#'.

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

Static fields and methods are useful for existing only on the prototype, but not on every instance of a given class. You can restrict these fields and methods so that they can only be accessed within the class.

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

For a public field, attempting to access a non-existent field of a class returns `undefined`. A private field, on the other hand, throws an exception instead of `undefined`.

To prevent this, you can use the `in` keyword to check for a private property/method.

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

It provides quite a lot of information about the position of the full match in the original input, but lacks information about the indices of substring matches. Using the new `/d`, you can obtain the start and end positions for a matched group.

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

Before this feature, await could only be used inside an async function. This posed the problem that await could not be used at the top level of a module.

Now `await` can be used at the top level of a module, which is very useful when creating imports, fallbacks, and so on.

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

It returns a response as soon as one of the promises is fulfilled. However, if all promises error out, it returns an AggregateError.

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

Common trait: parallel processing since ES2017

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

- Logical assignment operators

Logical assignment operators combine a logical operator with an assignment expression. There are two new operators.

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

- Numeric separators

```javascript
1_000_000_000; // 1,000,000,000(10억)
const amount = 1_234_500; // 1,234,500
```

- WeakRef, FinalizationRegistry

A `WeakRef` object contains a weak reference to an object, called its *target* or *referent*. A *weak reference* to an object is a reference that does not prevent the garbage collector from reclaiming the object.

FinalizationRegistry provides a way to request that a *cleanup callback* (_finalizer_) be invoked when an object registered in the registry is *reclaimed* (garbage-collected).

Create a registry that takes a callback. (GC memory release → FinalizationRegistry callback invoked)

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

In the past, the global object in browsers was window and in Node.js it was global. Because they differed, there were many cases where you had to branch your code. Now they have been unified under globalThis. Of course, the existing window and global still exist.

```javascript
// 브라우저에서는
globalThis === window; // true

// 노드에서는
globalThis === global; // true
```

- optional chaining

The most common errors you see in JavaScript are cannot read property X of undefined or cannot read property Y of undefined.

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

Returns b only when the value is null or undefined.

```javascript
0 || 'A'; // A
0 ?? 'A'; // 0

0 ? 0 : 'A'; // A
0 ?? 'A'; // 0
```

- Dynamic Import

File imports can now be done dynamically.

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

Unlike Promise.all(), which only runs when all operations succeed (resolve), Promise.allSettled() runs to completion even if some operations fail (reject) along the way.

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

- Reference sites

<a href="https://gomugom.github.io/ecmascript-proposals-1-intro/" target="_blank" style="font-size=30px; color: #4dabf7; text-decoration:underline;">https://gomugom.github.io/ecmascript-proposals-1-intro/</a>
<a href="https://junhobaik.github.io/es2016-es2020/" target="_blank" style="font-size=30px; color: #4dabf7; text-decoration:underline;">https://junhobaik.github.io/es2016-es2020/</a>
<a href="https://ui.toast.com/fe-guide/ko_ES5-TO-ES6/" target="_blank" style="font-size=30px; color: #4dabf7; text-decoration:underline;">https://ui.toast.com/fe-guide/ko_ES5-TO-ES6/</a>
<a href="https://www.zerocho.com/category/ECMAScript/post/5eae7480e70c21001f3e7956" target="_blank" style="font-size=30px; color: #4dabf7; text-decoration:underline;">https://www.zerocho.com/category/ECMAScript/post/5eae7480e70c21001f3e7956</a>

# ES2019(ES10)

- String.trimStart() & trimEnd()

Removes whitespace from the beginning or end of a string.
There is trimStart, which removes the leading whitespace, and trimEnd, which removes the trailing whitespace.

```javascript
const s = ' hello world';
const e = '! ';

console.log(s + e + ';');
// " hello world! ;"

console.log(s.trimStart() + e.trimEnd() + ';');
// "hello world!;"
```

- Optional Catch Binding

You can use a catch block without a catch parameter.

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

If you turned an object into an array of entries, this means you can turn it back into an object with fromEntries. If you understand entries, you can grasp it easily through the example below.

```javascript
const obj1 = { name: 'Jhon', age: 24 };

const entries = Object.entries(obj1);
console.log(entries); // [["name", "Jhone"], ["age", 24]]

const fromEntries = Object.fromEntries(entries);
console.log(fromEntries); // {name: "Jhon", age: 24}
```

- Array.flat() & flatMap()

The flat method makes it easy to merge arrays inside an array.

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

The rest/spread that was previously used with arrays can now also be used with objects.

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
// ["choi", "kim", "seyoung"]

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

For then, catch, and finally: previously a Promise only had then and catch, but now finally has been added as well.

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

It became possible to iterate over asynchronous iterable objects.

```javascript
for await (const req of requests) {
  console.log(req);
}
```

# ES2017(ES8)

- String padding

A method that, for a string shorter than the maximum length, repeatedly fills the padding with a specified string.
padStart pads on the left side of the string, and padEnd does the opposite.
Neither method has any effect on strings longer than maxLength.

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

getOwnPropertyDescriptor is a method that takes an object and a property name as arguments and returns the property descriptor of that property.

Object.getOwnPropertyDescriptor(obj, prop)

getOwnPropertyDescriptors takes only an object, without a property name, and returns the property descriptors for all properties within the object.

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

You can now add a comma after the last parameter and argument of a function.

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

The built-in array function includes was added.
It returns a boolean value indicating whether an item exists.

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

It introduced syntax that is commonly used in other programming languages.
x \*\* y means x raised to the power of y, which is completely equivalent to Math.pow(x, y).

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

- Advantages of let and const

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

 * Arrow function

```javascript
const sum = (a, b) => {
return a + b;
};
````

- Class

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

- Enhanced object literal

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

- Template literal

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

- Destructuring

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

- Setting default values for function parameters

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

- Before ES6, you had to check whether aName was undefined and then set the value again, but now it is possible to set an initial value for an argument.
  e.g.) let defalutName = aName || "hong"

* Rest parameters, Spread expression

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

- Generator

You can pause the flow of a function at a specific point and then resume execution later.
You can emit result values multiple times.
The emergence of the Generator syntax led to the appearance of various libraries such as redux-saga and rxjs.

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

- Promise

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

- Module (ES Module)

* Named export

A named export can be done multiple times in a single file. Things exported via named export must later be imported in other modules under the same name they were exported with.

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

A default export, on the other hand, can be used only once per script file. And because only an expression is allowed after export default, keywords such as var, let, and const cannot be used.

The objects exported in this way can be accessed by modules. So from now on, let's look at the import statement that brings in objects exported from a module.

```javascript
export default 'Jack';

import jack from 'studentJack';
```

# ES5 (2009)

Support for array methods such as forEach, map, filter, reduce, some, and every
Support for getters / setters on Objects

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

What we commonly refer to as JavaScript.
Support for JavaScript strict mode (performs stricter? syntax checking).
Support for JSON (in the past XML was used, but as JSON gained popularity it came to be supported).

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
