import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import BookView from '@/components/common/BookView/BookView.tsx';
import { dbReadBook, dbWriteBook } from '@/utils/db.ts';
import { FB2 } from '@/utils/fb2/FB2.ts';

function ViewBookPage() {
  const location = useLocation();
  const [book, setBook] = useState<any>(null);
  const [isLoadFailed, setIsLoadFailed] = useState(false);
  const content = location.state?.data;
  const { id: hash } = useParams();

  const parseBookString = (str: string) => {
    const fb2 = FB2.init();
    const bookObj = fb2.parse(str);
    setBook(bookObj);
  };

  // Если была передана книга с другой странице - сохраняем её в DB
  useEffectOnce(() => {
    if (!content) {
      return;
    }

    parseBookString(content);

    void dbWriteBook({
      hash,
      bookString: content,
    });
  });

  // Если книгу не передавали, то пытаемся загрузить её из DB по хешу
  useEffectOnce(() => {
    if (content) {
      return;
    }

    void (async () => {
      try {
        const bookString = await dbReadBook({ hash });
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
