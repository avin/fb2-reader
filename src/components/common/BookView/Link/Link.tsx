import React, { useMemo } from 'react';
import cn from 'clsx';

interface Props extends React.ComponentPropsWithoutRef<'a'> {
  attributes: any;
}

function Link({ attributes, className, ...props }: Props) {
  const data = useMemo(() => {
    const hrefKey = Object.keys(attributes[':@']).find((i) => i.endsWith(':href'));
    if (!hrefKey) {
      return null;
    }

    return {
      href: attributes[':@'][hrefKey],
      text: attributes['a'][0]['#text'],
    };
  }, [attributes]);

  if (!data) {
    return null;
  }

  const isExternalLink = !data.href.startsWith('#');

  return (
    <a
      className={cn(className)}
      {...props}
      href={data.href}
      {...(isExternalLink
        ? {
            target: '_blank',
            rel: 'noopener nofollow noreferrer',
          }
        : null)}
    >
      {data.text}
    </a>
  );
}

export default Link;
