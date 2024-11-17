import { type i18n } from "i18next";
import { createContext, type ParentComponent } from "solid-js";

export interface I18nContextObject {
  i18n: i18n;
}

export const I18nContext = createContext<I18nContextObject>();

export const I18NextProvider: ParentComponent<I18nContextObject> = (props) => {
  return (
    <I18nContext.Provider value={props}>{props.children}</I18nContext.Provider>
  );
};
