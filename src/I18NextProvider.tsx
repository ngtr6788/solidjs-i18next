import { createContext, createMemo, type Context, type ParentComponent } from "solid-js";
import type { i18n, Namespace } from "i18next";

interface I18nContextObject {
  i18n: i18n;
  ns: Namespace;
}

export const I18nContext: Context<I18nContextObject | undefined> = createContext();

export const I18NextProvider: ParentComponent<I18nContextObject> = (props) => {
  const value = createMemo(() => ({ i18n: props.i18n, ns: props.ns }));

  return (
    <I18nContext.Provider value={value()}>
      {props.children}
    </I18nContext.Provider>
  );
}
