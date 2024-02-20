import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import BookView from '@/components/common/BookView/BookView.tsx';
import { booksDbManagerInstance } from '@/utils/db/booksDbManagerInstance.ts';
import {getBookMetadata, parseBookXml} from '@/utils/fb2.ts';

function ViewBookPage() {
  const location = useLocation();
  const [book, setBook] = useState<any>(null);
  const [isLoadFailed, setIsLoadFailed] = useState(false);
  const content = location.state?.data;
  const { id } = useParams();

  const parseBookString = (str: string) => {
    const bookObj = parseBookXml(str)[1].FictionBook;
    setBook(bookObj);

    // Пишем по книге метаданные
    void booksDbManagerInstance.writeBookMeta(id!, {
      ...getBookMetadata(bookObj)
    })
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
        parseBookString(bookString);
      } catch (e) {
        setIsLoadFailed(true);
      }
    })();
  });

  if (isLoadFailed) {
    return <div>Loading failed!</div>;
  }

  if (!book) {
    return <div>Loading...</div>;
  }

  return <BookView book={book} />;
}

export default ViewBookPage;
