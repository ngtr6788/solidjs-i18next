import type { i18n, Namespace, TFunction } from "i18next";
import i18next from "i18next";
import {
  type Accessor,
  batch,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  useContext,
} from "solid-js";

import { I18nContext } from "./I18NextProvider.tsx";

function hasLoadedNamespace(
  i18n: i18n,
  namespace: string | readonly string[],
  lng: string | readonly string[] | undefined,
) {
  if (i18n.languages && i18n.languages.length) {
    return batch(() => i18n.hasLoadedNamespace(namespace, { lng }));
  } else {
    return true;
  }
}

export interface UseTranslationOptions {
  keyPrefix?: string;
  lng?: string;
  ns?: Namespace<string>;
  i18n?: i18n;
}

const I18N_LISTENERS = ["initialized", "languageChanged", "loaded"] as const;

const I18N_STORE_LISTENERS = ["added", "removed"] as const;

export function useTranslation(
  options: UseTranslationOptions = {},
): [TFunction, i18n, Accessor<boolean>] {
  const i18nContext = useContext(I18nContext);

  const i18n = options.i18n || i18nContext?.i18n || i18next;

  const lng = createMemo(() => options.lng || null);

  const keyPrefix = createMemo(() => options.keyPrefix);

  const namespaces = createMemo(
    () => {
      const nsInit = options.ns || i18n.options?.defaultNS;
      return typeof nsInit === "string" ? [nsInit] : nsInit || ["translation"];
    },
    [],
    {
      equals: (prevNamespaces, curNamespaces) =>
        prevNamespaces.length === curNamespaces.length &&
        curNamespaces.some((val, i) => val === prevNamespaces[i]),
    },
  );

  const [trackT, dirtyT] = createSignal(undefined, { equals: false });

  const ready = createMemo(() => {
    trackT();
    return (
      (Boolean(i18n.isInitialized) || Boolean(i18n.initializedStoreOnce)) &&
      namespaces().every((ns) =>
        hasLoadedNamespace(i18n, ns, options.lng || undefined),
      )
    );
  });

  createEffect(() => {
    I18N_LISTENERS.forEach((event) => {
      i18n.on(event, dirtyT);
    });

    I18N_STORE_LISTENERS.forEach((event) => {
      i18n.store.on(event, dirtyT);
    });

    onCleanup(() => {
      I18N_LISTENERS.forEach((event) => {
        i18n.off(event, dirtyT);
      });

      I18N_STORE_LISTENERS.forEach((event) => {
        i18n.store.off(event, dirtyT);
      });
    });
  });

  // @ts-expect-error Property '$TFunctionBrand' is missing in type... TODO: Deal with this
  const t: TFunction = (...args) => {
    trackT();
    const fixedT = i18n.getFixedT(lng(), namespaces(), keyPrefix());
    return fixedT(...args);
  };

  return [t, i18n, ready];
}
