import React, { useEffect, useState } from 'react';
import { useEffectOnce } from 'react-use';
import cn from 'clsx';
import { debounce } from 'lodash-es';
import BookDescription from '@/components/common/BookView/BookDescription/BookDescription.tsx';
import BookProvider from '@/components/common/BookView/BookProvider/BookProvider.tsx';
import { FB2 } from '@/utils/fb2/FB2.ts';
import styles from './BookView.module.scss';
import FormattedContent from './FormattedContent/FormattedContent.tsx';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  content: string;
}

function BookView({ content, className, ...props }: Props) {
  const [book, setBook] = useState<any>(null);

  useEffect(() => {
    const fb2 = FB2.init();
    const bookObj = fb2.parse(content);
    setBook(bookObj);
  }, [content]);

  useEffectOnce(() => {
    // Функция для определения и фиксации элемента на верху
    const fixTopElement = debounce(function fixTopElement() {
      const elements = document.querySelectorAll('#book *'); // Селектор ваших элементов
      const scrollTop = window.scrollY;
      let closestElement: any = null;
      let closestElementOffset = Number.MAX_VALUE;

      elements.forEach((element) => {
        const offset = element.getBoundingClientRect().top + scrollTop;
        if (offset < scrollTop + 50 && scrollTop - offset < closestElementOffset) {
          // 50 - чувствительность
          closestElement = element;
          closestElementOffset = scrollTop - offset;
        }
      });

      if (closestElement) {
        console.log(closestElement);
        // TODO: записать признак элемента в сторадж
      }
    }, 300);

    // Слушатель события скролла
    window.addEventListener('scroll', fixTopElement);
  });

  if (!book) {
    return null;
  }

  return (
    <BookProvider book={book}>
      <div className={cn(styles.book, className)} id="book" {...props}>
        {book.map((item, idx) => {
          const tag = Object.keys(item)[0];
          if (tag === 'description') {
            return (
              <div className={styles.body} key={idx}>
                <BookDescription key={idx} content={item[tag]} />
              </div>
            );
          }
          if (tag === 'body') {
            return (
              <div className={styles.body} key={idx}>
                <FormattedContent key={idx} content={item[tag]} />
              </div>
            );
          }
          return null;
        })}
      </div>
    </BookProvider>
  );
}

export default BookView;
