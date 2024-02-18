import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import { Store } from '@reduxjs/toolkit';
import InitPage from '@/components/pages/InitPage/InitPage';
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
        </Routes>
      </Router>
    </ReduxProvider>
  );
}

export default App;
