import React from 'react';
import { useEffectOnce } from 'react-use';
import cn from 'clsx';
import { FB2 } from '@/utils/fb2/FB2.ts';

interface Props extends React.ComponentPropsWithoutRef<'div'> {}

function InitPage({ className, ...props }: Props) {
  useEffectOnce(() => {
    void (async () => {
      const fb2 = FB2.init();
      const text = await fb2.loadExample();
      const doc = fb2.parse(text);
      console.log(doc);
    })();
  });

  return (
    <div className={cn(className)} {...props}>
      InitPage
    </div>
  );
}

export default InitPage;
