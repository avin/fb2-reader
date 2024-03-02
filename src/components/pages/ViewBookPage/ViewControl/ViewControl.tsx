import React, { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { XMarkIcon } from '@heroicons/react/24/solid';
import cn from 'clsx';
import WidthControl from '@/components/common/WidthControl/WidthControl.tsx';
import routes from '@/constants/routes.ts';
import { setViewWidth } from '@/store/reducers/ui.ts';
import { useAppDispatch } from '@/utils/hooks/useAppDispatch.ts';

interface Props extends React.ComponentPropsWithoutRef<'div'> {}

function ViewControl({ className, ...props }: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const hideMenuTimeoutIdRef = useRef<ReturnType<typeof setTimeout>>();

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
    }, 1000);
  };

  useEffectOnce(() => {
    return () => {
      clearTimeout(hideMenuTimeoutIdRef.current);
    };
  });

  return (
    <div
      className="h-[200px] fixed top-0 left-0 w-full"
      onMouseOver={handleMouseOverTopArea}
      onMouseLeave={handleMouseLeaveTopArea}
    >
      <div
        className={cn(
          'absolute top-0 w-full flex justify-between bg-white shadow-lg text-slate-500 items-center h-12 -translate-y-full transition',
          className,
          { ['-translate-y-0']: isMenuVisible },
        )}
        {...props}
      >
        <div className="pl-4">
          <div className="-mb-1">Author</div>
          <div>Title</div>
        </div>
        <div className="flex items-center px-2 min-h-full">
          <div className="flex gap-2">
            <div className="text-sm">Content width:</div>
            <div className="w-[200px] px-2">
              <WidthControl onChange={handleChangeWidth}></WidthControl>
            </div>
          </div>

          <div className="h-10 w-[1px] bg-slate-300 ml-4 mr-2" />

          <button type="button" onClick={handleClickBack} className="size-8 hover:text-red-500">
            <XMarkIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewControl;
