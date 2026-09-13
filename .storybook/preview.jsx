import '../src/index.css'

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [{name: 'light', value: '#FFFFFF'}],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
