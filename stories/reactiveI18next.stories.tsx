import i18next from "i18next";
import { I18NextProvider } from "../src";
import { batch, createEffect } from "solid-js";
import { type Meta } from "@storybook/html";
import { createReactiveI18n } from "../src/reactiveI18next";

const i18nextInit = {
  resources: {
    en: {
      translation: {
        button: "Button in english",
        special: {
          button: "Special button in english",
        },
      },
      informal: {
        button: "Clicky thing in english",
      },
    },
    fr: {
      translation: {
        button: "Button in french",
        special: {
          button: "Special button in french",
        },
      },
      informal: {
        button: "Clicky thing in french",
      },
    },
  },
  fallbackLng: "en",
};

i18next.init(i18nextInit);

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

export const LanguagesReactiveOnChangeLanguage = {
  render: () => {
    const i18n = createReactiveI18n();

    const handleClick = () => {
      const lng = i18n.language;
      const newLng = lng === "en" ? "fr" : "en";
      i18n.changeLanguage(newLng);
    };

    createEffect(() => {
      console.log("i18n.language", i18n.language);
    });

    createEffect(() => {
      console.log("i18n.languages", JSON.stringify(i18n.languages));
    });

    createEffect(() => {
      console.log("i18n.resolvedLanguage", i18n.resolvedLanguage);
    });

    createEffect(() => {
      console.log("i18n.isInitialized", i18n.isInitialized);
    });

    createEffect(() => {
      console.log("i18n.isInitializing", i18n.isInitializing);
    });

    createEffect(() => {
      console.log("i18n.initializedStoreOnce", i18n.initializedStoreOnce);
    });

    createEffect(() => {
      console.log("i18n.initializedLanguageOnce", i18n.initializedLanguageOnce);
    });

    return (
      <>
        <button on:click={handleClick}>Change language</button>
        <p>i18n.language = {i18n.language}</p>
        <p>i18n.languages = {JSON.stringify(i18n.languages)}</p>
        <p>i18n.resolvedLanguage = {i18n.resolvedLanguage}</p>
        <p>i18n.isInitialized = {JSON.stringify(i18n.isInitialized)}</p>
        <p>i18n.isInitializing = {JSON.stringify(i18n.isInitializing)}</p>
      </>
    ) as Element;
  },
};

export const ResourcesReactiveOnAddResources = {
  render: () => {
    const i18n = createReactiveI18n();

    const handleAddResource = () => {
      batch(() => {
        i18n.addResource(
          "en",
          "very-informal",
          "special.button",
          "Super epic button in English",
        );
        i18n.addResource(
          "fr",
          "very-informal",
          "special.button",
          "Super epic button in French",
        );
      });
    };

    const handleRemoveResource = () => {
      batch(() => {
        i18n.removeResourceBundle("en", "very-informal");
        i18n.removeResourceBundle("fr", "very-informal");
      });
    };

    const enBundle = () =>
      JSON.stringify(i18n.getResourceBundle("en", "very-informal"));
    const hasEnBundle = () => i18n.hasResourceBundle("en", "very-informal");

    const frBundle = () =>
      JSON.stringify(i18n.getResourceBundle("fr", "very-informal"));
    const hasFrBundle = () => i18n.hasResourceBundle("en", "very-informal");

    createEffect(() => {
      console.log(enBundle());
      console.log(frBundle());
    });

    return (
      <>
        <button on:click={handleAddResource}>Add resource</button>
        <button on:click={handleRemoveResource}>Remove resource</button>
        <p>{hasEnBundle() ? enBundle() : "No resource bundle for English"}</p>
        <p>{hasFrBundle() ? frBundle() : "No resource bundle for French"}</p>
      </>
    ) as Element;
  },
};
