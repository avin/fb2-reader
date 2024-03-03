import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import cn from 'clsx';
import WidthControl from '@/components/common/WidthControl/WidthControl.tsx';
import styles from './ViewControl.module.scss';
import routes from '@/constants/routes.ts';
import { setViewWidth } from '@/store/reducers/ui.ts';
import { BookMeta } from '@/types';
import { useAppDispatch } from '@/utils/hooks/useAppDispatch.ts';
import { CSSTransition } from 'react-transition-group';
import {useAppSelector} from '@/utils/hooks/useAppSelector.ts';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  bookMeta: BookMeta;
}

function ViewControl({ bookMeta, className, ...props }: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const hideMenuTimeoutIdRef = useRef<ReturnType<typeof setTimeout>>();
  const viewWidth = useAppSelector(s => s.ui.viewWidth);

  const handleClickBack = () => {
    navigate(routes.selectBook);
  };

  const handleChangeWidth = useCallback(
    (v: number | 'auto') => {
      dispatch(setViewWidth(v));
    },
    [dispatch],
  );

  const handleMouseOverTopArea = () => {
    setIsMenuVisible(true);
    clearTimeout(hideMenuTimeoutIdRef.current);
  };

  const handleMouseLeaveTopArea = () => {
    hideMenuTimeoutIdRef.current = setTimeout(() => {
      setIsMenuVisible(false);
    }, 500);
  };

  useEffectOnce(() => {
    return () => {
      clearTimeout(hideMenuTimeoutIdRef.current);
    };
  });

  const authors = useMemo(() => {
    const names = bookMeta.authors.map((author, idx) => {
      return [author.firstName, author.nickname, author.middleName, author.lastName]
        .filter(Boolean)
        .join(' ');
    });
    return names.join(', ');
  }, [bookMeta.authors]);

  return (
    <div
      className="h-[90px] fixed top-0 left-0 w-full"
      onMouseOver={handleMouseOverTopArea}
      onMouseLeave={handleMouseLeaveTopArea}
    >
      <CSSTransition
        in={isMenuVisible}
        timeout={150} // Общее время для анимации включает 300мс задержки + 300мс анимации
        classNames={{ ...styles }}
        unmountOnExit
      >
        <div
          className={cn(
            'absolute z-10 top-0 w-full flex justify-between bg-white shadow-lg text-slate-500 items-center h-12',
            styles.menuBar,
            className,
          )}
          {...props}
        >
          <div className="flex items-center pl-2">
            <div>
              <BookOpenIcon className="size-8" />
            </div>
            <div className="pl-2 overflow-hidden">
              <div className="-mb-1 text-sm overflow-ellipsis whitespace-nowrap overflow-hidden">
                {authors}
              </div>
              <div className="overflow-ellipsis whitespace-nowrap overflow-hidden font-semibold">
                {bookMeta.bookTitle}
              </div>
            </div>
          </div>

          <div className="flex items-center px-2 min-h-full">
            <div className="flex gap-2 items-center">
              <div className="text-sm text-right">Width:</div>
              <div className="w-[200px] px-2">
                <WidthControl onChange={handleChangeWidth} initialValue={viewWidth}></WidthControl>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-slate-300 ml-4 mr-2" />

            <button type="button" onClick={handleClickBack} className="size-8 hover:text-red-500">
              <XMarkIcon />
            </button>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}

export default ViewControl;
