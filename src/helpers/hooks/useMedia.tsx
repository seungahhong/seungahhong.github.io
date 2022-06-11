import { useMediaPredicate } from 'react-media-hook';

export const useIsMobile = () => {
  return useMediaPredicate('(max-width: 768px)');
};
