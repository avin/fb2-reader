import { useCallback } from 'react';
import { adjustScrollToElement } from '@/utils/browser.ts';

let topElement = null;

export const useTopElementBeforeChangeWidth = () => {
  const setTopElement = useCallback((el) => {
    topElement = el;
  }, []);

  const scrollToTopElement = useCallback(() => {
    if (topElement) {
      adjustScrollToElement(topElement);
    }
  }, []);

  return { setTopElement, scrollToTopElement };
};
