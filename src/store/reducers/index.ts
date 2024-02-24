import { Reducer, combineReducers } from '@reduxjs/toolkit';
import { UnknownAction } from 'redux';
import ui from './ui';
import books from './books';

const rootReducer = combineReducers({
  ui,
  books,
});

export type RootState = ReturnType<typeof rootReducer>;

const resettableRootReducer: Reducer = (state: RootState, action: UnknownAction) => {
  if (action.type === 'store/reset') {
    return rootReducer(undefined, action);
  }
  return rootReducer(state, action);
};

export default resettableRootReducer;
