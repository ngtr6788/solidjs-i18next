import { ReactiveMap } from "@solid-primitives/map";
import i18next, { type Callback, type i18n, type TFunction } from "i18next";
import { createEffect, createMemo, createSignal, useContext } from "solid-js";

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
  | "t"
  | "on"
  | "off";

/**
 * Remaining attributes and methods
 * - [ ] init
 * - [ ] loadResources
 * - [ ] use
 * - [ ] exists
 * - [ ] getDataByLanguage
 * - [x] getFixedT
 * - [ ] reloadResources
 * - [ ] setDefaultNamespace
 * - [ ] dir
 * - [ ] format
 * - [ ] createInstance
 * - [ ] cloneInstance
 * - [ ] getResource
 * - [ ] addResource
 * - [ ] addResources
 * - [ ] addResourceBundle
 * - [ ] hasResourceBundle
 * - [ ] removeResourceBundle
 * - [ ] emit
 */

/**
 * TODOs: Get a better "key" from arguments than JSON.stringify
 */

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
    const t = await tPromise;
    i18nDirty();
    return t;
  };

  const hasLoadedNamespaceCache = new ReactiveMap<string, boolean>();

  createEffect(() => {
    i18nTrack();
    hasLoadedNamespaceCache.keys().forEach((key) => {
      const args = JSON.parse(key) as Parameters<i18n["hasLoadedNamespace"]>;
      hasLoadedNamespaceCache.set(key, i18n.hasLoadedNamespace(...args));
    });
  });

  const hasLoadedNamespace = (
    ...args: Parameters<i18n["hasLoadedNamespace"]>
  ): boolean => {
    const key = JSON.stringify(args);
    const result = hasLoadedNamespaceCache.get(key);
    if (result === undefined) {
      const newResult = i18n.hasLoadedNamespace(...args);
      hasLoadedNamespaceCache.set(key, newResult);
      return newResult;
    }
    return result;
  };

  const loadLanguages = async (...args: Parameters<i18n["loadLanguages"]>) => {
    const promise = i18n.loadLanguages(...args);
    await promise;
    i18nDirty();
  };

  const loadNamespaces = async (
    ...args: Parameters<i18n["loadNamespaces"]>
  ) => {
    const promise = i18n.loadNamespaces(...args);
    await promise;
    i18nDirty();
  };

  const tCache = new ReactiveMap<string, string>();

  createEffect(() => {
    i18nTrack();
    tCache.keys().forEach((key) => {
      const args = JSON.parse(key) as Parameters<i18n["t"]>;
      tCache.set(key, i18n.t(...args));
    });
  });

  const t = (...args: Parameters<i18n["t"]>) => {
    const key = JSON.stringify(args);
    const result = tCache.get(key);
    if (result === undefined) {
      const originalResult = i18n.t(...args);
      tCache.set(key, originalResult);
      return originalResult;
    }
    return result;
  };

  const getFixedTCache = new ReactiveMap<
    string,
    ReturnType<i18n["getFixedT"]>
  >();

  createEffect(() => {
    i18nTrack();
    getFixedTCache.keys().forEach((key) => {
      const args = JSON.parse(key) as Parameters<i18n["getFixedT"]>;
      getFixedTCache.set(key, i18n.getFixedT(...args));
    });
  });

  const getFixedT = (...args: Parameters<i18n["getFixedT"]>) => {
    const key = JSON.stringify(args);
    const result = getFixedTCache.get(key);
    if (result === undefined) {
      const originalResult = i18n.getFixedT(...args);
      getFixedTCache.set(key, originalResult);
      return originalResult;
    }
    return result;
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
    // @ts-expect-error TFunctionBrand issue
    t,
    on,
    off,
  };
};
