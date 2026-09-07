import { cn } from "@/utils";
import { cva } from "class-variance-authority";
import type {
  CSSProperties,
  ComponentType,
  FC,
  HTMLAttributes,
  ReactNode,
} from "react";
import "./index.css";

const textStyles = cva("text", {
  variants: {
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    italic: {
      true: "italic",
    },
    underline: {
      true: "underline underline-offset-2",
    },
  },
  defaultVariants: {
    align: "left",
  },
});

type AllowedTagValues = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
interface TitleCopyProps {
  /** The as property is optional and can be either an AllowedTagValues ("h1", "h2", "h3", "h4", "h5", "h6", "p") or a React ComponentType<HTMLAttributes<HTMLElement>>.  */
  as?: AllowedTagValues | ComponentType<HTMLAttributes<HTMLElement>>;
  /** The text property is optional and can be a string.  */
  text?: string;
  /** The align property is optional and can be either "left", "center", "right", null, or undefined.  */
  align?: "left" | "center" | "right" | null | undefined;
  /** The italic property is optional and can be a boolean.  */
  italic?: boolean;
  /** The underline property is optional and can be a boolean.  */
  underline?: boolean;
  /** The mods property is optional and can be a string with tailwind or css classes. */
  mods?: string;
  /** The styles property is optional and can be a CSSProperties object. */
  styles?: CSSProperties;
  /** The children property is optional and can be a ReactNode. */
  children?: ReactNode;
}

/** Renders a title or copy component with customizable styles and variants. */
export const TitleCopy: FC<TitleCopyProps> = ({
  as: Tag = "h1",
  text = "Rodrigor",
  align = "left",
  italic = false,
  underline = false,
  mods = "text-xl dark:text-white",
  styles = {},
  children,
  ...props
}: TitleCopyProps) => {
  return (
    <Tag
      className={cn(
        mods,
        textStyles({
          italic,
          underline,
          align,
        })
      )}
      style={styles}
      {...props}
    >
      {children || text}
    </Tag>
  );
};
