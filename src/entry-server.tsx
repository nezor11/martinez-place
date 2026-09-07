/**
 * Server entry used by scripts/prerender.mjs at build time. It renders the
 * same tree as main.tsx to a string, once per language, so every
 * index.html ships with its content. The prerender script also reads the
 * locale list and SEO copy from here to fill in each page's <head>.
 */
import { renderToString } from "react-dom/server";
import App from "./App";
import resumeEn from "./data/resume.en.json";
import resumeEs from "./data/resume.es.json";
import { type Locale, isLocale } from "./i18n";
import { ThemeProvider } from "./providers/index";
import type { Resume } from "./utils/types/resume";

export {
  defaultLocale,
  localeFile,
  localePath,
  locales,
  messages,
  seo,
} from "./i18n";

const resumes: Record<Locale, Resume> = {
  en: resumeEn as unknown as Resume,
  es: resumeEs as unknown as Resume,
};

export const resumeFor = (locale: Locale): Resume => resumes[locale];

export const render = (locale: string): string => {
  if (!isLocale(locale)) {
    throw new Error(`Unknown locale "${locale}"`);
  }
  return renderToString(
    <ThemeProvider>
      <App locale={locale} resume={resumes[locale]} />
    </ThemeProvider>,
  );
};
