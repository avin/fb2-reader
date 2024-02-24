import React, { useEffect, useRef, useState } from 'react';
import { useEffectOnce } from 'react-use';
import styles from './WidthControl.module.scss';

interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
  onChange: (v: number | 'auto') => void;
}

function WidthControl({ onChange, className, ...props }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(1);

  useEffectOnce(() => {
    let isDragging = false;

    const sliderEl = sliderRef.current;
    if (!sliderEl) {
      return;
    }

    const move = (mouseX: number) => {
      if (!isDragging) {
        return;
      }

      const sliderRect = sliderEl.getBoundingClientRect();

      const pos = Math.min(Math.max(mouseX - sliderRect.left, 0), sliderRect.width);

      const offsetPercent = pos / sliderRect.width;

      if (offsetPercent < 0.9) {
        setPosition(offsetPercent);
      } else if (offsetPercent > 0.975) {
        setPosition(1);
      }
    };

    const handleMouseDown = (event) => {
      isDragging = true;
      move(event.clientX);
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleMouseMove = (event) => {
      move(event.clientX);
    };

    sliderEl.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseUp);

    return () => {
      sliderEl.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
  });

  useEffect(() => {
    if (position > 0.9) {
      onChange('auto');
    } else {
      onChange(position * (1 / 0.9) * document.body.clientWidth);
    }
  }, [onChange, position]);

  return (
    <div className={styles.slider} ref={sliderRef}>
      <div className={styles.track}>
        <div className={styles.thumb} style={{ left: `${position * 100}%` }} />
        <div className={styles.separator} style={{ left: '0%' }} />
        <div className={styles.separator} style={{ left: '90%' }} />
        <div className={styles.separator} style={{ left: '100%' }} />
      </div>
    </div>
  );
}

export default WidthControl;
