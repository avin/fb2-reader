import React, { useEffect, useState } from 'react';
import cn from 'clsx';
import { FB2 } from '@/utils/fb2/FB2.ts';
import { Book } from '@/utils/fb2/FB2Parser.ts';
import styles from './BookView.module.scss';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  content: string;
}

function BookView({ content, className, ...props }: Props) {
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    const fb2 = FB2.init();
    const bookObj = fb2.parse(content);
    setBook(bookObj);
    console.log(bookObj);
  }, [content]);

  if (!book) {
    return null;
  }

  return (
    <div className={cn(styles.book, className)} {...props}>
      {book.bodies.map((body, idx) => {
        return (
          <div className={styles.body} key={String(idx)}>
            {body.sections.map((section, idx) => {
              return (
                <div className={styles.section} key={String(idx)}>
                  <div className={styles.title}>{section.title}</div>
                  {section.content.map((contentItem, idx) => {
                    return (
                      <div key={String(idx)}>
                        {(() => {
                          switch (contentItem.type) {
                            case 'paragraph': {
                              return <div className={styles.paragraph}>{contentItem.text}</div>;
                            }
                            case 'image': {
                              return (
                                <div className={styles.image}>
                                  TODO: Image here ({contentItem.href})
                                </div>
                              );
                            }
                            case 'poem': {
                              return <div className={styles.poem}>TODO: Poem here...</div>;
                            }
                            default:
                              return null;
                          }
                        })()}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default BookView;
