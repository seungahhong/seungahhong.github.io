'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * URL 쿼리 파라미터를 읽고 쓰는 훅.
 *
 * `useSearchParams()`를 쓰지 않는 이유: 정적 익스포트에서 그 훅은 프리렌더를 중단시켜
 * 가장 가까운 Suspense 경계의 fallback만 HTML에 남긴다. 목록 페이지(`/posts`, `/tags`)가
 * 통째로 빈 HTML이 되어 크롤러가 제목도 글 링크도 보지 못한다.
 *
 * 대신 `location.search`를 외부 스토어로 구독한다. 서버 스냅샷은 빈 쿼리라
 * 프리렌더된 HTML에는 필터 없는 전체 목록이 담기고, 하이드레이션 직후 실제 쿼리로
 * 다시 렌더되어 필터가 적용된다.
 */

const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  window.addEventListener('popstate', onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener('popstate', onStoreChange);
  };
}

/** 문자열이라 값 비교가 되므로 useSyncExternalStore의 캐싱 요구를 만족한다. */
const getSnapshot = () => window.location.search;
const getServerSnapshot = () => '';

export function useQueryParam(
  key: string,
): [string | null, (value: string | null) => void] {
  const search = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const value = new URLSearchParams(search).get(key);

  const setValue = useCallback(
    (next: string | null) => {
      const params = new URLSearchParams(window.location.search);
      if (next === null) params.delete(key);
      else params.set(key, next);
      const qs = params.toString();
      // App Router가 history.replaceState를 패치해 라우터 상태를 동기화한다.
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${qs ? `?${qs}` : ''}`,
      );
      emit();
    },
    [key],
  );

  return [value, setValue];
}
