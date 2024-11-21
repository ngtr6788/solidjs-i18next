import { ReactiveMap } from "@solid-primitives/map";
import i18next, { type i18n } from "i18next";
import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  useContext,
} from "solid-js";

import { I18N_LISTENERS, I18N_STORE_LISTENERS } from "./constants";
import { I18nContext } from "./I18NextProvider";

export const createReactiveI18n = (
  propI18n?: i18n,
): Omit<i18n, "createInstance" | "cloneInstance"> => {
  const i18nContext = useContext(I18nContext);
  const i18n = propI18n || i18nContext?.i18n || i18next;

  // @ts-expect-error This checks if the i18n passed in is already reactive
  if (i18n.__isReactiveI18n__ === true) {
    return i18n;
  }

  const [i18nTrack, i18nDirty] = createSignal(undefined, { equals: false });

  // NOTE TO SELF: Attributes are just signals that return the items as is FOR NOW.
  // TODO: I could put it in a store later on. No guarantees though.

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
  // However, this causes reaction even when no change took place
  // TODO: Add a deep comparison or store or something IDK
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

  const init = i18n.init.bind(i18n);

  const use = i18n.use.bind(i18n);

  // const createInstance = (...args: Parameters<i18n["createInstance"]>) => {
  //   const newI18n = i18n.createInstance(...args);
  //   const reactiveI18n = createReactiveI18n(newI18n);
  //   return reactiveI18n;
  // };
  //
  // const cloneInstance = (...args: Parameters<i18n["cloneInstance"]>) => {
  //   const newI18n = i18n.cloneInstance(...args);
  //   const reactiveI18n = createReactiveI18n(newI18n);
  //   return reactiveI18n;
  // };

  const changeLanguage = i18n.changeLanguage.bind(i18n);

  const setDefaultNamespace = i18n.setDefaultNamespace.bind(i18n);

  const loadLanguages = i18n.loadLanguages.bind(i18n);

  const loadNamespaces = i18n.loadNamespaces.bind(i18n);

  const loadResources = i18n.loadResources.bind(i18n);

  const reloadResources = i18n.reloadResources.bind(i18n);

  const getDataByLanguage = createReactiveMethod(
    i18n.getDataByLanguage.bind(i18n),
  );

  const exists = createReactiveMemoizedMethod(i18n.exists.bind(i18n));

  const hasLoadedNamespace = createReactiveMemoizedMethod(
    i18n.hasLoadedNamespace.bind(i18n),
  );

  const dir = createReactiveMethod(i18n.dir.bind(i18n));

  const t = createReactiveMemoizedMethod(i18n.t.bind(i18n));

  const getFixedT = createReactiveMemoizedMethod(i18n.getFixedT.bind(i18n));

  const getResource = createReactiveMethod(i18n.getResource.bind(i18n));

  const addResource = i18n.addResource.bind(i18n);

  const addResources = i18n.addResources.bind(i18n);

  const addResourceBundle = i18n.addResourceBundle.bind(i18n);

  const hasResourceBundle = createReactiveMemoizedMethod(
    i18n.hasResourceBundle.bind(i18n),
  );

  const getResourceBundle = createReactiveMethod(
    i18n.getResourceBundle.bind(i18n),
  );

  const removeResourceBundle = i18n.removeResourceBundle.bind(i18n);

  const on = i18n.on.bind(i18n);

  const off = i18n.off.bind(i18n);

  const emit = i18n.emit.bind(i18n);

  createEffect(() => {
    I18N_LISTENERS.forEach((event) => {
      i18n.on(event, i18nDirty);
    });

    I18N_STORE_LISTENERS.forEach((event) => {
      i18n.store.on(event, i18nDirty);
    });

    onCleanup(() => {
      I18N_LISTENERS.forEach((event) => {
        i18n.off(event, i18nDirty);
      });

      I18N_STORE_LISTENERS.forEach((event) => {
        i18n.store.off(event, i18nDirty);
      });
    });
  });

  const reactiveI18n = {
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
    init,
    use,
    // createInstance,
    // cloneInstance,
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
    reloadResources,
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
