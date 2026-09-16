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
import { ProjectPage } from "@/stories/components/pages/ProjectPage";
import { projectPath, projectsFrom } from "@/utils/projects";
import { Analytics } from "@vercel/analytics/react";
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

  // Paper is always light: drop the dark classes while printing and put them
  // back afterwards (Tailwind's dark: utilities key on them).
  useEffect(() => {
    const before = () => {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("theme-dark");
    };
    const after = () => {
      if (darkTheme) {
        document.documentElement.classList.add("dark");
        document.body.classList.add("theme-dark");
      }
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, [darkTheme]);

  return { darkTheme, toggleTheme };
};

const ResumeContent = ({
  latestResume,
  locale,
  projectSlug,
}: {
  latestResume: Resume;
  locale: Locale;
  projectSlug?: string;
}) => {
  const t = useMessages();
  // A project page keeps the site header and footer around the project.
  const project = projectSlug
    ? projectsFrom(latestResume).find((p) => p.slug === projectSlug)
    : undefined;
  if (projectSlug && !project) {
    throw new Error(`Unknown project "${projectSlug}"`);
  }
  return (
    <main id="main" tabIndex={-1} className="outline-none" key={`${latestResume._id}:${projectSlug ?? ""}`}>
      {project ? (
        <>
          <SectionRenderer section={latestResume.pageBuilder[0]} />
          <ProjectPage project={project} />
        </>
      ) : (
        latestResume.pageBuilder.map((section) => (
          <SectionRenderer key={section._key} section={section} />
        ))
      )}
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
const LanguageSwitcher = ({
  locale,
  projectSlug,
}: {
  locale: Locale;
  projectSlug?: string;
}) => (
  <nav aria-label={messages[locale].languageName} className="language-switcher">
    {locales
      .filter((other) => other !== locale)
      .map((other) => (
        <a
          key={other}
          href={projectSlug ? projectPath(other, projectSlug) : localePath(other)}
          hrefLang={other}
          lang={other}
          aria-label={messages[other].switchTo}
          className="inline-flex min-h-6 min-w-6 items-center justify-center uppercase text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
        >
          {other}
        </a>
      ))}
  </nav>
);

interface AppProps {
  locale: Locale;
  resume: Resume;
  /** Renders the page of one project instead of the resume sections. */
  projectSlug?: string;
}

function App({ locale, resume, projectSlug }: AppProps) {
  const { darkTheme, toggleTheme } = useTheme();
  const t = messages[locale];

  return (
    <LocaleProvider locale={locale}>
      <div className="container py-10 mx-auto px-4 max-w-5xl relative">
        <a href="#main" className="skip-link">
          {t.skipToContent}
        </a>
        <div className="site-controls absolute right-3 top-4 flex items-center gap-4">
          <LanguageSwitcher locale={locale} projectSlug={projectSlug} />
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={darkTheme ? t.lightMode : t.darkMode}
            className={`${darkTheme ? "button-dark" : "button-light"} inline-flex min-h-6 min-w-6 items-center justify-center`}
          >
            {darkTheme ? <MemoizedSunIcon /> : <MemoizedMoonIcon />}
          </button>
        </div>
        <ResumeContent
          latestResume={resume}
          locale={locale}
          projectSlug={projectSlug}
        />
        {/* Cookieless page views, only on Vercel builds; served same-origin under /_vercel/insights. */}
        {__VERCEL__ && <Analytics />}
      </div>
    </LocaleProvider>
  );
}

export default App;
