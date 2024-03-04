import React, { useMemo, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import cn from 'clsx';
import styles from './Link.module.scss';

interface Props extends React.ComponentPropsWithoutRef<'a'> {
  tooltipClassName: string;
  attributes: any;
}

function Link({ attributes, className, tooltipClassName, ...props }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [content, setContent] = useState('');
  const [referenceElement, setReferenceElement] = useState<any>(null);
  const popperElementRef = useRef<any>(null);
  const [popperElement, setPopperElement] = useState<any>(null);
  const { styles: popperStyles, attributes: popperAttributes } = usePopper(
    referenceElement,
    popperElement,
    {},
  );

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
        ref={setReferenceElement}
        {...(isExternalLink
          ? {
              target: '_blank',
              rel: 'noopener nofollow noreferrer',
            }
          : null)}
      >
        {data.text}
      </a>

      <TransitionGroup>
        {isHovered && !isExternalLink && (
          <CSSTransition timeout={100} unmountOnExit classNames={styles} nodeRef={popperElementRef}>
            <div
              className={cn(styles.tooltip, tooltipClassName)}
              ref={(v) => {
                setPopperElement(v);
                popperElementRef.current = v;
              }}
              style={popperStyles.popper}
              {...popperAttributes.popper}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </>
  );
}

export default Link;
