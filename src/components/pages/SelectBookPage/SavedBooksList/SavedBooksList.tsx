import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'clsx';
import routes from '@/constants/routes.ts';
import styles from './SavedBooksList.module.scss';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  savedBookMetas: any;
}

function SavedBooksList({ savedBookMetas, className, ...props }: Props) {
  return (
    <div className={cn(className, styles.list)} {...props}>
      {savedBookMetas.map((item) => {
        return (
          <Link className={styles.item} to={routes.viewBook.replace(':id', item.id)} key={item.id}>
            {item.titleInfo.bookTitle}
          </Link>
        );
      })}
    </div>
  );
}

export default SavedBooksList;
