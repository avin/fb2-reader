import React, { useMemo } from 'react';
import cn from 'clsx';
import FormattedContent from '@/components/common/BookView/FormattedContent/FormattedContent.tsx';
import { getBookMetadata } from '@/utils/fb2.ts';
import styles from './BookDescription.module.scss';

interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'content'> {
  content: any[];
}

function BookDescription({ content, className, ...props }: Props) {
  const data = useMemo(() => {
    return getBookMetadata(content);
  }, [content]);

  return (
    <div className={cn(className)} {...props}>
      <div>
        <div>
          <b>Genres:</b> {data.titleInfo.genres.join(', ')}
        </div>
        <div>
          <b>Authors:</b>{' '}
          {data.titleInfo.authors.map((author, idx) => {
            const name = [author.firstName, author.nickname, author.middleName, author.lastName]
              .filter(Boolean)
              .join(' ');
            return (
              <div key={idx}>
                <div>{name}</div>
                {author.homePage && (
                  <div>
                    HomePage: <a href={author.homePage}>{author.homePage}</a>
                  </div>
                )}

                {author.email && (
                  <div>
                    Email: {author.email && <a href={`mailto:${author.email}`}>{author.email}</a>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div>
          <b>BookTitle:</b> {data.titleInfo.bookTitle}
        </div>
        {data.titleInfo.annotation && (
          <div>
            <b>Annotation:</b>
            <FormattedContent content={data.titleInfo.annotation} />
          </div>
        )}
        {data.titleInfo.date && (
          <div>
            <b>date:</b> {data.titleInfo.date}
          </div>
        )}
        {data.titleInfo.coverPage && (
          <div>
            <b>coverPage:</b> <FormattedContent content={data.titleInfo.coverPage} />
          </div>
        )}
      </div>
    </div>
  );
}

export default BookDescription;
