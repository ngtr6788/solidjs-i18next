import { type Meta } from "@storybook/html";
import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { createEffect, createSignal, Suspense } from "solid-js";

import { createReactiveI18n, I18NextProvider, useTranslation } from "../src";

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

export const ReactiveInitializeAttributes = {
  render: () => {
    const i18n = createReactiveI18n();
    const [t] = useTranslation({ i18n: i18n as typeof i18next });

    createEffect(() => {
      console.log(`i18n.isInitializing`, i18n.isInitializing);
    });

    createEffect(() => {
      console.log(`i18n.isInitialized`, i18n.isInitialized);
    });

    createEffect(() => {
      console.log(
        'i18n.hasLoadedNamespace(["translation"])',
        i18n.hasLoadedNamespace(["translation"]),
      );
    });

    return (
      <>
        <p>i18n.isInitializing: {String(i18n.isInitializing)}</p>
        <p>i18n.isInitialized: {String(i18n.isInitialized)}</p>
        <p>
          i18n.hasLoadedNamespace("translation"):{" "}
          {String(i18n.hasLoadedNamespace(["translation"]))}
        </p>
        <p>
          <Suspense fallback={"Loading..."}>{t("test-string")}</Suspense>
        </p>
      </>
    );
  },
};

export const ReloadResources = {
  render: () => {
    const i18n = createReactiveI18n();
    const [loading, setLoading] = createSignal(false);

    const handleLoad = async () => {
      setLoading(true);
      i18n.loadResources();
      setLoading(false);
    };

    const handleReload = async () => {
      setLoading(true);
      await i18n.reloadResources("en");
      setLoading(false);
    };

    return (
      <>
        <button onClick={handleLoad}>Load resources</button>
        <button onClick={handleReload}>Reload resources</button>
        <p>
          {loading()
            ? "Loading..."
            : JSON.stringify(i18n.getDataByLanguage("en"))}
        </p>
      </>
    );
  },
};
