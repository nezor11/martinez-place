/**
 * ButtonTailwind is a component that renders a button element with Tailwind CSS classes. It is used to trigger actions or events when clicked.
 *
 * Props:
 * - variant: The variant of the button. Options are "solid", "outline", "ghost". Default is "solid".
 * - size: The size of the button. Options are "sm", "md", "lg". Default is "md".
 * - colorscheme: The color scheme of the button. Options are "primary". Default is "primary".
 * - className: Additional CSS classes to be applied to the button.
 * - disabled: Boolean indicating if the button is disabled. Default is false.
 * - onClick: Function to be called when the button is clicked.
 *
 * Example usage:
 * <ButtonTailwind
 *   variant="outline"
 *   size="lg"
 *   colorscheme="primary"
 *   onClick={handleClick}
 * >
 *   Click Me
 * </ButtonTailwind>
 */

import { cn } from "@/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { type ComponentProps, forwardRef } from "react";

const buttonStyles = cva(
  [
    "w-full",
    "rounded-md",
    "font-medium",
    "focus:outline-hidden",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        solid: "",
        outline: "border-2",
        ghost: "transition-colors duration-300",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
      },
      colorscheme: {
        primary: "text-white",
      },
    },
    compoundVariants: [
      {
        variant: "solid",
        colorscheme: "primary",
        className: "bg-primary-500 hover:bg-primary-600",
      },
      {
        variant: "outline",
        colorscheme: "primary",
        className:
          "text-primary-600 border-primary-500 bg-transparent hover:bg-primary-100",
      },
      {
        variant: "ghost",
        colorscheme: "primary",
        className: "text-primary-600 bg-transparent hover:bg-primary-100",
      },
    ],
    defaultVariants: {
      variant: "solid",
      size: "md",
      colorscheme: "primary",
    },
  }
);

type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonStyles>;

export const ButtonTailwind = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, colorscheme, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonStyles({ variant, size, colorscheme, className }))}
        {...props}
      />
    );
  }
);
