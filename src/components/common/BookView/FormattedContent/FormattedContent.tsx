import React from 'react';
import styles from './FormattedContent.module.scss';
import Image from '../Image/Image.tsx';
import Link from '../Link/Link.tsx';

interface Props {
  content: any[0];
}

let id = 0;

function FormattedContent({ content }: Props) {
  return (
    <>
      {content.map((item, idx) => {
        const tag = Object.keys(item)[0];

        const commonProps = {
          key: idx,
          'data-id': id++,
        };

        const commonTags = {
          p: {
            component: 'div',
            className: styles.paragraph,
          },
          title: {
            component: 'div',
            className: styles.title,
          },
          section: {
            component: 'div',
            className: styles.section,
          },
          epigraph: {
            component: 'div',
            className: styles.epigraph,
          },
          poem: {
            component: 'div',
            className: styles.poem,
          },
          stanza: {
            component: 'div',
            className: styles.stanza,
          },
          v: {
            component: 'div',
            className: styles.v,
          },
          'text-author': {
            component: 'div',
            className: styles.textAuthor,
          },
          subtitle: {
            component: 'div',
            className: styles.subtitle,
          },
          cite: {
            component: 'div',
            className: styles.cite,
          },
          code: {
            component: 'div',
            className: styles.code,
          },
          strong: {
            component: 'strong',
          },
          emphasis: {
            component: 'i',
          },
        };

        if (commonTags[tag]) {
          const Component = commonTags[tag].component;
          return (
            <Component {...commonProps} className={commonTags[tag].className}>
              <FormattedContent content={item[tag]} />
            </Component>
          );
        }

        if (tag === 'empty-line') {
          return <br {...commonProps} />;
        }

        if (tag === 'a') {
          return <Link {...commonProps} className={styles.link} attributes={item} />;
        }

        if (tag === 'image') {
          return <Image {...commonProps} attributes={item[':@']} className={styles.image} />;
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
