/**
 * App.tsx
 *
 * This is the main application component. It renders the resume content that
 * scripts/fetch-resume.mjs pulled from Sanity at build time (src/data/resume.ts)
 * with the appropriate theme context.
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
 * The resume data is bundled at build time, so there is no loading state.
 *
 */

import MemoizedMoonIcon from "@/stories/components/molecules/IconGallery/Icons/MoonIcon";
import MemoizedSunIcon from "@/stories/components/molecules/IconGallery/Icons/SunIcon";
import { Footer } from "@/stories/components/organisms/Footer";
import type { Resume } from "@/utils/types/resume";
import { useContext, useEffect } from "react";
import SectionRenderer from "./SectionRenderer";
import { ThemeContext } from "./contexts";
import { resume } from "./data/resume";
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

const ResumeContent = ({ latestResume }: { latestResume: Resume }) => {
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
            link_text: "Download PDF Resume",
            href: "/resume.pdf",
            target: "_blank",
            rel: "noopener noreferrer",
          }}
        />
      )}
    </main>
  );
};

function App() {
  const latestResume = resume;
  const { darkTheme, toggleTheme } = useTheme();

  return (
    <div className="container py-10 mx-auto px-4 max-w-5xl relative">
        <button
          type="button"
          onClick={toggleTheme}
          className={`absolute right-3 top-4 ${darkTheme ? "button-dark" : "button-light"}`}
        >
          {darkTheme ? <MemoizedSunIcon /> : <MemoizedMoonIcon />}
        </button>
        <ResumeContent latestResume={latestResume} />
      </div>
  );
}

export default App;
