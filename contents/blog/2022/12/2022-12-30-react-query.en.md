---
layout: post
title: react-query
date: 2022-12-30
published: 2022-12-30
category: Development
tags: ['state management']
comments: true,
thumbnail: './images/30/thumbnail.png'
github: 'https://github.com/seungahhong/states-todos'
---

# Overview

- A Data Synchronization Library for React
- It makes fetching, caching, synchronizing, and updating **server state** in a React application easy.

# Server State

- It is stored in a remote location and is neither owned nor controlled by your app.
- An asynchronous API is required to fetch and update the data.
- It is shared with other people and can be updated without your knowledge.
- The data your app uses can potentially become "out of date."

# Advantages of React Query

- Caching
- Deduplication of redundant server data requests (preventing double-clicks)
- Removing stale data in the background
- Knowing when data becomes stale
- Updating stale data as soon as possible
- Performance optimization for paginated and lazy-loaded data
- Memory management and garbage collection for server state
- Memoization through structural sharing of query results

# Disadvantages of React Query

- Adds a library dependency
- Learning curve
- Requires understanding the query lifecycle

# Query States

Query data managed through React Query goes through fetching, fresh, stale, inactive, and delete states according to its lifecycle.

- fetching - a query that is currently being requested
- fresh - a query that has not expired. Even when a component mounts or updates, the data is not requested again. (within staleTime)
- stale - an expired query. When a component mounts or updates, the data is requested again. (after staleTime ends)
- inactive - a query that is no longer in use. After a certain period of time, the garbage collector removes it from the cache. (within cacheTime)
  - If the site regains focus while cacheTime is still active, a stale query is triggered, but the cached data is displayed on the screen.
- delete - a query removed from the cache by the garbage collector (after cacheTime ends)

# Key Concepts

The following are the default settings that form the basis of the API provided by React Query.

- Data fetched with `useQuery` (and `useInfiniteQuery`) becomes stale by default.
  - You can extend the time it takes for data to become stale using the `staleTime` option.
- A stale query is refetched in the background in the following cases:
  - When a new query instance mounts
  - When the browser window is refocused
  - When the network reconnects
  - When the `refetchInterval` option is set
- Query results with no active `useQuery` or `useInfiniteQuery` instances are labeled "inactive" and remain until they are used again.
  - Inactive queries are released from memory after 300 seconds (5 minutes).
- A query that fails 3 or more times in the background is treated as an error.
  - Use the `retry` option to set the number of retries when the query function throws an error, and the `retryDelay` option to set the wait time between retries.
- Query results use structural sharing for memoization, and the data reference does not change.
  - This is a technique used in immutable.js. ([a helpful article](https://medium.com/@dtinth/immutable-js-persistent-data-structures-and-structural-sharing-6d163fbd73d2))
  - In 99.9% of cases, there is no need to turn this option off.
  - Structural sharing applies only to JSON-compatible data, and query results of other types are always considered changed.

## Fetching Data (useQuery)

```tsx
const { data, isLoading, isError } = useQuery(queryKey, queryFunction, options);
```

queryKey is the key for the query cache, and it can be a string, array, or object.

queryFunction is a function that returns a Promise. It can be axios.get or fetch.

options are the options for useQuery, where you can set cacheTime, staleTime, onSuccess, onError, and so on.

## Updating Data (useMutation)

```tsx
const mutation = useMutation(newTodo => axios.post('/todos', newTodo), options);

const handleSubmit = useCallback(async () => {
  mutation.mutate({ id: new Date(), title: 'Do Laundry' });

  // mutate이 후 의존적인 액션이 있다면 mutateAsync를 사용합니다.
  await mutation.mutateAsync(newTodo);
  setAnotherState();
  dispatch(createAnotherAction());
}, [mutation]);
```

For CUD operations on data, you can use useMutation. Similar to useQuery, its options include onSuccess and onError callbacks, as well as an onMutate callback that runs when mutate is called.

## Query Invalidation

```tsx
const queryClient = useQueryClient();

// 캐시에 있는 모든 쿼리를 무효화한다.
queryClient.invalidateQueries();

// todo로 시작하는 모든 쿼리를 무효화한다. ex) ['todos', 1], ['todos', 2], ...
queryClient.invalidateQueries('todos');

// ['todos', 1] 키를 가진 쿼리를 무효화한다.
queryClient.invalidateQueries(['todos', 1]);
```

When you need to refetch data that has been updated via useMutation or the like (when you want to invalidate the cache), you can use the invalidateQueries function.

## Developer Tools (ReactQueryDevTools)

```tsx
import { ReactQueryDevtools } from 'react-query/devtools';

export default function App() {
  // useQuery Hook이 QueryClient에 접근하기 위해 QueryClientProvider를 컴포넌트 트리 상위에 추가해야합니다.
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}
```

# staleTime vs cacheTime

The instance created when component A mounted had its `staleTime (default 0)` elapse, so its cache entered the `inactive` state at unmount time, and a new instance was created when component B mounted.

In this situation, I had misunderstood the point at which `cacheTime` and `staleTime` begin.

`staleTime` begins the moment a query instance mounts. `cacheTime` begins after a query instance has completely unmounted and entered the `inactive` state.

During the staleTime that begins at mount time, the query is in an active, fresh state.

Then, once staleTime ends, the query is in a stale state, but cacheTime has not yet started. (Because valid data still exists on the screen, the cache timer does not run.)

Only once the query unmounts, the things on the screen disappear, and it enters the inactive state does cacheTime finally begin. During this cacheTime, the data truly exists as a cache, so if you call it again, you can reuse this cached data.

So then, what exactly is the difference between staleTime and cacheTime?

If we just want to use the cache, isn't cacheTime alone enough? (Can't we just use the default options of staleTime=0, cacheTime=5 minutes?)

`staleTime` is the time it takes to change from `fresh -> stale`. `cacheTime` is the time an `inactive` query is kept in the cache.

This is why the defaults are `staleTime=0, cacheTime=5 minutes`.

By setting `staleTime=0`, every query becomes `stale` as soon as it finishes, and by default it is fetched from the server again when called again.

At this point, to provide a slightly faster response with cached data, React Query defaults to `cacheTime=5 minutes`, and a query that has become `stale` can be used until fresh data is fetched again from the server.

# isFetching vs isLoading

isFetching returns true every time data is fetched, regardless of whether cached data exists.

isLoading returns true only when there is no cached data. (If you set the initialData option, it always returns false.)

Knowing the difference between the two lets you use a more appropriate loading indicator.

# enabled refetch

```tsx
const { isLoading, isFetching, data, isError, error, refetch } = useQuery(
  'super-heroes',
  getSuperHero,
  {
    enabled: false,
  },
);

const handleClickRefetch = useCallback(() => {
  refetch();
}, [refetch]);

return (
  <div>
    {data?.data.map((hero: Data) => <div key={hero.id}>{hero.name}</div>)}
    <button onClick={handleClickRefetch}>Fetch Heroes</button>
  </div>
);
```

- `enabled` can be set to prevent a query from running automatically. Passing `false` prevents it from running automatically. Also, among the data returned by useQuery, status starts in the idle state.
- `refetch` is the feature that requests a query again `manually`. If a query error occurs, only the error is logged. To make it throw the error, you must pass the `throwOnError` property as `true`.
- It is typically used together in cases where you do not request the query automatically, but instead trigger the request via a button click or a specific event.
- If you set `enabled: false`, the `queryClient` ignores `invalidateQueries` and `refetchQueries` among the ways it refetches queries.

# Infinite scroll, pagination

```tsx
const { ref, inView } = useInView();

const {
  status,
  data,
  error,
  isFetching,
  isFetchingNextPage,
  isFetchingPreviousPage,
  fetchNextPage,
  fetchPreviousPage,
  hasNextPage,
  hasPreviousPage,
} = useInfiniteQuery(
  ['projects'],
  async ({ pageParam = 0 }) => {
    const res = await axios.get('/api/projects?cursor=' + pageParam);
    return res.data;
  },
  {
    getPreviousPageParam: firstPage => firstPage.previousId ?? undefined,
    getNextPageParam: lastPage => lastPage.nextId ?? undefined,
  },
);

React.useEffect(() => {
  if (inView) {
    fetchNextPage();
  }
}, [inView]);
```

# References

- Effective query key management: [https://www.zigae.com/react-query-key/](https://www.zigae.com/react-query-key/)
- Can React Query be used in a class component?

  - [https://stackoverflow.com/questions/65609409/how-can-i-use-react-query-in-a-react-class-component](https://stackoverflow.com/questions/65609409/how-can-i-use-react-query-in-a-react-class-component)

  ```tsx
  function UseQuery (props) {
    return props.children(useQuery(props.key, props.fn, props.options))
  }

  <UseQuery
    key=“todos”
    fn={() => getTodos()}
    options={ staleTime: 5000 }
  >
    {query => {. . .}}
  </UseQuery>
  ```

- What if you need to call another query that depends on the result of a query?

  ```tsx
  // 쿼리 config의 enabled 사용. enabled가 true 일 때만 쿼리를 호출
  const { data: user } = useQuery(['user', email], getUserByEmail);

  const userID = user?.id;

  const { isIdle, data: projects } = useQuery(
    ['projects', userID],
    () => getProjectsByUser(userID),
    {
      // The query will not execute until the userId exists
      enabled: !!userID,
    },
  );

  // isIdle will be `true` until `enabled` is true and the query begins to fetch.
  // It will then go to the `isLoading` stage and hopefully the `isSuccess` stage :)
  ```

# Reference Pages

- [React Query, the cache is alive](https://jiggag.github.io/blog/react-query-cache-is-alive/)
- [My Subscription's React Query migration story](https://tech.kakao.com/2022/06/13/react-query/)
- [https://github.com/ssi02014/react-query-tutorial](https://github.com/ssi02014/react-query-tutorial)
- [GitHub - ssi02014/react-query-tutorial: 😃 react-query 자주 사용되는 개념 정리](https://github.com/ssi02014/react-query-tutorial#enabled-refetch)
