import { useState } from 'react';
import LoadingBlock from './LoadingBlock';

export default {
  component: LoadingBlock,
};

export const Default = () => {
  const [active, setActive] = useState(false);

  return (
    <div>
      <button
        onClick={() => {
          setActive(true);
          setTimeout(() => {
            setActive(false);
          }, 500);
        }}
      >
        START
      </button>
      <LoadingBlock active={active} />
    </div>
  );
};
