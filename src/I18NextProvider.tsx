import { createContext, type ParentComponent } from "solid-js";
import { type i18n, type Namespace } from "i18next";

interface I18nContextObject {
  i18n: i18n;
  ns?: Namespace;
}

export const I18nContext = createContext<I18nContextObject>();

export const I18NextProvider: ParentComponent<I18nContextObject> = (props) => {
  const value = { i18n: props.i18n, ns: props.ns };

  return (
    <I18nContext.Provider value={value}>{props.children}</I18nContext.Provider>
  );
};
