import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useStore } from 'react-redux';
import { useEffectOnce } from 'react-use';
import cn from 'clsx';
import { debounce } from 'lodash-es';
import BookDescription from '@/components/common/BookView/BookDescription/BookDescription.tsx';
import BookProvider from '@/components/common/BookView/BookProvider/BookProvider.tsx';
import config from '@/config.ts';
import { RootState } from '@/store/reducers';
import { setBookProgress } from '@/store/reducers/books.ts';
import { adjustScrollToElement, getScrollPercentage, getTopElement } from '@/utils/browser.ts';
import { useAppDispatch } from '@/utils/hooks/useAppDispatch.ts';
import styles from './BookView.module.scss';
import FormattedContent from './FormattedContent/FormattedContent.tsx';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  book: any;
  bookId: string;
}

function BookView({ book, bookId, className, ...props }: Props) {
  const dispatch = useAppDispatch();
  const store = useStore<RootState>();
  const bookElRef = useRef<HTMLDivElement>(null);

  useEffectOnce(() => {
    let topElement: HTMLElement;
    let lastWidth = window.innerWidth;

    const writeProgressInfo = debounce(() => {
      if (!topElement) {
        return;
      }

      dispatch(
        setBookProgress(bookId, {
          elementId: topElement.dataset.id,
          progress: getScrollPercentage(),
          lastReadTime: +new Date(),
        }),
      );
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

  useLayoutEffect(() => {
    const savedProgress = store.getState().books.progresses[bookId];

    if (savedProgress && savedProgress.elementId) {
      const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            const el = bookElRef.current!.querySelector(
              `[data-id="${savedProgress.elementId}"]`,
            ) as HTMLDivElement;
            if (el) {
              adjustScrollToElement(el);
              observer.disconnect();
              break;
            }
          }
        }
      });

      if (bookElRef.current) {
        observer.observe(bookElRef.current, { childList: true, subtree: true });
      }

      return () => {
        observer.disconnect();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!book) {
    return null;
  }

  return (
    <BookProvider book={book}>
      <div
        className={cn(styles.book, className, { debug: config.debug })}
        data-id="book"
        ref={bookElRef}
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
