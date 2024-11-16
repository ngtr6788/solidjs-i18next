import { renderHook } from "@solidjs/testing-library";
import { createInstance } from "i18next";
import { createEffect, runWithOwner } from "solid-js";
import {
  describe,
  expect,
  onTestFailed,
  onTestFinished,
  test,
  vi,
} from "vitest";

import { createReactiveI18n } from "../src";

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

describe("createReactiveI18n unit tests", () => {
  test("resolvedLanguage reacts on language change", async () => {
    const i18nInstance = createInstance(i18nextInit);
    await i18nInstance.init();
    const { result: reactiveI18n, owner } = renderHook(createReactiveI18n, {
      initialProps: [i18nInstance],
    });

    let resolvedLanguage: string = "";
    const test = vi.fn();
    runWithOwner(owner, () => {
      createEffect(() => {
        resolvedLanguage = reactiveI18n.resolvedLanguage ?? "";
        test();
      }, 0);
    });
    test.mockClear();

    await reactiveI18n.changeLanguage("fr");
    expect(reactiveI18n.resolvedLanguage).toEqual("fr");
    expect(resolvedLanguage).toEqual("fr");
    expect(test).toBeCalledTimes(1);
  });

  test("languages reacts on language change", async () => {
    const i18nInstance = createInstance(i18nextInit);
    await i18nInstance.init();
    const { result: reactiveI18n, owner } = renderHook(createReactiveI18n, {
      initialProps: [i18nInstance],
    });

    let languages: readonly string[] = [];
    const test = vi.fn();
    runWithOwner(owner, () => {
      createEffect(() => {
        languages = reactiveI18n.languages;
        test();
      }, 0);
    });
    test.mockClear();

    await reactiveI18n.changeLanguage("fr");
    expect(reactiveI18n.resolvedLanguage).toContain("fr");
    expect(languages).toContain("fr");
    expect(test).toBeCalledTimes(1);
  });

  test("initialized doesn't react on language change", async () => {
    const i18nInstance = createInstance(i18nextInit);
    await i18nInstance.init();
    const { result: reactiveI18n, owner } = renderHook(createReactiveI18n, {
      initialProps: [i18nInstance],
    });

    let isInitialized = false;
    const test = vi.fn();
    runWithOwner(owner, () => {
      createEffect(() => {
        isInitialized = reactiveI18n.isInitialized;
        test();
      }, 0);
    });
    test.mockClear();

    await reactiveI18n.changeLanguage("fr");
    expect(reactiveI18n.isInitialized).toBe(true);
    expect(isInitialized).toBe(true);
    expect(test).toBeCalledTimes(0);
  });

  test("t changes on language change", async () => {
    const i18nInstance = createInstance(i18nextInit);
    await i18nInstance.init();
    const { result: reactiveI18n, owner } = renderHook(createReactiveI18n, {
      initialProps: [i18nInstance],
    });

    let translatedString: string = "";
    const test = vi.fn();
    runWithOwner(owner, () => {
      createEffect(() => {
        translatedString = reactiveI18n.t("button");
        test();
      }, 0);
    });
    test.mockClear();

    expect(translatedString).toBe("Button in english");
    await reactiveI18n.changeLanguage("fr");
    expect(test).toBeCalledTimes(1);
    expect(translatedString).toBe(translatedString);
  });

  test("t and exists change on added/removed resource", async () => {
    const i18nInstance = createInstance(i18nextInit);
    await i18nInstance.init();
    const { result: reactiveI18n, owner } = renderHook(createReactiveI18n, {
      initialProps: [i18nInstance],
    });

    let translatedString: string = "";
    let exists: boolean = false;
    const test = vi.fn();
    runWithOwner(owner, () => {
      createEffect(() => {
        translatedString = reactiveI18n.t("new-string", { ns: "different-ns" });
        exists = reactiveI18n.exists("new-string", { ns: "different-ns" });
        test();
      }, 0);
    });
    test.mockClear();

    expect(translatedString).toBe("new-string");
    expect(exists).toBe(false);

    const cleanup = () => {
      reactiveI18n.removeResourceBundle("en", "different-ns");
    };

    onTestFinished(cleanup);
    onTestFailed(cleanup);

    reactiveI18n.addResource("en", "different-ns", "new-string", "New string");
    expect(translatedString).toBe("New string");
    expect(exists).toBe(true);
    expect(test).toBeCalledTimes(1);

    reactiveI18n.addResources("en", "different-ns", {
      "new-string": "Brand new string",
    });

    expect(translatedString).toBe("Brand new string");
    expect(exists).toBe(true);
    expect(test).toBeCalledTimes(2);

    reactiveI18n.addResourceBundle("en", "different-ns", {
      "new-string": "Fresh new string",
    });

    expect(translatedString).toBe("Fresh new string");
    expect(exists).toBe(true);
    expect(test).toBeCalledTimes(3);

    reactiveI18n.removeResourceBundle("en", "different-ns");

    expect(translatedString).toBe("new-string");
    expect(exists).toBe(false);
    expect(test).toBeCalledTimes(4);
  });

  test("dir changes on language change", async () => {
    const i18nInstance = createInstance(i18nextInit);
    await i18nInstance.init();
    const { result: reactiveI18n, owner } = renderHook(createReactiveI18n, {
      initialProps: [i18nInstance],
    });

    let dir = "";
    const test = vi.fn();
    runWithOwner(owner, () => {
      createEffect(() => {
        dir = reactiveI18n.dir();
        test();
      }, 0);
    });
    test.mockClear();

    expect(dir).toBe("ltr");
    await reactiveI18n.changeLanguage("ar");
    expect(dir).toBe("rtl");
  });

  test("has/get ResourceBundle reacts on added/removed resourceBundle", async () => {
    const i18nInstance = createInstance(i18nextInit);
    await i18nInstance.init();
    const { result: reactiveI18n, owner } = renderHook(createReactiveI18n, {
      initialProps: [i18nInstance],
    });

    const test1 = vi.fn();
    let hasBundle = undefined;
    runWithOwner(owner, () => {
      createEffect(() => {
        hasBundle = reactiveI18n.hasResourceBundle("en", "very-informal");
        test1();
      });
    });
    test1.mockClear();

    const test2 = vi.fn();
    let bundle = undefined;
    runWithOwner(owner, () => {
      createEffect(() => {
        bundle = reactiveI18n.getResourceBundle("en", "very-informal");
        test2();
      });
    });
    test2.mockClear();

    const test3 = vi.fn();
    let powerString = undefined;
    runWithOwner(owner, () => {
      createEffect(() => {
        powerString = reactiveI18n.getResource(
          "en",
          "very-informal",
          "special.power",
        );
        test3();
      });
    });
    test3.mockClear();

    expect(hasBundle).toEqual(false);
    expect(bundle).toBeUndefined();

    reactiveI18n.addResources("en", "very-informal", {
      "special.button": "Epicly epic button in English",
      "special.link": "Clicky move to new page in English",
    });

    expect(test1).toBeCalledTimes(1);
    expect(test2).toBeCalledTimes(1);

    expect(hasBundle).toEqual(true);
    expect(bundle).toStrictEqual({
      special: {
        button: "Epicly epic button in English",
        link: "Clicky move to new page in English",
      },
    });
    expect(powerString).toBeUndefined();

    reactiveI18n.addResources("en", "very-informal", {
      "special.power": "Power button in English",
    });

    expect(test1).toBeCalledTimes(1);
    expect(test2).toBeCalledTimes(2);
    expect(test3).toBeCalled();

    expect(bundle).toStrictEqual({
      special: {
        button: expect.anything(),
        link: expect.anything(),
        power: "Power button in English",
      },
    });
    expect(powerString).toEqual("Power button in English");

    reactiveI18n.addResourceBundle(
      "en",
      "very-informal",
      {
        special: {
          button: "X",
          link: "Y",
          power: "Z",
        },
      },
      true,
      true,
    );

    expect(bundle).toStrictEqual({
      special: {
        button: "X",
        link: "Y",
        power: "Z",
      },
    });
    expect(powerString).toEqual("Z");

    reactiveI18n.removeResourceBundle("en", "very-informal");

    expect(bundle).toBeUndefined();
    expect(powerString).toBeUndefined();
  });
});
