import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  Cog6ToothIcon,
  PaintBrushIcon,
  WrenchIcon,
} from '@heroicons/react/24/solid';
import cn from 'clsx';
import routes from '@/constants/routes.ts';
import styles from './ViewControl.module.scss';

interface Props extends React.ComponentPropsWithoutRef<'div'> {}

function ViewControl({ className, ...props }: Props) {
  const navigate = useNavigate();

  const handleClickBack = () => {
    navigate(routes.selectBook);
  };

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
      </div>
    </div>
  );
}

export default ViewControl;
