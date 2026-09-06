/**
 * FrameImage is a component that renders an image with an optional mask and additional image details.
 *
 * Props:
 * - image: The URL of the image to be displayed.
 * - mask: The URL of the mask image to be applied to the main image. Optional.
 * - alt: The alt text for the image. Optional.
 * - width: The width of the image. Optional.
 * - height: The height of the image. Optional.
 * - imageDetail: Additional properties for the LazyImage component. Optional.
 *
 * Example usage:
 * <FrameImage
 *   image="https://example.com/image.jpg"
 *   mask="https://example.com/mask.png"
 *   alt="Example Image"
 *   width={150}
 *   height={150}
 *   imageDetail={{ placeholderSrc: "https://example.com/placeholder.jpg" }}
 * />
 */

import frameImage from "@/assets/images/js-frame-photo-empty.png";
import {
  LazyImage,
  type LazyImageProps,
} from "@/stories/components/atoms/LazyImage";
import type { CSSProperties, FC } from "react";

import "./index.css";

import maskImage from "@/assets/images/mask-photo.png";

export type FrameImageProps = {
  image: string;
  mask?: string;
  alt?: string;
  width?: number;
  height?: number;
  imageDetail?: LazyImageProps;
};

export const FrameImage: FC<FrameImageProps> = ({
  image: imageURL,
  mask: maskURL,
}: FrameImageProps) => {
  const maskFrameURL = maskURL || maskImage;
  const maskStyle: CSSProperties = {
    maskImage: `url("${maskFrameURL}")`,
    WebkitMaskImage: `url("${maskFrameURL}")`,
  };

  return (
    <div className="frame-wrapper-image">
      <LazyImage
        placeholderSrc={frameImage}
        src={frameImage}
        alt="Frame Image"
      />
      <img
        className="content-image"
        src={imageURL}
        alt=""
        style={maskStyle}
      />
    </div>
  );
};
