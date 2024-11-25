import { type i18n, type TFunction } from "i18next";
import {
  type Accessor,
  type Component,
  type JSXElement,
  splitProps,
} from "solid-js";

import {
  useTranslation,
  type UseTranslationOptions,
} from "./useTranslation.ts";

export interface TranslationProps extends UseTranslationOptions {
  children: (t: TFunction, i18n: i18n, ready: Accessor<boolean>) => JSXElement;
}

export const Translation: Component<TranslationProps> = (props) => {
  const [ch, options] = splitProps(props, ["children"]);

  const [t, i18n, ready] = useTranslation(options);

  return <>{ch.children(t, i18n, ready)}</>;
};
