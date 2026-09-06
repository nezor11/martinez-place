/**
 * Button is a component that renders a button element. It is used to trigger actions or events when clicked.
 *
 * Props:
 * - primary: Boolean indicating if the button is styled as primary. Default is false.
 * - backgroundColor: The background color of the button. Default is null.
 * - radius: The border radius of the button. Default is undefined.
 * - size: The size of the button. Options are "small", "medium", "large". Default is "medium".
 * - label: The text content to be displayed on the button.
 *
 * Example usage:
 * <Button
 *   primary={true}
 *   backgroundColor="#ff0"
 *   radius={10}
 *   size="large"
 *   label="Click Me"
 * />
 */

import type { CSSProperties } from "react";
import "./index.css";

interface ButtonProps {
  primary?: boolean;
  backgroundColor?: string | null;
  radius?: number; // border radius
  size: "small" | "medium" | "large";
  label: string;
}

export const Button = ({
  primary = false,
  backgroundColor = null,
  radius,
  size = "medium",
  label,
  ...props
}: ButtonProps) => {
  const buttonClass = "storybook-button";
  const sizeClass = `storybook-button--${size}`;
  const mode = primary
    ? "storybook-button--primary"
    : "storybook-button--secondary";

  const buttonClasses = [buttonClass, sizeClass, mode, buttonClass.trim()];

  const buttonStyle: CSSProperties = {
    backgroundColor: backgroundColor || undefined,
    borderRadius: radius ? `${radius}px` : undefined,
  };

  return (
    <button
      type="button"
      className={buttonClasses.join(" ")}
      style={buttonStyle}
      {...props}
    >
      {label}
    </button>
  );
};
