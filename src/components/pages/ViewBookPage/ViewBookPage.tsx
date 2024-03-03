import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import BookView from '@/components/common/BookView/BookView.tsx';
import LoadingBlock from '@/components/pages/ViewBookPage/LoadingBlock/LoadingBlock.tsx';
import ViewControl from '@/components/pages/ViewBookPage/ViewControl/ViewControl.tsx';
import { BookMeta } from '@/types';
import { booksDbManagerInstance } from '@/utils/db/booksDbManagerInstance.ts';
import { getBookMetadata, parseBookXml } from '@/utils/fb2.ts';
import { useAppSelector } from '@/utils/hooks/useAppSelector.ts';
import { useTopElementBeforeChangeWidth } from '@/utils/hooks/useTopElementBeforeChangeWidth.ts';

function ViewBookPage() {
  const location = useLocation();
  const [book, setBook] = useState<any>(null);
  const [bookMeta, setBookMeta] = useState<BookMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFailed, setIsLoadingFailed] = useState(false);
  const content = location.state?.data;
  const { id } = useParams();
  const viewWidth = useAppSelector((s) => s.ui.viewWidth);
  const { scrollToTopElement } = useTopElementBeforeChangeWidth();
  const { t } = useTranslation();

  const parseBookString = (str: string) => {
    const bookObj = parseBookXml(str)[1].FictionBook;
    setBook(bookObj);

    // Пишем по книге метаданные
    void getBookMetadata(bookObj).then((metadata) => {
      setBookMeta(metadata);
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

  useEffect(() => {
    scrollToTopElement();
  }, [scrollToTopElement, viewWidth]);

  useEffect(() => {
    if (bookMeta) {
      document.title = bookMeta.bookTitle;
    } else {
      document.title = t('pageTitle');
    }

    return () => {
      document.title = t('pageTitle');
    };
  }, [bookMeta, t]);

  useEffectOnce(() => {
    document.body.classList.add('with-scroll');
    return () => {
      document.body.classList.remove('with-scroll');
    };
  });

  return (
    <div className="relative">
      {bookMeta && <ViewControl bookMeta={bookMeta} />}
      <div
        className="m-auto max-w-full min-w-[200px]"
        style={{ width: viewWidth === 'auto' ? '100%' : `${viewWidth}px` }}
      >
        <LoadingBlock active={isLoading} />
        {book && <BookView book={book} bookId={id!} />}
        {isLoadingFailed && <div>Loading failed!</div>}
      </div>
    </div>
  );
}

export default ViewBookPage;
