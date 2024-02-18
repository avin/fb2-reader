import React from 'react';
import { useBookProvider } from '@/components/common/BookView/BookProvider/useBookProvider.ts';
import Image from '@/components/common/BookView/Image/Image.tsx';
import styles from './FormattedContent.module.scss';


interface Props {
  content: any[0];
}

function FormattedContent({ content }: Props) {
  return (
    <>
      {content.map((item, idx) => {
        const tag = Object.keys(item)[0];

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
            <Component className={commonTags[tag].className} key={idx}>
              <FormattedContent content={item[tag]} />
            </Component>
          );
        }

        if (tag === 'empty-line') {
          return <br key={idx} />;
        }
        if (tag === 'image') {
          return <Image key={idx} attributes={item[':@']} className={styles.image} />;
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
