import { render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import i18next from "i18next";
import { createSignal, type JSX, type ParentComponent } from "solid-js";
import { describe, expect, test } from "vitest";

import { Trans, type TransDynamicIndexable } from "../src";

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
          "Number <1>one</1>, number <3>three</3>, number <6>six</6>, number <7>seven, <8>eight</8>, <9>nine, <10>ten</10></9></7>",
        "hello-name-have-number":
          "<0>Hello {{name}}</0>, you have <1>{{numEmails}} unread emails</1> today.",
        "greetings-name-number":
          "You, there, currently have <1>{{numEmails}} letters</1> in the mail, <0>{{name}}</0>",
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
          "Click <strong class='my-class'>here</strong> to <i>subscribe</i><br><p>and hit the notification button as well</p>",
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

describe("Trans component tests", () => {
  describe("dynamic prop tests", () => {
    test("basic interpolating with dynamic component array", () => {
      const Test = () => {
        return (
          <Trans
            i18nKey="click-here-to-subscribe"
            dynamic={[{ component: "a", href: "" }, { component: "b" }]}
          />
        );
      };

      const screen = render(() => <Test />, {});

      expect(screen.container.innerHTML).toEqual(
        'Click <a href="">here</a> to <b>subscribe</b>',
      );
    });

    test("basic interpolating with dynamic component object", () => {
      const Test = () => {
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
      };

      const screen = render(() => <Test />, {});
      expect(screen.container.innerHTML).toEqual(
        'To learn <i>a whole lot</i> more, click <a href="">here</a>',
      );
    });

    test("no dynamic component object but string built on its own", () => {
      const Test = () => {
        return <Trans i18nKey="click-here-to-subscribe-buildable" />;
      };

      const screen = render(() => <Test />, {});
      expect(screen.container.innerHTML).toEqual(
        'Click <strong class="my-class">here</strong> to <i>subscribe</i><br><p>and hit the notification button as well</p>',
      );
    });

    test("nested interpolating with tree-like component object", () => {
      const Link: ParentComponent<JSX.HTMLAttributes<HTMLAnchorElement>> = (
        props,
      ) => {
        return (
          <a href="" {...props}>
            {props.children}
          </a>
        );
      };

      const Box: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (
        props,
      ) => {
        return <div class="my-class" {...props} />;
      };

      const Test = () => {
        return (
          <Trans
            i18nKey="bold-italics-underline"
            dynamic={{
              1: {
                component: "div",
                style: {
                  color: "red",
                },
              },
              3: {
                component: Link,
                style: {
                  color: "#4F97A3",
                  "text-decoration": "none",
                },
              },
              6: {
                component: "b",
                style: {
                  "font-size": "xx-large",
                },
              },
              7: {
                component: Box,
                style: {
                  display: "flex",
                  "flex-direction": "column-reverse",
                },
                children: {
                  8: {
                    component: "u",
                  },
                  9: {
                    component: "i",
                    children: {
                      10: {
                        component: Box,
                        style: {
                          "background-color": "black",
                          color: "white",
                          width: "100px",
                        },
                      },
                    },
                  },
                },
              },
            }}
          />
        );
      };

      const screen = render(() => <Test />, {});
      expect(screen.container.innerHTML).toMatchSnapshot();
    });

    test("value interpolation with component interpolation", () => {
      const Test = () => {
        const name = "John";
        const numEmails = 123;

        return (
          <Trans
            i18nKey="hello-name-have-number"
            values={{ name, numEmails }}
            dynamic={[
              {
                component: "bold",
              },
              {
                component: "i",
              },
            ]}
          />
        );
      };

      const screen = render(() => <Test />, {});
      expect(screen.container.innerHTML).toEqual(
        "<bold>Hello John</bold>, you have <i>123 unread emails</i> today.",
      );
    });

    test("defined and undefined dynamic object with number tags", async () => {
      const user = userEvent.setup();
      const Test = () => {
        const name = "Jane";
        const numEmails = 456;

        const [comps, setComps] = createSignal<
          TransDynamicIndexable | undefined
        >(undefined);

        const toggleComponentArray = () => {
          setComps((comps) => (comps === undefined ? [] : undefined));
        };

        return (
          <div>
            <button on:click={toggleComponentArray}>
              Toggle component array
            </button>
            <Trans
              i18nKey="greetings-name-number"
              values={{ name, numEmails }}
              dynamic={comps()}
            />
          </div>
        );
      };

      const textWithTags =
        "You, there, currently have <1>456 letters</1> in the mail, <0>Jane</0>";
      const textWithoutTags =
        "You, there, currently have 456 letters in the mail, Jane";
      const screen = render(() => <Test />, {});
      expect(screen.getByText(textWithTags)).toBeInTheDocument();
      expect(screen.queryByText(textWithoutTags)).not.toBeInTheDocument();

      await user.click(screen.getByText("Toggle component array"));
      expect(screen.getByText(textWithTags)).toBeInTheDocument();
      expect(screen.queryByText(textWithoutTags)).not.toBeInTheDocument();
    });

    test("defined and undefined dynamic object with word tags", async () => {
      const user = userEvent.setup();
      const Test = () => {
        const name = "Jane";
        const numEmails = 456;

        const [comps, setComps] = createSignal<
          TransDynamicIndexable | undefined
        >(undefined);

        const toggleComponentArray = () => {
          setComps((comps) => (comps === undefined ? [] : undefined));
        };

        return (
          <div>
            <button on:click={toggleComponentArray}>
              Toggle component array
            </button>
            <Trans
              i18nKey="to-learn-more-click-here"
              values={{ name, numEmails }}
              dynamic={comps()}
            />
          </div>
        );
      };

      const textWithTags =
        "To learn <italics>a whole lot</italics> more, click <CustomLink>here</CustomLink>";
      const textWithoutTags = "To learn a whole lot more, click here";
      const screen = render(() => <Test />, {});
      expect(screen.getByText(textWithTags)).toBeInTheDocument();
      expect(screen.queryByText(textWithoutTags)).not.toBeInTheDocument();

      await user.click(screen.getByText("Toggle component array"));
      expect(screen.getByText(textWithTags)).toBeInTheDocument();
      expect(screen.queryByText(textWithoutTags)).not.toBeInTheDocument();
    });
  });
});
