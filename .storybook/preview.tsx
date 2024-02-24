import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import type { Preview } from '@storybook/react';
import { StoryFn } from '@storybook/react';
import '../src/styles/index.scss';
import configureStore from '../src/store/configureStore';
import { prepareBrowser } from '../src/utils/prepareBrowser';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story: StoryFn) => {
      prepareBrowser();

      return (
        <Provider store={configureStore()}>
          <Router>
            <Story />
          </Router>
        </Provider>
      );
    },
  ],
};

export default preview;
