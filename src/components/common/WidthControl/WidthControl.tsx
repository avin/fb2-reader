import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEffectOnce } from 'react-use';
import cn from 'clsx';
import {debounce, throttle} from 'lodash-es';
import { getTopElement } from '@/utils/browser.ts';
import { useTopElementBeforeChangeWidth } from '@/utils/hooks/useTopElementBeforeChangeWidth.ts';

interface Props extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
  onChange: (v: number | 'auto') => void;
}

function WidthControl({ onChange, className, ...props }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(1);
  const { setTopElement } = useTopElementBeforeChangeWidth();

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
      setTopElement(getTopElement());
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

  const throttledOnChange = useMemo(() => {
    return throttle((val) => {
      onChange(val);
    }, 100);
  }, [onChange]);

  useEffect(() => {
    if (position > 0.9) {
      throttledOnChange('auto');
    } else {
      throttledOnChange(position * (1 / 0.9) * document.body.clientWidth);
    }
  }, [throttledOnChange, position]);

  return (
    <div
      className={cn(
        className,
        'flex relative items-center w-full h-5 cursor-pointer select-none group',
      )}
      ref={sliderRef}
    >
      <div className="relative w-full h-0.5 bg-slate-500">
        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transform border-2 border-slate-500 bg-white rounded-full size-3 transition-size group-hover:size-5"
          style={{ left: `${position * 100}%` }}
        />
        {['0%', '90%', '100%'].map((leftPosition, idx) => {
          return (
            <div
              key={String(idx)}
              className="absolute bg-slate-500 w-[2px] h-2 -translate-y-1/2 top-[50%]"
              style={{
                left: leftPosition,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default WidthControl;
