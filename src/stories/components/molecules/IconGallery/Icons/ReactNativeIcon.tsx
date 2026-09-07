import type { IconProps } from "@/utils/types/icons";
import { forwardRef, memo, useId } from "react";

/**
 * React Native has no logo of its own: the community uses the React atom on
 * the dark rounded tile of the app icon, which also tells it apart from
 * ReactIcon at a glance.
 */
const ReactNativeIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ name = "React Native", desc, width, height, ...props }, ref) => {
    const titleId = useId();
    const descId = useId();
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
        viewBox="0 0 32 32"
        width={width ? width : "1em"}
        height={height ? height : "1em"}
        ref={ref}
        role="img"
        aria-labelledby={titleId}
        aria-describedby={desc}
        {...props}
      >
        {desc && <desc id={descId}>{desc}</desc>}
        <title id={titleId}>{name}</title>
        <rect width="32" height="32" rx="6" fill="#20232a" />
        <g transform="translate(16 16) scale(0.82) translate(-16 -16)">
          <circle cx="16" cy="16" r="2.6" fill="#61dafb" />
          <g fill="none" stroke="#61dafb" strokeWidth="1.3">
            <ellipse cx="16" cy="16" rx="12" ry="4.6" />
            <ellipse
              cx="16"
              cy="16"
              rx="12"
              ry="4.6"
              transform="rotate(60 16 16)"
            />
            <ellipse
              cx="16"
              cy="16"
              rx="12"
              ry="4.6"
              transform="rotate(120 16 16)"
            />
          </g>
        </g>
      </svg>
    );
  },
);

const MemoizedReactNativeIcon = memo(ReactNativeIcon);

export default MemoizedReactNativeIcon;
