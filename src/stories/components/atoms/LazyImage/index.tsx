/**
 * LazyImage is a component that renders an image with lazy loading functionality. It displays a placeholder image until the actual image is fully loaded.
 *
 * Props:
 * - placeholderSrc: The source URL of the placeholder image.
 * - src: The source URL of the actual image.
 * - alt: The alt text for the image.
 * - width: The width of the image.
 * - height: The height of the image.
 * - onImageLoad: Function to be called when the image is fully loaded.
 * - style: Additional CSS styles to be applied to the image.
 * - lazy: Boolean indicating if the image should be lazy loaded.
 *
 * Example usage:
 * <LazyImage
 *   placeholderSrc="https://placehold.co/600x400"
 *   src="https://example.com/image.jpg"
 *   alt="Example Image"
 *   width={600}
 *   height={400}
 *   onImageLoad={handleImageLoad}
 *   style={{ borderRadius: "8px" }}
 *   lazy={true}
 * />
 */

import type { CSSProperties, FC } from "react";
import { useEffect, useRef, useState } from "react";
import "./index.css";

export interface LazyImageProps {
  placeholderSrc: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  onImageLoad?: () => void;
  style?: CSSProperties;
  lazy?: boolean;
}

export const LazyImage: FC<LazyImageProps> = ({
  placeholderSrc,
  src,
  alt,
  width,
  height,
  onImageLoad,
  style,
}) => {
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setLoaded(true);
      if (imageRef.current) {
        imageRef.current.src = src;
        onImageLoad?.();
      }
    };

    return () => {
      img.onload = null;
    };
  }, [src, onImageLoad]);

  const containerStyles: CSSProperties = {
    position: "relative",
    width: width ? `${width}px` : "100%",
    height: height ? `${height}px` : "100%",
  };

  const imageStylesPlaceHolder: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: loaded ? "none" : "block",
    ...style,
  };

  const imageStyles: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: loaded ? "block" : "none",
    ...style,
  };

  return (
    <div className="image-container" style={containerStyles}>
      <figure className="image-wrapper">
        <img
          src={placeholderSrc}
          width={width}
          height={height}
          style={imageStylesPlaceHolder}
          alt={`${alt}-placeholder`}
        />
        <img
          ref={imageRef}
          src={placeholderSrc}
          alt={alt}
          style={imageStyles}
          loading="eager"
          width={width}
          height={height}
        />
      </figure>
    </div>
  );
};
