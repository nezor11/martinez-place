import type { IconProps } from "@/utils/types/icons";
import type { FC } from "react";
import { useMemo } from "react";

export interface IconGalleryProps {
  iconsData?: { name: string; width?: string; height?: string }[]; // Hacer width y height opcionales
}

// The icon modules are imported eagerly, so the gallery can be resolved
// synchronously and rendered at prerender time.
const iconModules = import.meta.glob("./Icons/*.tsx", { eager: true });

const availableIcons = Object.entries(iconModules).reduce<
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

export const IconGallery: FC<IconGalleryProps> = ({ iconsData = [] }) => {
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

        return <Component key={name} width={width} height={height} />;
      })}
    </div>
  );
};
