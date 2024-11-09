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
  | "format"
  | "changeLanguage"
  | "setDefaultNamespace"
  | "hasLoadedNamespace"
  | "loadLanguages"
  | "loadNamespaces"
  | "exists"
  | "dir"
  | "getFixedT"
  | "t"
  | "on"
  | "off"
  | "emit"
  | "loadResources"
  | "reloadResources"
  | "getDataByLanguage"
  | "getResource"
  | "addResource"
  | "addResources"
  | "addResourceBundle"
  | "hasResourceBundle"
  | "getResourceBundle"
  | "removeResourceBundle";

/**
 * Remaining attributes and methods
 * - [ ] init
 * - [~] loadResources
 * - [ ] use
 * - [x] exists
 * - [~] getDataByLanguage
 * - [x] getFixedT
 * - [~] reloadResources
 * - [~] setDefaultNamespace
 * - [~] dir
 * - [~] format
 * - [ ] createInstance
 * - [ ] cloneInstance
 * - [x] getResource
 * - [x] addResource
 * - [x] addResources
 * - [x] addResourceBundle
 * - [x] hasResourceBundle
 * - [x] getResourceBundle
 * - [x] removeResourceBundle
 * - [x] emit
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

  const format = createMemo(() => {
    i18nTrack();
    return i18n.format;
  });

  const createReactiveMemoizedMethod = <P extends unknown[], R>(
    fn: (...args: P) => R,
  ): ((...args: P) => R) => {
    const cache = new ReactiveMap<string, R>();

    createEffect(() => {
      i18nTrack();
      cache.keys().forEach((key) => {
        const args = JSON.parse(key) as P;
        cache.set(key, fn(...args));
      });
    });

    const func = (...args: P): R => {
      const key = JSON.stringify(args);
      const result = cache.get(key);
      if (result === undefined) {
        const newResult = fn(...args);
        cache.set(key, newResult);
        return newResult;
      }
      return result;
    };

    return func;
  };

  // This method exists when the return value is not a primitive,
  // so that we can actually see the changes to the array/object/etc.
  const createReactiveMethod = <P extends unknown[], R>(
    fn: (...args: P) => R,
  ): ((...args: P) => R) => {
    const func = (...args: P): R => {
      i18nTrack();
      const result = fn(...args);
      return result;
    };

    return func;
  };

  const changeLanguage = async (
    lng?: string,
    callback?: Callback,
  ): Promise<TFunction> => {
    const tPromise = i18n.changeLanguage(lng, callback);
    const t = await tPromise;
    i18nDirty();
    return t;
  };

  const setDefaultNamespace = (
    ...args: Parameters<i18n["setDefaultNamespace"]>
  ) => {
    i18n.setDefaultNamespace(...args);
    i18nDirty();
  };

  const loadLanguages = async (...args: Parameters<i18n["loadLanguages"]>) => {
    await i18n.loadLanguages(...args);
    i18nDirty();
  };

  const loadNamespaces = async (
    ...args: Parameters<i18n["loadNamespaces"]>
  ) => {
    await i18n.loadNamespaces(...args);
    i18nDirty();
  };

  const loadResources = (...args: Parameters<i18n["loadResources"]>) => {
    i18n.loadResources(...args);
    i18nDirty();
  };

  const reloadResources = async (
    ...args: Parameters<i18n["reloadResources"]>
  ) => {
    await i18n.reloadResources(...args);
    i18nDirty();
  };

  const getDataByLanguage = createReactiveMethod(i18n.getDataByLanguage);

  const exists = createReactiveMemoizedMethod(i18n.exists);

  const hasLoadedNamespace = createReactiveMemoizedMethod(
    i18n.hasLoadedNamespace,
  );

  const dir = createReactiveMethod(i18n.dir);

  const t = createReactiveMemoizedMethod(i18n.t);

  const getFixedT = createReactiveMemoizedMethod(i18n.getFixedT);

  const getResource = createReactiveMethod(i18n.getResource);

  const addResource = (...args: Parameters<i18n["addResource"]>) => {
    const returnI18n = i18n.addResource(...args);
    i18nDirty();
    return returnI18n;
  };

  const addResources = (...args: Parameters<i18n["addResources"]>) => {
    const returnI18n = i18n.addResources(...args);
    i18nDirty();
    return returnI18n;
  };

  const addResourceBundle = (...args: Parameters<i18n["addResources"]>) => {
    const returnI18n = i18n.addResourceBundle(...args);
    i18nDirty();
    return returnI18n;
  };

  const hasResourceBundle = createReactiveMemoizedMethod(
    i18n.hasResourceBundle,
  );

  const getResourceBundle = createReactiveMethod(i18n.getResourceBundle);

  const removeResourceBundle = (
    ...args: Parameters<i18n["removeResourceBundle"]>
  ) => {
    const returnI18n = i18n.removeResourceBundle(...args);
    i18nDirty();
    return returnI18n;
  };

  const on = (...args: Parameters<i18n["on"]>) => {
    i18n.on(...args);
  };

  const off = (...args: Parameters<i18n["off"]>) => {
    i18n.off(...args);
  };

  const emit = (...args: Parameters<i18n["emit"]>) => {
    i18n.emit(...args);
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
    get format() {
      return format();
    },
    changeLanguage,
    setDefaultNamespace,
    hasLoadedNamespace,
    loadLanguages,
    loadNamespaces,
    getDataByLanguage,
    dir,
    exists,
    getFixedT,
    t: t as i18n["t"],
    on,
    off,
    emit,
    loadResources,
    reloadResources: reloadResources as i18n["reloadResources"],
    getResource,
    addResource,
    addResources,
    addResourceBundle,
    hasResourceBundle,
    getResourceBundle,
    removeResourceBundle,
  };
};
