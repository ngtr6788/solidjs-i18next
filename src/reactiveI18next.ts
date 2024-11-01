/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Callback,
  CloneOptions,
  InitOptions,
  KeyPrefix,
  Module,
  Namespace,
  Newable,
  NewableModule,
  TFunction,
} from "i18next";
import i18next, { type i18n } from "i18next";
import { createTrigger } from "@solid-primitives/trigger";
import { createEffect, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { I18nContext } from "./I18NextProvider";

class ReactiveI18n implements i18n {
  #i18n: i18n;
  #i18nTrack: VoidFunction;
  #i18nDirty: VoidFunction;
  #i18nStore;

  constructor(i18n: i18n) {
    const [track, dirty] = createTrigger();
    this.#i18n = i18n ?? i18next;
    this.#i18nTrack = track;
    this.#i18nDirty = dirty;

    const [i18nStore, setI18nStore] = createStore({
      language: this.#i18n.language,
      languages: this.#i18n.languages,
      resolvedLanguage: this.#i18n.resolvedLanguage,
      isInitialized: this.#i18n.isInitialized,
      isInitializing: this.#i18n.isInitializing,
      initializedStoreOnce: this.#i18n.initializedStoreOnce,
      initializedLanguageOnce: this.#i18n.initializedLanguageOnce,
    });
    this.#i18nStore = i18nStore;

    createEffect(() => {
      this.#i18nTrack();

      setI18nStore(
        produce((i18nStore) => {
          i18nStore.language = this.#i18n.language;
          i18nStore.languages = this.#i18n.languages;
          i18nStore.isInitialized = this.#i18n.isInitialized;
          i18nStore.isInitializing = this.#i18n.isInitializing;
          i18nStore.initializedStoreOnce = this.#i18n.initializedStoreOnce;
          i18nStore.initializedLanguageOnce =
            this.#i18n.initializedLanguageOnce;
        }),
      );
    });
  }

  // @ts-expect-error TSFunctionBrand issue
  t(...args: Parameters<i18n["t"]>) {
    this.#i18nTrack();
    return this.#i18n.t(...args);
  }

  init<T>(options: InitOptions<T>, callback?: Callback): Promise<TFunction>;
  init(callback?: Callback): Promise<TFunction>;

  async init(optionsOrCallback: any, callback?: Callback) {
    const t = await this.#i18n.init(optionsOrCallback, callback);
    this.#i18nDirty();
    return t;
  }

  loadResources(callback?: (err: any) => void): void {
    this.#i18nDirty();
    return this.#i18n.loadResources(callback);
  }

  use<T extends Module>(module: T | NewableModule<T> | Newable<T>): this {
    this.#i18nDirty();
    return this.use(module);
  }

  get modules() {
    this.#i18nTrack();
    return this.#i18n.modules;
  }

  get services() {
    this.#i18nTrack();
    return this.#i18n.services;
  }

  get store() {
    this.#i18nTrack();
    return this.#i18n.store;
  }

  exists(...args: Parameters<i18n["exists"]>) {
    this.#i18nTrack();
    return this.#i18n.exists(...args);
  }

  getDataByLanguage(
    lng: string,
  ): { [key: string]: { [key: string]: string } } | undefined {
    this.#i18nTrack();
    return this.#i18n.getDataByLanguage(lng);
  }

  getFixedT<
    Ns extends Namespace | null = "translation",
    TKPrefix extends KeyPrefix<ActualNs> = undefined,
    ActualNs extends Namespace = Ns extends null ? "translation" : Ns,
  >(
    ...args:
      | [lng: string | readonly string[], ns?: Ns, keyPrefix?: TKPrefix]
      | [lng: null, ns: Ns, keyPrefix?: TKPrefix]
  ): TFunction<ActualNs, TKPrefix> {
    this.#i18nTrack();
    return this.#i18n.getFixedT(...args);
  }

  async changeLanguage(lng?: string, callback?: Callback): Promise<TFunction> {
    const t = await this.#i18n.changeLanguage(lng, callback);
    this.#i18nDirty();
    return t;
  }

  get language() {
    return this.#i18nStore.language;
  }

  get languages() {
    return this.#i18nStore.languages;
  }

  get resolvedLanguage() {
    return this.#i18nStore.resolvedLanguage;
  }

  hasLoadedNamespace(
    ns: string | readonly string[],
    options?: {
      lng?: string | readonly string[];
      fallbackLng?: InitOptions["fallbackLng"];
      precheck?: (
        i18n: i18n,
        loadNotPending: (
          lng: string | readonly string[],
          ns: string | readonly string[],
        ) => boolean,
      ) => boolean | undefined;
    },
  ): boolean {
    this.#i18nTrack();
    return this.#i18n.hasLoadedNamespace(ns, options);
  }

  async loadNamespaces(
    ns: string | readonly string[],
    callback?: Callback,
  ): Promise<void> {
    await this.#i18n.loadNamespaces(ns, callback);
    this.#i18nDirty();
  }

  async loadLanguages(
    lngs: string | readonly string[],
    callback?: Callback,
  ): Promise<void> {
    await this.#i18n.loadLanguages(lngs, callback);
    this.#i18nDirty();
  }

  reloadResources(
    lngs?: string | readonly string[],
    ns?: string | readonly string[],
    callback?: () => void,
  ): Promise<void>;

  async reloadResources(
    lngs: null,
    ns: string | readonly string[],
    callback?: () => void,
  ): Promise<void>;

  async reloadResources(
    lngs: any,
    ns: any,
    callback?: () => void,
  ): Promise<void> {
    await this.#i18n.reloadResources(lngs, ns, callback);
    this.#i18nDirty();
  }

  setDefaultNamespace(ns: string): void {
    this.#i18n.setDefaultNamespace(ns);
    this.#i18nDirty();
  }

  dir(lng?: string): "ltr" | "rtl" {
    this.#i18nTrack();
    return this.#i18n.dir(lng);
  }

  format(...args: Parameters<i18n["format"]>) {
    this.#i18nTrack();
    return this.#i18n.format(...args);
  }

  createInstance(options?: InitOptions, callback?: Callback): i18n {
    return this.#i18n.createInstance(options, callback);
  }

  createReactiveInstance(
    options?: InitOptions,
    callback?: Callback,
  ): ReactiveI18n {
    const newI18n = this.#i18n.createInstance(options, callback);
    const reactiveI18n = new ReactiveI18n(newI18n);
    return reactiveI18n;
  }

  cloneInstance(options?: CloneOptions, callback?: Callback): i18n {
    return this.#i18n.cloneInstance(options, callback);
  }

  cloneReactiveInstance(
    options?: CloneOptions,
    callback?: Callback,
  ): ReactiveI18n {
    const newI18n = this.#i18n.cloneInstance(options, callback);
    const reactiveI18n = new ReactiveI18n(newI18n);
    return reactiveI18n;
  }

  on(
    event: Parameters<i18n["on"]>[0],
    listener: Parameters<i18n["on"]>[1],
  ): void {
    return this.#i18n.on(event, listener);
  }

  off(
    event: Parameters<i18n["off"]>[0],
    listener: Parameters<i18n["off"]>[1],
  ): void {
    return this.#i18n.off(event, listener);
  }

  getResource(
    lng: string,
    ns: string,
    key: string,
    options?: Pick<InitOptions, "keySeparator" | "ignoreJSONStructure">,
  ) {
    this.#i18nTrack();
    return this.#i18n.getResource(lng, ns, key, options);
  }

  addResource(
    lng: string,
    ns: string,
    key: string,
    value: string,
    options?: { keySeparator?: string; silent?: boolean },
  ): i18n {
    const i18n = this.#i18n.addResource(lng, ns, key, value, options);
    this.#i18nDirty();
    return i18n;
  }

  addResources(lng: string, ns: string, resources: any): i18n {
    const i18n = this.#i18n.addResources(lng, ns, resources);
    this.#i18nDirty();
    return i18n;
  }

  addResourceBundle(
    lng: string,
    ns: string,
    resources: any,
    deep?: boolean,
    overwrite?: boolean,
  ): i18n {
    const i18n = this.#i18n.addResourceBundle(
      lng,
      ns,
      resources,
      deep,
      overwrite,
    );
    this.#i18nDirty();
    return i18n;
  }

  hasResourceBundle(lng: string, ns: string): boolean {
    this.#i18nTrack();
    return this.#i18n.hasResourceBundle(lng, ns);
  }

  getResourceBundle(lng: string, ns: string) {
    this.#i18nTrack();
    return this.#i18n.getResourceBundle(lng, ns);
  }

  removeResourceBundle(lng: string, ns: string): i18n {
    const i18n = this.#i18n.removeResourceBundle(lng, ns);
    this.#i18nDirty();
    return i18n;
  }

  get options() {
    this.#i18nTrack();
    return this.#i18n.options;
  }

  get isInitialized() {
    return this.#i18nStore.isInitialized;
  }

  get isInitializing() {
    return this.#i18nStore.isInitializing;
  }

  get initializedStoreOnce() {
    return this.#i18nStore.initializedStoreOnce;
  }

  get initializedLanguageOnce() {
    return this.#i18nStore.initializedLanguageOnce;
  }

  emit(eventName: string, ...args: any[]): void {
    return this.#i18n.emit(eventName, ...args);
  }
}

export const createReactiveI18n = (i18n?: i18n) => {
  const i18nContext = useContext(I18nContext);
  const workingI18n = i18n || i18nContext?.i18n || i18next;
  const reactiveI18n = new ReactiveI18n(workingI18n);

  return reactiveI18n;
};
