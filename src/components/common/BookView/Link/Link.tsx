import React, { useMemo, useState } from 'react';
import cn from 'clsx';

interface Props extends React.ComponentPropsWithoutRef<'a'> {
  tooltipClassName: string;
  attributes: any;
}

function Link({ attributes, className, tooltipClassName, ...props }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [content, setContent] = useState('');

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

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!isExternalLink) {
      const id = data.href.substring(1); // Удаляем '#' из href для получения id
      const element = document.getElementById(id);
      if (element) {
        setContent(element.innerHTML);
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setContent('');
  };

  return (
    <>
      <a
        className={cn(className)}
        {...props}
        href={data.href}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...(isExternalLink
          ? {
              target: '_blank',
              rel: 'noopener nofollow noreferrer',
            }
          : null)}
      >
        {data.text}
      </a>
      {isHovered && !isExternalLink && (
        <div
          className={tooltipClassName}
          style={{
            position: 'absolute',
            border: '1px solid black',
            padding: '10px',
            backgroundColor: 'white',
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </>
  );
}

export default Link;
