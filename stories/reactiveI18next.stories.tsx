import { type Meta } from "@storybook/html";
import i18next, { type TFunction } from "i18next";
import { batch, createEffect, createSignal } from "solid-js";

import { I18NextProvider } from "../src";
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
        special: {
          button: "Epic clicky thing in english",
        },
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
        special: {
          button: "Epic clicky thing in french",
        },
      },
    },
    ar: {
      translation: {
        button: "Button in arabic",
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

export const ChangeLanguageChangeT = {
  render: () => {
    const i18n = createReactiveI18n();

    let lng = "en";
    const handleChangeLng = () => {
      lng = lng === "en" ? "fr" : "en";
      i18n.changeLanguage(lng);
    };

    const keysList = ["button", "special.button", "nonexistent"];
    const [key, setKey] = createSignal(0);

    const handleChangeKey = () => {
      setKey((key) => (key + 1) % keysList.length);
    };

    const handleNamespaces = () => {
      i18n.loadNamespaces(["translation", "informal"]);
    };

    createEffect(() => {
      console.log(i18n.t(keysList[key()]));
    });
    createEffect(() => {
      console.log(i18n.t(keysList[key()], { ns: "informal" }));
    });
    createEffect(() => {
      console.log(i18n.t(keysList[key()], { lng: "fr" }));
    });

    return (
      <>
        <button on:click={handleChangeLng}>Change language</button>
        <button on:click={handleChangeKey}>Change key</button>
        <button on:click={handleNamespaces}>Load namespaces</button>
        <p>{i18n.t(keysList[key()])}</p>
        <p>{i18n.t(keysList[key()], { ns: "informal" })}</p>
        <p>{i18n.t(keysList[key()], { lng: "fr" })}</p>
      </>
    ) as Element;
  },
};

export const GetFixedTChanges = {
  render: () => {
    const i18n = createReactiveI18n();

    const t1 = (...args: Parameters<TFunction>) => {
      const t = i18n.getFixedT(null, null, undefined);
      return t(...args);
    };

    const t2 = (...args: Parameters<TFunction>) => {
      const t = i18n.getFixedT(null, null, "special");
      return t(...args);
    };

    const t3 = (...args: Parameters<TFunction>) => {
      const t = i18n.getFixedT(null, "informal", undefined);
      return t(...args);
    };

    const t4 = (...args: Parameters<TFunction>) => {
      const t = i18n.getFixedT("fr", null, undefined);
      return t(...args);
    };

    let lng = "en";
    const handleChangeLng = () => {
      lng = lng === "en" ? "fr" : "en";
      i18n.changeLanguage(lng);
    };

    const [ns, setNs] = createSignal("translation");
    const handleChangeNs = () => {
      setNs(ns() === "translation" ? "informal" : "translation");
    };

    return (
      <>
        <button on:click={handleChangeLng}>Change language</button>
        <button on:click={handleChangeNs}>Change namespace</button>
        <p>{t1("button", { ns: ns() })}</p>
        <p>{t2("button", { ns: ns() })}</p>
        <p>{t3("button", { ns: ns() })}</p>
        <p>{t4("button", { ns: ns() })}</p>
      </>
    );
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

    const handleAddResources = () => {
      batch(() => {
        i18n.addResources("en", "very-informal", {
          "special.button": "Epicly epic button in English",
          "special.link": "Clicky move to new page in English",
        });
        i18n.addResources("fr", "very-informal", {
          "special.button": "Epicly epic button in French",
          "special.link": "Clicky move to new page in French",
        });
      });
    };

    const handleAddResourceBundle = () => {
      batch(() => {
        i18n.addResourceBundle(
          "en",
          "very-informal",
          {
            special: {
              button: "Special button in English",
              link: "Link in English",
              boring: "Boring in English",
            },
          },
          true,
          true,
        );
        i18n.addResourceBundle(
          "fr",
          "very-informal",
          {
            special: {
              button: "Special button in French",
              link: "Link in French",
              boring: "Boring in French",
            },
          },
          true,
          true,
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
      console.log(i18n.getResource("en", "very-informal", "special"));
    });

    const [lng, setLng] = createSignal("en");

    const handleChangeLanguage = () => {
      setLng(lng() === "en" ? "fr" : "en");
    };

    return (
      <>
        <button on:click={handleAddResource}>Add resource</button>
        <button on:click={handleAddResources}>Add resources</button>
        <button on:click={handleAddResourceBundle}>Add resource bundle</button>
        <button on:click={handleRemoveResource}>Remove resource</button>
        <button on:click={handleChangeLanguage}>Change language</button>
        <p>{hasEnBundle() ? enBundle() : "No resource bundle for English"}</p>
        <p>{hasFrBundle() ? frBundle() : "No resource bundle for French"}</p>
        <p>{JSON.stringify(i18n.getDataByLanguage(lng()))}</p>
        <p>
          {JSON.stringify(i18n.getResource(lng(), "very-informal", "special"))}
        </p>
        <p>{i18n.getResource(lng(), "very-informal", "special.button")}</p>
        <p>{i18n.getResource(lng(), "very-informal", "special.link")}</p>
        <p>{i18n.getResource(lng(), "very-informal", "special.boring")}</p>
      </>
    ) as Element;
  },
};

export const KeyExists = {
  render: () => {
    const i18n = createReactiveI18n();

    const keysList = ["button", "special.button", "nonexistent"];
    const [key, setKey] = createSignal(0);

    const handleChangeKey = () => {
      setKey((key) => (key + 1) % keysList.length);
    };

    return (
      <>
        <button on:click={handleChangeKey}>Change key</button>
        <p>
          i18n.exists("{keysList[key()]}"){" "}
          {String(i18n.exists(keysList[key()]))}
        </p>
      </>
    ) as Element;
  },
};

export const Dir = {
  render: () => {
    const i18n = createReactiveI18n();

    let lng = "en";
    const handleChangeLng = () => {
      lng = lng === "en" ? "ar" : "en";
      i18n.changeLanguage(lng);
    };

    return (
      <>
        <button on:click={handleChangeLng}>Change language</button>
        <p>Current lang: {i18n.resolvedLanguage}</p>
        <p>i18n.dir("en") {i18n.dir("en")}</p>
        <p>i18n.dir("ar") {i18n.dir("xaa")}</p>
        <p>i18n.dir() {i18n.dir()}</p>
      </>
    );
  },
};
