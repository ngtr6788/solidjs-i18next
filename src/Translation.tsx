import type { Component, JSXElement } from "solid-js";
import { createTranslation } from "./createTranslation.ts";
import type { i18n, TFunction } from "i18next";

interface TranslationProps {
  children: (t: TFunction, i18n: i18n) => JSXElement;
}

export const Translation: Component<TranslationProps> = (props) => {
  const [t, i18n] = createTranslation();

  return props.children(t, i18n);
};
