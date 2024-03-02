import React from 'react';
import cn from 'clsx';
import { colors } from '@/constants/colors.ts';
import styles from './Spinner.module.scss';

const R = 45;
const SPINNER_TRACK = `M 50,50 m 0,-${R} a ${R},${R} 0 1 1 0,${R * 2} a ${R},${R} 0 1 1 0,-${
  R * 2
}`;
const PATH_LENGTH = 280;

const MIN_SIZE = 10;
const STROKE_WIDTH = 4;
const MIN_STROKE_WIDTH = 16;

const TRACK_COLOR = colors.slate['200'];
const HEAD_COLOR = colors.blue['600'];

const getViewBox = (strokeWidth) => {
  const radius = R + strokeWidth / 2;
  const viewBoxX = (50 - radius).toFixed(2);
  const viewBoxWidth = (radius * 2).toFixed(2);
  return `${viewBoxX} ${viewBoxX} ${viewBoxWidth} ${viewBoxWidth}`;
};

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  size?: number;
  headColor?: string;
  trackColor?: string;
}

function Spinner({
  size = 50,
  headColor = HEAD_COLOR,
  trackColor = TRACK_COLOR,
  className,
  ...props
}: Props) {
  size = Math.max(MIN_SIZE, size);

  const strokeWidth = Math.min(MIN_STROKE_WIDTH, (STROKE_WIDTH * 100) / size);
  const strokeOffset = PATH_LENGTH - PATH_LENGTH * 0.25;

  return (
    <div className={cn(styles.spinner, className)} {...props}>
      <div className={styles.spinnerAnimation}>
        <svg
          width={size}
          height={size}
          strokeWidth={strokeWidth.toFixed(2)}
          viewBox={getViewBox(strokeWidth)}
        >
          <path className={styles.spinnerTrack} d={SPINNER_TRACK} stroke={trackColor} />
          <path
            className={styles.spinnerHead}
            d={SPINNER_TRACK}
            pathLength={PATH_LENGTH}
            strokeDasharray={`${PATH_LENGTH} ${PATH_LENGTH}`}
            strokeDashoffset={strokeOffset}
            stroke={headColor}
          />
        </svg>
      </div>
    </div>
  );
}

export default Spinner;
