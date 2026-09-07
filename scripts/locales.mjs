/**
 * Locale constants for the Node build scripts. Mirrors src/i18n/messages.ts,
 * which the scripts cannot import because it is TypeScript; keep both in sync.
 */
export const locales = ["en", "es"];
export const defaultLocale = "en";

/** URL prefix of a language: "/" for the default one, "/es/" otherwise. */
export const localePath = (locale) =>
  locale === defaultLocale ? "/" : `/${locale}/`;

/** Per-language build artefact name: resume.pdf / resume.es.pdf. */
export const localeFile = (base, ext, locale) =>
  locale === defaultLocale ? `${base}.${ext}` : `${base}.${locale}.${ext}`;

/** Where each language's page is built: dist/ or dist/es/. */
export const localeDist = (locale) =>
  locale === defaultLocale ? "dist" : `dist/${locale}`;

/** The fetched resume for a language. */
export const resumeDataFile = (locale) => `src/data/resume.${locale}.json`;

/** Copy the PDF needs that the site's catalogue also carries. */
export const pdfMessages = {
  en: { current: "Current", skills: "Skills", portfolio: "Portfolio", subject: "Resume", generated: "generated" },
  es: { current: "Actualidad", skills: "Habilidades", portfolio: "Portfolio", subject: "Currículum", generated: "generado el" },
};

/** Parse `--locale xx` (defaults to every locale). */
export const localesFromArgv = (argv) => {
  const index = argv.indexOf("--locale");
  if (index === -1) return locales;
  const value = argv[index + 1];
  if (!locales.includes(value)) {
    throw new Error(`Unknown locale "${value}"; expected one of ${locales.join(", ")}`);
  }
  return [value];
};
