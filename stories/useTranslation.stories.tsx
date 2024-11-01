import i18next from "i18next";
import { useTranslation, I18NextProvider } from "../src";
import { createSignal } from "solid-js";
import { type StoryObj, type Meta } from "@storybook/html";

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

export const ChangeLanguage: StoryObj = {
  render: () => {
    const [t, i18n] = useTranslation();

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
    ) as Element;
  },
};

export const UseTranslationLngProp: StoryObj = {
  render: () => {
    const [lng, setLng] = createSignal("en");

    const [t] = useTranslation({
      get lng() {
        return lng();
      },
    });

    const handleClick = () => {
      setLng(lng() === "en" ? "fr" : "en");
    };

    return (
      <>
        <button on:click={handleClick}>Change language</button>
        <p>{t("button")}</p>
      </>
    ) as Element;
  },
};

export const UseTranslationKeyPrefixProp: StoryObj = {
  render: () => {
    const [keyPrefix, setKeyPrefix] = createSignal("");

    const [t] = useTranslation({
      get keyPrefix() {
        return keyPrefix();
      },
    });

    const handleClick = () => {
      setKeyPrefix(keyPrefix() === "" ? "special" : "");
    };

    return (
      <>
        <button on:click={handleClick}>Change key prefix</button>
        <p>{t("button")}</p>
      </>
    ) as Element;
  },
};

export const UseTranslationNamespaceProp: StoryObj = {
  render: () => {
    const [ns, setNs] = createSignal("translation");

    const [t] = useTranslation({
      get ns() {
        return ns();
      },
    });

    const handleClick = () => {
      setNs(ns() === "translation" ? "informal" : "translation");
    };

    return (
      <>
        <button on:click={handleClick}>Change namespace</button>
        <p>{t("button")}</p>
      </>
    ) as Element;
  },
};
