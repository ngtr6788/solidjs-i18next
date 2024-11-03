import { type Meta } from "@storybook/html";
import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { Show, Suspense } from "solid-js";

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

export const UsingSuspense = {
  render: () => {
    const [t, , ready] = useTranslation({ useSuspense: true });

    // Expected behaviour: Loading... should appear because useSuspense is true
    return (
      <>
        <p>t is ready: {String(ready())}</p>
        <p>
          {/* This shows test-string instead of Loading... because useSuspense is false */}
          <Suspense fallback={"Loading..."}>{t("test-string")}</Suspense>
        </p>
        <p>
          {/* Because useSuspense is false, we will have to use ready to check if things are ready */}
          <Show when={ready()} fallback={"Loading..."}>
            {t("test-string")}
          </Show>
        </p>
      </>
    );
  },
};

export const NotUsingSuspense = {
  render: () => {
    const [t, , ready] = useTranslation({ useSuspense: false });

    return (
      <>
        <p>t is ready: {String(ready())}</p>
        <p>
          {/* This shows test-string instead of Loading... because useSuspense is false */}
          <Suspense fallback={"Loading..."}>{t("test-string")}</Suspense>
        </p>
        <p>
          {/* Because useSuspense is false, we will have to use ready to check if things are ready */}
          <Show when={ready()} fallback={"Loading..."}>
            {t("test-string")}
          </Show>
        </p>
      </>
    );
  },
};
