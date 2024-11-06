// import { signalify } from "classy-solid";
import i18next, { type Callback, type i18n, type TFunction } from "i18next";
import { createMemo, createSignal, useContext } from "solid-js";

import { I18nContext } from "./I18NextProvider";

type InterimKeys =
  | "modules"
  | "services"
  | "store"
  | "language"
  | "languages"
  | "resolvedLanguage"
  | "isInitialized"
  | "isInitializing"
  | "initializedStoreOnce"
  | "initializedLanguageOnce"
  | "changeLanguage"
  | "hasLoadedNamespace"
  | "loadLanguages"
  | "loadNamespaces"
  | "getFixedT"
  | "on"
  | "off";

export const createReactiveI18n = (
  propI18n?: i18n,
): Pick<i18n, InterimKeys> => {
  const i18nContext = useContext(I18nContext);
  const i18n = propI18n || i18nContext?.i18n || i18next;

  const [i18nTrack, i18nDirty] = createSignal(undefined, { equals: false });

  // NOTE TO SELF: Attributes are just signals that return the items as is FOR NOW.
  // I could put it in a store later on. No guarantees though.

  const modules = createMemo(
    () => {
      i18nTrack();
      return i18n.modules;
    },
    { equals: false },
  );

  const services = createMemo(
    () => {
      i18nTrack();
      return i18n.services;
    },
    { equals: false },
  );

  const store = createMemo(
    () => {
      i18nTrack();
      return i18n.store;
    },
    { equals: false },
  );

  const language = createMemo(() => {
    i18nTrack();
    return i18n.language;
  });

  // TODO: languages is an array. For now I'll just return as is. Maybe put it in a store later on?
  const languages = createMemo(
    () => {
      i18nTrack();
      return i18n.languages;
    },
    { equals: false },
  );

  const resolvedLanguage = createMemo(() => {
    i18nTrack();
    return i18n.resolvedLanguage;
  });

  const isInitialized = createMemo(() => {
    i18nTrack();
    return i18n.isInitialized;
  });

  const isInitializing = createMemo(() => {
    i18nTrack();
    return i18n.isInitializing;
  });

  const initializedStoreOnce = createMemo(() => {
    i18nTrack();
    return i18n.initializedStoreOnce;
  });

  const initializedLanguageOnce = createMemo(() => {
    i18nTrack();
    return i18n.initializedLanguageOnce;
  });

  const changeLanguage = async (
    lng?: string,
    callback?: Callback,
  ): Promise<TFunction> => {
    const tPromise = i18n.changeLanguage(lng, callback);
    i18nDirty();
    const t = await tPromise;
    i18nDirty();
    return t;
  };

  const hasLoadedNamespace = (
    ...args: Parameters<i18n["hasLoadedNamespace"]>
  ) => {
    return i18n.hasLoadedNamespace(...args);
  };

  const loadLanguages = async (...args: Parameters<i18n["loadLanguages"]>) => {
    const promise = i18n.loadLanguages(...args);
    i18nDirty();
    await promise;
    i18nDirty();
  };

  const loadNamespaces = async (
    ...args: Parameters<i18n["loadNamespaces"]>
  ) => {
    const promise = i18n.loadNamespaces(...args);
    i18nDirty();
    await promise;
    i18nDirty();
  };

  const getFixedT = (...args: Parameters<i18n["getFixedT"]>) => {
    return i18n.getFixedT(...args);
  };

  const on = (...args: Parameters<i18n["on"]>) => {
    i18n.on(...args);
  };

  const off = (...args: Parameters<i18n["off"]>) => {
    i18n.off(...args);
  };

  return {
    get modules() {
      return modules();
    },
    get services() {
      return services();
    },
    get store() {
      return store();
    },
    get language() {
      return language();
    },
    get languages() {
      return languages();
    },
    get resolvedLanguage() {
      return resolvedLanguage();
    },
    get isInitialized() {
      return isInitialized();
    },
    get isInitializing() {
      return isInitializing();
    },
    get initializedStoreOnce() {
      return initializedStoreOnce();
    },
    get initializedLanguageOnce() {
      return initializedLanguageOnce();
    },
    changeLanguage,
    hasLoadedNamespace,
    loadLanguages,
    loadNamespaces,
    getFixedT,
    on,
    off,
  };
};
