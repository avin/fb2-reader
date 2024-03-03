import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { AppThunkAction } from '@/store/configureStore';
import { BookMeta, BookProgress } from '@/types';

export type BooksState = {
  progresses: Record<string, BookProgress>;
  metas: Record<string, BookMeta>;
};

const initialState: BooksState = {
  progresses: {},
  metas: {},
};

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMeta: (state, action: PayloadAction<{ id: string; meta: BookMeta }>) => {
      const { id, meta } = action.payload;
      state.metas[id] = meta;
    },
    setProgress: (state, action: PayloadAction<{ id: string; progress: BookProgress }>) => {
      const { id, progress } = action.payload;
      state.progresses[id] = progress;
    },
    removeBook: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.metas[id];
      delete state.progresses[id];
    },
  },
});

export const { removeBook, setProgress, setMeta } = slice.actions;

export default slice.reducer;

export function addBook(id: string, meta: BookMeta): AppThunkAction<void> {
  return async (dispatch, getState) => {
    dispatch(setMeta({ id, meta }));
  };
}

export function setBookProgress(id: string, progress: BookProgress): AppThunkAction<void> {
  return async (dispatch, getState) => {
    dispatch(setProgress({ id, progress }));
  };
}
