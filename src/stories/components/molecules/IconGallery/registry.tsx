/**
 * Icon registry. Every `Icons/<Name>Icon.tsx` module is discovered by a lazy
 * glob, so the icons stay out of the main bundle until something renders
 * them. Two ways to get an icon synchronously:
 *
 * - `registerIcons` puts components in the ready map up front. The
 *   `virtual:critical-icons` module (vite.config.js) does this for the icons
 *   the prerendered HTML contains (header and section titles), so hydration
 *   never suspends on them.
 * - `preloadIcons` awaits the lazy modules; the server entry preloads all of
 *   them before rendering to a string.
 *
 * Anything else renders through `<Icon>`, which suspends on first use and
 * shows a same-sized placeholder meanwhile.
 */
import type { IconProps } from "@/utils/types/icons";
import { type FC, Suspense, lazy } from "react";

type IconModule = { default: FC<IconProps> };

const loaders = import.meta.glob<IconModule>("./Icons/*Icon.tsx");

const nameOf = (path: string): string =>
  path
    .split("/")
    .pop()
    ?.replace(/\.tsx$/, "") ?? "";

const loaderByName: Record<string, () => Promise<IconModule>> =
  Object.fromEntries(
    Object.entries(loaders).map(([path, load]) => [nameOf(path), load]),
  );

/** Every icon component name (file name without extension), sorted. */
export const iconNames: string[] = Object.keys(loaderByName).sort();

export const hasIcon = (name: string): boolean => name in loaderByName;

const ready = new Map<string, FC<IconProps>>();
const lazies = new Map<string, FC<IconProps>>();

/** Makes already-imported icon components available synchronously. */
export const registerIcons = (icons: Record<string, FC<IconProps>>): void => {
  for (const [name, component] of Object.entries(icons)) {
    ready.set(name, component);
  }
};

/** Loads the named icons (all of them by default) into the ready map. */
export const preloadIcons = async (
  names: readonly string[] = iconNames,
): Promise<void> => {
  await Promise.all(
    names
      .filter((name) => loaderByName[name] && !ready.has(name))
      .map(async (name) => {
        const module = await loaderByName[name]();
        ready.set(name, module.default);
      }),
  );
};

/** The icon component if it is already loaded. */
export const getIcon = (name: string): FC<IconProps> | undefined =>
  ready.get(name);

const lazyIcon = (name: string): FC<IconProps> | undefined => {
  const load = loaderByName[name];
  if (!load) return undefined;
  let component = lazies.get(name);
  if (!component) {
    component = lazy(async () => {
      const module = await load();
      ready.set(name, module.default);
      return module;
    });
    lazies.set(name, component);
  }
  return component;
};

export interface IconComponentProps extends IconProps {
  /** Component name as stored in Sanity, e.g. `ReactIcon`. */
  name: string;
}

/** Same-sized inline box shown while an icon module loads. */
export const IconPlaceholder: FC<Pick<IconProps, "width" | "height">> = ({
  width = "1em",
  height = "1em",
}) => (
  <span
    className="icon-placeholder inline-block align-middle"
    style={{ width, height }}
    aria-hidden="true"
  />
);

/**
 * Renders an icon by name: synchronously when it is loaded, otherwise
 * through a Suspense boundary with a placeholder of the same size.
 */
export const Icon: FC<IconComponentProps> = ({ name, ...props }) => {
  const Ready = ready.get(name);
  if (Ready) return <Ready {...props} />;
  const Lazy = lazyIcon(name);
  if (!Lazy) return null;
  return (
    <Suspense
      fallback={<IconPlaceholder width={props.width} height={props.height} />}
    >
      <Lazy {...props} />
    </Suspense>
  );
};
