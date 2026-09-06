/**
 * SuspenseIconGallery is a component that wraps the IconGallery component with React.Suspense to handle lazy loading.
 *
 * Props:
 * - All props are passed down to the IconGallery component.
 *
 * Example usage:
 * <SuspenseIconGallery iconsData={[{ name: "icon1", width: "24", height: "24" }]} />
 */

import type React from "react";
import { startTransition, useEffect, useState } from "react";
import { IconGallery, type IconGalleryProps } from "../IconGallery";

/**
 * Renders the gallery only after the component has mounted. Cards and modals
 * use it so their icons stay out of the prerendered HTML (each card would
 * otherwise inline every SVG) and so hydration has nothing to reconcile.
 */
export const SuspenseIconGallery: React.FC<IconGalleryProps> = (props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  if (!mounted) {
    return (
      <div
        className="flex items-center flex-wrap justify-center"
        aria-hidden="true"
      />
    );
  }

  return <IconGallery {...props} />;
};
