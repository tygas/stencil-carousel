import type { Components, JSX } from "../dist/types/components";

interface StencilCarousel extends Components.StencilCarousel, HTMLElement {}
export const StencilCarousel: {
  prototype: StencilCarousel;
  new (): StencilCarousel;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
