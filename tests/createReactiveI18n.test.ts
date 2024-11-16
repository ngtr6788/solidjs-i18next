import { renderHook } from "@solidjs/testing-library";
import { createInstance } from "i18next";
import { createEffect, runWithOwner } from "solid-js";
import { describe, expect, test, vi } from "vitest";

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
});
