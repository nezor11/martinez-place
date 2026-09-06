/**
 * Link is a component that renders an anchor element. It is used to navigate to different URLs when clicked.
 *
 * Props:
 * - link_text: The text content to be displayed for the link. Default is "Link text".
 * - href: The URL to which the link points. Default is "https://google.com".
 * - target: The target attribute specifies where to open the linked document. Default is "_blank".
 * - rel: The relationship between the current document and the linked document. Default is "noreferrer noopener".
 * - mods: Additional CSS classes to be applied to the link.
 *
 * Example usage:
 * <Link
 *   link_text="Go to Google"
 *   href="https://google.com"
 *   target="_self"
 *   rel="noopener"
 *   mods="custom-class"
 * />
 */

import type { FC } from "react";

export interface LinkProps {
  /** The link_text property is optional and can be a string.  */
  link_text: string;
  /** The href property is optional and can be a string.  */
  href: string;
  /** The target property is optional and can be a string.  */
  target?: string;
  /** The rel property is optional and can be a string. */
  rel: string;
  /** The mods property is optional and can be a string with tailwind or css classes. */
  mods?: string;
}

/** Renders a link component with customizable styles and variants. */
export const Link: FC<LinkProps> = ({
  link_text = "Link text",
  href = "https://google.com",
  target = "_blank",
  rel = "noreferrer noopener",
  mods = "visited:text-gray-800 hover:text-primary-500 focus:text-primary-500 active:text-primary-500 dark:text-white dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-500 transition-colors duration-300 ease-in-out",
  ...props
}: LinkProps) => {
  return (
    <a href={href} target={target} rel={rel} {...props}>
      {link_text}
    </a>
  );
};
