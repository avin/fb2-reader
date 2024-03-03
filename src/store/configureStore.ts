import {
  Action,
  Store,
  ThunkAction,
  ThunkDispatch,
  configureStore as configureToolkitStore,
} from '@reduxjs/toolkit';
import { saveUiSettingsMiddleware } from '@/store/middlewares/saveUiSettingsMiddleware.ts';
import type { RootState } from './reducers';
import rootReducer from './reducers';

const configureStore = (initialState = {}): Store<RootState> => {
  return configureToolkitStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(saveUiSettingsMiddleware),
    devTools: import.meta.env.MODE !== 'production',
    preloadedState: initialState,
  });
};

export default configureStore;

export type AppThunkAction<T> = ThunkAction<T, RootState, unknown, Action<string>>;

export type AppThunkDispatch = ThunkDispatch<RootState, unknown, Action<string>>;
