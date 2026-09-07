import type { IconProps } from "@/utils/types/icons";
import { forwardRef, memo, useId } from "react";

const SchoolIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ name = "School", desc, width, height, ...props }, ref) => {
    const titleId = useId();
    const descId = useId();
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width ? width : "1em"}
        height={height ? height : "1em"}
        fill="#f43f5e"
        viewBox="0 -960 960 960"
        ref={ref}
        role="img"
        aria-labelledby={titleId}
        aria-describedby={desc ? descId : undefined}
        {...props}
      >
        {desc && <desc id={descId}>{desc}</desc>}
        <title id={titleId}>{name}</title>
        <path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z" />
      </svg>
    );
  },
);

const MemoizedSchoolIcon = memo(SchoolIcon);

export default MemoizedSchoolIcon;
