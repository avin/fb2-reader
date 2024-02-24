import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  Cog6ToothIcon,
  PaintBrushIcon,
  WrenchIcon,
} from '@heroicons/react/24/solid';
import cn from 'clsx';
import WidthControl from '@/components/common/WidthControl/WidthControl.tsx';
import routes from '@/constants/routes.ts';
import { setViewWidth } from '@/store/reducers/ui.ts';
import { useAppDispatch } from '@/utils/hooks/useAppDispatch.ts';
import styles from './ViewControl.module.scss';

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
    <div className={cn(styles.container, className)} {...props}>
      <div className={styles.buttons}>
        <button type="button" onClick={handleClickBack}>
          <ArrowLeftIcon />
        </button>
        <button type="button">
          <Cog6ToothIcon />
        </button>
        <button type="button">
          <PaintBrushIcon />
        </button>
        <button type="button">
          <WrenchIcon />
        </button>
        <div className={styles.widthControlContainer}>
          <WidthControl onChange={handleChangeWidth}></WidthControl>
        </div>
      </div>
    </div>
  );
}

export default ViewControl;
