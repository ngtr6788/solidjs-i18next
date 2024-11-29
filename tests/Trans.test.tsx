import { render } from "@solidjs/testing-library";
import i18next from "i18next";
// import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

// const user = userEvent.setup();
import { Trans } from "../src";

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
  test("not real test", () => {
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
});
