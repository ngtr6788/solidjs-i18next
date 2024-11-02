import { type i18n, type TFunction } from "i18next";
import { type Component, type JSXElement, splitProps } from "solid-js";

import {
  useTranslation,
  type UseTranslationOptions,
} from "./useTranslation.ts";

interface TranslationProps extends UseTranslationOptions {
  children: (t: TFunction, i18n: i18n) => JSXElement;
}

export const Translation: Component<TranslationProps> = (props) => {
  const [ch, options] = splitProps(props, ["children"]);

  const [t, i18n] = useTranslation(options);

  return <>{ch.children(t, i18n)}</>;
};
