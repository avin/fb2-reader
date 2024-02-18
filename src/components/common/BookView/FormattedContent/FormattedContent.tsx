import React, { useMemo } from 'react';
import cn from 'clsx';
import DOMPurify from 'dompurify';
import styles from './FormattedContent.module.scss';

interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'content'> {
  content: string | undefined | null;
}

function FormattedContent({ content, className, ...props }: Props) {
  const html = useMemo(() => {
    if (content === undefined || content === null) {
      return null;
    }
    DOMPurify.addHook('uponSanitizeElement', (node, data) => {
      if (data.tagName === 'strong') {
        const newNode = document.createElement('b');
        newNode.innerHTML = node.innerHTML;
        node.parentNode?.replaceChild(newNode, node);
      }
    });

    const cleanHTML = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['strong', 'b'],
    });

    return cleanHTML;
  }, [content]);

  if (html === null) {
    return null;
  }

  return <div className={cn(className)} {...props} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default FormattedContent;
