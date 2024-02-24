import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import config from '@/config';
import i18n from '@/i18n';
import type { AppThunkAction } from '@/store/configureStore';
import type { Language } from '@/types';

export type UiState = {
  // Язык страницы пришедший в query-параметрах
  language: Language;
  viewWidth: number|'auto';
};

const initialState: UiState = {
  language: config.defaultLanguage,
  viewWidth: 'auto'
};

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<UiState['language']>) => {
      state.language = action.payload;
    },
    setViewWidth: (state, action: PayloadAction<UiState['viewWidth']>) => {
      state.viewWidth = action.payload;
    },
  },
});

export const { setLanguage, setViewWidth } = slice.actions;

export default slice.reducer;

export function changeLanguage(language: Language): AppThunkAction<Promise<void>> {
  return async (dispatch, getState) => {
    dispatch(setLanguage(language));

    void i18n.changeLanguage(language).then(() => {
      document.title = i18n.t('pageTitle');
      document.documentElement.lang = language;
    });
  };
}
