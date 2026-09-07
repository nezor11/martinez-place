/**
 * The published resume in the language this bundle is built for. Vite maps
 * `@resume-data` to src/data/resume.<locale>.json (see vite.config.js and
 * SITE_LOCALE); scripts/fetch-resume.mjs writes those files. Run
 * `yarn fetch-resume` to refresh them locally.
 */
import type { Resume } from "@/utils/types/resume";
import data from "@resume-data";

export const resume = data as unknown as Resume;
