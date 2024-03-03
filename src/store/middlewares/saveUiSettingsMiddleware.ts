import { debounce } from 'lodash-es';
import { RootState } from '@/store/reducers';
import { booksDbManagerInstance } from '@/utils/db/booksDbManagerInstance.ts';

const saveStateToDb = debounce((state: RootState) => {
  void booksDbManagerInstance.writeState(state);
}, 300);

export const saveUiSettingsMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  saveStateToDb(store.getState());

  // Вернем результат для следующего middleware или dispatch
  return result;
};
