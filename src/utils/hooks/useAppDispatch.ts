import { useDispatch } from 'react-redux';
import { AppThunkDispatch } from '@/store/configureStore.ts';

export const useAppDispatch = useDispatch<AppThunkDispatch>;
