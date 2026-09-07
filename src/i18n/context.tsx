import { createContext, type FC, type ReactNode, useContext } from "react";
import {
  defaultLocale,
  type Locale,
  type Messages,
  messages,
} from "./messages";

/**
 * The language of the page being rendered. Defaults to English so components
 * keep working unchanged in Storybook and tests; the app sets it per build.
 */
export const LocaleContext = createContext<Locale>(defaultLocale);

export const LocaleProvider: FC<{ locale: Locale; children: ReactNode }> = ({
  locale,
  children,
}) => (
  <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
);

export const useLocale = (): Locale => useContext(LocaleContext);

/** UI copy for the current language. */
export const useMessages = (): Messages => messages[useLocale()];
