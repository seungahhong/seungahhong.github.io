---
layout: post
title: react-query
date: 2022-12-30
published: 2022-12-30
category: 개발
tags: ['상태관리']
comments: true,
thumbnail: './images/30/thumbnail.png'
github: 'https://github.com/seungahhong/states-todos'
---

# 개요

- React를 위한 Data Synchronization Library
- React application에서 **서버 상태**를 fetching, caching, synchronizing, updating 작업을 쉽게 만들어 줍니다.

# 서버 상태

- 원격에 위치한 공간에 저장되며 앱이 소유하거나 제어하지 않습니다.
- 데이터를 가져오고 업데이트하기 위해선 비동기 API가 필요합니다.
- 다른 사람과 함께 사용하며, 내가 모르는 사이에 업데이트될 수 있습니다.
- 앱에서 사용하는 데이터가 “유효 기간이 지난” 상태가 될 가능성을 가집니다.

# React Query 장점

- 캐싱
- 서버 데이터 중복 호출 제거 (따닥 방지)
- 만료된 데이터를 백그라운드에서 제거하기
- 데이터가 언제 만료되는지 알고 있기
- 만료된 데이터는 가능한 빨리 업데이트하기
- 페이지네이션, 레이지 로딩 데이터의 성능 최적화
- 서버 상태의 메모리 관리 및 가비지 콜렉션
- 쿼리 결과의 구조 공유를 통한 메모이제이션

# React Query 단점

- 라이브러리 의존성 추가
- 러닝 커브
- Query lifecycle의 이해

# Query의 상태

React Query를 통해 관리하는 쿼리 데이터는 라이프사이클에 따라 fetching, fresh, stale, inactive, delete 상태를 가집니다.

- fetching - 요청 중인 쿼리
- fresh - 만료되지 않은 쿼리. 컴포넌트가 마운트, 업데이트되어도 데이터를 다시 요청하지 않습니다.(staleTime범위)
- stale - 만료된 쿼리. 컴포넌트가 마운트, 업데이트되면 데이터를 다시 요청합니다.(staleTime 종료될 경우)
- inactive - 사용하지 않는 쿼리. 일정 시간이 지나면 가비지 컬렉터가 캐시에서 제거합니다.(cacheTime범위)
  - cacheTime이 유지된 상태에서 사이트로 포커스가 다시 올경우 stale 쿼리가 수행되지만, 화면에는 cache된 데이터로 보여주게 된다.
- delete - 가비지 컬렉터에 의해 캐시에서 제거된 쿼리(cacheTime 종료될 경우)

# 주요개념

다음은 React Query에서 제공하는 API의 기본이 되는 설정입니다.

- `useQuery`(그리고 `useInfiniteQuery`)로 가져온 데이터는 기본적으로 stale 상태가 됩니다.
  - `staleTime` 옵션으로 데이터가 stale 상태로 바뀌는데 걸리는 시간을 늘릴 수 있습니다.
- stale 쿼리는 다음 경우에 백그라운드에서 다시 가져옵니다.
  - 새로운 쿼리 인스턴스가 마운트되었을 때
  - 브라우저 윈도우가 다시 포커스되었을 때
  - 네트워크가 다시 연결되었을 때
  - `refetchInterval` 옵션이 있을 때
- 활성화된 `useQuery`, `useInfiniteQuery` 인스턴스가 없는 쿼리 결과는 “inactive” 라벨이 붙으며 다음에 사용될 때까지 남아있습니다.
  - inactive 쿼리는 300초(5분) 후에 메모리에서 해제됩니다.
- 백그라운드에서 3회 이상 실패한 쿼리는 에러 처리됩니다.
  - `retry` 옵션으로 쿼리 함수에서 오류 발생시 재시도할 횟수, `retryDelay` 옵션으로 재시도 대기 시간을 설정
- 쿼리 결과는 memoization을 위해 structural sharing을 사용하며 데이터 reference는 변경되지 않습니다.
  - immutable.js에서 사용하는 기술.([참고할만한 글](https://medium.com/@dtinth/immutable-js-persistent-data-structures-and-structural-sharing-6d163fbd73d2))
  - 99.9% 케이스에서는 이 옵션을 끌 필요가 없습니다.
  - structural sharing은 JSON 호환 데이터에만 적용되며, 다른 타입의 쿼리 결과는 항상 변경되었다고 판단합니다.

## 데이터 가져오기 (useQuery)

```tsx
const { data, isLoading, isError } = useQuery(queryKey, queryFunction, options);
```

queryKey는 쿼리 캐시에 대한 key이며, string, array, object가 가능합니다.

queryFuntion은 Promise를 리턴하는 함수입니다. axios.get 이나 fetch 가 될 수 있습니다.

options 는 useQuery에 대한 옵션으로 cacheTime, staleTime, onSuccess, onError 등을 설정할 수 있습니다.

## 데이터 업데이트하기 (useMutation)

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

데이터의 CUD에는 useMutation을 사용하면 되고, options도 useQuery와 비슷하게 onSuccess, onError 콜백과 mutate를 호출할 때 실행되는 onMutate 콜백도 있습니다.

## 쿼리 무효화 (Invalidation)

```tsx
const queryClient = useQueryClient();

// 캐시에 있는 모든 쿼리를 무효화한다.
queryClient.invalidateQueries();

// todo로 시작하는 모든 쿼리를 무효화한다. ex) ['todos', 1], ['todos', 2], ...
queryClient.invalidateQueries('todos');

// ['todos', 1] 키를 가진 쿼리를 무효화한다.
queryClient.invalidateQueries(['todos', 1]);
```

useMutation등으로 업데이트 된 데이터를 다시 가져와야 하는 경우 (캐시를 무효화하고 싶은 경우) invalidateQueries 함수를 사용할 수 있습니다.

## 개발자 도구 (ReactQueryDevTools)

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

컴포넌트A가 마운트 되면서 생성된 인스턴스는 `staleTime (디폴트 0)` 이 지나버렸기 때문에 언마운트 시점에 캐시가 `inactive` 상태가 되었고 컴포넌트B가 마운트 되면서 새로운 인스턴스가 생성되었다.

이 상황에서 `cacheTime` 과 `staleTime` 가 시작되는 시점을 잘못 이해하고 있었다.

쿼리 인스턴스가 마운트 되는 순간에는 `staleTime` 이 시작된다. `cacheTime` 은 쿼리 인스턴스가 완전히 언마운트 되어서 `inactive` 상태가 되고 나면 시작된다.

마운트 되는 시점에 시작된 staleTime에서는 active, fresh한 상태를 가지고 있다.

그러다 staleTime이 끝나면 stale 상태를 가지고 있지만 아직 cacheTime이 시작되는 않는다. (화면에 아직 유효한 데이터가 존재하기 때문에 캐시 타임이 흐르지 않는다)

언마운트 되면서 화면에 존재하던 것들이 사라지고 inactive 상태를 지니면 이제서야 cacheTime이 시작된다. 이 cacheTime 동안에는 정말 캐시로 존재하기 때문에 다시 호출하면 이 캐싱된 데이터를 재사용할 수 있다.

그렇다면 staleTime과 cacheTime의 차이가 정확하게 무엇이였을까?

캐시를 사용하려고 하는건데 그럼 cacheTime만 있으면 되는게 아닌가? (staleTime=0, cacheTime=5분 으로 설정된 디폴트 옵션을 사용하면 되지 않나?)

`staleTime` 은 `fresh -> stale` 로 변경되는 시간이다. `cacheTime` 은 `inactive` 한 상태의 쿼리를 캐시로 유지하는 시간이다.

기본값이 `staleTime=0, cacheTime=5분` 인 이유이다.

`staleTime=0` 으로 두면서 모든 쿼리가 호출이 끝나면 바로 `stale` 해지고, 다시 호출하면 서버로부터 가져오는 것을 기본으로 하는 것이다.

이때 리액트 쿼리는 캐싱된 데이터로 조금이나마 빠른 응답을 시켜주기 위해 `cacheTime=5분` 으로 기본 설정해주었고, `stale` 해진 쿼리를 서버로부터 다시 `fresh` 한 데이터를 가져오기 전까지 사용할 수 있다.

# isFetching vs isLoading

isFetching은 캐싱 된 데이터 유무에 상관없이 데이터 Fetching 때마다 true를 리턴합니다.

isLoading은 캐싱 된 데이터가 없을 때만 true를 리턴합니다. (initialData 옵션을 설정하면 항상 false를 리턴합니다.)

둘의 차이를 알면 더 적합한 Loading Indicator를 사용할 수 있습니다.

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
    {data?.data.map((hero: Data) => (
      <div key={hero.id}>{hero.name}</div>
    ))}
    <button onClick={handleClickRefetch}>Fetch Heroes</button>
  </div>
);
```

- `enabled`는 쿼리가 자동으로 실행되지 않도록 할 때 설정할 수 있다. `false`를 주면 자동 실행되지 않는다. 또한 useQuery 리턴 데이터중 status가 idle 상태로 시작한다.
- `refetch`는 쿼리를 `수동`으로 다시 요청하는 기능이다. 쿼리 오류가 발생하면 오류만 기록된다. 오류를 발생시키려면 `throwOnError`속성을 `true`로해서 전달해야 한다.
- 보통 자동으로 쿼리 요청을 하지 않고 버튼 클릭이나 특정 이벤트를 통해 요청을 시도할 때 같이 사용한다.
- 만약 `enabled: false`를 줬다면 `queryClient`가 쿼리를 다시 가져오는 방법들 중 `invalidateQueries`와 `refetchQueries`를 무시한다.

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

# 참고

- 효과적인 query key 관리: [https://www.zigae.com/react-query-key/](https://www.zigae.com/react-query-key/)
- class component에도 React Query를 적용할 수 있나요?

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

- 쿼리 결과에 의존하는 다른 쿼리를 호출해야하는 경우?

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

# 참고페이지

- [리액트 쿼리, 캐시가 살아있다](https://jiggag.github.io/blog/react-query-cache-is-alive/)
- [My구독의 React Query 전환기](https://tech.kakao.com/2022/06/13/react-query/)
- [https://github.com/ssi02014/react-query-tutorial](https://github.com/ssi02014/react-query-tutorial)
- [GitHub - ssi02014/react-query-tutorial: 😃 react-query 자주 사용되는 개념 정리](https://github.com/ssi02014/react-query-tutorial#enabled-refetch)
