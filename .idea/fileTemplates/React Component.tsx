import React from 'react';
import cn from 'clsx';
import styles from './${NAME}.module.scss';

interface Props extends React.ComponentPropsWithoutRef<'div'> {}

function ${NAME}({ className, ...props }: Props) {
  return (
    <div className={cn(className)} {...props}>
      ${NAME}
    </div>
  );
}

export default ${NAME};
