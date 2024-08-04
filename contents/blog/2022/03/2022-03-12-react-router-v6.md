---
layout: post
title: react-router-v6
date: 2022-03-12
published: 2022-03-12
category: 개발
tags: ['react-router']
comments: true,
thumbnail: './assets/12/thumbnail.png'
github: 'https://github.com/seungahhong/react-router-tutorial'
---

# v6

## React Router v6 정식 릴리즈

2021년 11월 4일 v6.0.0 beta → release 출시되었습니다.

## React v16.8 이상으로 업그레이드

단, React ≥ 15 이상이면 react router v5 이상을 호환하고 있어서 v6로 업그레이드 하지 않더라도 react만 업그레이드 가능합니다.

- 샘플코드: https://github.com/seungahhong/react-router-tutorial

## React Router v6 장점

- 기존 버전에 비해서 버들 사이즈가 70% 정도 감소했습니다.(빌드시간 감소??)

v5.1 버전의 크기는 9.4kb → v6 버전의 크기는 2.9kb로 감소했습니다.

![Untitled](./assets/12/Untitled.png)

![Untitled](./assets/12/Untitled1.png)

- React Hooks 전반적인 지원(hoc 등 기능지원 들이 사라짐)
- 구 브라우저에 대한 지원 중단(단, polyfill 사용으로 대응가능)
  - IE 11 지원
    - package.json IE11 브라우저 지원하도록 추가
    ```bash
    "browserslist": {
        "production": [
          "...",
          "ie 11"
        ],
        "development": [
          "...",
          "ie 11"
        ]
      },
    ```
    - polyfill 추가
      - react-app-polyfill(facebook 제공)
        - 리액트 개발에서 사용하는 다양한 문법을 변환해주는 라이브러리
        - **Promise, window.fetch, Symbol, Object.assign, Array.from + [ IE9 Map, Set ]**와 같은 필요한 것만 포함하고 있어 사이즈가 작아 가벼운 게 특징
      ```tsx
      // src/index.tsx
      // 첫번째 라인에 추가
      import 'react-app-polyfill/ie11';
      import 'react-app-polyfill/stable'; // async,await,generator 문법사용
      import React from 'react';
      ```
- 상대경로 사용으로 인한 코드량 감소(match.url, match.path)
- 기능에 대한 단일화된 표준
  - 예) Router → element 통합

## React Router v6 설치

```solidity
npm install react-router-dom // react-router-dom@6
```

## Switch → Routes 변경사항

- Switch 처럼 순서를 기준으로 선택하는 것이 아닌, 가장 일치하는 라우트를 기반인 기능으로 변경
- Switch → Routes 변경(route는 routes에 children이어야 함)
- exact props 삭제
  - 서브경로가 필요한 경우 path \* 사용
- component, children, render → element 통일

```tsx
// v6 이전
<Switch>
  <Route path="/about" render={() => <About />} />
  <Route exact path="/" component={Home} />
  <Route path={'/*'}> // <Route>
    <div>Not Found</div>
  </Route>
</Switch>

// v6 이후
<Routes>
  <Route path="/about" element={<About />} />
  <Route path="/" element={<Home />} />
  <Route path={'/*'} element={<div>Not Found</div>} />
</Routes>
```

![Untitled](./assets/12/Untitled2.png)

![Untitled](./assets/12/Untitled3.png)

![Untitled](./assets/12/Untitled4.png)

## withRouter → hooks 변경사항

- withRouter 삭제로 인한 hooks api 변경
  - match: useMatch → 현재 상대경로(단, 속성값이 달라져서 확인필요)
  - history: useNavigate 지원
  - location: useLocation ( v5 이후에서도 지원)

```tsx
// v6 이전
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

interface MatchParams {
  id: string;
}

const WithRouter = ({
  match,
  location,
  history,
}: RouteComponentProps<MatchParams>) => {
  return (
    <>
      <h1>WithRouter</h1>
      <p>{match?.params?.id}</p>
      <p>{location.pathname}</p>
      <p>{history.length}</p>
    </>
  );
};

WithRouter.defaultProps = {};

export default withRouter(WithRouter);

// v6 이후
import React from 'react';
import { useMatch, useNavigate, useLocation } from 'react-router-dom';

const WithRouter = () => {
  const match = useMatch('/with/:id');
  const history = useNavigate();
  const location = useLocation();
  return (
    <>
      <h1>WithRouter</h1>
      <p>{match?.params?.id}</p>
      <p>{location.pathname}</p>
      <p>{history.length}</p>
    </>
  );
};

WithRouter.defaultProps = {};

export default WithRouter;
```

![Untitled](./assets/12/Untitled5.png)

## useHistory → useNavigate 변경사항

useHistory hooks 대체로 useNavigate 변경

- useHistory 리턴값(객체) vs useNavigate 리턴값(함수)
- 기존에는 용도에 맞게 go, goBback, goForward, push, replace 메서드 호출에서 직관적인 함수호출로 변경

```tsx
// v6 이전
import React from 'react';
import { useHistory } from 'react-router';

const Navigation = () => {
  const history = useHistory();

  return (
    <div>
      <button
        onClick={() => {
          history.push('/');
        }}
      >
        Home
      </button>
      <button
        onClick={() => {
          history.goBack();
        }}
      >
        Go -1
      </button>
      <button
        onClick={() => {
          history.go(-2);
        }}
      >
        Go -2
      </button>
      <button
        onClick={() => {
          history.push('/about');
        }}
      >
        Go to about
      </button>
      <button
        onClick={() => {
          history.replace('Item/2');
        }}
      >
        Replace to Item
      </button>
    </div>
  );
};

Navigation.defaultProps = {};

export default Navigation;

// v6 이후
import React from 'react';
import { useNavigate } from 'react-router';

const Navigation = () => {
  const navigation = useNavigate();

  return (
    <div>
      <button
        onClick={() => {
          navigation('/'); // vs history.push('/');
        }}
      >
        Home
      </button>
      <button
        onClick={() => {
          navigation(-1); // vs history.goBack();
        }}
      >
        Go -1
      </button>
      <button
        onClick={() => {
          navigation(-2); // vs history.go(-2);
        }}
      >
        Go -2
      </button>
      <button
        onClick={() => {
          navigation('/about'); // vs history.push('/about');
        }}
      >
        Go to about
      </button>
      <button
        onClick={() => {
          navigation('Item/2', {
            // vs history.replace('Item/2');
            replace: true,
          });
        }}
      >
        Replace to Item
      </button>
    </div>
  );
};

Navigation.defaultProps = {};

export default Navigation;
```

![Untitled](./assets/12/Untitled6.png)

![Untitled](./assets/12/Untitled7.png)

![Untitled](./assets/12/Untitled8.png)

## useRouteMatch 변경사항

- useRouteMatch 사라져서, 기존에 현재 url을 얻기위한 match.path, match.url 사라짐
  - 현재 라우터 기준의 상대경로로 변경

```tsx
// v6 이전
import React from 'react';
import { Link, Route, useParams, useRouteMatch } from 'react-router-dom';
import About from './About';
import Main from './Main';

type UserProps = {
  id: string;
};

const User = () => {
  const match = useRouteMatch();
  const { id } = useParams<UserProps>();

  return (
    <>
      <h1>{`User ${id}`}</h1>
      <ul>
        <li>
          <Link to={`${match.url}`}>Main</Link>
        </li>
        <li>
          <Link to={`${match.url}/about`}>About</Link>
        </li>
      </ul>
      <Route path={match.path} exact>
        <Main />
      </Route>
      <Route path={`${match.path}/about`} exact>
        <About />
      </Route>
    </>
  );
};

User.defaultProps = {};

export default User;

// v6 이후
// user 서브 경로 추가하기 위해서 * 추가
function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/users/:id/*" element={<User />} />
        <Route path="/with/:id" element={<WithRouter />} />
        <Route path="/" element={<Home />} />
        <Route path={'*'} element={<div>Not Found</div>} />
      </Routes>
    </>
  );
}

import React from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import About from './About';
import Main from './Main';

type UserProps = {
  id: string;
};

const User = () => {
  // const match = useRouteMatch();
  const { id } = useParams<UserProps>();

  return (
    <>
      <h1>{`User ${id}`}</h1>
      <ul>
        <li>
          <Link to="">Main</Link>
        </li>
        <li>
          <Link to="about">About</Link>
        </li>
      </ul>
      <Routes>
        <Route path="" element={<Main />} />
        <Route path="about" element={<About />} />
      </Routes>
    </>
  );
};

User.defaultProps = {};

export default User;
```

![Untitled](./assets/12/Untitled9.png)

## 서브라우터에 다른 구현 Outlet

```tsx
// v6 이전
// App.tsx
<Route path="/user/:id">
  <User />
</Route>

// User.tsx
<>
  <h1>{`User ${id}`}</h1>
  <ul>
    <li>
      <Link to={`${match.url}`}>Main</Link>
    </li>
    <li>
      <Link to={`${match.url}/about`}>About</Link>
    </li>
  </ul>
  <Route path={match.path} exact>
    <UserMain />
  </Route>
  <Route path={`${match.path}/about`} exact>
    <UserAbout />
  </Route>
</>

// v6 이후
// App.tsx
<Route path="/useroutlet/:id/*" element={<UserOutlet />}>
  <Route path="" element={<UserMain />} />
  <Route path="about" element={<UserAbout />} />
</Route>

// User.tsx
<>
  <h1>{`User ${id}`}</h1>
  <ul>
    <li>
      <Link to="">Main</Link>
    </li>
    <li>
      <Link to="about">About</Link>
    </li>
  </ul>
  <Outlet />
</>
```

## Optional URL → Multi Route 추가

```tsx
// v6 이전
<Route path="/optional/:value?" element={<Optional />} />

// v6 이후
<Route path="/optional/:value" element={<Optional />} />
<Route path="/optional/" element={<Optional />} />
```

## NavLink 변경사항

- activeStye, activeClassName 사라지고, isActive Props로 변경
  - activeClassName → className={({ isActive }) => (isActive ? styles.active : '')}
  - activeStyle={activeStyle} → style={({ isActive }) => (isActive ? activeStyle : {})}
- exact → end 로 변경

  ```tsx
  // v6 이전
  import React from 'react';
  import { NavLink } from 'react-router-dom';
  import styles from './Template.module.scss';
  import Navigation from './Navigation';

  type TemplateProps = {
    children: React.ReactChild;
  };

  const Template = ({ children }: TemplateProps) => {
    const activeStyle = {
      fontWeight: 'bold',
      color: 'red',
    };

    return (
      <div>
        <ul>
          <li>
            <NavLink to="/" exact activeClassName={styles.active}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" activeStyle={activeStyle}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/with/1" activeStyle={activeStyle}>
              User Params with router
            </NavLink>
          </li>
          <li>
            <NavLink to="/user/1" activeStyle={activeStyle}>
              User Params hooks
            </NavLink>
          </li>
          <li>
            <NavLink to="/item/2" activeStyle={activeStyle}>
              User Params render
            </NavLink>
          </li>
          <li>
            <NavLink to="/optional" exact activeStyle={activeStyle}>
              Optional None params
            </NavLink>
          </li>
          <li>
            <NavLink to="/optional/3" activeStyle={activeStyle}>
              Optional params
            </NavLink>
          </li>
        </ul>
        <Navigation />
        {children}
      </div>
    );
  };

  Template.defaultProps = {};

  export default Template;

  // v6 이후
  import React from 'react';
  import { NavLink } from 'react-router-dom';
  import styles from './Template.module.scss';
  import Navigation from './Navigation';

  type TemplateProps = {
    children: React.ReactChild;
  };

  const Template = ({ children }: TemplateProps) => {
    const activeStyle = {
      fontWeight: 'bold',
      color: 'red',
    };

    return (
      <div>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? styles.active : '')}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              style={({ isActive }) => (isActive ? activeStyle : {})}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/with/1"
              style={({ isActive }) => (isActive ? activeStyle : {})}
            >
              User Params with router
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user/1"
              style={({ isActive }) => (isActive ? activeStyle : {})}
            >
              User Params hooks
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/useroutlet/1"
              style={({ isActive }) => (isActive ? activeStyle : {})}
            >
              User Outlet Params hooks
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/item/2"
              style={({ isActive }) => (isActive ? activeStyle : {})}
            >
              User Params render
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/optional"
              end
              style={({ isActive }) => (isActive ? activeStyle : {})}
            >
              Optional None params
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/optional/3"
              style={({ isActive }) => (isActive ? activeStyle : {})}
            >
              Optional params
            </NavLink>
          </li>
        </ul>
        <Navigation />
        {children}
      </div>
    );
  };

  Template.defaultProps = {};

  export default Template;
  ```

  ![Untitled](./assets/12/Untitled10.png)
  ![Untitled](./assets/12/Untitled11.png)

## Redirect → Navigate 변경사항

```tsx
// v6 이전
<Switch>
  <Redirect path="/main" to="/user/1" />
</Switch>

// v6 이후
<Routes>
  <Route path="/main" element={<Navigate replace to="/user/1" />} />
</Routes>
```

## renderRoutes → useRoutes

기존의 react-router-config의 renderRouters가 useRoutes라는 Hook 으로 변경됨.

```tsx
// v6 이전
// react-router-config
// yarn add react-router-config로 설치 후 사용
import { renderRoutes } from 'react-router-config';

const routes = [
  {
    component: Root,
    routes: [
      {
        path: '/',
        exact: true,
        component: Home,
      },
      {
        path: '/child/:id',
        component: Child,
        routes: [
          {
            path: '/child/:id/grand-child',
            component: GrandChild,
          },
        ],
      },
    ],
  },
];

const Root = ({ route }) => (
  <div>
    <h1>Root</h1>
    {/* 자식 라우트들이 렌더할 수 있도록  renderRoutes 실행 */}
    {renderRoutes(route.routes)}
  </div>
);

const Home = ({ route }) => (
  <div>
    <h2>Home</h2>
  </div>
);

const Child = ({ route }) => (
  <div>
    <h2>Child</h2>
    {/*  renderRoutes가 없으면 자식들은 렌더되지 않음  */}
    {renderRoutes(route.routes)}
  </div>
);

const GrandChild = ({ someProp }) => (
  <div>
    <h3>Grand Child</h3>
    <div>{someProp}</div>
  </div>
);

ReactDOM.render(
  <BrowserRouter>
    {/* renderRoutes에 가장 처음 정의했던 routes 자체를 뿌려줌으로써 차례로 렌더링될 수 있도록 함 */}
    {renderRoutes(routes)}
  </BrowserRouter>,
  document.getElementById('root'),
);

// v6 이후
function App() {
  const element = useRoutes([
    // Route에서 사용하는 props의 요소들과 동일
    { path: '/', element: <Home /> },
    { path: 'dashboard', element: <Dashboard /> },
    {
      path: 'invoices',
      element: <Invoices />,
      // 중첩 라우트의 경우도 Route에서와 같이 children이라는 property를 사용
      children: [
        { path: ':id', element: <Invoice /> },
        { path: 'sent', element: <SentInvoices /> },
      ],
    },
    // NotFound 페이지는 다음과 같이 구현할 수 있음
    { path: '*', element: <NotFound /> },
  ]);

  // element를 return함으로써 적절한 계층으로 구성된 element가 렌더링 될 수 있도록 함
  return element;
}
```

## Prompt, history.block 미지원

- 현재 최신버전에서는 Prompt 미지원하나 추후에 적용예정
- 추가 구현은 가능하나 마이그레이션 할 시 고민해봐야함.
- history.block → useBlocker 커스텀 훅으로 변환가능

```tsx
// v6 이전
const About = () => {
  const location = useLocation();

  return (
    <>
      <h1>About</h1>
      <p>{location.search}</p>
      <Prompt when={true} message="페이지를 떠나시겠습니까?" />
    </>
  );
};

// v6 이후
// Block.jsx
import { BrowserHistory, Blocker } from 'history';
import { useContext, useEffect, useCallback } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';
import { createBrowserHistory } from 'history';

export function useBlocker(blocker: Blocker, when = true) {
  const navigation = useContext(NavigationContext).navigator as BrowserHistory;
  const history = createBrowserHistory();

  useEffect(() => {
    if (!when) return;

    const unblock = navigation.block(tx => {
      // history.block
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };
      blocker(autoUnblockingTx);
    });
    return unblock;
  }, [navigator, blocker, when]);
}

export function usePrompt(message: string, when = true) {
  const blocker = useCallback(
    tx => {
      //   eslint-disable-next-line no-alert
      if (window.confirm(message)) tx.retry();
    },
    [message],
  );

  useBlocker(blocker, when);
}

// App.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { usePrompt } from '../utils/Block';

const About = () => {
  const location = useLocation();
  usePrompt('Leave screen?', true);

  return (
    <>
      <Prompt when />
      <h1>About</h1>
      <p>{location.search}</p>
    </>
  );
};

About.defaultProps = {};

export default About;
```

# Migrating to RouterProvider(with createBrowserRouter)

도입배경

createBrowserRouter가 도입된 이유와 장점입니다:

1. **단순화된 라우팅 설정**: createBrowserRouter를 사용하면 라우트 구성을 하나의 객체로 선언할 수 있습니다. 이로 인해 라우트 설정을 보다 간단하고 일관성 있게 관리할 수 있습니다.
2. **라우트 데이터 로딩**: createBrowserRouter는 데이터 로딩을 더 쉽게 처리할 수 있는 기능을 제공합니다. 라우트마다 데이터를 로드하고, 이를 loader 함수를 통해 처리할 수 있습니다. 이로 인해 데이터와 라우트 설정을 한 곳에서 관리할 수 있습니다.
3. **중첩 라우트의 간편한 관리**: 중첩 라우트(nested routes)를 설정하는 것도 더 직관적입니다. createBrowserRouter는 중첩 라우트를 선언적이고 명확하게 관리할 수 있는 구조를 제공합니다.
4. **에러 경계(Error Boundaries)**: 각 라우트에 에러 경계를 쉽게 추가할 수 있습니다. createBrowserRouter를 사용하면 특정 라우트에서 발생하는 오류를 처리하기 위해 에러 경계를 설정하는 것이 간편해집니다.
5. **경량화 및 최적화**: React Router v6는 성능과 사용성을 고려하여 많은 부분이 최적화되었습니다. createBrowserRouter는 이러한 최신 최적화를 활용할 수 있는 구조를 제공합니다.

- Add RouterProvider with a root splat route

  ```tsx
  import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

  export default function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog/*" element={<BlogApp />} />
          <Route path="/users/*" element={<UserApp />} />
        </Routes>
      </BrowserRouter>
    );
  }

  function Home() {
    return (
      <>
        <h1>Welcome!</h1>
        <p>
          Check out the <Link to="/blog">blog</Link> or the{' '}
          <Link to="users">users</Link> section
        </p>
      </>
    );
  }

  function BlogApp() {
    return (
      <Routes>
        <Route index element={<h1>Blog Index</h1>} />
        <Route path="posts" element={<h1>Blog Posts</h1>} />
      </Routes>
    );
  }

  function UserApp() {
    return (
      <Routes>
        <Route index element={<h1>Users Index</h1>} />
      </Routes>
    );
  }

  import {
    createBrowserRouter,
    Link,
    Route,
    RouterProvider,
    Routes,
  } from 'react-router-dom';

  // 3️⃣ Router singleton created
  const router = createBrowserRouter([{ path: '*', element: <Root /> }]);

  // 4️⃣ RouterProvider added
  export default function App() {
    return <RouterProvider router={router} />;
  }

  // 1️⃣ Changed from App to Root
  function Root() {
    // 2️⃣ `BrowserRouter` component removed, but the <Routes>/<Route>
    // component below are unchanged
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/*" element={<BlogApp />} />
        <Route path="/users/*" element={<UserApp />} />
      </Routes>
    );
  }

  function Home() {
    /* Unchanged */
  }
  function BlogApp() {
    /* Unchanged */
  }
  function UserApp() {
    /* Unchanged */
  }
  ```

- Start lifting routes and leveraging the data APIs

  ```tsx
  // routes/root.jsx
  import { getContacts } from '../contacts';

  export async function loader() {
    const contacts = await getContacts();
    return { contacts };
  }

  export async function action() {
    const contact = await createContact();
    return { contact };
  }

  return (
    <>
      <Form method="post">
        <button type="submit">New</button>
      </Form>
    </>
  );

  /* previous imports */
  import ErrorPage from './error-page';
  import { Outlet, useLoaderData, Form } from 'react-router-dom';
  import { loader as rootLoader } from './routes/root';

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      // Lifted blog splat route
      path: '/blog/*',
      children: [
        // New blog index route
        { index: true, element: <h1>Blog Index</h1> },
        // Blog subapp splat route added for /blog/posts matching
        { path: '*', element: <BlogApp /> },
      ],
    },
    {
      path: '*',
      element: (
        <Suspense fallback={<Loading />}>
          <Home />
        </Suspense>
      ),
      loader: rootLoader,
      errorElement: <ErrorPage />,
      children: [
        {
          path: 'contacts/:contactId',
          element: <Contact />,
        },
      ],
    },
  ]);

  export default function App() {
    return <RouterProvider router={router} />;
  }

  function Root() {
    const { contacts } = useLoaderData();

    return (
      <Routes>
        {/* ⬆️ Home route lifted up to the data router */}
        <Route path="/blog/*" element={<BlogApp />} />
        <Route path="/users/*" element={<UserApp />} />
        <Outlet />
      </Routes>
    );
  }

  function BlogApp() {
    return (
      <Routes>
        {/* ⬆️ Blog index route lifted */}
        <Route path="posts" element={<h1>Blog Posts</h1>} />
      </Routes>
    );
  }
  ```

* [optimistic-ui](https://reactrouter.com/en/main/start/tutorial#optimistic-ui)
* [not-found-data](https://reactrouter.com/en/main/start/tutorial#not-found-data)
* [pathless-routes](https://reactrouter.com/en/main/start/tutorial#pathless-routes)
* [jsx-routes](https://reactrouter.com/en/main/start/tutorial#jsx-routes)

## 참고페이지

[https://reactrouter.com/docs/en/v6/upgrading/v5](https://reactrouter.com/docs/en/v6/upgrading/v5)

[https://gist.github.com/rmorse/426ffcc579922a82749934826fa9f743#file-usage-useprompt-react-router-dom-js](https://gist.github.com/rmorse/426ffcc579922a82749934826fa9f743#file-usage-useprompt-react-router-dom-js)

[https://velog.io/@velopert/react-router-v6-tutorial](https://velog.io/@velopert/react-router-v6-tutorial)
