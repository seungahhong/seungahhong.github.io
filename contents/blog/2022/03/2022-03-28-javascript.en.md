---
layout: post
title: javascript
date: 2022-03-28
published: 2022-03-28
category: Development
tags: ['javascript']
comments: true,
thumbnail: './assets/28/thumbnail.jpg'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

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

- JavaScript 6~10 reference sites

* [Nomad Courses](https://academy.nomadcoders.co/)
