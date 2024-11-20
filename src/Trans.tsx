import { type IDom, parse } from "html-parse-string";
import type { i18n, TFunction, TOptions, TOptionsBase } from "i18next";
import i18next from "i18next";
import {
  type Component,
  type JSXElement,
  mergeProps,
  Show,
  splitProps,
  untrack,
  useContext,
  type ValidComponent,
} from "solid-js";
import { Dynamic, type DynamicProps } from "solid-js/web";

import { I18nContext } from "./I18NextProvider.tsx";

export type TransDynamic<T extends ValidComponent> = DynamicProps<T> & {
  children?: TransDynamicIndexable;
};

export type TransDynamicIndexable =
  | Array<TransDynamic<ValidComponent>>
  | {
      [key: string | number]: TransDynamic<ValidComponent>;
    };

export interface TransProps {
  i18nKey?: string;

  /* t function options */
  count?: number;
  context?: string;
  ns?: string | string[];
  defaultValue?: string;
  tOptions?: TOptionsBase;
  values?: Record<string, unknown>;

  /* Use the HTMLs and Components thing */
  dynamic?: TransDynamicIndexable;

  /* Use custom t or i18n */
  t?: TFunction;
  i18n?: i18n;
}

export const Trans: Component<TransProps> = (props) => {
  const i18nContext = useContext(I18nContext);

  const i18n = () => props.i18n || i18nContext?.i18n || i18next;

  const t = () => props.t || i18n().t.bind(i18n());

  const namespaces = () => {
    const namespaces = props.ns || i18n().options?.defaultNS;
    const namespacesArray =
      typeof namespaces === "string"
        ? [namespaces]
        : namespaces || ["translation"];
    return namespacesArray;
  };

  const keepArray = ["br", "strong", "i", "p"];
  const keepRegex = new RegExp(keepArray.map((keep) => `<${keep}`).join("|"));

  const defaultValue = () => props.defaultValue || props.i18nKey;

  const key = () => props.i18nKey || defaultValue();

  const values = () => {
    const defaultVariables = i18n().options?.interpolation?.defaultVariables;
    const combinedValues = mergeProps(props.values, defaultVariables);
    return combinedValues;
  };

  const tOpts = (): TOptions => {
    const combinedTOpts = mergeProps(
      props.tOptions,
      {
        context: props.context || props.tOptions?.context,
        count: props.count,
      },
      values(),
      {
        defaultValue: defaultValue(),
        ns: namespaces(),
      },
    );

    return combinedTOpts;
  };

  const translation = () => {
    const k = key();
    return k ? t()(k, tOpts()) : defaultValue();
  };

  const emptyChildrenButNeedsHandling = () => {
    const translateStr = translation();
    return translateStr && keepRegex.test(translateStr);
  };

  const ast = () => parse(`<0>${translation()}</0>`);

  const interpolate = (content: string | undefined | null) => {
    const i18nInstance = untrack(i18n);
    const translateOpts = untrack(tOpts);

    return i18nInstance.services.interpolator.interpolate(
      content ?? "",
      translateOpts,
      i18nInstance.language,
      {},
    );
  };

  const buildContent = (
    astNodes: IDom[],
    dynamic?: TransDynamicIndexable | undefined,
  ) => {
    return astNodes.reduce(
      (mem, node) => {
        if (node.type === "text") {
          const content = interpolate(node.content);
          mem.push(content);
        } else if (node.type === "tag") {
          const dynNodes = dynamic as
            | {
                [key: string | number]: TransDynamic<ValidComponent>;
              }
            | undefined;
          const child =
            dynNodes?.[parseInt(node.name, 10)] ?? dynNodes?.[node.name];

          const nodeAttrs: Record<string, string> = {};
          for (const attr of node.attrs) {
            nodeAttrs[attr.name] = attr.value;
          }

          if (child) {
            const [cc, childProps] = splitProps(child, [
              "component",
              "children",
            ]);
            const finalProps = mergeProps(nodeAttrs, childProps);

            mem.push(
              <Dynamic
                component={cc.component}
                {...finalProps}
                children={buildContent(node.children, cc.children)}
              />,
            );
          } else if (Number.isNaN(parseFloat(node.name))) {
            if (keepArray.includes(node.name)) {
              mem.push(
                <Dynamic
                  component={node.name}
                  {...nodeAttrs}
                  children={
                    node.voidElement ? undefined : buildContent(node.children)
                  }
                />,
              );
            } else if (node.voidElement) {
              mem.push(`<${node.name}></${node.name}>`);
            } else {
              const inner = buildContent(node.children)
                .map((x) => {
                  if (x instanceof Element) {
                    return x.outerHTML;
                  } else {
                    return x;
                  }
                })
                .join();
              mem.push(`<${node.name}>${inner}</${node.name}>`);
            }
          } else {
            mem.push(buildContent(node.children));
          }
        }
        return mem;
      },
      [] as (string | JSXElement)[],
    );
  };

  const content = () => {
    return buildContent(ast()[0]!.children, props.dynamic);
  };

  return (
    <Show when={translation()}>
      <Show
        when={props.dynamic ?? emptyChildrenButNeedsHandling()}
        fallback={translation()}
      >
        {content()}
      </Show>
    </Show>
  );
};
