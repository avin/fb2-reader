import React, { useMemo } from 'react';
import cn from 'clsx';
import { useBookProvider } from '@/components/common/BookView/BookProvider/useBookProvider.ts';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  attributes: any;
}

function getImageSrcFromBook(book: any, attributes: any) {
  const hrefKey = Object.keys(attributes).find((i) => i.endsWith(':href'));
  if (!hrefKey) {
    return null;
  }
  const id = attributes[hrefKey].replace(/^#/, '');
  const binObj = book.find((i) => {
    return i.binary && i[':@']?.['@_id'] === id;
  });
  if (!binObj) {
    return null;
  }
  const base64Text = binObj.binary[0]['#text'].replace(/[^A-Za-z0-9+/]+/g, '');
  return `data:${binObj[':@']['@_content-type']};base64,${base64Text}`;
}

function Image({ attributes, className, ...props }: Props) {
  const book = useBookProvider().getBook();

  const imgSrc = useMemo(() => {
    return getImageSrcFromBook(book, attributes);
  }, [attributes, book]);

  if (!imgSrc) {
    return null;
  }


  return (
    <div className={cn(className)} {...props}>
      <img src={imgSrc} alt="" />
    </div>
  );
}

export default Image;
