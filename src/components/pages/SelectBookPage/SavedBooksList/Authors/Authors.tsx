import React, { useMemo } from 'react';
import cn from 'clsx';
import { BookMeta } from '@/types';
import styles from './Authors.module.scss';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  authors: BookMeta['authors'];
}

function Authors({ authors, className, ...props }: Props) {
  const authorsListStr = useMemo(() => {
    return authors
      .reduce((acc, { firstName, lastName, middleName, nickname }) => {
        acc.push([firstName, nickname, middleName, lastName].filter(Boolean).join(' '));
        return acc;
      }, [] as string[])
      .join(', ');
  }, [authors]);

  return (
    <div className={cn(className)} {...props}>
      {authorsListStr}
    </div>
  );
}

export default Authors;
