import type { IconProps } from "@/utils/types/icons";
import type { FC } from "react";
import { Suspense, useEffect, useState } from "react";

export interface IconGalleryProps {
  iconsData?: { name: string; width?: string; height?: string }[]; // Hacer width y height opcionales
}

export const IconGallery: FC<IconGalleryProps> = ({ iconsData = [] }) => {
  const [icons, setIcons] = useState<
    { name: string; Component: FC<IconProps> }[]
  >([]);

  useEffect(() => {
    const loadIcons = async () => {
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

      let selectedIcons: { name: string; Component: FC<IconProps> }[] = [];

      if (iconsData.length > 0) {
        selectedIcons = iconsData
          .filter(({ name }) => availableIcons[name])
          .map(({ name }) => ({ name, Component: availableIcons[name] }));
      } else {
        selectedIcons = Object.entries(availableIcons).map(
          ([name, Component]) => ({ name, Component })
        );
      }

      if (JSON.stringify(icons) !== JSON.stringify(selectedIcons)) {
        setIcons(selectedIcons);
      }
    };

    loadIcons();
  }, [iconsData, icons]);

  return (
    <div className="flex items-center flex-wrap justify-center">
      {icons.map(({ name, Component }) => {
        const iconConfig = iconsData.find((icon) => icon.name === name);
        const width = iconConfig?.width || "1em";
        const height = iconConfig?.height || "1em";

        return (
          <Suspense
            key={name}
            fallback={<div className="w-6 h-6 bg-gray-300" />}
          >
            <Component width={width} height={height} />
          </Suspense>
        );
      })}
    </div>
  );
};
