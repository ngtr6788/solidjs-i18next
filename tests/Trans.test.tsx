import { render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import escape from "escape-html";
import i18next from "i18next";
import { createSignal, type JSX, type ParentComponent } from "solid-js";
import { describe, expect, test } from "vitest";

import {
  Fragment,
  Trans,
  type TransDynamicBasicNode,
  transDynamicNode,
} from "../src";

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
        "nested-word-number-tags":
          "<word>Word tag <0>number 0</0>, <1>number 1</1>, <longer-word>longer word</longer-word></word>",
        "nested-number-word-tags":
          "<0>Number tag <word0>word 0</word0>, <word1>word 1</word1>, <1234>longer number</1234></0>",
        "nested-word-buildable-tags":
          "<word>Word tag <strong>STRONG</strong>, <i>italics</i>, <p>paragraph</p></word>",
        "nested-number-buildable-tags":
          "<0>Number tag <strong>STRONG</strong>, <i>italics</i>, <p>paragraph</p></0>",
        "this-tag-has-void-elements":
          "This <tag /> <has></has> <void /> elements",
        "this-tag-has-number-void-elements":
          "This has <1 /> <2 /> <3></3> elements",
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
            dynamic={{
              0: transDynamicNode({ component: "a", props: { href: "" } }),
              1: transDynamicNode({ component: "b", props: {} }),
            }}
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
              italics: transDynamicNode({
                component: "i",
                props: {},
              }),
              CustomLink: transDynamicNode({
                component: "a",
                props: {
                  href: "",
                },
              }),
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
                props: {
                  style: {
                    color: "red",
                  },
                },
              },
              3: {
                component: Link,
                props: {
                  style: {
                    color: "#4F97A3",
                    "text-decoration": "none",
                  },
                },
              },
              6: {
                component: "b",
                props: {
                  style: {
                    "font-size": "xx-large",
                  },
                },
              },
              7: {
                component: Box,
                props: {
                  style: {
                    display: "flex",
                    "flex-direction": "column-reverse",
                  },
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
                        props: {
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
            dynamic={{
              0: {
                component: "bold",
              },
              1: {
                component: "i",
              },
            }}
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
          Record<string, TransDynamicBasicNode> | undefined
        >(undefined);

        const toggleComponentArray = () => {
          setComps((comps) => (comps === undefined ? {} : undefined));
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
          Record<string, TransDynamicBasicNode> | undefined
        >(undefined);

        const toggleComponentArray = () => {
          setComps((comps) => (comps === undefined ? {} : undefined));
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

    test("undefined component for word tag, nested number tags", () => {
      const Link: ParentComponent<JSX.HTMLAttributes<HTMLAnchorElement>> = (
        props,
      ) => {
        return (
          <a href="" {...props}>
            {props.children}
          </a>
        );
      };

      const Test = () => {
        return (
          <Trans
            i18nKey="nested-word-number-tags"
            dynamic={{
              word: {
                children: {
                  0: {
                    component: Link,
                  },
                  "longer-word": {
                    component: "u",
                  },
                },
              },
            }}
          />
        );
      };

      const screen = render(() => <Test />, {});
      expect(screen.container.innerHTML).toEqual(
        `${escape("<word>")}Word tag <a href="">number 0</a>, ${escape("<1>")}number 1${escape("</1>")}, <u>longer word</u>${escape("</word>")}`,
      );
    });

    test("undefined component for number tag, nested word tags", () => {
      const Header: ParentComponent<JSX.HTMLAttributes<HTMLAnchorElement>> = (
        props,
      ) => {
        return <h1>{props.children}</h1>;
      };

      const Test = () => {
        return (
          <Trans
            i18nKey="nested-number-word-tags"
            dynamic={{
              0: transDynamicNode({
                children: {
                  word0: transDynamicNode({
                    component: "u",
                    props: {},
                  }),
                  1234: transDynamicNode({
                    component: Header,
                    props: {},
                  }),
                },
              }),
            }}
          />
        );
      };

      const screen = render(() => <Test />, {});
      expect(screen.container.innerHTML).toEqual(
        `${escape("<0>")}Number tag <u>word 0</u>, ${escape("<word1>")}word 1${escape("</word1>")}, <h1>longer number</h1>${escape("</0>")}`,
      );
    });

    test("undefined component for word tag, nested number + buildable tags", () => {
      const Test = () => {
        return <Trans i18nKey="nested-word-buildable-tags" dynamic={{}} />;
      };

      const screen = render(() => <Test />, {});
      expect(screen.container.innerHTML).toEqual(
        `${escape("<word>")}Word tag <strong>STRONG</strong>, <i>italics</i>, <p>paragraph</p>${escape("</word>")}`,
      );
    });

    test("undefined component for number tag, nested word + buildable tags", () => {
      const Test = () => {
        return <Trans i18nKey="nested-number-buildable-tags" dynamic={{}} />;
      };

      const screen = render(() => <Test />, {});
      expect(screen.container.innerHTML).toEqual(
        `${escape("<0>")}Number tag <strong>STRONG</strong>, <i>italics</i>, <p>paragraph</p>${escape("</0>")}`,
      );
    });

    test("fragment component in various slot tags", () => {
      const Test = () => {
        return (
          <Trans
            i18nKey="bold-italics-underline"
            dynamic={{
              3: transDynamicNode({
                component: Fragment,
                props: {},
              }),
              7: transDynamicNode({
                component: Fragment,
                props: {},
                children: {
                  9: transDynamicNode({
                    children: {
                      10: transDynamicNode({
                        component: Fragment,
                        props: {},
                      }),
                    },
                  }),
                },
              }),
            }}
          />
        );
      };

      const screen = render(() => <Test />, {});
      expect(screen.container.innerHTML).toEqual(
        `Number ${escape("<1>one</1>")}, number three, number ${escape("<6>six</6>")}, number seven, ${escape("<8>eight</8>")}, ${escape("<9>")}nine, ten${escape("</9>")}`,
      );
    });

    test("void elements with and without dynamic", async () => {
      const user = userEvent.setup();
      const Test = () => {
        const [dynamic, setDynamic] = createSignal<
          Record<string, TransDynamicBasicNode> | undefined
        >(undefined);

        const toggleNoDynamic = () => {
          setDynamic(undefined);
        };

        const toggleEmptyDynamic = () => {
          setDynamic({});
        };

        const toggleFilledDynamic = () => {
          setDynamic({
            tag: {
              component: () => {
                return <i>italic tag</i>;
              },
            },
            has: {
              component: () => {
                return <strong>DEFINITELY HAS</strong>;
              },
            },
            void: {
              component: () => {
                return <button>1 button</button>;
              },
            },
          });
        };

        return (
          <>
            <div data-testid="translated-string">
              <Trans i18nKey="this-tag-has-void-elements" dynamic={dynamic()} />
            </div>
            <div>
              <button on:click={toggleNoDynamic}>Toggle no dynamic</button>
              <button on:click={toggleEmptyDynamic}>
                Toggle empty dynamic
              </button>
              <button on:click={toggleFilledDynamic}>
                Toggle filled dynamic
              </button>
            </div>
          </>
        );
      };

      const screen = render(() => <Test />, {});
      expect(screen.getByTestId("translated-string").innerHTML).toEqual(
        `This ${escape("<tag />")} ${escape("<has></has>")} ${escape("<void />")} elements`,
      );
      await user.click(screen.getByText("Toggle empty dynamic"));
      expect(screen.getByTestId("translated-string").innerHTML).toEqual(
        `This ${escape("<tag />")} ${escape("<has></has>")} ${escape("<void />")} elements`,
      );
      await user.click(screen.getByText("Toggle filled dynamic"));
      expect(screen.getByTestId("translated-string").innerHTML).toEqual(
        `This <i>italic tag</i> <strong>DEFINITELY HAS</strong> <button>1 button</button> elements`,
      );
    });
  });

  test("void elements with and without dynamic", async () => {
    const user = userEvent.setup();
    const Test = () => {
      const [dynamic, setDynamic] = createSignal<
        Record<string, TransDynamicBasicNode> | undefined
      >(undefined);

      const toggleNoDynamic = () => {
        setDynamic(undefined);
      };

      const toggleEmptyDynamic = () => {
        setDynamic({});
      };

      const toggleFilledDynamic = () => {
        setDynamic({
          1: {
            component: () => {
              return <i>1 and</i>;
            },
          },
          2: {
            component: () => {
              return <strong>2 and</strong>;
            },
          },
          3: {
            component: () => {
              return <button>3</button>;
            },
          },
        });
      };

      return (
        <>
          <div data-testid="translated-string">
            <Trans
              i18nKey="this-tag-has-number-void-elements"
              dynamic={dynamic()}
            />
          </div>
          <div>
            <button on:click={toggleNoDynamic}>Toggle no dynamic</button>
            <button on:click={toggleEmptyDynamic}>Toggle empty dynamic</button>
            <button on:click={toggleFilledDynamic}>
              Toggle filled dynamic
            </button>
          </div>
        </>
      );
    };

    const screen = render(() => <Test />, {});
    expect(screen.getByTestId("translated-string").innerHTML).toEqual(
      `This has ${escape("<1 />")} ${escape("<2 />")} ${escape("<3></3>")} elements`,
    );
    await user.click(screen.getByText("Toggle empty dynamic"));
    expect(screen.getByTestId("translated-string").innerHTML).toEqual(
      `This has ${escape("<1 />")} ${escape("<2 />")} ${escape("<3></3>")} elements`,
    );
    await user.click(screen.getByText("Toggle filled dynamic"));
    expect(screen.getByTestId("translated-string").innerHTML).toEqual(
      "This has <i>1 and</i> <strong>2 and</strong> <button>3</button> elements",
    );
  });
});
