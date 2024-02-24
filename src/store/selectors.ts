import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/reducers';

export const languageSelector = (state: RootState) => state.ui.language;

export const savedBooksListSelector = createSelector(
  (state: RootState) => state.books.savedBooks,
  (savedBooks) => {
    const result: any[] = [];
    for(const id of Object.keys(savedBooks)){
      result.push(savedBooks[id]);
    }

    return result;
  },
);
