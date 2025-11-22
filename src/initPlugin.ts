import { type InitOptions, type ThirdPartyModule } from "i18next";

import { type I18N_LISTENERS, type I18N_STORE_LISTENERS } from "./constants";

export type I18nListeners = (typeof I18N_LISTENERS)[number];
export type I18nStoreListeners = (typeof I18N_STORE_LISTENERS)[number];

export interface SolidI18nextOptions {
  bindI18n: I18nListeners[];
  bindI18nStore: I18nStoreListeners[];
  transEmptyNodeValue: string;
  transKeepBasicHtmlNodesFor: string[];
}

export interface I18nextExtendedOptions extends InitOptions {
  solidjs: SolidI18nextOptions;
}

const defaultOptions = {
  bindI18n: ["languageChanged"],
  bindI18nStore: [],
  transEmptyNodeValue: "",
  transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
} satisfies SolidI18nextOptions;

export const initSolidI18next = {
  type: "3rdParty",

  init(instance) {
    (instance.options as I18nextExtendedOptions).solidjs = {
      ...defaultOptions,
      ...((instance.options as I18nextExtendedOptions).solidjs || {}),
    };
  },
} satisfies ThirdPartyModule;
