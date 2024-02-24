import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/reducers';

export const languageSelector = (state: RootState) => state.ui.language;

export const savedBooksListSelector = createSelector(
  (state: RootState) => state.books.savedBooks,
  (savedBooks) => {
    const result: (typeof savedBooks)[string][] = [];
    for (const id of Object.keys(savedBooks)) {
      result.push(savedBooks[id]);
    }

    return result.sort((a, b) => b.progress.lastReadTime - a.progress.lastReadTime);
  },
);
