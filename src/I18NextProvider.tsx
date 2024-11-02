import { type i18n, type Namespace } from "i18next";
import { createContext, type ParentComponent } from "solid-js";

interface I18nContextObject {
  i18n: i18n;
  ns?: Namespace;
}

export const I18nContext = createContext<I18nContextObject>();

export const I18NextProvider: ParentComponent<I18nContextObject> = (props) => {
  return (
    <I18nContext.Provider value={props}>{props.children}</I18nContext.Provider>
  );
};
