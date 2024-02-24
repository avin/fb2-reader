import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';

export const useAppSelector = <T>(f: (s: RootState) => T) => {
  return useSelector(f);
};
