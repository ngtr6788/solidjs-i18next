import type { Component, JSXElement } from "solid-js";
import { useTranslation, TranslationOptions } from "./useTranslation.ts";
import type { i18n, TFunction } from "i18next";

interface TranslationProps {
  children: (t: TFunction, i18n: i18n) => JSXElement;
  options?: TranslationOptions;
}

export const Translation: Component<TranslationProps> = (props) => {
  const [t, i18n] = useTranslation(props.options);

  return props.children(t, i18n);
};
