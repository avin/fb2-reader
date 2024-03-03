import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/reducers';
import { BookMeta, BookProgress } from '@/types';

export const languageSelector = (state: RootState) => state.ui.language;

export const savedBooksListSelector = createSelector(
  (state: RootState) => state.books.metas,
  (state: RootState) => state.books.progresses,
  (bookMetas, bookProgresses) => {
    const result: {
      id: string;
      meta: BookMeta;
      progress?: BookProgress;
    }[] = [];
    for (const id of Object.keys(bookMetas)) {
      result.push({
        id: id,
        meta: bookMetas[id],
        progress: bookProgresses[id],
      });
    }

    return result.sort((a, b) => (b.progress?.lastReadTime || 0) - (a.progress?.lastReadTime || 0));
  },
);
