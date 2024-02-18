import React, { useEffect, useState } from 'react';
import cn from 'clsx';
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

  if (!book) {
    return null;
  }

  return (
    <div className={cn(styles.book, className)} {...props}>
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
  );
}

export default BookView;
