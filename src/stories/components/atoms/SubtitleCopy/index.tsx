/**
 * SubtitleCopy is a component that renders a subtitle element with customizable tag, text, and styles.
 *
 * Props:
 * - subtitle: The HTML tag to be used for the subtitle. Default is "h2".
 * - text: The text content to be displayed for the subtitle. Default is "Papaar papaar".
 * - mods: Additional CSS classes to be applied to the subtitle. Default is "text-3xl uppercase".
 * - styles: Additional CSS styles to be applied to the subtitle.
 *
 * Example usage:
 * <SubtitleCopy
 *   subtitle="h3"
 *   text="This is a subtitle"
 *   mods="text-2xl font-bold"
 *   styles={{ color: "red" }}
 * />
 */
import type { CSSProperties, FC } from "react";
import "./index.css";

type AllowedTagValues = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface SubtitleCopyProps {
  /** The subtitle property is optional and can be an AllowedTagValues ("h1", "h2", "h3", "h4", "h5", "h6").  */
  subtitle: AllowedTagValues;
  /** The text property is optional and can be a string.  */
  text: string;
  /** The mods property is optional and can be a string with tailwind or css classes. */
  mods: string;
  /** The styles property is optional and can be a CSSProperties object. */
  styles?: CSSProperties;
}

/** Renders a subtitle with customizable tag, text, and styles. */
export const SubtitleCopy: FC<SubtitleCopyProps> = ({
  subtitle = "h2",
  text = "Papaar papaar",
  mods = "text-3xl uppercase",
  styles = {},
  ...props
}: SubtitleCopyProps) => {
  const SubTitle = subtitle as keyof JSX.IntrinsicElements;

  return (
    <SubTitle className={`text ${mods}`} style={styles} {...props}>
      {text}
    </SubTitle>
  );
};
