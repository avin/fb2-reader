import ReactDOM from 'react-dom/client';
import '@/i18n';
import configureStore from '@/store/configureStore.ts';
import { prepareBrowser } from '@/utils/prepareBrowser.ts';
import './styles/index.scss';
import App from './components/root/App/App.tsx';

prepareBrowser();

const store = configureStore();

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <App store={store} />,
  // </React.StrictMode>,
);
