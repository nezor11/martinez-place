/**
 * Footer is a component that displays the footer section of a webpage.
 *
 * Props:
 * - copy_right_text: The text to be displayed in the copyright section. Default is "Sage".
 * - mods: Additional CSS classes to be applied to the footer. Optional.
 * - last_updated: The date or string representing the last updated date. Optional.
 * - my_link: An object containing link properties. Optional.
 * - contact_details: An object containing contact details such as title, email, and phone. Optional.
 *
 * Example usage:
 * <Footer
 *   copy_right_text="© 2023 My Company"
 *   mods="custom-footer"
 *   last_updated="2023-01-01"
 *   my_link={{ link_text: "Privacy Policy", href: "/privacy", rel: "noopener noreferrer" }}
 *   contact_details={{ title: "Contact Us", email: "info@mycompany.com", phone: "+1234567890" }}
 * />
 */

import { buttonStyles } from "@/stories/components/atoms/ButtonTailwind";
import { Link, type LinkProps } from "@/stories/components/atoms/Link";
import {
  ContactDetail,
  type ContactDetailTexts,
} from "@/stories/components/molecules/ContactDetails";
import { useMessages } from "@/i18n";
import type { FC } from "react";

export interface FooterProps {
  copy_right_text?: string;
  mods?: string;
  last_updated?: Date | string;
  my_link?: LinkProps;
  contact_details?: ContactDetailTexts;
}

export const Footer: FC<FooterProps> = ({
  copy_right_text = "Sage",
  my_link = { link_text: "", href: "", rel: "" },
  contact_details = { title: "", email: "", phone: "" },
  last_updated = "",
  mods = "",
  ...props
}: FooterProps) => {
  const t = useMessages();
  const currentYear = new Date().getFullYear();

  const formatDate = (dateString: string): string => {
    // Locale fixed per build and UTC time zone: the value must not depend on
    // where it is rendered (build server vs. visitor) or hydration breaks.
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    };
    return new Date(dateString).toLocaleDateString(t.dateLocale, options);
  };

  const lastUpdated = last_updated ? formatDate(last_updated.toString()) : null;

  return (
    <footer {...props}>
      <div className="flex items-center pb-6">
        <div className="grow border-b border-gray-600" />
      </div>
      {contact_details && (
        <div className="contact-wrapper mt-0 mb-6">
          <ContactDetail contactDetail={contact_details} />{" "}
        </div>
      )}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between">
        <div className="flex flex-row lg:flex-col items-center lg:items-start justify-between">
          <div>
            {last_updated && (
              <p className="text-sm">
                <em className="text-gray-600 dark:text-gray-400">
                  {t.lastUpdated}: {lastUpdated}
                </em>
              </p>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {currentYear} {copy_right_text}
            </p>
          </div>
        </div>
        <div className="flex-none mt-10 lg:mt-0">
          {my_link ? (
            <Link
              {...my_link}
              mods={buttonStyles({ variant: "outline", size: "sm" })}
            />
          ) : null}
        </div>
      </div>
    </footer>
  );
};
