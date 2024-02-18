import { StoreEnhancer } from '@reduxjs/toolkit';

export {};
declare global {
  const IS_URAL: boolean;

  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => StoreEnhancer;
    YaPay: any;
  }
}
