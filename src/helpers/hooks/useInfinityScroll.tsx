import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { PostListItemType } from '../../types/PostItem';

type InfinityScrollType = [React.RefObject<HTMLDivElement>, PostListItemType[]];

const useInfinityScroll = (
  posts: PostListItemType[],
  INIT_PER_PAGE_NUMBER: number,
): InfinityScrollType => {
  const currentRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState<number>(1);

  useEffect(() => {
    const observer = new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting) {
        return;
      }

      setCount(prev => prev + 1);
      observer.disconnect();
    });

    if (
      INIT_PER_PAGE_NUMBER * count >= posts.length ||
      currentRef.current === null
    ) {
      return;
    }

    observer.observe(currentRef.current);

    return () => {
      observer.disconnect();
    };
  }, [count, posts, currentRef]);

  return [currentRef, posts.slice(0, count * INIT_PER_PAGE_NUMBER)];
};

export default useInfinityScroll;
