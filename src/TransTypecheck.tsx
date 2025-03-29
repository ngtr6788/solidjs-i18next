import { type ComponentProps, type ValidComponent } from "solid-js";

import { Trans, type TransProps } from "./Trans";

export type TransDynamicGenericNode = {
  component?: ValidComponent;
  children?: TransDynamicGenericChildren;
};

export type TransDynamicGenericChildren = {
  [key: string]: TransDynamicGenericNode;
};

export type TransDynamicNode<
  TBaseNode extends TransDynamicGenericNode,
  TComponentProps = TBaseNode["component"] extends ValidComponent
    ? Omit<ComponentProps<TBaseNode["component"]>, "children">
    : never,
> = (TBaseNode["component"] extends ValidComponent
  ? { component: TBaseNode["component"]; props: TComponentProps }
  : {
      component?: undefined;
    }) &
  (TBaseNode["children"] extends TransDynamicGenericChildren
    ? { children: TransDynamicChildren<TBaseNode["children"]> }
    : { children?: Record<string, never> });

export type TransDynamicChildren<
  TBaseTree extends TransDynamicGenericChildren,
> = {
  [Slot in keyof TBaseTree]: TransDynamicNode<TBaseTree[Slot]>;
};

export interface TransTypecheckProps<
  TBaseTree extends TransDynamicGenericChildren,
> extends TransProps {
  dynamic?: TransDynamicChildren<TBaseTree>;
}

export const TransTypecheck = <TBaseTree extends TransDynamicGenericChildren>(
  props: TransTypecheckProps<TBaseTree>,
) => {
  return <Trans {...props} />;
};
