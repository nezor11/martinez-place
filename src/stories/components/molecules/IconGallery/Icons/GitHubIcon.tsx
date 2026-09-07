import type { IconProps } from "@/utils/types/icons";
import { forwardRef, memo, useId } from "react";

const GitHubIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ name = "GitHub", desc, width, height, ...props }, ref) => {
    const titleId = useId();
    const descId = useId();
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width ? width : "1em"}
        height={height ? height : "1em"}
        preserveAspectRatio="xMinYMin meet"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        className="feather feather-github"
        ref={ref}
        role="img"
        aria-labelledby={titleId}
        aria-describedby={desc}
        {...props}
      >
        {desc && <desc id={descId}>{desc}</desc>}
        <title id={titleId}>{name}</title>
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    );
  },
);

const MemoizedGitHubIcon = memo(GitHubIcon);

export default MemoizedGitHubIcon;
