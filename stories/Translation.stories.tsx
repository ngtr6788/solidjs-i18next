import { type Meta, type StoryObj } from "@storybook/html";
import i18next from "i18next";
import { createSignal } from "solid-js";

import { I18NextProvider, Translation } from "../src";

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
        button: "Clicky thing in english",
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

export const UseTProp: StoryObj = {
  render: () =>
    (
      <Translation>{(t) => <p>{t("special.button")}</p>}</Translation>
    ) as Element,
};

export const ChangeLanguage: StoryObj = {
  render: () => {
    return (
      <Translation>
        {(t, i18n) => {
          let lng = "en";
          const handleClick = () => {
            lng = lng === "en" ? "fr" : "en";
            i18n.changeLanguage(lng);
          };

          return (
            <>
              <button on:click={handleClick}>Change language</button>
              <p>{t("button")}</p>
            </>
          );
        }}
      </Translation>
    ) as Element;
  },
};

export const TranslationLngProp: StoryObj = {
  render: () => {
    const [lng, setLng] = createSignal("en");

    const handleClick = () => {
      setLng(lng() === "en" ? "fr" : "en");
    };

    return (
      <>
        <button on:click={handleClick}>Change language</button>
        <Translation lng={lng()}>{(t) => <p>{t("button")}</p>}</Translation>
      </>
    ) as Element;
  },
};

export const TranslationKeyPrefixProp: StoryObj = {
  render: () => {
    const [keyPrefix, setKeyPrefix] = createSignal("");

    const handleClick = () => {
      setKeyPrefix(keyPrefix() === "" ? "special" : "");
    };

    return (
      <>
        <button on:click={handleClick}>Change key prefix</button>
        <Translation keyPrefix={keyPrefix()}>
          {(t) => <p>{t("button")}</p>}
        </Translation>
      </>
    ) as Element;
  },
};

export const TranslationNamespaceProp: StoryObj = {
  render: () => {
    const [ns, setNs] = createSignal("translation");

    const handleClick = () => {
      setNs(ns() === "translation" ? "informal" : "translation");
    };

    return (
      <>
        <button on:click={handleClick}>Change namespace</button>
        <Translation ns={ns()}>{(t) => <p>{t("button")}</p>}</Translation>
      </>
    ) as Element;
  },
};
