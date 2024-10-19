import { render } from "solid-js/web"

let disposeStory = () => {};

export const decorators = [
  (Story) => {
    disposeStory();
    const solidRoot = document.createElement("div");
    disposeStory = render(Story, solidRoot);
    return solidRoot;
  },
];

// This isn't part of the solution, it's just what `storybook init` scaffolded and I didn't delete it
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};