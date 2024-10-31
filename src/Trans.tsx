import i18next, { type i18n, type TFunction } from "i18next";
import {
  children,
  type Component,
  type JSXElement,
  Show,
  useContext,
} from "solid-js";
import { type IDom, parse } from "html-parse-string";
import { I18nContext } from "./I18NextProvider.tsx";

type TransChild = JSXElement | Record<string, unknown>;

interface TransProps {
  i18nKey?: string;
  count?: number;
  context?: string;
  values?: Record<string, unknown>;
  ns?: string | string[];
  defaultValue?: string;
  components?: readonly JSXElement[] | Record<string, JSXElement>;
  children?: TransChild | readonly TransChild[];
  t?: TFunction;
  i18n?: i18n;
}

export const Trans: Component<TransProps> = (props) => {
  // @ts-expect-error Type 'TransChild | readonly TransChild[]' is not assignable to type 'Element'.
  const c = children(() => props.children);

  const childrenArray = () => c.toArray();

  const i18nContext = useContext(I18nContext);

  const i18n = props.i18n || i18nContext?.i18n || i18next;

  const t = () => props.t || i18n.t.bind(i18n);

  const namespaces = () => {
    const namespaces = props.ns || i18nContext?.ns || i18n.options?.defaultNS;
    const namespacesArray =
      typeof namespaces === "string"
        ? [namespaces]
        : namespaces || ["translation"];
    return namespacesArray;
  };

  const keepArray = ["br", "strong", "i", "p"];
  const keepRegex = new RegExp(keepArray.map((keep) => `<${keep}`).join("|"));

  const nodesToString = (nodes: TransChild[]): string => {
    let stringNode = "";

    nodes.forEach((node, i) => {
      if (typeof node === "string") {
        stringNode += `${node}`;
      } else if (node instanceof Element) {
        if (node.nodeType === Node.TEXT_NODE) {
          stringNode += `${node.textContent}`;
        } else {
          const nodeName = node.nodeName.toLocaleLowerCase();
          const shouldKeepChild = keepArray.includes(nodeName);
          const nodeChildren = node.childNodes;
          const attributeLen = node.attributes.length;

          if (nodeChildren.length === 0) {
            if (shouldKeepChild && attributeLen === 0) {
              stringNode += `<${nodeName} />`;
            } else {
              stringNode += `<${i}></${i}>`;
            }
          } else {
            if (
              shouldKeepChild &&
              nodeChildren.length === 1 &&
              nodeChildren[0].nodeType === Node.TEXT_NODE
            ) {
              stringNode += `<${nodeName}>${nodeChildren[0].textContent}</${nodeName}>`;
            } else {
              const content = nodesToString([...nodeChildren]);
              stringNode += `<${i}>${content}</${i}>`;
            }
          }
        }
      } else if (typeof node === "object") {
        const { format, ...clone } = node as {
          format?: string;
          [key: string]: unknown;
        };
        const keys = Object.keys(clone);

        if (keys.length === 1) {
          const value = format ? `${keys[0]}, ${format}` : keys[0];
          stringNode += `{{${value}}}`;
        }
      }
    });

    return stringNode;
  };

  const nodesAsString = () => nodesToString(childrenArray());

  const defaultValue = () =>
    props.defaultValue || nodesAsString() || props.i18nKey;

  const key = () => props.i18nKey || nodesAsString() || defaultValue();

  const values = () => {
    const defaultVariables = i18n.options?.interpolation?.defaultVariables;
    if (defaultVariables) {
      return props.values && Object.keys(props.values).length > 0
        ? { ...props.values, ...defaultVariables }
        : { ...defaultVariables };
    } else {
      return props.values;
    }
  };

  const tOpts = () => {
    return {
      context: props.context,
      count: props.count,
      ...values(),
      defaultValue: defaultValue(),
      ns: namespaces(),
    };
  };

  const translation = () => {
    const k = key();
    return k ? t()(k, tOpts()) : defaultValue();
  };

  const emptyChildrenButNeedsHandling = () => {
    const translateStr = translation();
    return translateStr && keepRegex.test(translateStr);
  };

  const components = () => props.components ?? childrenArray();

  const ast = () => parse(`<0>${translation()}</0>`);

  const opts = () => {
    const data = {};

    const comps = components() as { [key: string | number]: JSXElement };
    if (comps) {
      Object.keys(comps).forEach((key) => {
        const child = comps[key];
        if (typeof child === "object" && !(child instanceof Node)) {
          Object.assign(data, child);
        }
      });
    }

    return { ...data, ...tOpts() };
  };

  const buildContent = (
    jsxNodes: readonly JSXElement[] | Record<string, JSXElement>,
    astNodes: IDom[],
  ) => {
    return astNodes.reduce(
      (mem, node) => {
        if (node.type === "text") {
          const content = i18n.services.interpolator.interpolate(
            node.content || "",
            opts(),
            i18n.language,
            {},
          );
          mem.push(content);
        } else if (node.type === "tag") {
          const nodes = jsxNodes as {
            [key: string | number]: JSXElement;
          };
          const child =
            nodes[parseInt(node.name, 10)] ?? nodes[node.name] ?? {};

          if (typeof child === "string") {
            const value = i18n.services.interpolator.interpolate(
              child,
              opts(),
              i18n.language,
              {},
            );
            mem.push(value);
          } else if (child instanceof Element) {
            if (child.nodeType === Node.TEXT_NODE) {
              const value = i18n.services.interpolator.interpolate(
                child.textContent ?? "",
                opts(),
                i18n.language,
                {},
              );
              mem.push(value);
            } else {
              const childChildren = buildContent(
                [...child.childNodes],
                node.children,
              );
              if (childChildren.length === 0 && child.hasChildNodes()) {
                const childDeepClone = child.cloneNode(true) as Element;
                mem.push(childDeepClone);
              } else {
                const childShallowClone = child.cloneNode(false) as Element;
                childShallowClone.replaceChildren(...childChildren);
                mem.push(childShallowClone);
              }
            }
          } else if (Number.isNaN(parseFloat(node.name))) {
            if (keepArray.includes(node.name)) {
              const elem = document.createElement(node.name);
              if (node.voidElement) {
                mem.push(elem);
              } else {
                const childChildren = buildContent([], node.children);
                elem.replaceChildren(...childChildren);
                mem.push(elem);
              }
            } else if (node.voidElement) {
              mem.push(`<${node.name}></${node.name}>`);
            } else {
              const inner = buildContent([], node.children)
                .map((x) => (typeof x === "string" ? x : x.outerHTML))
                .join();
              mem.push(`<${node.name}>${inner}</${node.name}>`);
            }
          } else if (typeof child === "object" && !(child instanceof Element)) {
            const nodeContent = node.children?.[0]?.content;
            const translationContent = i18n.services.interpolator.interpolate(
              nodeContent ?? "",
              opts(),
              i18n.language,
              {},
            );

            if (translationContent) {
              mem.push(translationContent);
            }
          } else {
            // TODO: What case would lead us here?
          }
        }
        return mem;
      },
      [] as (string | Element)[],
    );
  };

  const content = () => {
    return buildContent(components(), ast()[0].children);
  };

  return (
    <Show when={translation()}>
      <Show
        when={components() || emptyChildrenButNeedsHandling()}
        fallback={translation()}
      >
        {content()}
      </Show>
    </Show>
  );
};
