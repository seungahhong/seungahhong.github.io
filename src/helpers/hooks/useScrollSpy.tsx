import { useEffect } from 'react';

type targetProps = {
  headings: HTMLHeadElement[];
  tocs: HTMLAnchorElement[];
};

const useScrollSpy = (
  tocRef: React.RefObject<HTMLElement>,
  markdownRef: React.RefObject<HTMLElement>,
) => {
  const handleScroll = (event: Event, target: targetProps) => {
    const { headings, tocs } = target;
    headings.forEach(target => {
      if (target.offsetTop - window.scrollY <= 0) {
        tocs.forEach(toc => {
          if (decodeURIComponent(toc.hash.replace('#', '')) === target.id) {
            toc.classList.add('reach');
          } else {
            toc.classList.remove('reach');
          }
        });
      }
    });
  };

  useEffect(() => {
    const markdownTarget: NodeListOf<HTMLHeadElement> | undefined =
      markdownRef.current?.querySelectorAll<HTMLHeadElement>(
        'h1, h2, h3, h4, h5, h6',
      );

    const tocTarget: NodeListOf<HTMLAnchorElement> | undefined =
      tocRef.current?.querySelectorAll<HTMLAnchorElement>('a');

    const target = {
      headings: markdownTarget ? Array.from(markdownTarget) : [],
      tocs: tocTarget ? Array.from(tocTarget) : [],
    };

    if (markdownTarget && tocTarget) {
      if (markdownTarget.length > 0 && tocTarget.length > 0) {
        document.addEventListener('scroll', (event: Event) =>
          handleScroll(event, target),
        );
      }
    }

    return () => {
      document.removeEventListener('scroll', (event: Event) =>
        handleScroll(event, target),
      );
    };
  }, [tocRef, markdownRef]);
};

export default useScrollSpy;
