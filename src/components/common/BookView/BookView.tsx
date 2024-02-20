import React from 'react';
import { useEffectOnce } from 'react-use';
import cn from 'clsx';
import { debounce } from 'lodash-es';
import BookDescription from '@/components/common/BookView/BookDescription/BookDescription.tsx';
import BookProvider from '@/components/common/BookView/BookProvider/BookProvider.tsx';
import config from '@/config.ts';
import styles from './BookView.module.scss';
import FormattedContent from './FormattedContent/FormattedContent.tsx';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  book: any;
}

function BookView({ book, className, ...props }: Props) {
  useEffectOnce(() => {
    // Функция для определения и фиксации элемента наверху
    const fixTopElement = debounce(function fixTopElement() {
      const elements = document.querySelectorAll('[data-id=book] *'); // Селектор ваших элементов
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
        // console.log(closestElement);
        // TODO: записать признак элемента в сторадж
      }
    }, 300);

    window.addEventListener('scroll', fixTopElement);

    return () => {
      window.removeEventListener('scroll', fixTopElement);
    };
  });

  if (!book) {
    return null;
  }

  return (
    <BookProvider book={book}>
      <div className={cn(styles.book, className, {debug: config.debug})} data-id="book" {...props}>
        <div className={styles.bookDescription}>
          <BookDescription content={book}/>
        </div>

        {book.map((item, idx) => {
          const tag = Object.keys(item)[0];
          if (tag === 'body') {
            return (
                <div className={styles.body} key={idx}>
                  <FormattedContent key={idx} content={item[tag]}/>
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
