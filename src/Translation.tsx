import { splitProps, type Component, type JSXElement } from "solid-js";
import {
  useTranslation,
  type UseTranslationOptions,
} from "./useTranslation.ts";
import { type i18n, type TFunction } from "i18next";

interface TranslationProps extends UseTranslationOptions {
  children: (t: TFunction, i18n: i18n) => JSXElement;
}

export const Translation: Component<TranslationProps> = (props) => {
  const [ch, options] = splitProps(props, ["children"]);

  const [t, i18n] = useTranslation(options);

  return ch.children(t, i18n);
};
