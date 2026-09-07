import type { IconProps } from "@/utils/types/icons";
import { forwardRef, memo, useId } from "react";

/**
 * commercetools symbol: an open cube of three rounded faces. Redrawn from
 * the brand logo (the site only ships it as a bitmap); round joins on a
 * same-colour stroke give the soft corners.
 */
const CommercetoolsIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ name = "commercetools", desc, width, height, ...props }, ref) => {
    const titleId = useId();
    const descId = useId();
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
        viewBox="0 0 416 432"
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
        <g strokeWidth="16" strokeLinejoin="round">
          <path
            d="M216 16 378 106 216 197 54 106Z"
            fill="#ffc806"
            stroke="#ffc806"
          />
          <path
            d="M36 136 197 232v182L36 322Z"
            fill="#6359ff"
            stroke="#6359ff"
          />
          <path
            d="M230 244l148 84-148 84Z"
            fill="#0bbfbf"
            stroke="#0bbfbf"
          />
        </g>
      </svg>
    );
  },
);

const MemoizedCommercetoolsIcon = memo(CommercetoolsIcon);

export default MemoizedCommercetoolsIcon;
