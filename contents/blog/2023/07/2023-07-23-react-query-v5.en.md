---
layout: post
title: react-query(v5)
date: 2023-07-23
published: 2023-07-23
category: Development
tags: ['state management']
comments: true,
thumbnail: './assets/23/thumbnail.png'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# What's new in v5

## Install

### react-query renamed to @tanstack/react-query

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

  - Using the `variables` needed for optimistic UI updates has become simpler (the variables are returned as the return value).

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
  - A `combine` property was added to merge the results of the queries called by useQueries.
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
  - The more pages an Infinite Query fetches, the more memory it consumes, and since every page has to be refetched sequentially, the query refetch process becomes slower.
  - By providing `maxPages`, you can cap the maximum number of pages so that only the pages you actually need are fetched.
- Prefetching Infinite Queries
  - Prefetching was also added for Infinite Queries.
  - If you want to preload more than one page of data, you can specify a number in the `pages` option to load the page data ahead of time.
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

## Changed Features

- Supports a single signature, one object
  - Only the object-form function call signature is supported.
  - Because useQuery, useInfiniteQuery, and others accepted positional arguments, TypeScript ended up with many overloads, which required runtime checks to preserve types and determine which type each argument was.
  - Therefore, starting from v5 only the object form is supported.
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
  The onSuccess, onError, and onSettled callback functions were removed from options. (This does not apply to mutations.)

  - Use global cache-level callbacks, which fire only once per query.
    - When you need to show a different message per query, use the `meta` field.
  - Additional rendering cycles
    - When you manage the value with useState, a state can be rendered in the intermediate layer while the value is being synchronized.
    - Return the desired state value as an object instead.
  - Instead of using a callback function that runs only when a fetch occurs, hook the actual data change into your deps.
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

  - Because the name `cacheTime`, which is used while a query is unused, was confusing, it was renamed to gc (garbage collect).

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

  - Previously you could specify the default value for `pageParam`, but in v5 this was changed to specifying it via `defaultPageParam`.

  ```tsx
  - refetch({ refetchPage: (page, index) => index === 0 }) // index === {the page you want to refetch}

  useInfiniteQuery({
     queryKey,
  -  queryFn: ({ pageParam = 0 }) => fetchSomething(pageParam),
  +  queryFn: ({ pageParam }) => fetchSomething(pageParam),
  +  defaultPageParam: 0,
     getNextPageParam: (lastPage) => lastPage.next,
  })
  ```

- status: loading → status: pending, isLoading → isPending, isInitialLoading → isLoading
  - The statuses that were changed to support v4's offline mode were reorganized to once again match their intended meaning.
- The minimum required Typescript version is now 4.7
  - Because there was an important bug fix related to TypeScript's type inference, this version was set as the minimum.
- Typescript: Error is now the default type for errors instead of unknown

  - The default error type in the API is `Error`. Previously, when the type could not be clearly determined, TypeScript used `unknown`, but in v5 the default type was changed to `Error`.
  - If you want to throw a custom error, you can narrow the type of the error field.

  ```tsx
  const { error } = useQuery({ queryKey: ['groups'], queryFn: fetchGroups });
  // ^? const error: Error

  const { error } = useQuery<Group[], string>(['groups'], fetchGroups);
  // ^? const error: string | null
  ```

- The minimum required React version is now 18.0
  - Starting from v5, React v18 or higher is required. The reason is that internally it uses `useSyncExternalStore`, which is only supported in React v18 and above.
- The useErrorBoundary options has been renamed to throwOnError
  - To avoid being tied to a specific framework and to prevent confusion with React's use/ErrorBoundary component name, it was renamed to throwOnError.
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
  - queryClient.getQueryData and queryClient.getQueryState were changed to accept only a query key as an argument.
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
  - The logger-related handling that was deprecated in v4 was removed entirely.
- Private class fields and methods
  - The **[ECMAScript Private class features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)** spec was applied to the actual react-query code.
- eslint prefer-query-object-syntax rule is removed
- Removed keepPreviousData in favor of placeholderData identity function

  - The `keepPreviousData` option and `isPreviousData` were removed. They behaved almost identically to the `placeholderData` and `isPlaceholderData` flags, so they were removed.
  - However, `keepPreviousData` held onto the previous query state, whereas `placeholderData` always delivers the latest state. If you need to know whether the state is the previous one, you can implement it by managing the `dataUpdateAt` state.

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
  The `context` option that could be used in all react-query hooks was removed. (As a result, the `contextSharing` option was also removed.)
  Since context can only be used in React, it was changed to pass the `queryClient` so it can be used across multiple platforms. The existing context feature only granted access to the queryClient, so there are no issues with existing behavior.

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
  - v4 provided `refetchPage`, but there was an issue where loading (filtering) all pages did not fit the purpose of infinite queries, so refetchPage was removed.
  - Instead, the `maxPages` option, which limits the maximum number of pages, was added.
- Window focus refetching no longer listens to the focus event
  - Because it was decided to support only browsers that support the `visibilitychange` event, the previously used focus event is no longer listened to.
- No longer using unstable_batchedUpdates as the batching function in React and React Native

  - `unstable_batchedUpdates`, which was used when batching in React and React Native, is no longer used.

  ```tsx
  import { notifyManager } from '@tanstack/query-core';
  import { batch } from 'solid-js';

  notifyManager.setBatchNotifyFunction(batch);
  ```

- Hydrate has been renamed to HydrationBoundary and the useHydrate hook has been removed
  Hydrate was renamed to HydrationBoundary, and the useHydrate hook was removed.

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
# for jsx/js
npx jscodeshift ./path/to/src/ \
  --extensions=js,jsx \
  --transform=./node_modules/@tanstack/react-query/build/codemods/v5/remove-overloads/remove-overloads.js

# for tsx/ts
npx jscodeshift ./path/to/src/ \
  --extensions=ts,tsx \
  --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/build/codemods/v5/remove-overloads/remove-overloads.js
```

# References

- [Changes in TanStack Query v5](https://wonsss.github.io/library/tanstack-query-v5/#7-지원-브라우저-변경)
- [v5 Milestone · TanStack/query](https://github.com/TanStack/query/milestone/2)
- [Migrating to TanStack Query v5 | TanStack Query Docs](https://tanstack.com/query/v5/docs/react/guides/migrating-to-v5)
- [[React] TanStack Query v4 (React Query)](https://beomy.github.io/tech/react/tanstack-query-v4/#tanstackqueryprefer-query-object-syntax)
- [Breaking React Query's API on purpose](https://tkdodo.eu/blog/breaking-react-querys-api-on-purpose)
- [[Translation] Breaking React Query's API on purpose](https://velog.io/@cnsrn1874/breaking-react-querys-api-on-purpose#나쁜-api)
