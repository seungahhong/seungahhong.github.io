---
layout: post
title: redux-toolkit
date: 2022-03-26
published: 2022-03-26
category: Development
tags: ['state management']
comments: true,
thumbnail: './assets/26/thumbnail.png'
github: 'https://github.com/seungahhong/states-todos'
---

# What is Redux Toolkit?

- The Redux Toolkit library was created to address three concerns the Redux team had.

1. Configuring a Redux store is too complicated.
2. To make Redux useful, you have to install many additional packages.
3. Redux requires too much boilerplate code.

The library that solves these three problems is Redux Toolkit, which makes Redux far easier and more convenient to use. Let's now look at how to use Redux Toolkit and how it solves the problems above.

# Installation

```
npm install @reduxjs/toolkit react-redux
```

## Redux Toolkit API

- configureStore: A function similar to Redux's createStore function that provides simplified configuration options and sensible defaults. It automatically combines slice reducers, lets you add middleware, and includes redux-thunk by default. It also enables the use of the Redux DevTools Extension.
- createReducer: Instead of writing a reducer function as a switch statement, it lets you use a lookup table approach for the reducer function, and it has the immer library built in so you can write mutative code.
- createAction: Generates an action creator function from a given action type string. Since the function itself has toString() defined, it can be used in place of a constant type.
- createSlice: Accepts a reducer function, a slice name, and an initial value, and automatically generates a slice reducer with its action creators and action types.
- createAsyncThunk: A replacement for redux-thunk.
- createSelector: Identical to the utility functionality of the reselect library.

## Advantages of Redux Toolkit

- You don't need to create action types or action creators separately.
- immer is built in, so you can use mutable objects.
- redux-thunk is built in, so asynchronous operations are supported.
- TypeScript is supported.
- reselect is built in.

# Redux

- redux-action
- reselect
- immer's produce
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

Example code: https://github.com/seungahhong/states-todos

- react
  - Example code:
    [redux-toolkit-tutorial.zip](./files/26/redux-toolkit-tutorial.zip)
  - Existing redux structure example:
    [redux.zip](./files/26/redux.zip)
  - redux-toolkit applied example:
    [reduxtoolkit.zip](./files/26/reduxtoolkit.zip)
- typscript
  - Example code
    [typescript-react-tutorial.zip](./files/26/typescript-react-tutorial.zip)

# Redux vs Redux-toolkit Differences

[Redux vs Redux-toolkit Differences](https://material-debt-c1c.notion.site/149741eea2b44f58ab1e06e48e77f92b?v=2507477a92e943deb13e7f2369d5ba29)

## React based: Existing Redux Structure

- Folder structure
  ```jsx
  ├── actions  uses redux-actions to create action creator functions
  │   ├── index.js
  ├── constants #
  │   ├── index.js
  ├── reducers  uses immer and redux-action to maintain immutability
  │   ├── domain.js
  │   ├── index.js
  ├── selectors  uses reselect to handle the Store efficiently and prevent unnecessary re-renders
  │   ├── index.js
  ├── stores  uses redux-thunk to handle asynchronous operations smoothly
  │   ├── configureStore.js
  │   ├── index.js
  ```
- Example code

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

## React based: Structure After Migrating to Redux-toolkit

- Folder structure
  ```jsx
  ├── constants #
  │   ├── index.js
  ├── feature  uses @redux/toolkit (createSlice, createSelector)
  │   ├── index.js // duck pattern applied
  ├── stores  uses @redux/toolkit (configureStore, getDefaultMiddleware)
  │   ├── index.js
  ```
- Example code

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

# Typescript Redux vs Redux-toolkit Differences

[Typescript Redux vs Redux-toolkit Differences](https://material-debt-c1c.notion.site/692837d86ddb478aa2bb26a434d4f9c9?v=ce0f92d0c2be4a1a973570c2aaebdb1c)

# Typescript based: Existing Redux Structure

- Folder structure
  ```jsx
  ├── actions  uses redux-actions to create action creator functions
  │   ├── index.ts
  ├── constants #
  │   ├── index.ts
  ├── reducers  uses immer and redux-action to maintain immutability
  │   ├── domain.ts
  │   ├── index.ts
  ├── selectors  uses reselect to handle the Store efficiently and prevent unnecessary re-renders
  │   ├── index.ts
  ├── stores  uses redux-thunk to handle asynchronous operations smoothly
  │   ├── configureStore.ts
  │   ├── index.ts
  ├── types  definitions for typescript types
  │   ├── index.ts
  ```
- Example code

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

# Typescript based: Structure After Migrating to Redux-toolkit

- Folder structure
  ```jsx
  ├── constants #
  │   ├── index.ts
  ├── feature  uses @redux/toolkit (createSlice, createSelector)
  │   ├── index.ts // duck pattern applied
  ├── stores  uses @redux/toolkit (configureStore, getDefaultMiddleware)
  │   ├── index.ts
  ├── types
  │   ├── index.ts
  ```
- Example code

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
