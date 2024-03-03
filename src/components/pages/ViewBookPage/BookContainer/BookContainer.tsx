import React, { useRef } from 'react';
import { useStore } from 'react-redux';
import { useEffectOnce } from 'react-use';
import cn from 'clsx';
import { RootState } from '@/store/reducers';
import { useTopElementBeforeChangeWidth } from '@/utils/hooks/useTopElementBeforeChangeWidth.ts';

interface Props extends React.ComponentPropsWithoutRef<'div'> {}

function BookContainer({ className, children, ...props }: Props) {
  const containerElRef = useRef<HTMLDivElement>(null);
  const { scrollToTopElement } = useTopElementBeforeChangeWidth();

  const store = useStore<RootState>();

  useEffectOnce(() => {
    const setContainerWidth = (viewWidth) => {
      containerElRef.current!.style.width = viewWidth === 'auto' ? '100%' : `${viewWidth}px`;
      scrollToTopElement();
    };
    let previousViewWidth = store.getState().ui.viewWidth;
    setContainerWidth(previousViewWidth);

    const unsubscribe = store.subscribe(() => {
      const currentViewWidth = store.getState().ui.viewWidth;
      if (previousViewWidth !== currentViewWidth) {
        previousViewWidth = currentViewWidth;
        setContainerWidth(currentViewWidth);
      }
    });

    return () => {
      unsubscribe();
    };
  });

  return (
    <div
      className={cn(className, 'm-auto max-w-full min-w-[200px]')}
      ref={containerElRef}
      {...props}
    >
      {children}
    </div>
  );
}

export default BookContainer;
