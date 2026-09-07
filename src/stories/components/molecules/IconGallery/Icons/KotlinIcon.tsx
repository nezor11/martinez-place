import type { IconProps } from "@/utils/types/icons";
import { forwardRef, memo, useId } from "react";

/** Kotlin logo: the official shape with its purple-to-coral gradient. */
const KotlinIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ name = "Kotlin", desc, width, height, ...props }, ref) => {
    const titleId = useId();
    const descId = useId();
    const gradientId = useId();
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
        viewBox="0 0 256 256"
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
        <defs>
          <linearGradient
            id={gradientId}
            x1="99.991%"
            x2=".01%"
            y1="-.011%"
            y2="100.01%"
          >
            <stop offset=".344%" stopColor="#e44857" />
            <stop offset="46.89%" stopColor="#c711e1" />
            <stop offset="100%" stopColor="#7f52ff" />
          </linearGradient>
        </defs>
        <path fill={`url(#${gradientId})`} d="M256 256H0V0h256L128 127.949z" />
      </svg>
    );
  },
);

const MemoizedKotlinIcon = memo(KotlinIcon);

export default MemoizedKotlinIcon;
