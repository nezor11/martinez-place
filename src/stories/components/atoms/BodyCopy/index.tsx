import { cn } from "@/utils";
import { cva } from "class-variance-authority";
import DOMPurify from "dompurify";
import type { CSSProperties, FC, ReactNode } from "react";
import ReactHtmlParser, {
  convertNodeToElement,
  type Transform,
} from "react-html-parser";
import "./index.css";

const textStyles = cva("text", {
  variants: {
    emphasis: {
      low: "text-gray-600 dark:text-gray-400 font-light",
      high: "text-red-600 font-extrabold",
    },
    size: {
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
    },
    weight: {
      thin: "font-thin",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      black: "font-black",
    },
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
    size: "base",
    align: "left",
  },
});

type AllowedTagValues = "div" | "span" | "p";

interface BodyCopyProps {
  /** The tag property is optional and can be either an AllowedTagValues ("div", "span", "p").  */
  tag: AllowedTagValues;
  /** The text property is optional and can be a string.  */
  text: string;
  /** The mods property is optional and can be a string with tailwind or css classes. */
  mods?: string;
  /** The align property is optional and can be either "left", "center", "right", null, or undefined.  */
  align?: "left" | "center" | "right" | null | undefined;
  /** The size property is optional and can be either "sm", "base", "lg", "xl", "2xl", "3xl", null, or undefined.  */
  size?: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | null | undefined;
  /** The emphasis property is optional and can be either "low", "high", null, or undefined.  */
  emphasis?: "low" | "high" | null | undefined;
  /** The italic property is optional and can be a boolean.  */
  italic?: boolean;
  underline?: boolean;
  /** The weight property is optional and can be either "thin", "normal", "medium", "semibold", "bold", "black", null, or undefined.  */
  weight?:
    | "thin"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "black"
    | null
    | undefined;
  /** The styles property is optional and can be a CSSProperties object. */
  styles?: CSSProperties;
}

/** Renders a body copy component with customizable styles and variants. */
export const BodyCopy: FC<BodyCopyProps> = ({
  tag = "div",
  text = "Lorem fistrum ahorarr de la pradera no te digo trigo por no llamarte Rodrigor",
  mods = "text-base dark:text-white",
  styles = {},
  align = "left",
  size = "base",
  emphasis = null,
  italic = false,
  underline = false,
  weight = "normal",
  ...props
}: BodyCopyProps) => {
  const Tag = tag as keyof JSX.IntrinsicElements;

  const sanitizedHTML = DOMPurify.sanitize(text);

  const addTargetBlank: Transform = (node, index) => {
    if (node.type === "tag" && node.name === "a") {
      node.attribs = {
        ...node.attribs,
        target: "_blank",
        rel: "noreferrer noopener",
      };
      return convertNodeToElement(node, index, addTargetBlank);
    }
  };

  const classes = cn(
    mods,
    "[&_a]:text-primary-500",
    "[&_a]:underline",
    textStyles({
      size,
      weight,
      emphasis,
      italic,
      underline,
      align,
    })
  );
  return (
    <Tag className={classes} style={styles} {...props}>
      {
        ReactHtmlParser(sanitizedHTML, {
          transform: addTargetBlank,
        }) as ReactNode
      }
    </Tag>
  );
};
