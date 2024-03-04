import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import cn from 'clsx';
import RemoveBookDialog from '@/components/common/RemoveBookDialog/RemoveBookDialog.tsx';
import Authors from '@/components/pages/SelectBookPage/SavedBooksList/Authors/Authors.tsx';
import routes from '@/constants/routes.ts';
import { removeBook } from '@/store/reducers/books.ts';
import { savedBooksListSelector } from '@/store/selectors.ts';
import { booksDbManagerInstance } from '@/utils/db/booksDbManagerInstance.ts';
import { useAppDispatch } from '@/utils/hooks/useAppDispatch.ts';
import { useAppSelector } from '@/utils/hooks/useAppSelector.ts';

interface Props extends React.ComponentPropsWithoutRef<'div'> {}

function SavedBooksList({ className, ...props }: Props) {
  const savedBooksList = useAppSelector(savedBooksListSelector);
  const dispatch = useAppDispatch();
  const [removingBookId, setRemovingBookId] = useState(null);

  const handleClickRemoveBook = (e) => {
    e.preventDefault();
    const bookId = e.currentTarget.dataset.bookId;
    setRemovingBookId(bookId);
  };

  const handleConfirmRemoveDialog = () => {
    if (!removingBookId) {
      return;
    }

    dispatch(removeBook(removingBookId));
    void booksDbManagerInstance.removeBook(removingBookId);

    setRemovingBookId(null);
  };

  if (!savedBooksList.length) {
    return null;
  }

  return (
    <div className={cn(className, 'w-full max-w-4xl space-y-2 pb-10')} {...props}>
      {savedBooksList.map(({ id, meta, progress }) => {
        return (
          <Link
            to={routes.viewBook.replace(':id', id)}
            key={id}
            className="flex overflow-hidden border border-gray-300 hover:border-gray-500 bg-white rounded-md space-x-2 transition"
          >
            <div className="flex p-2 flex-1">
              <div className="flex w-[50px] max-h-[100px] h-full">
                {meta.coverPageImgPreview ? (
                  <img
                    src={meta.coverPageImgPreview}
                    alt=""
                    className="w-[50px] max-h-[100px] h-full border border-gray-500 rounded-md"
                  />
                ) : (
                  <div className="w-full h-full bg-orange-300 rounded-md border border-gray-500" />
                )}
              </div>

              <div className="flex-1 ml-4">
                <Authors authors={meta.authors} className="text-gray-500" />
                <div className="text-gray-800 font-semibold">{meta.bookTitle}</div>
              </div>
            </div>

            <div className="flex flex-col justify-between items-end p-2">
              <button
                type="button"
                className="p-2 -mr-2 -mt-2 rounded-bl-md transition hover:bg-red-100"
                onClick={handleClickRemoveBook}
                data-book-id={id}
              >
                <TrashIcon className="text-red-500 w-4 h-4" />
              </button>

              {progress && (
                <div className="text-sm text-gray-500">{progress.progress.toFixed(0)}%</div>
              )}
            </div>
          </Link>
        );
      })}

      <RemoveBookDialog
        open={!!removingBookId}
        onCancel={() => setRemovingBookId(null)}
        onConfirm={handleConfirmRemoveDialog}
      />
    </div>
  );
}

export default SavedBooksList;
