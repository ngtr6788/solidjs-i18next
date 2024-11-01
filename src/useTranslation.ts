import type { Callback, i18n, Namespace, TFunction } from "i18next";
import i18next from "i18next";
import {
  createEffect,
  createResource,
  onCleanup,
  untrack,
  useContext,
} from "solid-js";

import { I18nContext } from "./I18NextProvider.tsx";

function hasLoadedNamespace(
  i18n: i18n,
  namespace: string | readonly string[],
  lng: string | readonly string[] | undefined,
) {
  if (i18n.languages && i18n.languages.length) {
    return i18n.hasLoadedNamespace(namespace, { lng });
  } else {
    return true;
  }
}

function loadLanguages(
  i18n: i18n,
  lng: string | readonly string[],
  namespaces: string | readonly string[],
  callback: Callback,
) {
  const namespacesArray =
    typeof namespaces === "string" ? [namespaces] : namespaces;

  namespacesArray.forEach((namespace) => {
    if (i18n.options?.ns && i18n.options.ns.indexOf(namespace) < 0) {
      if (typeof i18n.options.ns === "string") {
        i18n.options.ns = [i18n.options.ns, namespace];
      } else {
        (i18n.options.ns as string[]).push(namespace);
      }
    }
  });

  i18n.loadLanguages(lng, callback);
}

function loadNamespaces(
  i18n: i18n,
  namespaces: string | readonly string[],
  callback: Callback,
) {
  i18n.loadNamespaces(namespaces, callback);
}

export interface UseTranslationOptions {
  keyPrefix?: string;
  lng?: string;
  ns?: Namespace<string>;
  useSuspense?: boolean;
  i18n?: i18n;
}

export function useTranslation(
  options: UseTranslationOptions = {},
): [TFunction, i18n] {
  const i18nContext = useContext(I18nContext);

  const i18n = options.i18n || i18nContext?.i18n || i18next;

  const keyPrefix = () => options.keyPrefix;

  const lng = () => options.lng;

  const ns = () => options.ns;

  const useSuspense = () => options.useSuspense ?? true;

  const namespaces = () => {
    const nsInit = ns() || i18nContext?.ns || i18n.options?.defaultNS;
    return typeof nsInit === "string" ? [nsInit] : nsInit || ["translation"];
  };

  const getT = () => {
    return i18n.getFixedT(lng() || null, namespaces(), keyPrefix());
  };

  const ready = () =>
    (i18n.isInitialized || i18n.initializedStoreOnce) &&
    namespaces().every((ns) =>
      hasLoadedNamespace(i18n, ns, lng() || undefined),
    );

  const loadLanguageNamespaces = (callback: Callback) => {
    const language = lng();
    if (language) {
      loadLanguages(i18n, language, namespaces(), callback);
    } else {
      loadNamespaces(i18n, namespaces(), callback);
    }
  };

  const loadLngNsT = async (): Promise<ReturnType<typeof getT>> => {
    if (!ready() && untrack(useSuspense)) {
      return await new Promise((resolve) =>
        loadLanguageNamespaces(() => resolve(getT())),
      );
    } else {
      return getT();
    }
  };

  const [translate, { mutate: setTranslate, refetch }] = createResource(
    loadLngNsT,
    { initialValue: getT() },
  );

  createEffect(() => {
    if (!ready()) {
      if (untrack(useSuspense)) {
        refetch();
      } else {
        loadLanguageNamespaces(() => setTranslate(() => getT()));
      }
    }
  });

  createEffect((prevNamespaces: readonly string[]) => {
    const differentNamespaces =
      prevNamespaces.length !== namespaces().length ||
      namespaces().some((val, i) => val !== prevNamespaces[i]);

    if (ready() && differentNamespaces) {
      setTranslate(() => getT());
    }

    return namespaces();
  }, []);

  createEffect((prevLng) => {
    if (ready() && prevLng !== lng()) {
      setTranslate(() => getT());
    }

    return lng();
  }, "");

  createEffect((prevKeyPrefix) => {
    if (ready() && prevKeyPrefix !== keyPrefix()) {
      setTranslate(() => getT());
    }

    return keyPrefix();
  }, "");

  createEffect(() => {
    const resetT = () => {
      setTranslate(() => getT());
    };

    if (i18n) {
      i18n.on("languageChanged", resetT);
    }

    onCleanup(() => {
      i18n.off("languageChanged", resetT);
    });
  });

  // @ts-expect-error Property '$TFunctionBrand' is missing in type... TODO: Deal with this
  const t: TFunction = (...args) => translate()(...args);

  return [t, i18n];
}
