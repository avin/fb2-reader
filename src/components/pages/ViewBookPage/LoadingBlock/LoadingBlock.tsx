import React from 'react';
import { CSSTransition } from 'react-transition-group';
import cn from 'clsx';
import Spinner from '@/components/common/Spinner/Spinner.tsx';
import styles from './LoadingBlock.module.scss';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  active: boolean;
}

function LoadingBlock({ active, className, ...props }: Props) {
  return (
    <CSSTransition
      in={active}
      timeout={600} // Общее время для анимации включает 300мс задержки + 300мс анимации
      classNames={{ ...styles }}
      unmountOnExit
    >
      <div
        className={cn(
          styles.container,
          'flex items-center justify-center z-50 fixed inset-0 flex-col space-y-2',
          className,
        )}
        {...props}
      >
        <Spinner size={48} />
        <div>Book loading...</div>
      </div>
    </CSSTransition>
  );
}

export default LoadingBlock;
