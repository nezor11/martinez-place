/**
 * App.tsx
 *
 * This is the main application component. It fetches the latest resume data from the Sanity API
 * and renders the application with the appropriate theme context.
 *
 * The application uses the following components:
 * - Loader: A loading spinner component.
 * - MemoizedMoonIcon: A memoized moon icon component.
 * - MemoizedSunIcon: A memoized sun icon component.
 * - Footer: The footer component of the application.
 * - SectionRenderer: A component that renders different sections of the resume.
 *
 * The application also uses the following hooks and context:
 * - useContext: To access the ThemeContext.
 * - useEffect: To perform side effects such as fetching data.
 * - useMemo: To memoize values.
 * - useState: To manage state.
 *
 * The ThemeContext provides the current theme (dark or light) and a function to toggle the theme.
 * The latest resume data is fetched from the Sanity API and stored in the state.
 *
 * The Helmet and HelmetProvider components are used for managing changes to the document head.
 */

import Loader from "@/stories/components/atoms/Loader";
import MemoizedMoonIcon from "@/stories/components/molecules/IconGallery/Icons/MoonIcon";
import MemoizedSunIcon from "@/stories/components/molecules/IconGallery/Icons/SunIcon";
import { Footer } from "@/stories/components/organisms/Footer";
import type { Resume } from "@/utils/types/resume";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import SectionRenderer from "./SectionRenderer";
import { ThemeContext } from "./contexts";
import { sanityAPI } from "./utils/setup/sanitySetup";
import type { ThemeContextInterface } from "./utils/types/theme";

const useLatestResume = () => {
  const [latestResume, setLatestResume] = useState<Resume | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    sanityAPI
      .fetch<Resume>(
        `*[_type == "resume" && !(_id in path('drafts.**'))] | order(_updatedAt desc)[0]{
          _id,
          title,
          _updatedAt,
          "pageBuilder": pageBuilder[]{
            ...,
            icons[] {
              "iconDetails": icons->{
                name,
                width,
                height,
              }
            },
            "iconTitleDetails": iconTitle->{
              name,
              width,
              height,
            },
            "contactDetails": contactDetails->{
              title,
              phone,
              email,
              address
            },
            "imageDetails": image.asset->{
              url,
              metadata {
                dimensions
              }
            },
            "sliderDetails": sliderDetails->{
              name,
              slides[] {
                "slideDetails": slides->{
                  _id,
                  name,
                  company,
                  type,
                  infoUrl,
                  workDate,
                  slideTitle,
                  "slideImage": slideImage.asset->{
                    "src": url,
                    "width": metadata.dimensions.width,
                    "height": metadata.dimensions.height,
                    "alt": alt
                  },
                  slideSummary,
                  slideDesc,
                  workDone,
                  backgroundColor,
                  videoUrl,
                  icons[] {
                    "icon": icons-> {
                      name,
                      width,
                      height
                    }
                  },
                 "images": images[] {
                    "src": asset->url,
                    "width": asset->metadata.dimensions.width,
                    "height": asset->metadata.dimensions.height,
                    "alt": alt
                  }
                }
              }
            }
          },
          "pdfResumeUrl": pdfResume.asset->url,
          slug
        }`
      )
      .then((data: Resume) => {
        if (!data) {
          setError("No published resume was found.");
          return;
        }
        setLatestResume(data);
      })
      .catch((err: unknown) => {
        console.error(err);
        setError("The resume could not be loaded. Please try again later.");
      });
  }, []);

  return { latestResume, error };
};

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
            href: latestResume.pdfResumeUrl,
            target: "_blank",
            rel: "noopener noreferrer",
          }}
        />
      )}
    </main>
  );
};

function App() {
  const { latestResume, error } = useLatestResume();
  const { darkTheme, toggleTheme } = useTheme();

  // Memoriza el contenido de Helmet para evitar renderizados innecesarios
  const helmetContent = useMemo(
    () =>
      latestResume && (
        <Helmet>
          <title>
            Jorge Martínez Ortiz - Frontend Developer, Designer, Creator,
            Frontender, Trainer
          </title>
          <meta
            name="description"
            content="Detail-oriented designer, creator, and developer with a passion for usability and frontend. Skilled in content management systems and committed to creating a positive work environment."
          />
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@JorgeMartinez" />
          <meta
            name="twitter:title"
            content="Jorge Martínez Ortiz - Designer, Creator, Developer, Trainer"
          />
          <meta
            name="twitter:description"
            content="Detail-oriented designer, creator, and developer with a passion for usability and frontend. Skilled in content management systems and committed to creating a positive work environment."
          />
          <meta
            name="twitter:image"
            content="https://cdn.sanity.io/images/6zr8au58/production/a67a4d8f26a8bb3762c578d7dbf46e52e0a9b402-555x555.jpg"
          />

          {/* Open Graph (OG) */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://martinez.place/" />
          <meta
            property="og:title"
            content="Jorge Martínez Ortiz - Designer, Creator, Developer, Trainer"
          />
          <meta
            property="og:description"
            content="Detail-oriented designer, creator, and developer with a passion for usability and frontend. Skilled in content management systems and committed to creating a positive work environment."
          />
          <meta
            property="og:image"
            content="https://cdn.sanity.io/images/6zr8au58/production/a67a4d8f26a8bb3762c578d7dbf46e52e0a9b402-555x555.jpg"
          />
        </Helmet>
      ),
    [latestResume]
  );

  if (error) {
    return (
      <div
        role="alert"
        className="container mx-auto px-4 py-10 max-w-5xl text-center"
      >
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  if (!latestResume) {
    return (
      <div className="w-[200px] h-[200px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader />
      </div>
    );
  }

  return (
    <HelmetProvider>
      {helmetContent}
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
    </HelmetProvider>
  );
}

export default App;
