import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import cn from 'clsx';
import BookView from '@/components/common/BookView/BookView.tsx';
import { booksDbManagerInstance } from '@/utils/db/booksDbManagerInstance.ts';
import { getBookMetadata, parseBookXml } from '@/utils/fb2.ts';
import styles from './ViewBookPage.module.scss';
import ViewControl from '@/components/pages/ViewBookPage/ViewControl/ViewControl.tsx';

function ViewBookPage() {
  const location = useLocation();
  const [book, setBook] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFailed, setIsLoadingFailed] = useState(false);
  const content = location.state?.data;
  const { id } = useParams();

  const parseBookString = (str: string) => {
    const bookObj = parseBookXml(str)[1].FictionBook;
    setBook(bookObj);

    // Пишем по книге метаданные
    void getBookMetadata(bookObj).then((metadata) => {
      void booksDbManagerInstance.writeBookMeta(id!, {
        ...metadata,
      });
    });

    setIsLoading(false);
  };

  // Если была передана книга с другой страницы - сохраняем её в БД
  useEffectOnce(() => {
    if (!content) {
      return;
    }

    parseBookString(content);

    void booksDbManagerInstance.writeBookString(id!, content);
  });

  // Если книгу не передавали, то пытаемся загрузить её из БД
  useEffectOnce(() => {
    if (content) {
      return;
    }

    void (async () => {
      try {
        const bookString = await booksDbManagerInstance.readBookString(id!);
        parseBookString(bookString!);
      } catch (e) {
        setIsLoading(false);
        setIsLoadingFailed(true);
        console.warn(e);
      }
    })();
  });

  return (
    <div className={styles.page}>
      <ViewControl />
      <div className={cn(styles.loadingContainer, { [styles.active]: isLoading })}>
        <div className={styles.content}>Loading...</div>
      </div>
      {book && <BookView book={book} bookId={id!} />}
      {isLoadingFailed && <div>Loading failed!</div>}
    </div>
  );
}

export default ViewBookPage;
