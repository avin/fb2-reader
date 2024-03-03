import ReactDOM from 'react-dom/client';
import '@/i18n';
import configureStore from '@/store/configureStore.ts';
import {
  booksDbManagerInstance,
  initBooksDbManagerInstance,
} from '@/utils/db/booksDbManagerInstance.ts';
import { prepareBrowser } from '@/utils/prepareBrowser.ts';
import './styles/index.scss';
import App from './components/root/App/App.tsx';

void (async () => {
  void (await initBooksDbManagerInstance());

  prepareBrowser();

  const savedState = await booksDbManagerInstance.readState();

  const store = configureStore(savedState);

  ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <App store={store} />,
    // </React.StrictMode>,
  );
})();
