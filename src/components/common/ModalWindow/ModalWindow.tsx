import React, { useCallback, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Portal from '@/components/common/Portal/Portal.tsx';
import styles from './ModalWindow.module.scss';

interface Props extends React.PropsWithChildren<{}> {
  open: boolean;
  onClose?: () => void;
}

const ModalWindow = ({ open, onClose, children }: Props): JSX.Element => {
  const layoutRef = useRef<HTMLDivElement>(null);

  const handleClickLayout = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return (
    <Portal>
      <TransitionGroup>
        {open && (
          <CSSTransition timeout={200} unmountOnExit classNames={styles} nodeRef={layoutRef}>
            <div
              ref={layoutRef}
              className={styles.layout}
              role="presentation"
              onClick={handleClickLayout}
            >
              <div onClick={(e) => e.stopPropagation()}>{children}</div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </Portal>
  );
};

export default ModalWindow;
