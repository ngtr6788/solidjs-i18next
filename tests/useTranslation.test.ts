import { renderHook } from "@solidjs/testing-library";
import i18next from "i18next";
import { createEffect, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { beforeEach, describe, expect, onTestFinished, test, vi } from "vitest";

import { useTranslation } from "../src";

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

describe("useTranslation tests", () => {
  beforeEach(() => {});

  test("i18n.language change", () => {
    const {
      result: [t, i18n],
    } = renderHook(useTranslation);

    expect(t("button")).toEqual("Button in english");
    i18n.changeLanguage("fr");
    expect(t("button")).toEqual("Button in french");

    onTestFinished(() => {
      i18n.changeLanguage("en");
    });
  });

  test("language option change", () => {
    const [lng, setLng] = createSignal("en");

    const {
      result: [t],
    } = renderHook(useTranslation, {
      initialProps: [
        {
          get lng() {
            return lng();
          },
        },
      ],
    });

    expect(t("button")).toEqual("Button in english");
    setLng("fr");
    expect(t("button")).toEqual("Button in french");
  });

  test("key prefix change", () => {
    const [keyPrefix, setKeyPrefix] = createSignal("");

    const {
      result: [t],
    } = renderHook(useTranslation, {
      initialProps: [
        {
          get keyPrefix() {
            return keyPrefix();
          },
        },
      ],
    });

    expect(t("button")).toEqual("Button in english");
    setKeyPrefix("special");
    expect(t("button")).toEqual("Special button in english");
  });

  test("namespace value change", () => {
    const [ns, setNs] = createSignal("translation");

    const {
      result: [t],
    } = renderHook(useTranslation, {
      initialProps: [
        {
          get ns() {
            return ns();
          },
        },
      ],
    });

    expect(t("button")).toEqual("Button in english");
    setNs("informal");
    expect(t("button")).toEqual("Clicky thing in english");
  });

  test("namespace array itself changes", () => {
    const [ns, setNs] = createSignal(["translation", "informal"]);

    const {
      result: [t],
    } = renderHook(useTranslation, {
      initialProps: [
        {
          get ns() {
            return ns();
          },
        },
      ],
    });

    const test = vi.fn();
    createEffect(() => {
      t("button");
      test();
    });
    test.mockClear();

    expect(t("button")).toEqual("Button in english");

    setNs(["translation", "informal"]);
    expect(test).toBeCalledTimes(0);
    expect(t("button")).toEqual("Button in english");

    setNs(["informal", "translation"]);
    expect(t("button")).toEqual("Clicky thing in english");
    expect(test).toBeCalledTimes(1);

    test.mockClear();
  });

  test("namespace array items changes", () => {
    const [ns, setNs] = createStore(["translation"]);

    const {
      result: [t],
    } = renderHook(useTranslation, {
      initialProps: [{ ns }],
    });

    const test = vi.fn();
    createEffect(() => {
      t("button");
      test();
    });
    test.mockClear();

    expect(t("button")).toEqual("Button in english");

    setNs(produce((ns) => ns.push("informal")));
    expect(test).toBeCalledTimes(1);
    expect(t("button")).toEqual("Button in english");

    setNs(produce((ns) => ns.reverse()));
    expect(t("button")).toEqual("Clicky thing in english");
    expect(test).toBeCalledTimes(2);

    setNs(produce((ns) => ns.pop()));
    expect(t("button")).toEqual("Clicky thing in english");
    expect(test).toBeCalledTimes(3);

    setNs(produce((ns) => (ns[0] = "informal")));
    expect(test).toBeCalledTimes(3);

    test.mockClear();
  });
});
