import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'clsx';
import routes from '@/constants/routes.ts';
import { removeBook } from '@/store/reducers/books.ts';
import { savedBooksListSelector } from '@/store/selectors.ts';
import { useAppDispatch } from '@/utils/hooks/useAppDispatch.ts';
import { useAppSelector } from '@/utils/hooks/useAppSelector.ts';
import styles from './SavedBooksList.module.scss';

interface Props extends React.ComponentPropsWithoutRef<'div'> {}

function SavedBooksList({ className, ...props }: Props) {
  const savedBooksList = useAppSelector(savedBooksListSelector);
  const dispatch = useAppDispatch();

  const createRemoveBookHandler = (id: string) => () => {
    void dispatch(removeBook(id));
  };

  if (!savedBooksList.length) {
    return null;
  }

  return (
    <div className={className}>
      <div>or select a previously loaded book:</div>
      <div className={cn(className, styles.list)} {...props}>
        {savedBooksList.map(({ id, meta, progress }) => {
          return (
            <div key={id} className={styles.item}>
              <Link className={styles.openButton} to={routes.viewBook.replace(':id', id)}>
                {meta.coverPageImgPreview && <img src={meta.coverPageImgPreview} alt="" className={styles.previewImg}/>}

                <div className={styles.name}>{meta.bookTitle}</div>
                {progress && <div className={styles.progress}>{progress.progress.toFixed(1)}%</div>}
              </Link>
              <button
                type="button"
                className={styles.removeButton}
                onClick={createRemoveBookHandler(id)}
              >
                x
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SavedBooksList;
