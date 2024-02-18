import {
  Action,
  Store,
  ThunkAction,
  ThunkDispatch,
  configureStore as configureToolkitStore,
} from '@reduxjs/toolkit';
import type { RootState } from './reducers';
import rootReducer from './reducers';

const configureStore = (initialState = {}): Store<RootState> => {
  return configureToolkitStore({
    reducer: rootReducer,
    devTools: import.meta.env.MODE !== 'production',
    preloadedState: initialState,
  });
};

export default configureStore;

export type AppThunkAction<T> = ThunkAction<T, RootState, unknown, Action<string>>;

export type AppThunkDispatch = ThunkDispatch<RootState, unknown, Action<string>>;
