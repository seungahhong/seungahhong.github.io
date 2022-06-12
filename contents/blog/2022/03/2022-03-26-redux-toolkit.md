---
layout: post
title: redux-toolkit
date: 2022-03-26
published: 2022-03-26
category: 개발
tags: ['state']
comments: true,
thumbnail: './assets/26/thumbnail.png'
github: 'https://github.com/seungahhong/seungahhong.github.io'
---

# 리덕스 툴킷이란?

- redux toolkit 라이브러리는 리덕스팀의 3가지 걱정을 해결하기 위해 등장하였다.

1. 리덕스 스토어를 구성하는 것은 너무 복잡하다.
2. 리덕스가 유용해지려면 많은 패키지들을 추가로 설치해야한다.
3. 리덕스는 너무 많은 보일러플레이트 코드를 요구한다.

이 세가지를 해결한 것이 리덕스 툴킷이라는 라이브러리로 리덕스를 훨씬 쉽고 간편하게 사용할 수 있다. 이제 리덕스 툴킷을 어떻게 쓰는지 또, 어떻게 위의 문제점들을 해결했는지 살펴보도록 하자.

# 설치

```
npm install @reduxjs/toolkit react-redux
```

## 리덕스 툴킷 API

- configureStore: 리덕스 createStore함수와 비슷한 함수로, 간단화된 구성 옵션과, 기본 구성을 제공한다. slice reducer를 자동으로 합치고, 미들웨어를 추가할 수 있으며, redux-thunk를 기본적으로 제공한다. 또한 redux devtools Extension 사용이 가능하다.
- createReducer: 리듀서 함수를 switch 구문으로 쓰기보다는, 리듀서 함수를 계속쓰는 lookup table 방식을 쓸 수 있게 해주고, immer라이브러리가 내장되어 있어서 mutative한 코드를 작성할 수 있도록 해준다.
- createAction: 주어진 액션 타입 문자열로 액션 크리에이터 함수를 생성해준다. 함수 자체에 toString()이 정의되어 있어서 constant 타입 대신 사용이 가능하다.
- createSlice: reducer 함수, slice 이름, 초깃값을 넣을 수 있고 action creator와 action type을 가진 slice reducer를 자동으로 생성해준다.
- createAsyncThunk: redux-thunk의 대체재
- createSelector: reselect 라이브러리의 유틸리티 기능과 동일

## 리덕스 툴킷 장점

- action type이나 action creator를 따로 생성해주지 않아도 된다.
- immer가 내장되어 있어 mutable 객체를 사용해도 된다.
- redux thunk가 내장되어 있어 비동기를 지원한다.
- 타입스크립트 지원이 된다.
- reselector가 내장되어 있다.

# Redux

- redux-action
- reselect
- immer의 produce
- redux-thunk

# Redux Toolkit

- redux-toolkit
  - redux-action,
  - reselect
  - immer
  - redux-thunk
- flux standard action
- type definition
- ducks pattern

예제코드: https://github.com/seungahhong/states-todos

- react
  - 예제코드:
    [redux-toolkit-tutorial.zip](./files/26/redux-toolkit-tutorial.zip)
  - 기존 redux 구조예제:
    [redux.zip](./files/26/redux.zip)
  - redux-toolkit 적용예제:
    [reduxtoolkit.zip](./files/26/reduxtoolkit.zip)
- typscript
  - 예제코드
    [typescript-react-tutorial.zip](./files/26/typescript-react-tutorial.zip)

# Redux vs Redux-toolkit 차이점

[Redux vs Redux-toolkit 차이점](https://material-debt-c1c.notion.site/149741eea2b44f58ab1e06e48e77f92b?v=2507477a92e943deb13e7f2369d5ba29)

## React 기반: 기존 Redux 구조

- 폴더구조
  ```jsx
  ├── actions  액션 생성 함수 만들기 위한 redux-actions 사용
  │   ├── index.js
  ├── constants #
  │   ├── index.js
  ├── reducers  불변성을 지키기 위한 immer, redux-action 사용
  │   ├── domain.js
  │   ├── index.js
  ├── selectors  Store를 효율적으로 핸들링하여 불필요한 리렌더링을 막기위한 reselect 사용
  │   ├── index.js
  ├── stores  비동기를 수월하게 하기위한 redux-thunk 사용
  │   ├── configureStore.js
  │   ├── index.js
  ```
- 예제코드

  ```jsx
  // constants/index.js
  export const INCREASE = 'FETCH_INCREASE';
  export const DECREASE = 'FETCH_DECREASE';
  export const SET_DIFF = 'FETCH_SET_DIFF';

  // Action Create Function(actions/index.js)
  import { createActions } from 'redux-actions';
  import { INCREASE, DECREASE, SET_DIFF } from '../constants';

  export const {
    fetchIncrease,
    fetchDecrease,
    fetchSetDiff,
  } = createActions({
    [INCREASE]: () => {},
    [DECREASE]: () => {},
    [SET_DIFF]: (diff) => ({ diff }),
  });

  // redux-thunk
  export const fetchAsyncSetDiff = (diff) => (dispatch, getState) =>  {
    const setAsyncDiff = async (diff) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      dispatch(fetchSetDiff(diff));
    }

    try {
      setAsyncDiff(diff);
    } catch(e) {
      throw new Error(e);
    }
  };

  // Reducer(reducers/domain.js)
  import { handleActions } from 'redux-actions';
  import produce from 'immer';

  import { SET_DIFF, INCREASE, DECREASE } from '../constants';
  import { getIncreaseNumber, getDecreaseNumber } from '../selectors';

  const initialState = {
    number: 0,
    diff: 1
  };

  export default handleActions({
    [INCREASE]: (state) => produce(state, draft => {
      draft.number = getIncreaseNumber(state);
    }),
    [DECREASE]: (state) => produce(state, draft => {
      draft.number = getDecreaseNumber(state);
    }),
    [SET_DIFF]: (state, action) => produce(state, draft => {
      draft.diff = action.payload.diff;
    }),
  }, initialState);

  // Selector(selectors/index.js)
  import { createSelector } from 'reselect';

  const getNumber = (state) => state.number;
  const getDiff = (state) => state.diff;

  // selector(selector/index.js)
  export const getIncreaseNumber = createSelector(
    getNumber,
    getDiff,
    (number, diff) => number + diff,
  );

  export const getDecreaseNumber = createSelector(
    getNumber,
    getDiff,
    (number, diff) => number - diff,
  );

  // store
  // store/configureStore.js
  import { combineReducers } from "redux";
  import reducers from "../reducers";

  const rootReducers = () => combineReducers({
    counter: reducers.counter
  });

  export default rootReducers;

  // store/index.js
  import { createStore, applyMiddleware } from 'redux';
  import thunkMiddleware from 'redux-thunk';
  import logger from 'redux-logger';
  import rootReducer from './configureStore';

  export default function configureStore() {
    const store = createStore(
      rootReducer(),
      applyMiddleware(
        logger,
        thunkMiddleware,
      ),
    );
    return store;
  }
  ```

## React 기반: Redux-toolkit 변경 후 구조

- 폴더구조
  ```jsx
  ├── constants #
  │   ├── index.js
  ├── feature  @redux/toolkit 사용 (createSlice, createSelector)
  │   ├── index.js // duck pattern 적용
  ├── stores  @redux/toolkit 사용 (configureStore, getDefaultMiddleware)
  │   ├── index.js
  ```
- 예제코드

  ```jsx
  // ducks pattern 구조
  import {
    createSlice, // handleActions 대체
    createSelector, // reselect 대체
    createAction, // createActions 대체
    createAsyncThunk, // redux-thunk 수신 간소화
  } from "@reduxjs/toolkit";
  import { INCREASE, DECREASE, SET_DIFF, FETCH_ASYNC_SET_DIFF } from '../constants';

  // selector
  const getNumber = (state) => state.number;
  const getDiff = (state) => state.diff;

  export const getIncreaseNumber = createSelector(
    getNumber,
    getDiff,
    (number, diff) => number + diff,
  );

  export const getDecreaseNumber = createSelector(
    getNumber,
    getDiff,
    (number, diff) => number - diff,
  );

  // createActions이 없어서 createAction으로 대체
  export const fetchIncrease = createAction(INCREASE);
  export const fetchDecrease = createAction(DECREASE);
  export const fetchSetDiff = createAction(SET_DIFF, function prepare(diff) { return { payload: { diff } } });

  // 내부 오류처리를 하지 않더라도, pending/fulfilled/rejected 호출됨
  // 컴포넌트 내부에서 커스텀하게 오류를 처리할 경우 unwrap으로 프로퍼티를 호출해서 컴포넌트에 처리가능
  // const onClick = async () => {
  //   try {
  //     const result = await dispatch(fetchAsyncSetDiff(diff)).unwrap();
  //   } catch (error) {
  //   }
  // }

  // redux-thunk -> createAsyncThunk
  export const fetchAsyncSetDiff = createAsyncThunk(FETCH_ASYNC_SET_DIFF, async (diff, thunkAPI) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { dispatch } = thunkAPI;
    dispatch(fetchSetDiff(diff));
  });

  // createAsyncThunk 내부에서 오류 처리를 할 경우(단, rejectWithValue 호출하지 않은 경우 에러가 날 경우라도 fulfilled가 호출됨)
  export const fetchAsyncSetDiff = createAsyncThunk(FETCH_ASYNC_SET_DIFF, async (diff, thunkAPI) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { dispatch } = thunkAPI;
      dispatch(fetchSetDiff(diff));
    } catch(err) {
      const { rejectWithValue } = thunkAPI;
      return rejectWithValue(err.response.data);
    }
  });

  // reducer, immer 내장
  const initialState = {
    number: 0,
    diff: 1
  };

  // redux-actions handleActions 내장
  const counter = createSlice({
    name: 'counter',
    initialState,
    reducers: { }, // key값으로 정의한 이름으로 자동으로 액션함수 생성
    extraReducers: { // 사용자가 정의한 이름의 액션함수가 생성
      [INCREASE]: (state) => {
        state.number = getIncreaseNumber(state);
      },
      [DECREASE]: (state) => {
        state.number = getDecreaseNumber(state);
      },
      [SET_DIFF]: (state, action) => {
        state.diff = action.payload.diff;
      },
      [fetchAsyncSetDiff.fulfilled]: (target, action) => {
       // 성공
      },
      [fetchAsyncSetDiff.pending]: (target, action) => {
        // 로딩
       },
       [fetchAsyncSetDiff.rejected]: (target, action) => {
        // 실패
       },
    },
  });

  export default counter.reducer;

  // store/index.js
  import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
  import logger from 'redux-logger';

  import reducers from "../features";

  export default configureStore({
    reducer: {
      counter: reducers
    },
    middleware: getDefaultMiddleware().concat(logger),
  });
  ```

# Typescript Redux vs Redux-toolkit 차이점

[Typescript Redux vs Redux-toolkit 차이점](https://material-debt-c1c.notion.site/692837d86ddb478aa2bb26a434d4f9c9?v=ce0f92d0c2be4a1a973570c2aaebdb1c)

# Typescript 기반: 기존 Redux 구조

- 폴더구조
  ```jsx
  ├── actions  액션 생성 함수 만들기 위한 redux-actions 사용
  │   ├── index.ts
  ├── constants #
  │   ├── index.ts
  ├── reducers  불변성을 지키기 위한 immer, redux-action 사용
  │   ├── domain.ts
  │   ├── index.ts
  ├── selectors  Store를 효율적으로 핸들링하여 불필요한 리렌더링을 막기위한 reselect 사용
  │   ├── index.ts
  ├── stores  비동기를 수월하게 하기위한 redux-thunk 사용
  │   ├── configureStore.ts
  │   ├── index.ts
  ├── types  typescript type에 대한 정의
  │   ├── index.ts
  ```
- 예제코드

  ```jsx
  // constants/index.ts
  export const INCREASE = 'FETCH_INCREASE' as const;
  export const DECREASE = 'FETCH_DECREASE' as const;
  export const SET_DIFF = 'FETCH_SET_DIFF' as const;

  export const FETCH_ASYNC_SET_DIFF = 'FETCH_ASYNC_SET_DIFF' as const;
  export const FETCH_ASYNC_SET_DIFF_SUCCESS = 'FETCH_ASYNC_SET_DIFF_SUCCESS' as const;
  export const FETCH_ASYNC_SET_DIFF_FAIL = 'FETCH_ASYNC_SET_DIFF_FAIL' as const;

  // Action Create Function(actions/index.ts)
  import { createAction } from 'typesafe-actions';
  import { INCREASE, DECREASE, SET_DIFF, FETCH_ASYNC_SET_DIFF, FETCH_ASYNC_SET_DIFF_SUCCESS, FETCH_ASYNC_SET_DIFF_FAIL } from '../constants';
  import { TypedThunk, TypedCounterAsync } from '../types';

  export const fetchIncrease = createAction(INCREASE)();
  export const fetchDecrease = createAction(DECREASE)();
  export const fetchSetDiff = createAction(SET_DIFF, (diff: number) => ({ diff }))();

  export const fetchAsyncSetDiffRequest = createAction(FETCH_ASYNC_SET_DIFF)();
  export const fetchAsyncSetDiffRequestSuccess = createAction(FETCH_ASYNC_SET_DIFF_SUCCESS)();
  export const fetchAsyncSetDiffRequestFail = createAction(FETCH_ASYNC_SET_DIFF_FAIL)<Error>();

  export const fetchAsyncSetDiff = (diff: number): TypedThunk => async (dispatch) =>  {
    const { request, success, failure } = TypedCounterAsync;
    dispatch(request());

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      dispatch(fetchSetDiff(diff));
      dispatch(success());
    } catch(e) {
      dispatch(failure(e));
    }
  };

  // Reducer(reducers/domain.ts)
  import { createReducer } from 'typesafe-actions';
  import produce from 'immer';

  import { SET_DIFF, INCREASE, DECREASE, FETCH_ASYNC_SET_DIFF, FETCH_ASYNC_SET_DIFF_SUCCESS, FETCH_ASYNC_SET_DIFF_FAIL } from '../constants';
  import { getIncreaseNumber, getDecreaseNumber } from '../selectors';
  import { ICounterState, CounterAction } from '../types';

  const initialState: ICounterState = {
    number: 0,
    diff: 1,
    loading: false,
    message: '',
  };

  export default createReducer<ICounterState, CounterAction>(initialState, {
    [INCREASE]: (state) => produce(state, draft => {
      draft.number = getIncreaseNumber(state);
    }),
    [DECREASE]: (state) => produce(state, draft => {
      draft.number = getDecreaseNumber(state);
    }),
    [SET_DIFF]: (state, action) => produce(state, draft => {
      draft.diff = action.payload.diff;
    }),
    [FETCH_ASYNC_SET_DIFF]: (state) => {
      return {
        ...state,
        loading: true,
        message: '',
      };
    },
    [FETCH_ASYNC_SET_DIFF_SUCCESS]: (state, action) => {
      // 성공
      return {
        ...state,
        loading: false,
        message: '성공했습니다....'
      };
    },
    [FETCH_ASYNC_SET_DIFF_FAIL]: (state, action) => {
      // 실패
      return {
        ...state,
        loading: false,
        message: '실패했습니다...'
      };
    },
  });

  // Selector(selectors/index.ts)
  import { Selector } from 'react-redux';
  import { createSelector } from 'reselect';

  import { ICounterState } from '../types';

  const getNumber = (state: ICounterState) => state.number;
  const getDiff = (state: ICounterState) => state.diff;

  export const getIncreaseNumber: Selector<ICounterState, number> = createSelector(
    getNumber,
    getDiff,
    (number, diff) => number + diff,
  );

  export const getDecreaseNumber: Selector<ICounterState, number> = createSelector(
    getNumber,
    getDiff,
    (number, diff) => number - diff,
  );

  // store
  // store/configureStore.ts
  import { combineReducers } from "redux";
  import reducers from "../reducers";

  const rootReducers = () => combineReducers({
    'counter': reducers.counter
  });

  export default rootReducers;

  // store/index.js
  import { createStore, applyMiddleware } from 'redux';
  import thunkMiddleware from 'redux-thunk';
  import logger from 'redux-logger';
  import rootReducer from './configureStore';

  const store = () => {
    const store = createStore(
      rootReducer(),
      applyMiddleware(
        thunkMiddleware,
        logger,
      ),
    );
    return store;
  };

  export const RootState = store().getState;
  export const RootDispatch = store().dispatch;

  export default store;

  // types/index.ts
  import { createAsyncAction } from 'typesafe-actions';
  import { ThunkAction, ThunkDispatch } from 'redux-thunk';
  import { fetchIncrease, fetchDecrease, fetchSetDiff, fetchAsyncSetDiffRequest, fetchAsyncSetDiffRequestSuccess, fetchAsyncSetDiffRequestFail } from "../actions";
  import { RootState, RootDispatch } from '../store';
  import { FETCH_ASYNC_SET_DIFF, FETCH_ASYNC_SET_DIFF_SUCCESS, FETCH_ASYNC_SET_DIFF_FAIL } from '../constants';

  // reducers
  export interface ICounterState {
    number: number;
    diff: number;
    loading: boolean;
    message: string;
  }

  // actions
  export const TypedCounterAsync = createAsyncAction(
    FETCH_ASYNC_SET_DIFF,
    FETCH_ASYNC_SET_DIFF_SUCCESS,
    FETCH_ASYNC_SET_DIFF_FAIL,
  )<undefined, undefined, Error>();

  export type CounterAction =
    | ReturnType<typeof fetchIncrease>
    | ReturnType<typeof fetchDecrease>
    | ReturnType<typeof fetchSetDiff>
    | ReturnType<typeof fetchAsyncSetDiffRequest>
    | ReturnType<typeof fetchAsyncSetDiffRequestSuccess>
    | ReturnType<typeof fetchAsyncSetDiffRequestFail>;

  export type TypedThunk = ThunkAction<void, ICounterState, unknown, CounterAction>;
  export type TypedThunkDispath = ThunkDispatch<ICounterState, unknown, CounterAction>;

  // reducers
  export type RootState = ReturnType<typeof RootState>;
  export type RootDispatch = typeof RootDispatch;
  ```

# Typescript 기반: Redux-toolkit 변경 후 구조

- 폴더구조
  ```jsx
  ├── constants #
  │   ├── index.ts
  ├── feature  @redux/toolkit 사용 (createSlice, createSelector)
  │   ├── index.ts // duck pattern 적용
  ├── stores  @redux/toolkit 사용 (configureStore, getDefaultMiddleware)
  │   ├── index.ts
  ├── types
  │   ├── index.ts
  ```
- 예제코드

  ```jsx
  // constants/index.ts
  export const INCREASE = 'FETCH_INCREASE' as const;
  export const DECREASE = 'FETCH_DECREASE' as const;
  export const SET_DIFF = 'FETCH_SET_DIFF' as const;
  export const FETCH_ASYNC_SET_DIFF = 'FETCH_ASYNC_SET_DIFF' as const;

  // feature/index.ts
  // ducks pattern 구조
  import {
    createSlice, // handleActions 대체
    createSelector, // reselect 대체
    createAction, // createActions 대체
    createAsyncThunk, // redux-thunk 수신 간소화
    Selector,
  } from "@reduxjs/toolkit";
  import { INCREASE, DECREASE, SET_DIFF, FETCH_ASYNC_SET_DIFF } from '../constants';
  import { ICounterState } from '../types';

  // selector
  const getNumber = (state: ICounterState) => state.number;
  const getDiff = (state: ICounterState) => state.diff;

  export const getIncreaseNumber: Selector<ICounterState, number> = createSelector(
    getNumber,
    getDiff,
    (number, diff) => number + diff,
  );

  export const getDecreaseNumber: Selector<ICounterState, number> = createSelector(
    getNumber,
    getDiff,
    (number, diff) => number - diff,
  );

  // createActions이 없어서 createAction으로 대체
  export const fetchIncrease = createAction(INCREASE);
  export const fetchDecrease = createAction(DECREASE);
  export const fetchSetDiff = createAction(SET_DIFF, (diff: number) => ({ payload: { diff }}));

  // 내부 오류처리를 하지 않더라도, pending/fulfilled/rejected 호출됨
  // 컴포넌트 내부에서 커스텀하게 오류를 처리할 경우 unwrap으로 프로퍼티를 호출해서 컴포넌트에 처리가능
  // const onClick = async () => {
  //   try {
  //     const result = await dispatch(fetchAsyncSetDiff(diff)).unwrap();
  //   } catch (error) {
  //   }
  // }

  export const fetchAsyncSetDiff = createAsyncThunk(FETCH_ASYNC_SET_DIFF, async (diff: number, thunkAPI) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { dispatch } = thunkAPI;
    dispatch(fetchSetDiff(diff));
  });

  // createAsyncThunk 내부에서 오류 처리를 할 경우(단, rejectWithValue 호출하지 않은 경우 에러가 날 경우라도 fulfilled가 호출됨)
  export const fetchAsyncSetDiff = createAsyncThunk(FETCH_ASYNC_SET_DIFF, async (diff: number, thunkAPI) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { dispatch } = thunkAPI;
      dispatch(fetchSetDiff(diff));
    } catch(err) {
      const { rejectWithValue } = thunkAPI;
      return rejectWithValue(err.response.data);
    }
  });

  // reducer, immer 내장
  const initialState: ICounterState = {
    number: 0,
    diff: 1,
    loading: false,
    message: '',
  };

  // redux-actions handleActions 내장
  const counter = createSlice({
    name: 'counter',
    initialState,
    reducers: { }, // key값으로 정의한 이름으로 자동으로 액션함수 생성
    extraReducers: { // 사용자가 정의한 이름의 액션함수가 생성
      [INCREASE]: (state) => {
        state.number = getIncreaseNumber(state);
      },
      [DECREASE]: (state) => {
        state.number = getDecreaseNumber(state);
      },
      [SET_DIFF]: (state, action) => {
        state.diff = action.payload.diff;
      },
      [fetchAsyncSetDiff.pending.type]: (state, action) => {
        // 호출 전
        state.loading = true;
        state.message = '';
      },
      [fetchAsyncSetDiff.fulfilled.type]: (state, action) => {
        // 성공
        state.loading = true;
        state.message = '성공했습니다...';
      },
      [fetchAsyncSetDiff.rejected.type]: (state, action) => {
        // 실패
        state.loading = true;
        state.message = '실패했습니다....';
      },
    },
  });

  export default counter.reducer;

  // store/index.ts
  import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
  import logger from 'redux-logger';

  import reducers from "../features";

  const store = configureStore({
    reducer: {
      counter: reducers
    },
    middleware: getDefaultMiddleware().concat(logger),
  });

  export const RootState = store.getState;
  export const RootDispatch = store.dispatch;

  export default store;

  // types/index.js
  import { ThunkDispatch } from 'redux-thunk';
  import { fetchIncrease, fetchDecrease, fetchSetDiff } from "../features";
  import { RootState, RootDispatch } from '../store';

  // reducers
  export interface ICounterState {
    number: number;
    diff: number;
    loading: boolean;
    message: string;
  }

  // actions
  export type CounterAction =
    | ReturnType<typeof fetchIncrease>
    | ReturnType<typeof fetchDecrease>
    | ReturnType<typeof fetchSetDiff>;

  export type TypedThunkDispath = ThunkDispatch<ICounterState, unknown, CounterAction>;

  // reducers
  export type RootState = ReturnType<typeof RootState>;
  export type RootDispatch = typeof RootDispatch;
  ```
