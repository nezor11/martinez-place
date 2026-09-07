/**
 * App.tsx
 *
 * This is the main application component. It renders the resume content that
 * scripts/fetch-resume.mjs pulled from Sanity at build time, in the language
 * the entry point passes in (one client bundle per language, see main.tsx;
 * every language at once in entry-server.tsx), with the theme context.
 *
 * The application uses the following components:
 * - MemoizedMoonIcon: A memoized moon icon component.
 * - MemoizedSunIcon: A memoized sun icon component.
 * - Footer: The footer component of the application.
 * - SectionRenderer: A component that renders different sections of the resume.
 *
 * The application also uses the following hooks and context:
 * - useContext: To access the ThemeContext.
 * - useEffect: To sync the theme class on the document.
 *
 * The ThemeContext provides the current theme (dark or light) and a function to toggle the theme.
 * The LocaleContext provides the UI copy; the resume data is bundled at build
 * time, so there is no loading state.
 *
 */

import MemoizedMoonIcon from "@/stories/components/molecules/IconGallery/Icons/MoonIcon";
import MemoizedSunIcon from "@/stories/components/molecules/IconGallery/Icons/SunIcon";
import { Footer } from "@/stories/components/organisms/Footer";
import type { Resume } from "@/utils/types/resume";
import { useContext, useEffect } from "react";
import SectionRenderer from "./SectionRenderer";
import { ThemeContext } from "./contexts";
import {
  type Locale,
  LocaleProvider,
  localeFile,
  localePath,
  locales,
  messages,
  useMessages,
} from "./i18n";
import type { ThemeContextInterface } from "./utils/types/theme";

const useTheme = () => {
  const { darkTheme, toggleTheme } = useContext(
    ThemeContext
  ) as ThemeContextInterface;

  useEffect(() => {
    if (darkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkTheme]);

  return { darkTheme, toggleTheme };
};

const ResumeContent = ({
  latestResume,
  locale,
}: {
  latestResume: Resume;
  locale: Locale;
}) => {
  const t = useMessages();
  return (
    <main key={latestResume._id}>
      {latestResume.pageBuilder.map((section) => (
        <SectionRenderer key={section._key} section={section} />
      ))}
      {latestResume.pageBuilder[0] && (
        <Footer
          copy_right_text={latestResume.title}
          last_updated={latestResume._updatedAt}
          contact_details={latestResume.pageBuilder[0].contactDetails}
          my_link={{
            link_text: t.downloadPdf,
            href: localeFile("resume", "pdf", locale),
            target: "_blank",
            rel: "noopener noreferrer",
          }}
        />
      )}
    </main>
  );
};

/**
 * Links to the same page in every other language. Plain anchors: each
 * language is its own prerendered page, so no client routing is involved.
 */
const LanguageSwitcher = ({ locale }: { locale: Locale }) => (
  <nav aria-label={messages[locale].languageName} className="language-switcher">
    {locales
      .filter((other) => other !== locale)
      .map((other) => (
        <a
          key={other}
          href={localePath(other)}
          hrefLang={other}
          lang={other}
          aria-label={messages[other].switchTo}
          className="uppercase text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
        >
          {other}
        </a>
      ))}
  </nav>
);

interface AppProps {
  locale: Locale;
  resume: Resume;
}

function App({ locale, resume }: AppProps) {
  const { darkTheme, toggleTheme } = useTheme();
  const t = messages[locale];

  return (
    <LocaleProvider locale={locale}>
      <div className="container py-10 mx-auto px-4 max-w-5xl relative">
        <div className="absolute right-3 top-4 flex items-center gap-4">
          <LanguageSwitcher locale={locale} />
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={darkTheme ? t.lightMode : t.darkMode}
            className={darkTheme ? "button-dark" : "button-light"}
          >
            {darkTheme ? <MemoizedSunIcon /> : <MemoizedMoonIcon />}
          </button>
        </div>
        <ResumeContent latestResume={resume} locale={locale} />
      </div>
    </LocaleProvider>
  );
}

export default App;
