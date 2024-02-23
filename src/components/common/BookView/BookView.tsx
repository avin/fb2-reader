import React from 'react';
import { useEffectOnce } from 'react-use';
import cn from 'clsx';
import { debounce } from 'lodash-es';
import BookDescription from '@/components/common/BookView/BookDescription/BookDescription.tsx';
import BookProvider from '@/components/common/BookView/BookProvider/BookProvider.tsx';
import config from '@/config.ts';
import { adjustScrollToElement, getScrollPercentage } from '@/utils/browser.ts';
import { booksDbManagerInstance } from '@/utils/db/booksDbManagerInstance.ts';
import styles from './BookView.module.scss';
import FormattedContent from './FormattedContent/FormattedContent.tsx';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  book: any;
  bookId: string;
}

function BookView({ book, bookId, className, ...props }: Props) {
  useEffectOnce(() => {
    let topElement: HTMLElement;
    let lastWidth = window.innerWidth;

    const writeProgressInfo = debounce(function fixTopElement() {
      if (!topElement) {
        return;
      }
      void booksDbManagerInstance.writeBookProgress(bookId, {
        elementId: topElement.dataset.id,
        progress: getScrollPercentage(),
      });
    }, 300);

    // Сохранить позицию верхнего элемента
    const fixTopElement = function fixTopElement() {
      const elements = document.querySelectorAll('[data-id=book] [data-id]'); // Селектор ваших элементов
      const scrollTop = window.scrollY;
      let closestElement: any = null;
      let closestElementOffset = Number.MAX_VALUE;

      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const offset = rect.top + scrollTop; // Абсолютное смещение от начала страницы

        // Ищем элемент, который находится наверху или как можно ближе к верху видимой части
        if (rect.top >= 0 && rect.top < closestElementOffset) {
          closestElement = element;
          closestElementOffset = rect.top;
        }
      });

      if (!closestElement) {
        return;
      }

      topElement = closestElement;

      writeProgressInfo();
    };

    const handleScroll = () => {
      // Если ширина окна изменилась, предполагаем, что это изменение зума
      const widthChange = Math.abs(window.innerWidth - lastWidth);
      if (widthChange > 0) {
        if (topElement) {
          // Подскроливаем до последнего верхнего элемента
          adjustScrollToElement(topElement);
        }
        // Обновляем последнюю известную ширину окна
        lastWidth = window.innerWidth;
        return;
      }

      fixTopElement();
    };

    window.addEventListener('scroll', handleScroll);
    // window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // window.removeEventListener('resize', handleResize);
    };
  });

  useEffectOnce(() => {
    void (async () => {
      // Восстанавливаем предыдущее состояние прокрутки
      const data = await booksDbManagerInstance.readBookProgress(bookId);
      if (!data) {
        return;
      }
      const el = document.querySelector(`[data-id="${data.elementId}"]`) as HTMLElement;
      if (el) {
        adjustScrollToElement(el);
      }
    })();
  });

  if (!book) {
    return null;
  }

  return (
    <BookProvider book={book}>
      <div
        className={cn(styles.book, className, { debug: config.debug })}
        data-id="book"
        {...props}
      >
        <div className={styles.bookDescription}>
          <BookDescription content={book} />
        </div>

        {book.map((item, idx) => {
          const tag = Object.keys(item)[0];
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
