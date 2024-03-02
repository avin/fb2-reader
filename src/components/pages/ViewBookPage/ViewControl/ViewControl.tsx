import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  Cog6ToothIcon,
  PaintBrushIcon,
  WrenchIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import cn from 'clsx';
import WidthControl from '@/components/common/WidthControl/WidthControl.tsx';
import routes from '@/constants/routes.ts';
import { setViewWidth } from '@/store/reducers/ui.ts';
import { useAppDispatch } from '@/utils/hooks/useAppDispatch.ts';

interface Props extends React.ComponentPropsWithoutRef<'div'> {}

function ViewControl({ className, ...props }: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleClickBack = () => {
    navigate(routes.selectBook);
  };

  const handleChangeWidth = useCallback(
    (v: number | 'auto') => {
      dispatch(setViewWidth(v));
    },
    [dispatch],
  );

  return (
    <div
      className={cn(
        'fixed flex justify-between top-0 left-0 w-full bg-white shadow-xl text-slate-500 items-center',
        className,
      )}
      {...props}
    >
      <div className="pl-4">
        <div>Author</div>
        <div>Title</div>
      </div>
      <div className="flex gap-8 items-center px-2">
        <div className="flex gap-2">
          <div className="text-sm">
            Content width:
          </div>
          <div className="w-[200px]">
            <WidthControl onChange={handleChangeWidth}></WidthControl>
          </div>
        </div>

        <button type="button" onClick={handleClickBack} className="size-8 hover:text-red-500">
          <XMarkIcon />
        </button>
      </div>
    </div>
  );
}

export default ViewControl;
