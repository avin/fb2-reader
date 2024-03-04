import React from 'react';
import ReactDOM from 'react-dom';

let portalRootEl = document.querySelector('#portal-root') as HTMLDivElement;
if (!portalRootEl) {
  portalRootEl = document.createElement('div');
  portalRootEl.id = 'portal-root';
  document.body.append(portalRootEl);
}

const Portal = ({ children }: React.PropsWithChildren<{}>): JSX.Element | null => {
  return ReactDOM.createPortal(children, portalRootEl);
};

export default Portal;
