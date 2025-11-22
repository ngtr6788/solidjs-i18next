import HTML from "html-parse-stringify";
import type { i18n, TFunction, TOptions, TOptionsBase } from "i18next";
import i18next from "i18next";
import {
  type Component,
  type ComponentProps,
  type JSXElement,
  mergeProps,
  Show,
  untrack,
  useContext,
  type ValidComponent,
} from "solid-js";
import { Dynamic } from "solid-js/web";

import { I18nContext } from "./I18NextProvider.tsx";
import { type I18nextExtendedOptions } from "./initPlugin.ts";

export interface TransDynamicBasicNode {
  component?: ValidComponent;
  props?: Record<string, unknown>;
  children?: Record<string, TransDynamicBasicNode>;
}

export interface TransDynamicValidComponentNode<
  TComponent extends ValidComponent,
> extends TransDynamicBasicNode {
  component: TComponent;
  props: Omit<ComponentProps<TComponent>, "children">;
}

export interface TransDynamicEmptyComponentNode extends TransDynamicBasicNode {
  component?: undefined;
  props?: never;
}

export type TransDynamicNode<TComponent extends ValidComponent | undefined> =
  TComponent extends undefined
    ? TransDynamicEmptyComponentNode
    : TComponent extends ValidComponent
      ? TransDynamicValidComponentNode<TComponent>
      : never;

export function transDynamicNode<TComponent extends ValidComponent>(
  node: TransDynamicValidComponentNode<TComponent>,
): TransDynamicValidComponentNode<TComponent>;

export function transDynamicNode(
  node: TransDynamicEmptyComponentNode,
): TransDynamicEmptyComponentNode;

export function transDynamicNode<TComponent extends ValidComponent | undefined>(
  node: TransDynamicNode<TComponent>,
) {
  return node;
}

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
  dynamic?: Record<string, TransDynamicBasicNode>;

  /* Use custom t or i18n */
  t?: TFunction;
  i18n?: i18n;
}

export const Trans: Component<TransProps> = (props) => {
  const i18nContext = useContext(I18nContext);

  const i18n = () => props.i18n || i18nContext?.i18n || i18next;

  const t = () => props.t || i18n()!.t.bind(i18n());

  const namespaces = () => {
    const namespaces = props.ns || i18n()!.options?.defaultNS;
    const namespacesArray =
      typeof namespaces === "string"
        ? [namespaces]
        : namespaces || ["translation"];
    return namespacesArray;
  };

  const i18nOptions = () => i18n().options as I18nextExtendedOptions;

  const keepArray = () =>
    i18nOptions().solidjs.transKeepBasicHtmlNodesFor || [];

  const keepRegex = () =>
    new RegExp(
      keepArray()
        .map((keep) => `<${keep}`)
        .join("|"),
    );

  const defaultValue = () =>
    props.defaultValue ||
    i18nOptions().solidjs.transEmptyNodeValue ||
    props.i18nKey;

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
    return translateStr && keepRegex().test(translateStr);
  };

  const ast = () => HTML.parse(`<0>${translation()}</0>`) as HTML.TagNode[];

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
    astNodes: HTML.ASTNode[],
    dynamic?: Record<string, TransDynamicBasicNode> | undefined,
  ): JSXElement[] => {
    return astNodes.reduce((mem, node) => {
      if (node.type === "text") {
        const content = interpolate(node.content);
        mem.push(content);
      } else if (node.type === "tag") {
        const child =
          dynamic?.[parseInt(node.name, 10)] ?? dynamic?.[node.name];

        if (child) {
          if (child.component) {
            const finalProps = mergeProps(node.attrs, child.props);
            mem.push(
              <Dynamic
                component={child.component}
                {...finalProps}
                children={buildContent(node.children, child.children)}
              />,
            );
          } else {
            mem.push(
              `<${node.name}>`,
              buildContent(node.children, child.children),
              `</${node.name}>`,
            );
          }
        } else {
          if (keepArray().includes(node.name)) {
            mem.push(
              <Dynamic
                component={node.name}
                {...node.attrs}
                children={
                  node.voidElement ? undefined : buildContent(node.children)
                }
              />,
            );
          } else if (node.voidElement) {
            mem.push(`<${node.name} />`);
          } else {
            mem.push(
              `<${node.name}>`,
              buildContent(node.children),
              `</${node.name}>`,
            );
          }
        }
      }
      return mem;
    }, [] as JSXElement[]);
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
