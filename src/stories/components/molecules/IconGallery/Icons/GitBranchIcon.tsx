import type { IconProps } from "@/utils/types/icons";
import type { FC } from "react";
import { forwardRef, memo, useId } from "react";

const GitBranchIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ name = "GitBranch", desc, width, height, ...props }, ref) => {
    const titleId = useId();
    const descId = useId();
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={width ? width : "1em"}
        height={height ? height : "1em"}
        preserveAspectRatio="xMinYMin meet"
        viewBox="0 0 24 24"
        ref={ref}
        role="img"
        aria-labelledby={titleId}
        aria-describedby={desc}
        className={name}
        {...props}
      >
        {desc && <desc id={descId}>{desc}</desc>}
        <title id={titleId}>{name}</title>
        <path
          fillRule="evenodd"
          d="M6 5a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm2 2.83a3.001 3.001 0 1 0-2 0v8.34a3.001 3.001 0 1 0 2.105.04A3.001 3.001 0 0 1 11 14h2a6 6 0 0 0 6-6v-.17a3.001 3.001 0 1 0-2 0V8a4 4 0 0 1-4 4h-2a4.978 4.978 0 0 0-3 1V7.83ZM18 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM6 19a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
          clipRule="evenodd"
        />
      </svg>
    );
  },
);

const MemoizedGitBranchIcon: FC<IconProps> = memo(GitBranchIcon);

export default MemoizedGitBranchIcon;
