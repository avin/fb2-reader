import { RootState } from '@/store/reducers';

export const languageSelector = (state: RootState) => state.ui.language;
