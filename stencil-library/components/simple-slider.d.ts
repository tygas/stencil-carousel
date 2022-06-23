import type { Components, JSX } from "../dist/types/components";

interface SimpleSlider extends Components.SimpleSlider, HTMLElement {}
export const SimpleSlider: {
  prototype: SimpleSlider;
  new (): SimpleSlider;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
