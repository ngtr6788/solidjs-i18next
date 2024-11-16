import { type Meta } from "@storybook/html";
import i18next from "i18next";
import { createSignal, type JSX, type JSXElement } from "solid-js";

import { I18NextProvider, Trans, useTranslation } from "../src";

const i18nInit = {
  resources: {
    fr: {
      translation: {
        "click-here-to-subscribe":
          "In the language of Moliere, click <0>here</0> to <1>subscribe</1>",
      },
    },
    en: {
      translation: {
        "click-here-to-subscribe": "Click <0>here</0> to <1>subscribe</1>",
        "to-learn-more-click-here":
          "To learn <italics>a whole lot</italics> more, click <CustomLink>here</CustomLink>",
        "bold-italics-underline":
          "Number <1>one</1>, number <3>three</3>, number <6>six</6>, number <7>seven, <8>eight, </8> <9>nine, <10>ten</10></9></7>",
        "hello-name-have-number":
          "Hello {{name}}, you have {{numEmails}} unread emails today.",
        "greetings-name-number":
          "You, there, currently have {{numEmails}} letters in the mail, {{name}}",
        actors_male_zero: "No actors",
        actors_male_one: "{{count}} actors",
        actors_male_other: "{{count}} actors",
        actors_female_zero: "No actresses",
        actors_female_one: "{{one}} actress",
        actors_female_other: "{{count}} actresses",
        "array-join": ["Item 1", "Item 2", "Item 3"],
        items_ordinal_one: "{{count}}st item",
        items_ordinal_two: "{{count}}nd item",
        items_ordinal_few: "{{count}}rd item",
        items_ordinal_other: "{{count}}th item",
        "click-here-to-subscribe-buildable":
          "Click <strong>here</strong> to <i>subscribe</i><br><p>and hit the notification button as well</p>",
      },
      silly: {
        "click-here-to-subscribe": "<0>SMASH LIKE</0> and <1>SUBSCRIBE</1>",
        "to-learn-more-click-here":
          "Click <CustomLink>here</CustomLink> to learn <italics>a bunch</italics> more",
        "bold-italics-underline":
          "Counting thing <1>1</1>, counting thing <3>three</3>, counting six <6>six</6>",
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
        dynamic={[{ component: "a", href: "" }, { component: "b" }]}
      />
    );
  },
};

export const ComponentsObject = {
  render: () => {
    return (
      <Trans
        i18nKey="to-learn-more-click-here"
        dynamic={{
          italics: {
            component: "i",
          },
          CustomLink: {
            component: "a",
            href: "",
          },
        }}
      />
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
        <Trans
          i18nKey={i18nKey()}
          defaultValue="Someone with the name {{ name }} has email count of {{ numEmails }}"
          values={{ name, numEmails }}
        />
      </div>
    );
  },
};

export const TranslationsWithAndWithoutInterpolation = {
  render: () => {
    const name = "Minh";
    const numEmails = 103;

    const [i18nKey, setI18nKey] = createSignal("bold-italics-underline");
    const [comps, setComps] = createSignal<Array<JSXElement> | undefined>(
      undefined,
    );

    const setBoldItalicsUnderline = () => {
      setI18nKey("bold-italics-underline");
    };

    const setHelloNameHaveNumber = () => {
      setI18nKey("hello-name-have-number");
    };

    const toggleComponentArray = () => {
      setComps((comps) => (comps === undefined ? [] : undefined));
    };

    return (
      <div>
        <button on:click={setBoldItalicsUnderline}>
          bold-italics-underline
        </button>
        <button on:click={setHelloNameHaveNumber}>
          hello-have-name-number
        </button>
        <button on:click={toggleComponentArray}>
          Toggle empty component array
        </button>
        <Trans
          i18nKey={i18nKey()}
          values={{ name, numEmails }}
          dynamic={comps()}
        />
      </div>
    );
  },
};

export const InterpolationValueObjectsChange = {
  render: () => {
    const [values, setValues] = createSignal<
      { name: string; numEmails: number } | undefined
    >({
      name: "John",
      numEmails: 1024,
    });

    const handleMinh = () => {
      setValues({
        name: "Minh",
        numEmails: 1729,
      });
    };

    const handleJohn = () => {
      setValues({
        name: "John",
        numEmails: 1024,
      });
    };

    const handleUndefined = () => {
      setValues(undefined);
    };

    return (
      <>
        <button on:click={handleJohn}>John</button>
        <button on:click={handleMinh}>Minh</button>
        <button on:click={handleUndefined}>undefined</button>
        <Trans i18nKey="hello-name-have-number" values={values()} />
      </>
    );
  },
};

export const InterpolationValueThemselvesChange = {
  render: () => {
    const [name, setName] = createSignal("John");
    const [numEmails, setNumEmails] = createSignal(1024);

    const handleMinh = () => {
      setName("Minh");
      setNumEmails(1729);
    };

    const handleJohn = () => {
      setName("John");
      setNumEmails(1024);
    };

    return (
      <>
        <button on:click={handleJohn}>John</button>
        <button on:click={handleMinh}>Minh</button>
        <Trans
          i18nKey="hello-name-have-number"
          values={{ name: name(), numEmails: numEmails() }}
        />
      </>
    );
  },
};

export const PluralsAndContextProps = {
  render: () => {
    const [count, setCount] = createSignal(0);
    const [context, setContext] = createSignal("male");

    const handleInput: JSX.InputEventHandlerUnion<
      HTMLInputElement,
      InputEvent
    > = (e) => {
      const value = e.target.value;

      // Check if the input is a nonnegative integer
      // Prevent leading zeros unless the value is "0"
      if (/^\d*$/.test(value)) {
        setCount(Number(value));
      }
    };

    const handleKeyDown: JSX.EventHandlerUnion<
      HTMLInputElement,
      KeyboardEvent
    > = (e) => {
      // Allow: backspace, delete, arrow keys
      if (
        e.key === "Backspace" ||
        e.key === "Delete" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      ) {
        return;
      }

      // Prevent any key that isn't a number
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    };

    const handleContext = () => {
      setContext((context) => (context === "male" ? "female" : "male"));
    };

    return (
      <>
        <button onClick={handleContext}>Toggle context (gender)</button>
        <input
          type="text"
          value={count()}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type a nonnegative integer"
        />
        <p>
          <Trans i18nKey="actors" count={count()} context={context()} />
        </p>
      </>
    );
  },
};

export const UseDefaultValue = {
  render: () => {
    const [defaultValue, setDefaultValue] = createSignal("");

    const toggleDefault = () => {
      setDefaultValue((value) =>
        value === "" ? "Use default value instead" : "",
      );
    };

    return (
      <>
        <button on:click={toggleDefault}>Toggle default value</button>
        <Trans i18nKey="non-existant-key" defaultValue={defaultValue()} />
      </>
    );
  },
};

export const ChangeNamespace = {
  render: () => {
    const [ns, setNs] = createSignal("");

    const toggleNamespace = () => {
      setNs((value) => (value === "" ? "silly" : ""));
    };

    return (
      <>
        <button on:click={toggleNamespace}>Toggle default value</button>
        <Trans
          i18nKey="click-here-to-subscribe"
          ns={ns()}
          dynamic={[{ component: "a", href: "" }, { component: "b" }]}
        />
      </>
    );
  },
};

export const ChangeLanguageWithI18n = {
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
        <p>
          <Trans
            t={t}
            i18nKey="click-here-to-subscribe"
            dynamic={[{ component: "a", href: "" }, { component: "b" }]}
          />
        </p>
      </>
    ) as Element;
  },
};

export const UseTOptionsExamples = {
  render: () => {
    return (
      <>
        <p>
          <Trans
            i18nKey="array-join"
            tOptions={{
              returnObjects: true,
              joinArrays: ", ",
            }}
          />
        </p>
        <p>
          <Trans i18nKey="items" count={1} tOptions={{ ordinal: true }} />
        </p>
        <p>
          <Trans i18nKey="items" count={2} tOptions={{ ordinal: true }} />
        </p>
        <p>
          <Trans i18nKey="items" count={3} tOptions={{ ordinal: true }} />
        </p>
        <p>
          <Trans i18nKey="items" count={4} tOptions={{ ordinal: true }} />
        </p>
      </>
    );
  },
};

export const TranslationStringBuildAlone = {
  render: () => {
    return <Trans i18nKey="click-here-to-subscribe-buildable" />;
  },
};
