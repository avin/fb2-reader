import React, { useEffect, useState } from 'react';
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
    <div>
      <div className="text-xl text-center font-bold mb-2">{data.bookTitle}</div>
      <div className="text-sm text-center italic mb-4">
        {data.authors
          .map((author, idx) => {
            return [author.firstName, author.nickname, author.middleName, author.lastName]
              .filter(Boolean)
              .join(' ');
          })
          .join(', ')}
      </div>
      {data.coverPage && (
        <div className="max-w-[400px] m-auto my-12">
          <FormattedContent content={data.coverPage} />
        </div>
      )}
      <div>
        {data.annotation && (
          <div className="text-sm">
            <FormattedContent content={data.annotation} />
          </div>
        )}
      </div>
    </div>
  );
}

export default BookDescription;
