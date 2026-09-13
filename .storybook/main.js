import tailwindcss from '@tailwindcss/vite'

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/components/ui/**/*.stories.@(js|jsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = viteConfig.plugins || []
    viteConfig.plugins.push(tailwindcss())
    return viteConfig
  },
};

export default config;
