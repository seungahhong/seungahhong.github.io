---
layout: post
title: javascript
date: 2021-12-21
published: 2021-12-21
category: javascript
tags: ['ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', 'javascript']
comments: true,
thumbnail: './images/thumbnail.jpg'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# ES2020

## globalThis

예전에는 브라우저의 전역객체는 window였고 Node.js의 전역객체는 global이었습니다. 둘이 달라서 분기처리를 해줘야 했던 경우가 많았는데 이제는 globalThis라는 것으로 통일되었습니다. 물론 기존 window나 global도 존재합니다.

```javascript
// 브라우저에서는
globalThis === window; // true

// 노드에서는
globalThis === global; // true
```

## optional chaining

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

## Nullish Coalescing Operator

null이나 undefined일 때만 b를 반환합니다.

```javascript
0 || 'A'; // A
0 ?? 'A'; // 0

0 ? 0 : 'A'; // A
0 ?? 'A'; // 0
```

## Dynamic Import

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

## Promise.allSettled

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

## 참고사이트

<a href="https://gomugom.github.io/ecmascript-proposals-1-intro/" target="_blank" style="font-size=30px; color: #4dabf7; text-decoration:underline;">https://gomugom.github.io/ecmascript-proposals-1-intro/</a>
<a href="https://junhobaik.github.io/es2016-es2020/" target="_blank" style="font-size=30px; color: #4dabf7; text-decoration:underline;">https://junhobaik.github.io/es2016-es2020/</a>
<a href="https://ui.toast.com/fe-guide/ko_ES5-TO-ES6/" target="_blank" style="font-size=30px; color: #4dabf7; text-decoration:underline;">https://ui.toast.com/fe-guide/ko_ES5-TO-ES6/</a>
<a href="https://www.zerocho.com/category/ECMAScript/post/5eae7480e70c21001f3e7956" target="_blank" style="font-size=30px; color: #4dabf7; text-decoration:underline;">https://www.zerocho.com/category/ECMAScript/post/5eae7480e70c21001f3e7956</a>

# ES2019(ES10)

## String.trimStart() & trimEnd()

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

## Optional Catch Binding

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

## Object.fromEntries()

객체를 entries로 배열로 만들었다면 fromEntries로 다시 객체로 만들 수 있다는 이야기입니다. entires를 이해했다면 간단하게 아래 예제를 통해 알 수 있습니다.

```javascript
const obj1 = { name: 'Jhon', age: 24 };

const entries = Object.entries(obj1);
console.log(entries); // [["name", "Jhone"], ["age", 24]]

const fromEntries = Object.fromEntries(entries);
console.log(fromEntries); // {name: "Jhon", age: 24}
```

## Array.flat() & flatMap()

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

## Rest/Spread Properties

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

## Promise.prototype.finally()

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

## Asynchronous iteration

비동기 이터러블 객체를 순회하는 것이 가능해졌습니다.

```javascript
for await (const req of requests) {
  console.log(req);
}
```

# ES2017(ES8)

## String padding

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

## Object.values / Object.entries

Object.values(object)
Object.entries(obj)

```javascript
const obj = { a: 1, b: 2, c: 3 };
console.log(Object.keys(obj)); // [ "a", "b", "c" ]
console.log(Object.values(obj)); // [ 1, 2, 3 ]
console.log(Object.entries(obj)); // [ ["a", 1], ["b", 2], ["c", 3] ]
```

## Object.getOwnPropertyDescriptors

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

## Trailing commas

함수의 마지막 매개변수와 인자에도 콤마를 넣을 수 있습니다.

const foo = (a, b, c,) => {}

## async/await

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

## Async Awaite(try catch finally)

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

## Paraller Async Await

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

## Array.prototype.includes

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

## Exponentiation operator

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

## let, const의 장점

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

## 화살표 함수(Arrow function)

```javascript
const sum = (a, b) => {
return a + b;
};
````

## 클래스(Class)

### Instroduction classes

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

## Extending classes

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

## WTF is this

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

## 개선된 객체 리터럴(Object literal)

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

## 템플릿 리터럴(Template literal)

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

## 디스트럭처링(Destructuring)

### Object Destructuring

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

### Array Destructuring

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

## 함수 매개변수의 디폴트 값 설정

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

## Rest 파라미터, Spread 표현식

### Spread

```javascript
// Spread object/Array unpack
const number = [1, 2, 3, 4];
const alpha = ['a', 'b', 'c'];

console.log([...number, ...alpha]);
//[1, 2, 3, 4, "a", "b", "c"]
```

### Rest

```javascript
const bestfriends = (one, ...friendsRest) =>
  console.log(`my best friends : ${one}, friends rest : ${friendsRest}`);

bestfriends('kim', 'choi', 'seyoung');
```

### Rest & Spread Destructure

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

## 제너레이터(Generator)

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

## 프로미스(Promise)

### create promises

```javascript
// async function
const newPromise = new Promise((resolve, reject) => {
  setTimeout(resolve, 3000, 'I am new Promise');
});

console.log(newPromise);

setInterval(console.log, 1000, newPromise);
```

### using promises

```javascript
const newPromise = new Promise((resolve, reject) => {
  setTimeout(resolve, 3000, 'I am new Promise');
});

// resolve : then, reject : catch 호출이며 단 하나만 호출이 된다.
newPromise
  .then(value => console.log(value))
  .catch(err => console.log(`error ${err}`));
```

### chaining promises

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

## promises all/race

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

## 모듈(ES Module)

### Named export

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

### Default export

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

# HTML Fragments

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

# More String Implovements

```javascript
const isEmail = email => email.includes('@');
console.log(isEmail('gmm117@naver.com'));

const lastNumber = '2519';
console.log(`${'*'.repeat(3)}-${'*'.repeat(4)}-${lastNumber}`);

const name = 'hong';
console.log(name.startsWith('o'));
console.log(name.endsWith('g'));
```

# Array

## Array.of, Array.from

```javascript
Array.of(1, 2, 3, false, 'hong');
// Array.from => array-like object(HTMLCollection등등) 를 array 만들어줌
```

## Array.find

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

# For ... of

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

## fetch

```javascript
// fetch의 return값을 promise를 리턴하도록 되어있음
fetch('https://yts.am/api/v2/list_movies.json')
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(err => console.log(err));
```

## Symbol

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

## Sets

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

## WeakSet

```javascript
// weakset은 number, text 저장 불가능(단지 objects와 함께 동작)
// weakset은 has,add,delete 정도만 가지고 있는 작은 set이다.
// weakset에 넣은 objects를 가리키는 것이 없다면 garbage collection에 의해서 지워진다(약하게 붙들려 있다고 가정)
const weakSet = new WeakSet();
weakSet.add({ hi: true });
```

## Map

```javascript
// map도 weakmap 존재
const map = new Map();
map.set('age', 35);
map.entries();
map.has('age');
map.get('age');
map.set('age', 1111); // 덮어쓰기 가능
```

## Proxies

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

# 그외

## reduce

**배열.reduce((누적값, 현잿값, 인덱스, 요소) => { return 결과 }, 초깃값);**

```javascript
const oneTwoThree = [1, 2, 3];
// 초기값 세팅 O
result = oneTwoThree.reduce((acc, cur, i) => {
  console.log(acc, cur, i);
  return acc + cur;
}, 0);
// 0 1 0
// 1 2 1
// 3 3 2
result; // 6

// 초기값 세팅 X
result = oneTwoThree.reduce((acc, cur, i) => {
  console.log(acc, cur, i);
  return acc + cur;
});
// 1 2 1
// 3 3 2
result; // 6
```

---

> # Javascript 정리

# IIFE

```javascript
// 숨기고 싶은 값이지만 브라우저에서 secretUsers에 접근이 가능하다.
const secretUsers = ['hong', 'kim', 'choi', 'seyoung'];
console.log(secretUsers);

// IIFE(Immediately-Invoked Function Expressions) 적용
/*function()*/ (() => {
  const secretUsers = ['hong', 'kim', 'choi', 'seyoung'];
  console.log(secretUsers);
})();
```

# javascript를 통한 모듈번들러(웹팩,gulp) 기능 간단구현(ES6)

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <!-- type:module로 인해서 import,export 구현가능 -->
    <script type="module" src="app.js"></script>
    <script type="module" src="app2.js"></script>
  </body>
</html>
```

```javascript
// app.js
let users = ['hong', 'kim', 'choi'];
export const addUsers = user => (users = [...users, user]);

export const getUsers = () => users;

export const deleteUsers = user =>
  (users = users.filter(aUser => aUser !== user));
```

```javascript
//app2.js
import { addUsers, getUsers } from './app.js';

console.log(getUsers());
addUsers('seyoung');
console.log(getUsers());
```

# Javascript6~10 참고사이트

- [Nomad Courses](https://academy.nomadcoders.co/)
