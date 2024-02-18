import React from 'react';
import cn from 'clsx';
import styles from './InitPage.module.scss';

interface Props extends React.ComponentPropsWithoutRef<'div'> {}

function InitPage({ className, ...props }: Props) {
  return (
    <div className={cn(className)} {...props}>
      InitPage
    </div>
  );
}

export default InitPage;
