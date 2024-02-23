import React, { ReactNode, useRef } from 'react';

interface BookProviderContextType {
  getBook: () => any;
  getDataIdRef: () => { current: number };
}

export const BookProviderContext = React.createContext<BookProviderContextType | undefined>(
  undefined,
);

interface BookProviderProps {
  children: ReactNode;
  book: any;
}

function BookProvider({ children, book }: BookProviderProps) {
  const dataIdRef = useRef(0);

  const contextValue = {
    getBook: () => book,
    getDataIdRef: () => dataIdRef,
  };

  return (
    <BookProviderContext.Provider value={contextValue}>{children}</BookProviderContext.Provider>
  );
}

export default BookProvider;
