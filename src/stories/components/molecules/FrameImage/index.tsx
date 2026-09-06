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
import type { FC } from "react";
import styled from "styled-components";

import "./index.css";

import maskImage from "@/assets/images/mask-photo.png";

interface StyledImageProps {
  masksrc: string;
}

const StyledImage = styled.img<StyledImageProps>`
  mask-image: ${(p) => `url("${p.masksrc}")`};
  mask-repeat: no-repeat;
  mask-size: contain;
  width: 150px;
  height: 150px;
  object-fit: cover;
`;

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

  return (
    <div className="frame-wrapper-image">
      <LazyImage
        placeholderSrc={frameImage}
        src={frameImage}
        alt="Frame Image"
      />
      <StyledImage
        className="content-image"
        src={imageURL}
        masksrc={maskFrameURL}
      />
    </div>
  );
};
