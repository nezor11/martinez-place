/** Resolved by the `@resume-data` alias in vite.config.js to the locale's JSON. */
declare module "@resume-data" {
  const data: unknown;
  export default data;
}

/** Language this client bundle is built for (`define` in vite.config.js). */
declare const __SITE_LOCALE__: string;
