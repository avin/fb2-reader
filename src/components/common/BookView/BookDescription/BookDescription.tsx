import React, { useMemo } from 'react';
import cn from 'clsx';
import FormattedContent from '@/components/common/BookView/FormattedContent/FormattedContent.tsx';
import styles from './BookDescription.module.scss';

interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'content'> {
  content: any[];
}

function BookDescription({ content, className, ...props }: Props) {
  const data = useMemo(() => {
    const titleInfo = content.find((i) => Object.keys(i)[0] === 'title-info')['title-info'];

    const genres = titleInfo
      .filter((i) => Object.keys(i)[0] === 'genre')
      .map((i) => i['genre'][0]['#text']);

    const bookTitle = titleInfo.find((i) => Object.keys(i)[0] === 'book-title')?.['book-title'][0][
      '#text'
    ];
    const annotation = titleInfo.find((i) => Object.keys(i)[0] === 'annotation')?.['annotation'];
    const coverPage = titleInfo.find((i) => Object.keys(i)[0] === 'coverpage')?.['coverpage'];
    const date = titleInfo.find((i) => Object.keys(i)[0] === 'date')?.['date'][0]?.['#text'];

    const authors = titleInfo
      .filter((i) => Object.keys(i)[0] === 'author')
      .map((i) => i['author'])
      .map((i) => {
        const dict = {
          firstName: 'first-name',
          middleName: 'middle-name',
          lastName: 'last-name',
          nickname: 'nickname',
          homePage: 'home-page',
          email: 'email',
          id: 'id',
        };
        const result = {};
        Object.entries(dict).map(([key, fbKey]) => {
          result[key] = i.find((i) => Object.keys(i)[0] === fbKey)?.[fbKey][0]['#text'];
        });
        return result;
      });

    return {
      titleInfo: {
        genres,
        authors,
        bookTitle,
        annotation,
        date,
        coverPage,
      },
    };
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
