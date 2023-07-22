---
layout: post
title: react-query(v5)
date: 2023-07-23
published: 2023-07-23
category: 개발
tags: ['상태관리']
comments: true,
thumbnail: './assets/23/thumbnail.png'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# v5 변경사항

## Install

### react-query → @tanstack/react-query로 변경

```bash
$ npm i @tanstack/react-query@alpha
# or
$ pnpm add @tanstack/react-query@alpha
# or
$ yarn add @tanstack/react-query@alpha
```

## Requirements

```tsx
Chrome >= 84;
Firefox >= 90;
Edge >= 84;
Safari >= 15;
iOS >= 15;
opera >= 70;
```

## New Features

- Simplified optimistic updates

  - 낙관적 UI 업데이트에 필요한 variables 사용방법이 간단해졌습니다(리턴값으로 variables가 리턴)

  ```tsx
  const queryInfo = useTodos();
  const addTodoMutation = useMutation({
    mutationFn: (newTodo: string) => axios.post('/api/data', { text: newTodo }),
    onSuccess: (data, variables, context) => {
      // I will fire first
    },
    onError: (error, variables, context) => {
      // I will fire first
    },
    onSettled: (error, variables, context) =>
      queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  addTodoMutation.mutate(variables, {
    onError,
    onSuccess,
  });

  if (queryInfo.data) {
    return (
      <ul>
        {queryInfo.data.items.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
        {addTodoMutation.isPending && (
          <li
            key={String(addTodoMutation.submittedAt)}
            style={{ opacity: 0.5 }}
          >
            {addTodoMutation.variables}
          </li>
        )}
      </ul>
    );
  }
  ```

- New combine option for useQueries
  - useQueries에 호출되는 query에 대한 합칠 수 있는 combine 속성이 추가 되었습니다.
  ```tsx
  const ids = [1, 2, 3];
  const combinedQueries = useQueries({
    queries: ids.map(id => [
      { queryKey: ['post', id], queryFn: () => fetchPost(id) },
    ]),
    combine: results => {
      return {
        data: results.map(result => result.data),
        pending: results.some(result => result.isPending),
      };
    },
  });
  ```
- Limited, Infinite Queries with new maxPages option
  - Infinite Query 는 많은 페이지를 가져올수록, 더 많은 메모리를 소비하고, 이는 모든 페이지가 순차적으로 refetch되어야 하므로 query refetch 과정을 느려지게 됩니다.
  - maxPages를 제공함으로써 최대 페이지수를 제공해서 꼭 필요한 페이지만 얻어오도록 처리가 가능하다.
- Prefetching Infinite Queries
  - Infinite Queries에서도 프리페치 기능이 추가되었습니다.
  - 1 페이지 이상의 데이터를 미리 로딩하고 싶으면, pages 옵션에 숫자를 지정해서 미리 page 데이터를 로딩이 가능합니다.
  ```tsx
  const prefetchTodos = async () => {
    // The results of this query will be cached like a normal query
    await queryClient.prefetchInfiniteQuery({
      queryKey: ['projects'],
      queryFn: fetchProjects,
      defaultPageParam: 0,
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
      pages: 3, // prefetch the first 3 pages
    });
  };
  ```
- Typing Query Options(Typesafe way to create Query Options)

  ```tsx
  import { queryOptions } from '@tanstack/react-query';

  function groupOptions() {
    return queryOptions({
      queryKey: ['groups'],
      queryFn: fetchGroups,
      staleTime: 5 * 1000,
    });
  }

  useQuery(groupOptions());
  queryClient.prefetchQuery(groupOptions());
  ```

  ```tsx
  import { queryOptions } from '@tanstack/react-query';

  function groupOptions() {
    return queryOptions({
      queryKey: ['groups'],
      queryFn: fetchGroups,
      staleTime: 5 * 1000,
    });
  }

  useQuery(groupOptions());
  queryClient.prefetchQuery(groupOptions());
  ```

## Change Features

- Supports a single signature, one object
  - 함수 호출 시그니처(객체 형식) 만을 지원
  - useQuery, useInfiniteQuery 등을 인자로 제공함에 따라서 타입스크립트에서 많은 오버르도를 가지곤 했고, 이걸 통해서 타입 유지, 인자별로 어떤 타입이지를 체크하는 런타임 검사가 필요했습니다.
  - 따라서 v5부터는 오직 객체 형식만 지원합니다.
  ```tsx
  -useQuery(key, fn, options) +
    useQuery({ queryKey, queryFn, ...options }) -
    useInfiniteQuery(key, fn, options) +
    useInfiniteQuery({ queryKey, queryFn, ...options }) -
    useMutation(fn, options) +
    useMutation({ mutationFn, ...options }) -
    useIsFetching(key, filters) +
    useIsFetching({ queryKey, ...filters }) -
    useIsMutating(key, filters) +
    useIsMutating({ mutationKey, ...filters }) -
    queryClient.isFetching(key, filters) +
    queryClient.isFetching({ queryKey, ...filters }) -
    queryClient.ensureQueryData(key, filters) +
    queryClient.ensureQueryData({ queryKey, ...filters }) -
    queryClient.getQueriesData(key, filters) +
    queryClient.getQueriesData({ queryKey, ...filters }) -
    queryClient.setQueriesData(key, updater, filters, options) +
    queryClient.setQueriesData({ queryKey, ...filters }, updater, options) -
    queryClient.removeQueries(key, filters) +
    queryClient.removeQueries({ queryKey, ...filters }) -
    queryClient.resetQueries(key, filters, options) +
    queryClient.resetQueries({ queryKey, ...filters }, options) -
    queryClient.cancelQueries(key, filters, options) +
    queryClient.cancelQueries({ queryKey, ...filters }, options) -
    queryClient.invalidateQueries(key, filters, options) +
    queryClient.invalidateQueries({ queryKey, ...filters }, options) -
    queryClient.refetchQueries(key, filters, options) +
    queryClient.refetchQueries({ queryKey, ...filters }, options) -
    queryClient.fetchQuery(key, fn, options) +
    queryClient.fetchQuery({ queryKey, queryFn, ...options }) -
    queryClient.prefetchQuery(key, fn, options) +
    queryClient.prefetchQuery({ queryKey, queryFn, ...options }) -
    queryClient.fetchInfiniteQuery(key, fn, options) +
    queryClient.fetchInfiniteQuery({ queryKey, queryFn, ...options }) -
    queryClient.prefetchInfiniteQuery(key, fn, options) +
    queryClient.prefetchInfiniteQuery({ queryKey, queryFn, ...options }) -
    queryCache.find(key, filters) +
    queryCache.find({ queryKey, ...filters }) -
    queryCache.findAll(key, filters) +
    queryCache.findAll({ queryKey, ...filters });
  ```
- Callback on useQuery(and QueryObserver) have been removed
  options에 onSuccess, onError, onSettled 콜백 함수가 제거되었습니다.(단, mutation에 대해서는 적용하지 않음)

  - 쿼리당 한번만 호출되는 콜백인 전역 캐시 단계 콜백 사용
    - 쿼리 마다 다른 메시지를 보여줄 경우에는 meta 필드를 사용
  - 추가적인 렌더링 사이클
    - useState로 관를 할 경우 값이 동기화 되는 중간레이어에 상태가 렌더링 되는 경우가 발생
    - 원하는 상태값을 객체 형식으로 리턴하도록 처리
  - fetch가 발생해야 실행되는 콜백 함수 사용대시 실제 data changed를 deps로 걸어서 변경해보자.
    [https://tkdodo.eu/blog/breaking-react-querys-api-on-purpose](https://tkdodo.eu/blog/breaking-react-querys-api-on-purpose)

  ```bash
  // <= v4
  export function useTodos() {
    return useQuery({
      queryKey: ['todos', 'list'],
      queryFn: fetchTodos,
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  export function useTodos() {
    const [todoCount, setTodoCount] = React.useState(0)
    const { data: todos } = useQuery({
      queryKey: ['todos', 'list'],
      queryFn: fetchTodos,
      //😭 please dont
      onSuccess: (data) => {
        setTodoCount(data.length)
      },
    })

    return { todos, todoCount }
  }

  export function useTodos() {
    const { dispatch } = useDispatch()

    return useQuery({
      queryKey: ['todos', 'list'],
      queryFn: fetchTodos,
      onSuccess: (data) => {
        dispatch(setTodos(data))
      },
    })
  }

  // >= v5
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.meta.errorMessage) {
          toast.error(query.meta.errorMessage)
        }
      },
    }),
  })

  export function useTodos() {
    return useQuery({
      queryKey: ['todos', 'list'],
      queryFn: fetchTodos,
      meta: {
        errorMessage: 'Failed to fetch todos',
      },
    })
  }

  export function useTodos() {
    const { data: todos } = useQuery({
      queryKey: ['todos', 'list'],
      queryFn: fetchTodos,
    })

    const todoCount = todos?.length ?? 0

    return { todos, todoCount }
  }

  export function useTodos(filters) {
    const { dispatch } = useDispatch()

    const query = useQuery({
      queryKey: ['todos', 'list', { filters }],
      queryFn: () => fetchTodos(filters),
      staleTime: 2 * 60 * 1000,
    })

    React.useEffect(() => {
      if (query.data) {
        dispatch(setTodos(query.data))
      }
    }, [query.data])

    return query
  }
  ```

- Rename cacheTime to gcTime

  - 쿼리가 사용되지 않는 상태에서의 사용되는 cacheTime 명칭이 헷갈리는 이슈로 명칭이 gc(garbage collect)로 변경됩니다.

  ```tsx
  const MINUTE = 1000 * 60;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
  -      cacheTime: 10 * MINUTE,
  +      gcTime: 10 * MINUTE,
      },
    },
  })
  ```

- Infinite queries now need a defaultPageParam

  - 이전에는 pageParam 기본값을 지정할 수 있었지만, v5에서는 defaultPageParam으로 지정하는 방식으로 변경되었습니다.

  ```tsx
  - refetch({ refetchPage: (page, index) => index === 0 }) // index === {refetch하고 싶은 페이지}

  useInfiniteQuery({
     queryKey,
  -  queryFn: ({ pageParam = 0 }) => fetchSomething(pageParam),
  +  queryFn: ({ pageParam }) => fetchSomething(pageParam),
  +  defaultPageParam: 0,
     getNextPageParam: (lastPage) => lastPage.next,
  })
  ```

- status: loading → status: pending, isLoading → isPending, isInitialLoading → isLoading
  - v4 오프라인 모드 지원을 위해서 상태가 변경되었던게 다시 의미에 맞게 정리 되었습니다.
- The minimum required Typescript version is now 4.7
  - 타입스크립트 타입 추론 관련한 중요한 버그 수정이 있어서 해당 버전을 최소 버전으로 지정
- Typescript: Error is now the default type for errors instead of unknown

  - API 에 기본 타입에러는 Error 입니다. 단, 이전에는 타입스크립트에서 타입 지정이 모호한 경우 unknown을 사용했었지만, v5 넘어오면서 기본 타입이 Error로 변경되었습니다.
  - 만약 커스텀 에러를 던지고 싶다면 에러 필드의 타입을 구체화 하면 됩니다.

  ```tsx
  const { error } = useQuery({ queryKey: ['groups'], queryFn: fetchGroups });
  // ^? const error: Error

  const { error } = useQuery<Group[], string>(['groups'], fetchGroups);
  // ^? const error: string | null
  ```

- The minimum required React version is now 18.0
  - v5 이후부터는 react v18 이상을 지원합니다. 이유는 내부적으로 useSyncExternalStore 사용하는데 해당 함수는 react v18 이상에서 지원하기 때문입니다.
- The useErrorBoundary options has been renamed to throwOnError
  - 특정 프레임워크에 종속되지 않고. react use/ErrorBoudary 컴포넌트명을 혼동을 피하기 위해서 throwOnError 로 변경
  ```tsx
  export const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        - useErrorBoundary: true,
  			throwOnError: true,
      },
      mutations: {
        - useErrorBoundary: false,
  			throwOnError: true,
      },
    },
  });
  ```
- getQueryData, getQueryState now accepts querykey only as an argument
  - queryClient.getQueryData, queryClient.getQueryState 인자를 오직 쿼리키만 받기로 변경됨
  ```tsx
  -queryClient.getQueryData(queryKey, filters) +
    queryClient.getQueryData(queryKey) -
    queryClient.getQueryState(queryKey, filters) +
    queryClient.getQueryState(queryKey);
  ```
- The remove method has bean removed from useQuery

  ```tsx
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey, queryFn });

  -query.remove() + queryClient.removeQueries({ queryKey });
  ```

- The isDataEqual options has been removed from useQuery

  ```tsx
  import { replaceEqualDeep } from '@tanstack/react-query'

  - isDataEqual: (oldData, newData) => customCheck(oldData, newData)
  + structuralSharing: (oldData, newData) => customCheck(oldData, newData) ? oldData : replaceEqualDeep(oldData, newData)
  ```

- The deprecated custom logger has been removed
  - v4에서 deprecated 된 logger 관련 처리가 아예 삭제됨
- Private class fields and methods
  - **[ECMAScript Private class features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)** 스펙이 실제 react-query 코드에 적용됨
- eslint prefer-query-object-syntax rule is removed
- Removed keepPreviousData in favor of placeholderData identity function

  - keepPreviousData 옵션과 isPreviousData 제거 되었습니다. placeholderData, isPlaceholderData 플래그와 거의 유사한 동작이여서 제거 되었습니다.
  - 단, keepPreviouseData는 이전 query 상태를 주웠지만, placeholder는 언제나 최신 상태를 전달해줍니다. 혹여 이전 상태여부를 알아야할 경우에는 dataUpdateAt 상태를 관리한다면 구현이 가능하다.

  ```tsx
  const [updatedAt, setUpdatedAt] = useState(0)

  const {
     data,
  -  isPreviousData,
  +  isPlaceholderData,
  } = useQuery({
    queryKey,
    queryFn,
  - keepPreviousData: true,
  + placeholderData: keepPreviousData
  });

  useEffect(() => {
    if (dataUpdatedAt > updatedAt) {
      setUpdatedAt(dataUpdatedAt)
    }
  }, [dataUpdatedAt])
  ```

- Removed custom context prop in favor of custom queryClient instance, Remove contextsharing
  모든 react-query hook에서 사용할 수 있는 context 옵션이 삭제 되었습니다.(그로 인해서 contextSharing 옵션도 같이 삭제 되었습니다.)
  context는 리액트에서만 사용이 가능함으로, 멀티 플랫폼에서 사용 가능하도록 queryClient를 전달하도록 변경되었습니다. 기존 context 기능도 queryClient 접근 권한만 주는거라서 동작에는 기존 동작에는 이슈가 없습니다.

  ```tsx
  import { queryClient } from './my-client'

  const { data } = useQuery(
    {
      queryKey: ['users', id],
      queryFn: () => fetch(...),
  -   context,
    },
  +  queryClient,
  )
  ```

- Removed refetchPage in favor of maxPages
  - v4에서 refetchPage를 제공했지만, 전체페이지 로딩(필터)한다면 infinite queries에 용도와 맞지 않는 이슈가 있어서 refechPage는 삭제처리 하였음
  - 단, 최대 페이지 수를 제한하는 기능인 maxPages 옵션이 추가되었습니다.
- Window focus refetching no longer listens to the focus event
  - visibilitychange 이벤트를 지원하는 브라우저만 지원하기로 결정했기 때문에, 이전에 사용하던 focus 이벤트는 listen 하지 않음
- No longer using unstable_batchedUpdates as the batching function in React and React Native

  - react, react-native에서 배치 실행 시 사용되는 unstable_batchedUpdates를 더 이상 사용하지 않음.

  ```tsx
  import { notifyManager } from '@tanstack/query-core';
  import { batch } from 'solid-js';

  notifyManager.setBatchNotifyFunction(batch);
  ```

- Hydrate has been renamed to HydrationBoundary and the useHydrate hook has been removed
  Hydrate 이름이 HydrationBoundary로 변경, useHydrate hook은 제거 되었습니다.

  ```tsx
  - import { Hydrate } from '@tanstack/react-query'
  + import { HydrationBoundary } from '@tanstack/react-query'

  - <Hydrate state={dehydratedState}>
  + <HydrationBoundary state={dehydratedState}>
    <App />
  - </Hydrate>
  + </HydrationBoundary>
  ```

## v4 → v5 migraion tools: [CodeMod](https://tanstack.com/query/v5/docs/react/guides/migrating-to-v5#codemod)

```bash
# jsx/js 인 경우
npx jscodeshift ./path/to/src/ \
  --extensions=js,jsx \
  --transform=./node_modules/@tanstack/react-query/build/codemods/v5/remove-overloads/remove-overloads.js

# tsx/ts 인 경우
npx jscodeshift ./path/to/src/ \
  --extensions=ts,tsx \
  --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/build/codemods/v5/remove-overloads/remove-overloads.js
```

# 참고페이지

- [TanStack Query v5에서 변경사항](https://wonsss.github.io/library/tanstack-query-v5/#7-지원-브라우저-변경)
- [v5 Milestone · TanStack/query](https://github.com/TanStack/query/milestone/2)
- [Migrating to TanStack Query v5 | TanStack Query Docs](https://tanstack.com/query/v5/docs/react/guides/migrating-to-v5)
- [[React] TanStack Query v4 (React Query)](https://beomy.github.io/tech/react/tanstack-query-v4/#tanstackqueryprefer-query-object-syntax)
- [Breaking React Query's API on purpose](https://tkdodo.eu/blog/breaking-react-querys-api-on-purpose)
- [[번역] React Query API의 의도된 중단](https://velog.io/@cnsrn1874/breaking-react-querys-api-on-purpose#나쁜-api)
