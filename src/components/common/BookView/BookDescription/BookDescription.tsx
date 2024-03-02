import React, { useEffect, useState } from 'react';
import cn from 'clsx';
import FormattedContent from '@/components/common/BookView/FormattedContent/FormattedContent.tsx';
import { BookMeta } from '@/types';
import { getBookMetadata } from '@/utils/fb2.ts';

interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'content'> {
  content: any[];
}

function BookDescription({ content, className, ...props }: Props) {
  const [data, setData] = useState<BookMeta | null>(null);

  useEffect(() => {
    void getBookMetadata(content).then((result) => setData(result));
  }, [content]);

  if (!data) {
    return;
  }

  return (
    <div className={cn(className)} {...props}>
      <div>
        <div>
          <b>Genres:</b> {data.genres.join(', ')}
        </div>
        <div>
          <b>Authors:</b>{' '}
          {data.authors.map((author, idx) => {
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
          <b>BookTitle:</b> {data.bookTitle}
        </div>
        {data.annotation && (
          <div>
            <b>Annotation:</b>
            <FormattedContent content={data.annotation} />
          </div>
        )}
        {data.date && (
          <div>
            <b>date:</b> {data.date}
          </div>
        )}
        {data.coverPage && (
          <div>
            <b>coverPage:</b> <FormattedContent content={data.coverPage} />
          </div>
        )}
      </div>
    </div>
  );
}

export default BookDescription;
