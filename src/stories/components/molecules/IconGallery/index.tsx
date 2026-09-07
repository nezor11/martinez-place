import { useMessages } from "@/i18n";
import { cn } from "@/utils";
import { iconLabel } from "@/utils/iconLabels";
import type { IconProps } from "@/utils/types/icons";
import type { FC } from "react";
import { useMemo } from "react";

export interface IconGalleryProps {
  iconsData?: { name: string; width?: string; height?: string }[]; // Hacer width y height opcionales
  /** When set, every icon becomes a button that reports its component name. */
  onIconClick?: (name: string) => void;
  /** Component name of the icon currently used as a filter, if any. */
  activeIcon?: string;
}

// The icon modules are imported eagerly, so the gallery can be resolved
// synchronously and rendered at prerender time.
const iconModules = import.meta.glob("./Icons/*.tsx", { eager: true });

/** Every icon component by name (file name without extension). */
export const availableIcons = Object.entries(iconModules).reduce<
  Record<string, FC<IconProps>>
>((acc, [path, module]) => {
  const iconName = path.split("/").pop()?.split(".")[0] || "";
  if (
    iconName &&
    module &&
    typeof module === "object" &&
    "default" in module
  ) {
    acc[iconName] = (module as { default: FC<IconProps> }).default;
  }
  return acc;
}, {});

export const IconGallery: FC<IconGalleryProps> = ({
  iconsData = [],
  onIconClick,
  activeIcon,
}) => {
  const t = useMessages();
  const icons = useMemo(() => {
    if (iconsData.length > 0) {
      return iconsData
        .filter(({ name }) => availableIcons[name])
        .map(({ name }) => ({ name, Component: availableIcons[name] }));
    }
    return Object.entries(availableIcons).map(([name, Component]) => ({
      name,
      Component,
    }));
  }, [iconsData]);

  return (
    <div className="flex items-center flex-wrap justify-center">
      {icons.map(({ name, Component }) => {
        const iconConfig = iconsData.find((icon) => icon.name === name);
        const width = iconConfig?.width || "1em";
        const height = iconConfig?.height || "1em";

        if (!onIconClick) {
          return <Component key={name} width={width} height={height} />;
        }
        const active = activeIcon === name;
        return (
          <button
            key={name}
            type="button"
            className={cn(
              "icon-gallery__button inline-flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-sm p-0.5 leading-none",
              active && "ring-2 ring-primary-500 ring-offset-1"
            )}
            aria-label={t.filterByTech(iconLabel(name))}
            aria-pressed={active}
            onClick={() => onIconClick(name)}
          >
            <Component width={width} height={height} />
          </button>
        );
      })}
    </div>
  );
};
