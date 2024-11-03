import { render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import i18next, { type TFunction } from "i18next";
import { createSignal, type JSX } from "solid-js";
import { describe, expect, onTestFinished, test } from "vitest";

const user = userEvent.setup();

import { Translation } from "../src";

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

describe("Translation component tests", () => {
  test("i18n.language change", async () => {
    const i18n = i18next.cloneInstance();

    const Test = () => (
      <Translation i18n={i18n}>
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
    );

    const screen = render(() => <Test />, {});

    expect(screen.getByText(/button/i)).toHaveTextContent(/Button in english/);
    await user.click(screen.getByRole("button"));
    expect(screen.getByText(/button/i)).toHaveTextContent(/Button in french/);

    onTestFinished(() => {
      i18n.changeLanguage("en");
    });
  });

  test("language option change", async () => {
    const i18n = i18next.cloneInstance();

    const Test = () => {
      const [lng, setLng] = createSignal("en");

      const handleClick = () => {
        setLng(lng() === "en" ? "fr" : "en");
      };

      return (
        <>
          <button on:click={handleClick}>Change language</button>
          <Translation i18n={i18n} lng={lng()}>
            {(t) => <p>{t("button")}</p>}
          </Translation>
        </>
      );
    };

    const screen = render(() => <Test />, {});

    expect(screen.getByText(/button/i)).toHaveTextContent(/Button in english/);
    await user.click(screen.getByRole("button"));
    expect(screen.getByText(/button/i)).toHaveTextContent(/Button in french/);
  });

  test("key prefix change", async () => {
    const i18n = i18next.cloneInstance();

    const Test = () => {
      const [keyPrefix, setKeyPrefix] = createSignal("");

      const handleClick = () => {
        setKeyPrefix(keyPrefix() === "" ? "special" : "");
      };

      return (
        <>
          <button on:click={handleClick}>Change key prefix</button>
          <Translation i18n={i18n} keyPrefix={keyPrefix()}>
            {(t) => <p>{t("button")}</p>}
          </Translation>
        </>
      );
    };

    const screen = render(() => <Test />, {});

    expect(screen.getByText(/button/i)).toHaveTextContent(/Button in english/);
    await user.click(screen.getByRole("button"));
    expect(screen.getByText(/button/i)).toHaveTextContent(
      /Special button in english/,
    );
  });

  test("namespace value change", async () => {
    const i18n = i18next.cloneInstance();

    const Test = () => {
      const [ns, setNs] = createSignal("translation");

      const handleClick = () => {
        setNs(ns() === "translation" ? "informal" : "translation");
      };

      return (
        <>
          <button on:click={handleClick}>Change namespace</button>
          <Translation i18n={i18n} ns={ns()}>
            {(t) => <p>{t("button")}</p>}
          </Translation>
        </>
      );
    };

    const screen = render(() => <Test />, {});

    expect(screen.getByText(/english/i)).toHaveTextContent(/Button in english/);
    await user.click(screen.getByRole("button"));
    expect(screen.getByText(/english/i)).toHaveTextContent(
      /Clicky thing in english/,
    );
  });

  test("children changes", async () => {
    const Test = () => {
      type TChildType = "regular" | "informal" | "special";

      const regular = (t: TFunction) => <p>{t("button")}</p>;
      const informal = (t: TFunction) => <p>{t("informal:button")}</p>;
      const special = (t: TFunction) => <p>{t("special.button")}</p>;

      const translateMap: Record<TChildType, (t: TFunction) => JSX.Element> = {
        regular,
        informal,
        special,
      };

      const [currentFunc, setCurrentFunc] = createSignal<TChildType>("regular");

      const handleRadio: JSX.EventHandler<HTMLInputElement, MouseEvent> = (
        e,
      ) => {
        // @ts-expect-error target cannot have value error for some reason
        setCurrentFunc(e.target.value);
      };

      return (
        <>
          <div style={{ display: "flex", "flex-direction": "column" }}>
            <label>
              <input
                type="radio"
                value="regular"
                checked={currentFunc() === "regular"}
                on:click={handleRadio}
              />
              Regular
            </label>
            <label>
              <input
                type="radio"
                value="informal"
                checked={currentFunc() === "informal"}
                on:click={handleRadio}
              />
              Informal
            </label>
            <label>
              <input
                type="radio"
                value="special"
                checked={currentFunc() === "special"}
                on:click={handleRadio}
              />
              Special
            </label>
          </div>
          <Translation>{translateMap[currentFunc()]}</Translation>
        </>
      );
    };

    const screen = render(() => <Test />, {});

    expect(screen.getByText(/english/i)).toHaveTextContent(/Button in english/);
    const regularRadio = screen.getByLabelText("Regular");
    await user.click(regularRadio);
    expect(screen.getByText(/english/i)).toHaveTextContent(/Button in english/);

    const informalRadio = screen.getByLabelText("Informal");
    await user.click(informalRadio);
    expect(screen.getByText(/english/i)).toHaveTextContent(
      /Clicky thing in english/,
    );

    const specialRadio = screen.getByLabelText("Special");
    await user.click(specialRadio);
    expect(screen.getByText(/english/i)).toHaveTextContent(
      /Special button in english/,
    );
  });
});
