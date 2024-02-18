import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Store } from '@reduxjs/toolkit';
import InitPage from '@/components/pages/InitPage/InitPage';
import SelectBookPage from '@/components/pages/SelectBookPage/SelectBookPage.tsx';
import ViewBookPage from '@/components/pages/ViewBookPage/ViewBookPage.tsx';
import routes from '@/constants/routes.ts';

interface Props {
  store: Store;
}

function App({ store }: Props) {
  return (
    <ReduxProvider store={store}>
      <Router>
        <Routes>
          <Route path={routes.init} element={<InitPage />} />
          <Route path={routes.selectBook} element={<SelectBookPage />} />
          <Route path={routes.viewBook} element={<ViewBookPage />} />
        </Routes>
      </Router>
    </ReduxProvider>
  );
}

export default App;
