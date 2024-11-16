import { ReactiveMap } from "@solid-primitives/map";
import i18next, { type Callback, type i18n, type TFunction } from "i18next";
import { createEffect, createMemo, createSignal, useContext } from "solid-js";

import { I18nContext } from "./I18NextProvider";

export const createReactiveI18n = (propI18n?: i18n): i18n => {
  const i18nContext = useContext(I18nContext);
  const i18n = propI18n || i18nContext?.i18n || i18next;

  // @ts-expect-error This checks if the i18n passed in is already reactive
  if (i18n.__isReactiveI18n__ === true) {
    return i18n;
  }

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

  const options = createMemo(
    () => {
      i18nTrack();
      return i18n.options;
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
      for (const key of cache.keys()) {
        const args = JSON.parse(key) as P;
        cache.set(key, fn(...args));
      }
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

  const init = async (...args: Parameters<i18n["init"]>) => {
    const t = await i18n.init(...args);
    i18nDirty();
    return t;
  };

  const use = (...args: Parameters<i18n["use"]>) => {
    i18n.use(...args);
    i18nDirty();
    return reactiveI18n;
  };

  const createInstance = (...args: Parameters<i18n["createInstance"]>) => {
    const newI18n = i18n.createInstance(...args);
    const reactiveI18n = createReactiveI18n(newI18n);
    return reactiveI18n;
  };

  const cloneInstance = (...args: Parameters<i18n["cloneInstance"]>) => {
    const newI18n = i18n.cloneInstance(...args);
    const reactiveI18n = createReactiveI18n(newI18n);
    return reactiveI18n;
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
    i18n.addResource(...args);
    i18nDirty();
    return reactiveI18n;
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

  const reactiveI18n = {
    __isReactiveI18n__: true,
    get modules() {
      return modules();
    },
    get services() {
      return services();
    },
    get options() {
      return options();
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
    init: init as i18n["init"],
    use,
    createInstance,
    cloneInstance,
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

  return reactiveI18n;
};
