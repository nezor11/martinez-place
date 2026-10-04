/**
 * ConsentBanner asks once whether Google Analytics may load. It shows on the
 * first visit of a build that has a GTM container (see src/utils/analytics.ts)
 * and again when "Cookie settings" in the footer is used. Accept and Reject
 * look the same on purpose: neither choice is pushed.
 *
 * It renders nothing on the server or before mount, so it is never part of
 * the prerendered HTML.
 */
import { useMessages } from "@/i18n";
import { buttonStyles } from "@/stories/components/atoms/ButtonTailwind";
import { cn } from "@/utils";
import {
  CONSENT_OPEN_EVENT,
  type ConsentChoice,
  analyticsEnabled,
  setConsent,
  storedConsent,
} from "@/utils/analytics";
import type { FC } from "react";
import { useEffect, useState } from "react";

export interface ConsentBannerProps {
  /** Shows the banner regardless of the build and the stored choice (stories). */
  forceOpen?: boolean;
  /** Called with the choice instead of storing it (stories and tests). */
  onChoice?: (choice: ConsentChoice) => void;
}

export const ConsentBanner: FC<ConsentBannerProps> = ({
  forceOpen = false,
  onChoice,
}) => {
  const t = useMessages();
  const [open, setOpen] = useState(forceOpen);

  useEffect(() => {
    if (!analyticsEnabled()) return;
    if (storedConsent() === null) setOpen(true);
    const show = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, show);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, show);
  }, []);

  if (!open) return null;

  const choose = (choice: ConsentChoice) => {
    if (onChoice) onChoice(choice);
    else setConsent(choice);
    setOpen(false);
  };
  const button = cn(
    buttonStyles({ variant: "outline", size: "sm", colorscheme: "primary" }),
    "w-auto cursor-pointer whitespace-nowrap",
  );

  return (
    <section
      aria-label={t.consent.title}
      className="consent-banner fixed inset-x-0 bottom-0 z-[60] border-t border-gray-300 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)] dark:border-gray-700 dark:bg-slate-950"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:gap-8">
        <div>
          <p className="text-sm text-gray-950 dark:text-white">
            {t.consent.text}
          </p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            {t.consent.details}
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            className={button}
            onClick={() => choose("denied")}
          >
            {t.consent.reject}
          </button>
          <button
            type="button"
            className={button}
            onClick={() => choose("granted")}
          >
            {t.consent.accept}
          </button>
        </div>
      </div>
    </section>
  );
};
