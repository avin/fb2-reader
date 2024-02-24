import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { AppThunkAction } from '@/store/configureStore';
import { BookMeta, BookProgress } from '@/types';
import { booksDbManagerInstance } from '@/utils/db/booksDbManagerInstance.ts';

export type BooksState = {
  // Язык страницы пришедший в query-параметрах
  savedBooks: Record<string, { id: string; meta: BookMeta; progress: BookProgress }>;
};

const initialState: BooksState = {
  savedBooks: {},
};

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSavedBooks: (state, action: PayloadAction<BooksState['savedBooks']>) => {
      state.savedBooks = action.payload;
    },
  },
});

export const { setSavedBooks } = slice.actions;

export default slice.reducer;

export function loadSavedBooks(): AppThunkAction<Promise<void>> {
  return async (dispatch, getState) => {
    const metas = await booksDbManagerInstance.getAllBookMetas();
    const progresses = await booksDbManagerInstance.getAllBookProgresses();

    const results = {};
    for (const meta of metas) {
      const id = meta.id;
      results[id] = {
        id: id,
        meta: meta,
        progress: progresses.find((i) => i.id === id),
      };
    }

    dispatch(setSavedBooks(results));
  };
}

export function removeBook(id: string): AppThunkAction<Promise<void>> {
  return async (dispatch, getState) => {
    void booksDbManagerInstance.removeBook(id);

    const newSavedBooks = Object.entries(getState().books.savedBooks).reduce(
      (acc, [key, value]) => {
        if (key !== id) {
          acc[key] = value;
        }
        return acc;
      },
      {},
    );

    dispatch(setSavedBooks(newSavedBooks));
  };
}
