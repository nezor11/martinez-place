/**
 * ImageSlider is a component that renders a slider with multiple images. It uses the Swiper library for the slider functionality.
 *
 * Props:
 * - images: An array of image objects. Each object can have the following properties:
 *   - src: The source URL of the image.
 *   - width: The width of the image.
 *   - height: The height of the image.
 *   - alt: The alt text for the image.
 * - className: Additional CSS classes to be applied to the slider container.
 *
 * Example usage:
 * <ImageSlider
 *   images={[
 *     { src: "image1.jpg", width: 600, height: 400, alt: "Image 1" },
 *     { src: "image2.jpg", width: 600, height: 400, alt: "Image 2" },
 *     { src: "image3.jpg", width: 600, height: 400, alt: "Image 3" },
 *   ]}
 *   className="custom-slider"
 * />
 */

import createTripleSlider from "@/stories/assets/scripts/triple-slider";
import { nanoid } from "nanoid";
import type { FC } from "react";
import { useEffect, useRef } from "react";
import "swiper/css";
import "swiper/css/controller";
import "./index.css";

interface ImageSliderProps {
  images: {
    src?: string;
    width?: number;
    height?: number;
    alt?: string;
  }[];
  className?: string;
}

export const ImageSlider: FC<ImageSliderProps> = ({ images, className }) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (images.length > 0 && sliderRef.current) {
      createTripleSlider(sliderRef.current);
    }
  }, [images]);

  return (
    <div className={`triple-slider ${className || ""}`} ref={sliderRef}>
      <div className="swiper">
        <div className="swiper-wrapper">
          {images.map((image) => (
            <div key={nanoid()} className="swiper-slide">
              <img
                className="bg-image"
                src={image.src}
                width={image.width}
                height={image.height}
                alt={image.alt}
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
