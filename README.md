# solidjs-i18next

A library that combines [solid-js](https://www.solidjs.com/) nicely with
[i18next](https://www.i18next.com) internalization

## Installation

### npm

```
npm install solidjs-i18next
```

### yarn

```
yarn add solidjs-i18next
```

### pnpm

```
pnpm add solidjs-i18next
```

## Usage

This library took a lot of inspiration from `react-i18next` and a bit
of `i18next-vue` and `i18next-svelte` in terms of API.

This library is still currently in alpha, therefore, there can be bugs
and breaking changes.

### useTranslation

This is a simple "hook" similar to `react-i18next` that exposes a reactive
`t` translation function and the `i18n` internationalization instance.

```
const [t, i18n, ready] = useTranslation(options)
```

Arguments:

- `options` object:

  - `keyPrefix` - automatically applied to the `t` function, e.g.

    ```
    const [t] = useTranslation({ keyPrefix: "very.nested.key-prefix" })

    t("title") // same as t("very.nested.key-prefix.title")
    ```

  - `lng` - default language for `t` function
  - `ns` - default namespace(s) for `t` function
  - `i18n` - custom i18next instance to be used

Return values:

- `t` - the translation function that reacts to changes in any of the props or `i18next` events like language change and when the instance is initialized
- `i18n` - the instance either passed in by the user, or the instance used in the closest ancestor `I18NextProvider`, or the global instance
- `ready` - a signal showing if the `t` is ready to display actual translation strings

### Translation

This component is a simple wrapper for the `useTranslation` "hook".
It takes the same props as the `useTranslation` hook. The child of
`Translation` takes `t`, `i18n`, and `ready` as arguments and returns JSX,
akin to Solid's `Index` or `For` components' children.

```
<Translation>
  {(t, i18n, ready) => { ... }}
</Translation>
```

Props:

- `keyPrefix` - automatically applied to the `t` function, e.g.

  ```
  const [t] = useTranslation({ keyPrefix: "very.nested.key-prefix" })

  t("title") // same as t("very.nested.key-prefix.title")
  ```

- `lng` - default language for `t` function
- `ns` - default namespace(s) for `t` function
- `i18n` - custom i18next instance to be used
- `children` - a callback function receiving `t` and `i18n` and returns the displayed JSX

### I18NextProvider

This allows your custom `i18next` instance to be exposed to all of its
descendants, accessible via the `useTranslation` hook. It takes in a
single `i18n` internationalization instance.

```
import { createInstance } from "i18next";

const i18n = createInstance();

<I18NextProvider i18n={i18n} />
```

### createReactiveI18n

This is a reactive wrapper around `i18next` instances. You can either
pass your own instance in or use the default instance to wrap around.

```
const reactiveI18n = createReactiveI18n(i18n);
```

### Trans

Inspired by `react-i18next`, the Trans component allows you to
interpolate HTML elements or Solid components into your translation.
This is perfect if your translation string contains HTML-like nodes,
for example: `Hello <bold>world</bold>!`.

```
<Trans i18nKey="..." dynamic={{
  comp1: {
    component: Comp1
    prop1: ...
  },
  comp2: {
    component: Comp2
    prop2: ...,
    children: {
      comp3: {
        ...
      }
    }
  }
}}>
```

Props:

- `i18nKey` - the translation key to get the (potentially interpolated) translation string
- `count` - the count that would give different [plurals](https://www.i18next.com/translation-function/plurals) based on the value.
- `context` - allows for different translations based on [context](https://www.i18next.com/translation-function/context), e.g. gender.
- `ns` - default namespace(s)
- `defaultValue` - default translation string if no translation string is found with that `i18nKey`
- `tOptions` - any other options to provide for the `t` function
- `values` - an object containing any key-values for [interpolation](https://www.i18next.com/translation-function/interpolation)
- `t` - custom `t` function
- `i18n` - custom `i18n` instance
- `dynamic` - an array or object mapping which component and props to interpolate. It is similar to props passed in SolidJS's [`Dynamic`](https://docs.solidjs.com/concepts/control-flow/dynamic) component. It typically follows a tree-like structure, where each "node" has the following attributes:
  - `component` - a string representing an HTML element or SolidJS component that can (hopefully) receive text nodes as children
  - `children` - recursively containing an array or object mapping of the same "nodes"
  - any other props/arguments passed into the component

## Contributing

Contributions are most certainly welcome. To start, this library uses
`pnpm` as the package manager, so be sure to install that first.

### Getting started

To get started, run `pnpm install`.

### Lint and Format

This repo uses ESLint and Prettier for linting and formatting. Your
favourite IDE might have automatic linting and formatting, but if you
need to, you can run `pnpm lint` and `pnpm format` respectively for problems.

### Unit tests

There will also be unit tests and to run them, run `pnpm test`. It
currently uses `vitest` and `@testing-library/solidjs`.

### Documentation

Contributions to documentation are also helpful as well. Since this
library is still new, it would be great to make documentation clearer
and easier to understand.

## Licence

MIT
