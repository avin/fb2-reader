import React from 'react';
import cn from 'clsx';
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
