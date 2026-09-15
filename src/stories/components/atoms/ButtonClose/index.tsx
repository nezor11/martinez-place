/**
 * ButtonClose is a component that renders a close button element. It is used to trigger a close action when clicked.
 *
 * Props:
 * - onClick: Function to be called when the button is clicked.
 *
 * Example usage:
 * <ButtonClose onClick={handleClose} />
 */

import { useMessages } from "@/i18n";
import { cn } from "@/utils";
import type { FC } from "react";

/** Which background the button sits on; picks a contrasting pill. */
export type ButtonTone = "onLight" | "onDark";

export const toneClasses: Record<ButtonTone, string> = {
  onLight: "bg-gray-900/80 text-white hover:bg-gray-900",
  onDark: "bg-white/90 text-gray-900 hover:bg-white",
};

interface ButtonCloseProps {
  onClick: () => void;
  /** Defaults to the legacy white square; popups pass the tone of their background. */
  tone?: ButtonTone;
}

const ButtonClose: FC<ButtonCloseProps> = ({
  onClick,
  tone,
}): React.JSX.Element => {
  const t = useMessages();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t.close}
      className={cn(
        "absolute top-2 right-2 z-50 cursor-pointer rounded-full p-1 shadow-sm",
        tone
          ? toneClasses[tone]
          : "bg-white text-gray-500 dark:text-white hover:text-gray-700 dark:bg-transparent rounded-sm",
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <title>{t.close}</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export default ButtonClose;
