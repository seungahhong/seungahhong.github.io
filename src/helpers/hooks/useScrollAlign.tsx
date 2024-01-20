import { useCallback, useState, MouseEvent } from 'react';

const useScrollAlign = () => {
  const [element, setElement] = useState<HTMLElement>();
  const ref = useCallback((el: any) => {
    if (el) {
      setElement(el);
    }
  }, []);

  const handleScrollHorzCenter = useCallback(
    (event: MouseEvent) => {
      const currentElement = event.target as HTMLElement;
      const { offsetWidth: currentWidth } = currentElement;
      if (element && element.contains(currentElement)) {
        // parentWidth : 부모 요소의 전체너비
        // parentWidth / 2: 스크롤 된 부모요소 가로값의 절반(중앙정렬 기준)
        // currentLeft: viewport 기준의 자식 Left 위치(뷰포트 기준이다 보니 스크롤 위치가 가로로 변경되더라도 해당 값은 반영되지 않는다.)
        // parentLeft: 부모 요소의 Left 위치
        // offsetCurrentLeft: (자식요소 Left 위치 + 스크롤 Left위치) - 부모요소 Left 위치(실질적인 자식의 너비)
        // targetScollX: 중앙정렬 기준으로 자식의 너비값을 뺄 경우 중앙정렬
        /* 
          예:
          scrollLeft: 0
          parentLeft: 10
          parentWidth: 1300
          currentLeft: 1000
          parentWidth / 2: 750
          currentWidth / 2: 10
          targetScollX: (1000 + 0 - 10) - (1300/2 + 1000/2))
        */

        const { scrollLeft, offsetWidth: parentWidth } = element;

        const currentLeft = currentElement.getBoundingClientRect().left;
        const parentLeft = element.getBoundingClientRect().left;
        const offsetCurrentLeft = currentLeft + scrollLeft - parentLeft;
        const targetScollX =
          offsetCurrentLeft - parentWidth / 2 + currentWidth / 2;

        element.scroll({
          left: targetScollX,
          top: 0,
          behavior: 'smooth',
        });
      }
    },
    [element],
  );

  return {
    ref,
    handleScrollHorzCenter,
  };
};

export default useScrollAlign;
