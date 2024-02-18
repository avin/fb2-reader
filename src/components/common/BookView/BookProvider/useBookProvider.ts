import { useContext } from 'react';
import { BookProviderContext } from './BookProvider.tsx';

export const useBookProvider = () => {
  const context = useContext(BookProviderContext);
  if (!context) {
    throw new Error('useBookProvider must be used within a BookProviderProvider');
  }
  return context;
};
