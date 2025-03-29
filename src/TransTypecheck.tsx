import { type ComponentProps, type ValidComponent } from "solid-js";

import { Trans, type TransProps } from "./Trans";

export type TransDynamicGenericNode = {
  component?: ValidComponent;
  children?: TransDynamicGenericChildren;
};

export type TransDynamicGenericChildren = {
  [key: string]: TransDynamicGenericNode;
};

export type TransDynamicNodeDeep<
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
    ? { children: TransDynamicChildrenDeep<TBaseNode["children"]> }
    : { children?: Record<string, never> });

export type TransDynamicChildrenDeep<
  TBaseTree extends TransDynamicGenericChildren,
> = {
  [Slot in keyof TBaseTree]: TransDynamicNodeDeep<TBaseTree[Slot]>;
};

export interface TransTypecheckProps<
  TBaseTree extends TransDynamicGenericChildren,
> extends TransProps {
  dynamic?: TransDynamicChildrenDeep<TBaseTree>;
}

export const TransTypecheck = <TBaseTree extends TransDynamicGenericChildren>(
  props: TransTypecheckProps<TBaseTree>,
) => {
  return <Trans {...props} />;
};
