/**
 * Resume content, fetched from Sanity at build time by
 * scripts/fetch-resume.mjs and bundled with the site. Run
 * `yarn fetch-resume` to refresh it locally.
 */
import type { Resume } from "@/utils/types/resume";
import data from "./resume.json";

export const resume = data as unknown as Resume;
