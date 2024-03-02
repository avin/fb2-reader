import React from 'react';
import cn from 'clsx';
import { useBookProvider } from '@/components/common/BookView/BookProvider/useBookProvider.ts';
import styles from './FormattedContent.module.scss';
import Image from '../Image/Image.tsx';
import Link from '../Link/Link.tsx';

interface Props {
  content: any[0];
}

function FormattedContent({ content }: Props) {
  const dataIdRef = useBookProvider().getDataIdRef();

  return (
    <>
      {content.map((item, idx) => {
        const tag = Object.keys(item)[0];

        const commonProps: Record<string, any> = {
          key: idx,
          'data-id': dataIdRef.current++,
        };

        if (item[':@']?.['@_id']) {
          commonProps.id = item[':@']?.['@_id'];
        }

        const commonTags = {
          p: {
            component: 'div',
            className: cn(styles.paragraph, 'paragraph'),
          },
          title: {
            component: 'div',
            className: cn(styles.title, 'title'),
          },
          section: {
            component: 'div',
            className: cn(styles.section, 'section'),
          },
          epigraph: {
            component: 'div',
            className: cn(styles.epigraph, 'epigraph'),
          },
          poem: {
            component: 'div',
            className: cn(styles.poem, 'poem'),
          },
          stanza: {
            component: 'div',
            className: cn(styles.stanza, 'stanza'),
          },
          v: {
            component: 'div',
            className: cn(styles.v, 'v'),
          },
          'text-author': {
            component: 'div',
            className: cn(styles.textAuthor, 'textAuthor'),
          },
          subtitle: {
            component: 'div',
            className: cn(styles.subtitle, 'subtitle'),
          },
          cite: {
            component: 'div',
            className: cn(styles.cite, 'cite'),
          },
          code: {
            component: 'div',
            className: cn(styles.code, 'code'),
          },
          sup: {
            component: 'sup',
            className: cn(styles.sup, 'sup'),
          },
          sub: {
            component: 'sub',
            className: cn(styles.sub, 'sub'),
          },
          strikethrough: {
            component: 's',
            className: cn(styles.strikethrough, 'strikethrough'),
          },
          strong: {
            component: 'strong',
            className: cn(styles.strong, 'strong'),
          },
          emphasis: {
            component: 'i',
            className: cn(styles.emphasis, 'emphasis'),
          },
        };

        if (commonTags[tag]) {
          const { component: Component, ...otherProps } = commonTags[tag];
          return (
            <Component {...commonProps} {...otherProps}>
              <FormattedContent content={item[tag]} />
            </Component>
          );
        }

        if (tag === 'empty-line' || tag === 'br') {
          return <br {...commonProps} />;
        }

        if (tag === 'a') {
          return (
            <Link
              {...commonProps}
              className={cn(styles.link, 'link')}
              tooltipClassName={cn(styles.linkTooltip, 'linkTooltip')}
              attributes={item}
            />
          );
        }

        if (tag === 'image') {
          return (
            <Image {...commonProps} attributes={item[':@']} className={cn(styles.image, 'image')} />
          );
        }

        if (tag === '#text') {
          return <React.Fragment key={idx}>{item[tag]}</React.Fragment>;
        }

        return (
          <React.Fragment key={idx}>
            [?? {tag}]<FormattedContent content={item[tag]} />[{tag} ??]
          </React.Fragment>
        );
      })}
    </>
  );
}

export default FormattedContent;
