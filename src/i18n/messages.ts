/**
 * UI copy for every language the site ships in. Content (sections, jobs,
 * projects) comes from Sanity per language; this file only holds the chrome:
 * labels, buttons, accessible names, SEO metadata and date locales.
 *
 * scripts/locales.mjs mirrors the locale list and file names for the Node
 * build scripts, which cannot import TypeScript.
 */

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (locales as readonly string[]).includes(value);

/** URL prefix of a language: "/" for the default one, "/es/" otherwise. */
export const localePath = (locale: Locale): string =>
  locale === defaultLocale ? "/" : `/${locale}/`;

/** Per-language build artefact: resume.pdf / resume.es.pdf, og.png / og.es.png. */
export const localeFile = (
  base: string,
  ext: string,
  locale: Locale,
): string =>
  locale === defaultLocale ? `/${base}.${ext}` : `/${base}.${locale}.${ext}`;

/** Labels for the workDone keys stored in Sanity. */
export type WorkDoneKey =
  | "front_end"
  | "front_end_frameworks"
  | "back_end"
  | "back_end_frameworks"
  | "full_stack"
  | "databases"
  | "cms"
  | "ecommerce"
  | "mobile_app"
  | "game_dev"
  | "machine_learning"
  | "data_science"
  | "artificial_intelligence"
  | "cloud_computing"
  | "dev_ops"
  | "blockchain"
  | "iot"
  | "cybersecurity"
  | "servers_hosting"
  | "testing_debugging"
  | "version_control"
  | "maintenance_updates"
  | "performance_optimization"
  | "responsive_design"
  | "ux_ui_design"
  | "seo"
  | "analytics_metrics"
  | "security";

export interface Messages {
  /** BCP 47 tag for Intl formatting; must stay fixed per build for prerendering. */
  dateLocale: string;
  /** Name of the language in itself, for the switcher. */
  languageName: string;
  /** Accessible label of the link to this language from the other one. */
  switchTo: string;
  downloadPdf: string;
  lastUpdated: string;
  loadMore: string;
  viewDetails: string;
  cardImage: string;
  moreInfoAt: string;
  moreInfo: string;
  current: string;
  close: string;
  play: string;
  loading: string;
  noData: string;
  lightMode: string;
  darkMode: string;
  slide: (index: number) => string;
  /** "fresh - Project", "Proyecto nuevo"… from the Sanity slide type. */
  project: (workType: string) => string;
  workDone: Record<WorkDoneKey, string>;
}

export interface Seo {
  title: string;
  description: string;
  /** Shorter title for social cards. */
  socialTitle: string;
  imageAlt: string;
}

export const messages: Record<Locale, Messages> = {
  en: {
    dateLocale: "en-US",
    languageName: "English",
    switchTo: "View in English",
    downloadPdf: "Download PDF Resume",
    lastUpdated: "Last updated",
    loadMore: "Load more",
    viewDetails: "View details",
    cardImage: "Project image",
    moreInfoAt: "More info at: ",
    moreInfo: "More info",
    current: "Current",
    close: "Close",
    play: "Play video",
    loading: "Loading…",
    noData: "No data available",
    lightMode: "Switch to light mode",
    darkMode: "Switch to dark mode",
    slide: (index) => `Slide ${index}`,
    project: (workType) =>
      `${{ fresh: "New", maintenance: "Maintenance" }[workType] ?? workType} - Project`,
    workDone: {
      front_end: "Frontend Development",
      front_end_frameworks: "Frontend Frameworks",
      back_end: "Backend Development",
      back_end_frameworks: "Backend Frameworks",
      full_stack: "Full Stack Development",
      databases: "Databases",
      cms: "CMS",
      ecommerce: "E-commerce",
      mobile_app: "Mobile App Development",
      game_dev: "Game Development",
      machine_learning: "Machine Learning",
      data_science: "Data Science",
      artificial_intelligence: "Artificial Intelligence",
      cloud_computing: "Cloud Computing",
      dev_ops: "DevOps",
      blockchain: "Blockchain",
      iot: "Internet of Things",
      cybersecurity: "Cybersecurity",
      servers_hosting: "Servers & Hosting",
      testing_debugging: "Testing & Debugging",
      version_control: "Version Control",
      maintenance_updates: "Maintenance & Updates",
      performance_optimization: "Performance",
      responsive_design: "Responsive Design",
      ux_ui_design: "UX/UI Consultancy",
      seo: "SEO Support",
      analytics_metrics: "Analytics & Metrics",
      security: "Security",
    },
  },
  es: {
    dateLocale: "es-ES",
    languageName: "Español",
    switchTo: "Ver en español",
    downloadPdf: "Descargar CV en PDF",
    lastUpdated: "Última actualización",
    loadMore: "Ver más",
    viewDetails: "Ver detalles",
    cardImage: "Imagen del proyecto",
    moreInfoAt: "Más información en: ",
    moreInfo: "Más información",
    current: "Actualidad",
    close: "Cerrar",
    play: "Reproducir vídeo",
    loading: "Cargando…",
    noData: "No hay datos disponibles",
    lightMode: "Cambiar a modo claro",
    darkMode: "Cambiar a modo oscuro",
    slide: (index) => `Diapositiva ${index}`,
    project: (workType) =>
      `Proyecto ${{ fresh: "nuevo", maintenance: "de mantenimiento" }[workType] ?? workType}`,
    workDone: {
      front_end: "Desarrollo frontend",
      front_end_frameworks: "Frameworks frontend",
      back_end: "Desarrollo backend",
      back_end_frameworks: "Frameworks backend",
      full_stack: "Desarrollo full stack",
      databases: "Bases de datos",
      cms: "CMS",
      ecommerce: "Comercio electrónico",
      mobile_app: "Desarrollo de apps móviles",
      game_dev: "Desarrollo de videojuegos",
      machine_learning: "Machine learning",
      data_science: "Ciencia de datos",
      artificial_intelligence: "Inteligencia artificial",
      cloud_computing: "Cloud computing",
      dev_ops: "DevOps",
      blockchain: "Blockchain",
      iot: "Internet de las cosas",
      cybersecurity: "Ciberseguridad",
      servers_hosting: "Servidores y hosting",
      testing_debugging: "Testing y depuración",
      version_control: "Control de versiones",
      maintenance_updates: "Mantenimiento y actualizaciones",
      performance_optimization: "Rendimiento",
      responsive_design: "Diseño responsive",
      ux_ui_design: "Consultoría UX/UI",
      seo: "Soporte SEO",
      analytics_metrics: "Analítica y métricas",
      security: "Seguridad",
    },
  },
};

export const seo: Record<Locale, Seo> = {
  en: {
    title:
      "Jorge Martínez Ortiz - Frontend Developer, Designer, Creator, Frontender, Trainer",
    socialTitle: "Jorge Martínez Ortiz - Designer, Creator, Developer, Trainer",
    description:
      "Detail-oriented designer, creator, and developer with a passion for usability and frontend. Skilled in content management systems and committed to creating a positive work environment.",
    imageAlt: "Jorge Martínez, Frontender in Barcelona",
  },
  es: {
    title:
      "Jorge Martínez Ortiz - Desarrollador frontend, diseñador, creador, formador",
    socialTitle:
      "Jorge Martínez Ortiz - Diseñador, creador, desarrollador, formador",
    description:
      "Diseñador, creador y desarrollador detallista, apasionado por la usabilidad y el frontend. Con experiencia en gestores de contenidos y comprometido con un entorno de trabajo positivo.",
    imageAlt: "Jorge Martínez, frontender en Barcelona",
  },
};

/** Label for a workDone key, falling back to the key itself for unknown values. */
export const workDoneLabel = (locale: Locale, key: string): string =>
  (messages[locale].workDone as Record<string, string>)[key] ?? key;
