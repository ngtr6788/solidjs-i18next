import {
  type Component,
  type ComponentProps,
  type JSX,
  type ValidComponent,
} from "solid-js";

import { type TransDynamicBasicChildren } from "./Trans";

export type TransDynamicGenericNode = {
  component?: ValidComponent;
  children?: TransDynamicGenericChildren;
};

export type TransDynamicGenericChildren = {
  [key: string]: TransDynamicGenericNode;
};

export type EmptyComponentTransDynamicNode = {
  component?: undefined;
  children?: TransDynamicBasicChildren;
};

export type NonEmptyComponentTransDynamicNode<
  TComponent extends ValidComponent,
  TComponentProps = Omit<ComponentProps<TComponent>, "children">,
> = {
  [Prop in keyof TComponentProps]: TComponentProps[Prop];
} & {
  component: TComponent;
  children?: TransDynamicBasicChildren;
};

export type TransDynamicNode<TComponent extends ValidComponent | undefined> =
  TComponent extends ValidComponent
    ? NonEmptyComponentTransDynamicNode<TComponent>
    : EmptyComponentTransDynamicNode;

export function transDynamicNodeTypecheck(
  node: EmptyComponentTransDynamicNode,
): EmptyComponentTransDynamicNode;

export function transDynamicNodeTypecheck<
  TComponent extends keyof JSX.IntrinsicElements,
>(
  node: NonEmptyComponentTransDynamicNode<TComponent>,
): NonEmptyComponentTransDynamicNode<TComponent>;

export function transDynamicNodeTypecheck<TComponent extends Component>(
  node: NonEmptyComponentTransDynamicNode<TComponent>,
): NonEmptyComponentTransDynamicNode<TComponent>;

export function transDynamicNodeTypecheck<
  TComponent extends ValidComponent | undefined,
>(node: TransDynamicNode<TComponent>) {
  return node;
}

export type TransDynamicChildren<
  TChildren extends {
    [key: string]: ValidComponent | undefined;
  },
> = {
  [TKey in keyof TChildren]: TransDynamicNode<TChildren[TKey]>;
};

export function transDynamicChildrenTypecheck<
  TChildren extends {
    [key: string]: ValidComponent | undefined;
  },
>(node: TransDynamicChildren<TChildren>): TransDynamicChildren<TChildren> {
  return node;
}

export type TransDynamicNodeDeep<
  TBaseNode extends TransDynamicGenericNode,
  TComponentProps = TBaseNode["component"] extends ValidComponent
    ? Omit<ComponentProps<TBaseNode["component"]>, "children">
    : never,
> = (TBaseNode["component"] extends ValidComponent
  ? {
      [Prop in keyof TComponentProps]: TComponentProps[Prop];
    } & {
      component: TBaseNode["component"];
    }
  : { component?: undefined }) &
  (TBaseNode["children"] extends TransDynamicBasicChildren
    ? { children: TransDynamicChildrenDeep<TBaseNode["children"]> }
    : { children?: Record<string, never> | undefined });

export function transDynamicNodeDeepTypecheck<
  TBaseNode extends TransDynamicGenericNode,
>(node: TransDynamicNodeDeep<TBaseNode>) {
  return node;
}

export type TransDynamicChildrenDeep<
  TBaseTree extends TransDynamicGenericChildren,
> = {
  [Slot in keyof TBaseTree]: TransDynamicNodeDeep<TBaseTree[Slot]>;
};

export function transDynamicChildrenDeepTypecheck<
  TBaseTree extends TransDynamicGenericChildren,
>(node: TransDynamicChildrenDeep<TBaseTree>) {
  return node;
}
