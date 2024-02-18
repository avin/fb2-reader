import React, { useMemo } from 'react';
import cn from 'clsx';
import DOMPurify from 'dompurify';
import styles from './FormattedContent.module.scss';

DOMPurify.addHook('uponSanitizeElement', (node, data) => {
  console.log(node);
  if (data.tagName === 'strong') {
    const newNode = document.createElement('b');
    newNode.innerHTML = node.innerHTML;
    node.parentNode?.replaceChild(newNode, node);
  }
  if (data.tagName === 'empty-line') {
    const newNode = document.createElement('br');
    node.parentNode?.replaceChild(newNode, node);
  }
});

interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'content'> {
  content: string | undefined | null;
}

function FormattedContent({ content, className, ...props }: Props) {
  const html = useMemo(() => {
    if (content === undefined || content === null) {
      return null;
    }

    console.log('~', content);

    const cleanHTML = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['strong', 'b', 'p', 'empty-line', 'br'],
      FORBID_ATTR: ['xmlns'],
      CUSTOM_ELEMENT_HANDLING: {
        tagNameCheck: /.*/, // no custom elements are allowed
        attributeNameCheck: /.*/, // default / standard attribute allow-list is used
        allowCustomizedBuiltInElements: true, // no customized built-ins allowed
      },
    });

    return cleanHTML;
  }, [content]);

  if (html === null) {
    return null;
  }

  return <div className={cn(className)} {...props} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default FormattedContent;
