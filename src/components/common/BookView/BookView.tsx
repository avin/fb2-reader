import React from 'react';
import { useEffectOnce } from 'react-use';
import cn from 'clsx';
import { debounce } from 'lodash-es';
import BookDescription from '@/components/common/BookView/BookDescription/BookDescription.tsx';
import BookProvider from '@/components/common/BookView/BookProvider/BookProvider.tsx';
import config from '@/config.ts';
import { adjustScrollToElement, getScrollPercentage, getTopElement } from '@/utils/browser.ts';
import { booksDbManagerInstance } from '@/utils/db/booksDbManagerInstance.ts';
import styles from './BookView.module.scss';
import FormattedContent from './FormattedContent/FormattedContent.tsx';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  book: any;
  bookId: string;
}

function BookView({ book, bookId, className, ...props }: Props) {
  useEffectOnce(() => {
    void (async () => {
      const currentProgress = await booksDbManagerInstance.readBookProgress(bookId);
      void booksDbManagerInstance.writeBookProgress(
        bookId,
        currentProgress
          ? {
              ...currentProgress,
              lastReadTime: +new Date(),
            }
          : {
              elementId: undefined,
              progress: 0,
              lastReadTime: +new Date(),
            },
      );
    })();
  });
  useEffectOnce(() => {
    let topElement: HTMLElement;
    let lastWidth = window.innerWidth;

    const writeProgressInfo = debounce(() => {
      if (!topElement) {
        return;
      }
      console.log('~~', topElement.dataset.id);
      void booksDbManagerInstance.writeBookProgress(bookId, {
        elementId: topElement.dataset.id,
        progress: getScrollPercentage(),
        lastReadTime: +new Date(),
      });
    }, 300);

    // Сохранить позицию верхнего элемента
    const fixTopElement = () => {
      topElement = getTopElement();

      writeProgressInfo();
    };

    const handleScroll = () => {
      // Если ширина окна изменилась, предполагаем, что это изменение зума
      const widthChange = Math.abs(window.innerWidth - lastWidth);
      if (widthChange > 0) {
        if (topElement) {
          // Скролим до последнего верхнего элемента
          adjustScrollToElement(topElement);
        }
        // Обновляем последнюю известную ширину окна
        lastWidth = window.innerWidth;
        return;
      }

      fixTopElement();
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  useEffectOnce(() => {
    void (async () => {
      // Восстанавливаем предыдущее состояние прокрутки
      const data = await booksDbManagerInstance.readBookProgress(bookId);
      if (data?.elementId) {
        const el = document.querySelector(`[data-id="${data.elementId}"]`);
        if (el) {
          adjustScrollToElement(el as HTMLElement);
        }
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
        <div className="mb-[100px] pb-[100px] border-b border-slate-400 p-5">
          <BookDescription content={book} />
        </div>

        {book.map((item, idx) => {
          const tag = Object.keys(item)[0];
          if (tag === 'body') {
            return (
              <div className="p-4" key={idx}>
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
