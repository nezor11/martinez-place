import { useMessages } from "@/i18n";
import { cn } from "@/utils";
import { iconLabel } from "@/utils/iconLabels";
import type { FC } from "react";
import { useMemo } from "react";
import { Icon, hasIcon, iconNames } from "./registry";

export {
  Icon,
  hasIcon,
  iconNames,
  preloadIcons,
  registerIcons,
} from "./registry";

export interface IconGalleryProps {
  iconsData?: { name: string; width?: string; height?: string }[]; // Hacer width y height opcionales
  /** When set, every icon becomes a button that reports its component name. */
  onIconClick?: (name: string) => void;
  /** Component name of the icon currently used as a filter, if any. */
  activeIcon?: string;
}

export const IconGallery: FC<IconGalleryProps> = ({
  iconsData = [],
  onIconClick,
  activeIcon,
}) => {
  const t = useMessages();
  const icons = useMemo(() => {
    if (iconsData.length > 0) {
      return iconsData
        .filter(({ name }) => hasIcon(name))
        .map(({ name }) => name);
    }
    return iconNames;
  }, [iconsData]);

  return (
    <div className="flex items-center flex-wrap justify-center">
      {icons.map((name) => {
        const iconConfig = iconsData.find((icon) => icon.name === name);
        const width = iconConfig?.width || "1em";
        const height = iconConfig?.height || "1em";

        if (!onIconClick) {
          return <Icon key={name} name={name} width={width} height={height} />;
        }
        const active = activeIcon === name;
        return (
          <button
            key={name}
            type="button"
            className={cn(
              "icon-gallery__button inline-flex min-h-6 min-w-6 cursor-pointer items-center justify-center rounded-sm p-0.5 leading-none",
              active && "ring-2 ring-primary-500 ring-offset-1",
            )}
            aria-label={t.filterByTech(iconLabel(name))}
            aria-pressed={active}
            onClick={() => onIconClick(name)}
          >
            <Icon name={name} width={width} height={height} />
          </button>
        );
      })}
    </div>
  );
};
