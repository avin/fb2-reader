import React, { ReactNode } from 'react';

interface BookProviderContextType {
  getBook: () => any;
}

export const BookProviderContext = React.createContext<BookProviderContextType | undefined>(
  undefined,
);

interface BookProviderProps {
  children: ReactNode;
  book: any;
}

function BookProvider({ children, book }: BookProviderProps) {
  const contextValue = {
    getBook: () => book,
  };

  return (
    <BookProviderContext.Provider value={contextValue}>{children}</BookProviderContext.Provider>
  );
}

export default BookProvider;
