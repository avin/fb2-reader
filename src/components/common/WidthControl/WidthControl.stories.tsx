import { useState } from 'react';
import WidthControl from './WidthControl';

export default {
  component: WidthControl,
};

export const Default = () => {
  const [w, setW] = useState<number | 'auto'>('auto');

  return (
    <div>
      <div style={{ width: '300px' }}>
        <WidthControl onChange={(v) => setW(v)} />
      </div>
      <div>
        <div
          className="h-5 bg-amber-400 m-auto"
          style={{ width: w === 'auto' ? '100%' : `${w}px` }}
        />
      </div>
    </div>
  );
};
