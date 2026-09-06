/**
 * Play is a component that renders a play button icon inside a div container.
 *
 * Example usage:
 * <Play />
 */

import type { FC } from "react";

const Play: FC = () => {
  return (
    <div className="play">
      <svg
        height="100"
        width="100"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 58.752 58.752"
        xmlSpace="preserve"
        fill="#fff"
        role="img"
        aria-labelledby="svgTitle"
      >
        <title>Play Button</title>
        <path d="M52.524 23.925 12.507.824c-1.907-1.1-4.376-1.097-6.276 0a6.294 6.294 0 0 0-3.143 5.44v46.205a6.29 6.29 0 0 0 3.131 5.435 6.263 6.263 0 0 0 6.29.005l40.017-23.103a6.3 6.3 0 0 0 3.138-5.439 6.315 6.315 0 0 0-3.14-5.442zm-3 5.687L9.504 52.716a.27.27 0 0 1-.279-.005.28.28 0 0 1-.137-.242V6.263a.28.28 0 0 1 .421-.243l40.01 23.098a.29.29 0 0 1 .145.249.283.283 0 0 1-.14.245z" />
      </svg>
    </div>
  );
};

export default Play;
