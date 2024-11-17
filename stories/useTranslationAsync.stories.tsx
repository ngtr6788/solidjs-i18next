import { type Meta } from "@storybook/html";
import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { Show } from "solid-js";

import { I18NextProvider, useTranslation } from "../src";

const i18nextInit = {
  fallbackLng: "en",
};

i18next
  .use(
    resourcesToBackend(async (language: string, namespace: string) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return await import(`./locales/${language}/${namespace}.json`);
    }),
  )
  .init(i18nextInit);

const meta: Meta = {
  decorators: [
    (Story) => {
      const i18n = i18next.cloneInstance();

      return (
        <I18NextProvider i18n={i18n}>
          <Story />
        </I18NextProvider>
      ) as Element;
    },
  ],
};

export default meta;

export const UsingReadyWaitForReady = {
  render: () => {
    const [t, , ready] = useTranslation();

    // Expected behaviour: Loading... should appear because useSuspense is true
    return (
      <>
        <p>t is ready: {String(ready())}</p>
        <p>
          <Show when={ready()} fallback={"Loading..."}>
            {t("test-string")}
          </Show>
        </p>
      </>
    );
  },
};

