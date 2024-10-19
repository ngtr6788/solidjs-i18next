import { StorybookConfig } from "@storybook/html-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    // "@storybook/addon-onboarding",
    // "@storybook/addon-links",
    // "@storybook/addon-essentials",
    // "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/html-vite",
    options: {}
  }
};
export default config;
