declare module "*.jpg" {
  const value: any;
  export = value;
}

declare module "*.jpeg" {
  const value: any;
  export = value;
}

declare module "*.png" {
  const value: any;
  export = value;
}

declare module "*.gif" {
  const value: any;
  export = value;
}

declare module "@sanity/block-content-to-html" {
  const blocksToHtml: (options: Record<string, unknown>) => string;
  export default blocksToHtml;
}

declare module "@/stories/assets/scripts/triple-slider" {
  const createTripleSlider: (el: HTMLElement) => void;
  export default createTripleSlider;
}

declare module "*.svg" {
  const value: any;
  export = value;
}
declare module "doctrine" {
  // Replace `any` with more specific types if possible
  export function parse(src: string, options?: any): any;
}
