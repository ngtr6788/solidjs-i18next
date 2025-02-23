import { type ParentComponent } from "solid-js";

/**
 * A convience component that stacks its children without adding any extra elements
 */
export const Fragment: ParentComponent = (props) => <>{props.children}</>;
