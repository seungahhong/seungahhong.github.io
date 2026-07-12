---
layout: post
title: react-query(v4)
date: 2023-06-30
published: 2023-06-30
category: Development
tags: ['State Management']
comments: true,
thumbnail: './images/30/thumbnail.png'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# Install

## Migrating from react-query → @tanstack/react-query

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

# Supported Range

- typescript

  - TypeScript v4.1 or greater

- Supported Browsers
  - Starting from v4, React Query is optimized for modern browsers

```tsx
Chrome >= 73;
Firefox >= 78;
Edge >= 79;
Safari >= 12.0;
iOS >= 12.0;
opera >= 53;
```

- Support for React 18

# v3 → v4 migraion tools: **[Codemod](https://tanstack.com/query/v4/docs/react/guides/migrating-to-react-query-4#codemod)**

```bash
# for jsx/js
npx jscodeshift ./path/to/src/ \\
  --extensions=js,jsx \\
  --transform=./node_modules/@tanstack/react-query/codemods/v4/replace-import-specifier.js

# for tsx/ts
npx jscodeshift ./path/to/src/ \\
  --extensions=ts,tsx \\
  --parser=tsx \\
  --transform=./node_modules/@tanstack/react-query/codemods/v4/replace-import-specifier.js
```

# New Features

## The idle state has been removed

- A new fetchStatus was introduced to improve offline support
- The idle state became unnecessary because of `fetchStatus: 'idle'`, which better captures the same state

  - **`status`**: represents information about `data`, the query's result value
    - loading: there is no data yet
    - error: there is no data and an error occurred
    - success: data is available
  - **`fetchStatus`**: represents information about the `queryFn`

    - idle: the query is not doing anything
    - paused: the query attempted to fetch but was paused. Related to network mode
    - fetching: the query is fetching

  - In v3, during a background refetch you could not tell the fetching state from isLoading, so isFetching was used
    - In addition to isFetching, you can use fetchStatus.fetching
    - The point is that status could not properly represent the query's state.
    - The initial state value for a disabled query (an unused query) was changed to isLoading
    - isLoading → isInitialLoading
    - If you request (isFetching) a query that has no cached data (isLoading), then isInitialLoading === true

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

- A networkMode option was added, providing an explicit offline mode for queries and mutations

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

- networkMode has three possible values.

  - **`online`**: While offline, it does not fetch until a network connection is available, and in this state the query is marked as `fetchStatus:paused`.
  - **`always`**: It attempts to fetch even while offline, just like when online. Since the request is sent while offline, it will end up in the `status:error` state.
  - **`offlineFirst`**: Behaves the same as in v3. It stops retrying after the first call to queryFn.

## Tracked Query per default (performance improvement)

- [Tracked Query](https://github.com/TanStack/query/discussions/1554): an optimization that triggers re-renders only when the values actually accessed among useQuery's return values change

- Starting from v4, without this handling, React Query [proxies the query internally on its own](https://github.com/TanStack/query/discussions/1554), determines which values the component accesses, and renders based on those values.

```tsx
// v3
function User() {
  const { data } = useQuery('user', fetchUser, {
    // notifyOnChangeProps: ['data'], // re-render only when data changes
    notifyOnChangeProps: 'tracked',
  });
  return <div>Username: {data.username}</div>;
}

// v4
function User() {
  // re-renders only when data changes even without notifyOnChangeProps
  const { data } = useQuery('user', fetchUser);
  return <div>Username: {data.username}</div>;
}
```

# Change Features

## new API for useQueries

- A change in how multiple queries are passed to useQueries

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

## Query Keys (and Mutation Keys) need to be an Array (query keys can only be arrays)

- Query keys (or Mutation Keys) were changed to arrays

- In v3, a key could be either a String or an Array. But in v4, only the Array form is allowed

```tsx
// v3
useQuery('todos', fetchTodos);

// v4
useQuery(['todos'], fetchTodos);
```

## onSuccess is no loger called from setQueryData

- The onSuccess callback is no longer called when setQueryData is invoked.

- The onSuccess callback is only called after an actual request has occurred.

- If you want to actually subscribe to changes in data, it is recommended to use useEffect instead of onSuccess

```tsx
const { data } = useQuery({ queryKey, queryFn });
React.useEffect(() => mySideEffectHere(data), [data]);
```

## Undefined is an illegal cache value for successful queries (queryFn cannot return undefined)

`queryFn` is blocked at both the type and runtime levels from returning `undefined`

```tsx
// ❌
useQuery(['key'], () =>
  axios.get(url).then(result => console.log(result.data)),
);
```

## The cancel method on promises is no longer supported

- The cancel method that was used to support query cancellation is no longer available

- Instead, for query cancellation, it is recommended to use the [newer API](https://tanstack.com/query/v4/docs/react/guides/query-cancellation) (introduced in v3.30.0), which internally uses the [AbortController API](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) and provides an [AbortSignal instance](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) to the query function to support query cancellation

## Logging in production

- Logging is disabled in production mode (errors are shown in development mode)

## setLogger is removed

- The way to enable a globally configured logger has changed

```tsx
// v3
import { QueryClient, setLogger } from 'react-query';
setLogger(customLogger);
const queryClient = new QueryClient();

// v4
import { QueryClient } from '@tanstack/react-query';
const queryClient = new QueryClient({ logger: customLogger });
```

# Integration with react-router-dom v6

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

# References

- [https://tanstack.com/query/v4/docs/react/guides/migrating-to-react-query-4](https://tanstack.com/query/v4/docs/react/guides/migrating-to-react-query-4)
- [https://nuhends.tistory.com/134](https://nuhends.tistory.com/134)
- [https://maxkim-j.github.io/posts/tanstack-query-v4-preview/](https://maxkim-j.github.io/posts/tanstack-query-v4-preview/)
