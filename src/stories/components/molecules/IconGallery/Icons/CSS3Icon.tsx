import type { IconProps } from "@/utils/types/icons";
import { forwardRef, memo, useId } from "react";

const CSS3Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name = "CSS3", desc, width, height, ...props }, ref) => {
    const titleId = useId();
    const descId = useId();
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width ? width : "1em"}
        height={height ? height : "1em"}
        preserveAspectRatio="xMinYMin meet"
        viewBox="0 0 512 512"
        ref={ref}
        role="img"
        aria-labelledby={titleId}
        aria-describedby={desc ? descId : undefined}
        {...props}
      >
        {desc && <desc id={descId}>{desc}</desc>}
        <title id={titleId}>{name}</title>
        <path fill="#264de4" d="M72 460 30 0h451l-41 460-184 52" />
        <path fill="#2965f1" d="M256 37v435l149-41 35-394" />
        <path
          fill="#ebebeb"
          d="M114 94h142v56H119m5 58h132v57H129m3 28h56l4 45 64 17v59l-117-32"
        />
        <path
          fill="#fff"
          d="M256 208v57h69l-7 73-62 17v59l115-32 26-288H256v56h80l-5.5 58Z"
        />
      </svg>
    );
  },
);

const MemoizedCSS3Icon = memo(CSS3Icon);

export default MemoizedCSS3Icon;
