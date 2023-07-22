---
layout: post
title: react-query(v4)
date: 2023-06-30
published: 2023-06-30
category: 개발
tags: ['상태관리']
comments: true,
thumbnail: './images/30/thumbnail.png'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# Install

## react-quey → @tanstack/react-query로 변경

```bash
npm uninstall react-query
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools
```

```tsx
// v3
import { useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClientProvider } from 'react-query/react';

// v4
import { useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider } from '@tanstack/react-query/reactjs';
```

# 지원범위

- typescript

  - TypeScript v4.1 or greater

- Supported Browsers
  - v4부터 React Query는 최신 브라우저에 최적화

```tsx
Chrome >= 73;
Firefox >= 78;
Edge >= 79;
Safari >= 12.0;
iOS >= 12.0;
opera >= 53;
```

- Support for React 18

# v3 → v4 migraion tools: **[Codemod](https://tanstack.com/query/v4/docs/react/guides/migrating-to-react-query-4#codemod)**

```bash
# jsx/js 인 경우
npx jscodeshift ./path/to/src/ \\
  --extensions=js,jsx \\
  --transform=./node_modules/@tanstack/react-query/codemods/v4/replace-import-specifier.js

# tsx/ts 인 경우
npx jscodeshift ./path/to/src/ \\
  --extensions=ts,tsx \\
  --parser=tsx \\
  --transform=./node_modules/@tanstack/react-query/codemods/v4/replace-import-specifier.js
```

# New Features

## The idle state has been removed

- 오프라인 지원을 개선하기 위해 새로운 fetchStatus가 도입
- 동일한 상태를 더 잘 캡처하는 fetchStatus: 'idle'로 인해 idle state는 불필요해짐

  - **`status`**: `data`, 쿼리 결과값에 대한 정보를 나타냄
    - loading: 아직 data가 없음
    - error: data는 없고 에러가 있음
    - success: data가 있음
  - **`fetchStatus`**: `queryFn`에 대한 정보를 나타냄

    - idle: 쿼리가 아무것도 안하고 있는 상태
    - paused: 쿼리가 패칭을 시도했지만 일시중지된 상태. network mode와 연관
    - fetching: 쿼리가 패칭중인 상태

  - v3에서 background refetch 상황에서는 패칭에 대한 상태값을 isLoading으로 알 수가 없어서 isFetching을 사용
    - isFetching 외에 fetchStatus.fetching 사용가능
    - status가 query의 상태를 제대로 표현할 수 없었던 것이죠.
    - 비활성화된 쿼리(사용하지 않는 쿼리)에 대한 초기 상태값이 isLoading 변경
    - isLoading → isInitialLoading
    - 캐시된 데이터가 없는(isLoading) 쿼리를 요청(isFetching)하면 isInitialLoading === true

```tsx
export default function Test() {
  const { isSuccess: q1Succeed } = useQuery1();
  const { data: q2Data, isLoading: q2Loading } = useQuery2({
    options: {
      enabled: q1Succeed,
    },
  });
  const { data: q3Data, isLoading: q3Loading } = useQuery3({
    options: {
      enabled: q1Succeed,
    },
  });
  const { refetch: q4Refetch } = useQuery4({
    options: {
      enabled: false,
    },
  });

  if (q2Loading || q3Loading) {
    return <>Loading...</>;
  }

  return (
    <>
      {q2Data.tmpData} / {q3Data.tmpData}
    </>
  );
}

// useQuery1	useQuery2	useQuery3	useQuery4
// 1	idle	  idle	    idle	    idle
// 2	loading	idle	    idle	    idle
// 3	success	idle	    idle	    idle
// 4	success	loading	  loading	  idle
// 5	success	success	  success	  idle
```

## Queries and mutations, per default, need network connection to run

- query와 mutation의 명시적인 오프라인 모드를 제공하는 기능인 networkMode 옵션이 추가

```tsx
new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
});
```

- networkMode의 설정값은 3가지입니다.

  - **`online`**: 오프라인 상태에서 network connection이 있기 전까지 fetch를 하지 않고, 이때 쿼리의 상태를 `fetchStatus:paused` 로 표시합니다.
  - **`always`**: 오프라인 상태에서도 온라인처럼 fetch를 시도합니다. 오프라인 상태에서 요청을 보내는 것이니 `status:error` 상태가 될 겁니다.
  - **`offlineFirst`**: v3에서의 동작과 같습니다. queryFn 최초 호출 후 retry를 멈춥니다.

## Tracked Query per default(성능개선)

- [Tracked Query](https://github.com/TanStack/query/discussions/1554): useQuery의 리턴값 중, 실질적으로 직접 접근하는 값들이 변했을때만 리렌더링이 되게끔 하는 최적화 처리

- v4부터는 이 처리가 없이도 [자체적으로 query를 proxy처리하고](https://github.com/TanStack/query/discussions/1554), 컴포넌트에서 어떤 값에 접근하는지 판단하여 해당 값을 렌더링 처리해줌.

```tsx
// v3
function User() {
  const { data } = useQuery('user', fetchUser, {
    // notifyOnChangeProps: ['data'], // data가 바뀌었을 때만 리렌더링
    notifyOnChangeProps: 'tracked',
  });
  return <div>Username: {data.username}</div>;
}

// v4
function User() {
  // notifyOnChangeProps가 없어도 data가 바뀌었을 때만 리렌더링
  const { data } = useQuery('user', fetchUser);
  return <div>Username: {data.username}</div>;
}
```

# Change Features

## new API for useQueries

- useQueries에 여러개 쿼리를 넘길 때 방식의 변화

```tsx
// v3
useQueries([
  { queryKey1, queryFn1, options1 },
  { queryKey2, queryFn2, options2 },
]);

// v4
useQueries({
  queries: [
    { queryKey1, queryFn1, options1 },
    { queryKey2, queryFn2, options2 },
  ],
});
```

## Query Keys (and Mutation Keys) need to be an Array(쿼리키는 배열만 가능)

- Query key (혹은 Mutation Key)가 배열로 변경

- v3에서 key는 String | Array 둘 다 가능했다. 하지만 v4에서는 Array 형태만 가능

```tsx
// v3
useQuery('todos', fetchTodos);

// v4
useQuery(['todos'], fetchTodos);
```

## onSuccess is no loger called from setQueryData

- onSuccess 콜백이 setQueryData를 호출했을 때 더이상 호출되지 않습니다.

- onSuccess 콜백은 실질적인 요청이 발생한 후에만 호출됩니다.

- data가 바뀐 것을 실질적으로 구독하고 싶다면 onSuccess → useEffect 사용 권고

```tsx
const { data } = useQuery({ queryKey, queryFn });
React.useEffect(() => mySideEffectHere(data), [data]);
```

## Undefined is an illegal cache value for successful queries(queryFn undefined 리턴 불가)

`queryFn`이 `undefined`를 리턴할 수 없도록 타입, 런타임 단에서 막힘

```tsx
// ❌
useQuery(['key'], () =>
  axios.get(url).then(result => console.log(result.data)),
);
```

## The cancel method on promises is no longer supported

- query cancellation 지원을 위해서 사용되던 cancel 메서드 사용안됨

- 대신 쿼리 취소를 위해서는 내부적으로 [AbortController API](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)를 사용하고 쿼리 취소를 지원하기 위해 쿼리 함수에 대한 [AbortSignal instance](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)를 제공하는 [newer API](https://tanstack.com/query/v4/docs/react/guides/query-cancellation)(v3.30.0에 도입됨)를 사용을 권고

## Logging in production

- production 모드에서는 로깅 처리 비활성(개발 모드에서는 오류 표시)

## setLogger is removed

- 전역으로 세팅했던 로그에 대한 활성화 사용법 변경

```tsx
// v3
import { QueryClient, setLogger } from 'react-query';
setLogger(customLogger);
const queryClient = new QueryClient();

// v4
import { QueryClient } from '@tanstack/react-query';
const queryClient = new QueryClient({ logger: customLogger });
```

# react-router-dom v6 연동

[https://tanstack.com/query/v4/docs/react/examples/react/react-router](https://tanstack.com/query/v4/docs/react/examples/react/react-router)

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader(queryClient),
    action: rootAction(queryClient),
  },
]);
```

# 참고페이지

- [https://tanstack.com/query/v4/docs/react/guides/migrating-to-react-query-4](https://tanstack.com/query/v4/docs/react/guides/migrating-to-react-query-4)
- [https://nuhends.tistory.com/134](https://nuhends.tistory.com/134)
- [https://maxkim-j.github.io/posts/tanstack-query-v4-preview/](https://maxkim-j.github.io/posts/tanstack-query-v4-preview/)
