import { type Meta } from "@storybook/html";
import { I18NextProvider, Trans } from "../src";
import i18next from "i18next";
import { createSignal } from "solid-js";

const i18nInit = {
  resources: {
    en: {
      translation: {
        "click-here-to-subscribe": "Click <0>here</0> to <1>subscribe</1>",
        "to-learn-more-click-here":
          "To learn <italics>a whole lot</italics> more, click <CustomLink>here</CustomLink>",
        "bold-italics-underline":
          "Number <1>one</1>, number <3>three</3>, number <6>six</6>",
        "hello-name-have-number":
          "Hello {{name}}, you have {{numEmails}} unread emails today.",
        "greetings-name-number":
          "You, there, currently have {{numEmails}} letters in the mail, {{name}}",
      },
    },
  },
  fallbackLng: "en",
};

i18next.init(i18nInit);

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

export const ComponentsArray = {
  render: () => {
    return (
      <Trans
        i18nKey="click-here-to-subscribe"
        components={[<a href="" />, <b />]}
      />
    );
  },
};

export const ComponentsObject = {
  render: () => {
    return (
      <Trans
        i18nKey="to-learn-more-click-here"
        components={{
          italics: <i />,
          CustomLink: <a href="" />,
        }}
      />
    );
  },
};

export const UsingChildren = {
  render: () => {
    const [i18nKey, setI18nKey] = createSignal("");

    const handleClick = () => {
      setI18nKey((i18nKey) => (i18nKey === "" ? "bold-italics-underline" : ""));
    };

    return (
      <>
        <button on:click={handleClick}>Change i18n key</button>
        <div>
          <Trans i18nKey={i18nKey()}>
            This text is <b>BOLD</b>, this text is <i>italic</i>, this text is{" "}
            <u>underlined</u>
          </Trans>
        </div>
      </>
    );
  },
};

export const WithInterpolation = {
  render: () => {
    const name = "Minh";
    const numEmails = 103;

    const [i18nKey, setI18nKey] = createSignal("");

    const setHelloNameHaveNumber = () => {
      setI18nKey("hello-name-have-number");
    };

    const setGreetingsNameNumber = () => {
      setI18nKey("greetings-name-number");
    };

    const setDefault = () => {
      setI18nKey("");
    };

    return (
      <div>
        <button on:click={setDefault}>Default</button>
        <button on:click={setHelloNameHaveNumber}>
          hello-have-name-number
        </button>
        <button on:click={setGreetingsNameNumber}>greeings-name-number</button>
        <Trans i18nKey={i18nKey()}>
          Someone with the name {{ name }} has email count of {{ numEmails }}
        </Trans>
      </div>
    );
  },
};

export const SomeHaveInterpolationSomeDoNot = {
  render: () => {
    const name = "Minh";
    const numEmails = 103;

    const [i18nKey, setI18nKey] = createSignal("bold-italics-underline");

    const setBoldItalicsUnderline = () => {
      setI18nKey("bold-italics-underline");
    };

    const setHelloNameHaveNumber = () => {
      setI18nKey("hello-name-have-number");
    };

    return (
      <div>
        <button on:click={setBoldItalicsUnderline}>
          bold-italics-underline
        </button>
        <button on:click={setHelloNameHaveNumber}>
          hello-have-name-number
        </button>
        <Trans i18nKey={i18nKey()} values={{ name, numEmails }} />
      </div>
    );
  },
};
