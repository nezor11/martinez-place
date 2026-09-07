#!/usr/bin/env node
/**
 * Fetches the published resume from Sanity, once per language, and writes
 * src/data/resume.<locale>.json so the site can import it at build time.
 *
 * Usage:
 *   node scripts/fetch-resume.mjs            keep the existing files if the
 *                                            request fails (local dev)
 *   node scripts/fetch-resume.mjs --strict   fail when the request fails
 *                                            (production builds)
 *   node scripts/fetch-resume.mjs --locale es   one language only
 *   RESUME_ID=<id> node scripts/fetch-resume.mjs   build from another resume
 *                                            document (e.g. a new edition
 *                                            before switching activeResumeId)
 *
 * Translatable fields are localised objects in Sanity ({ en, es }); the query
 * resolves each one to a string for the requested language, falling back to
 * English and then to the plain value, so it also works with documents that
 * have not been migrated or translated yet.
 *
 * The site never talks to Sanity at runtime; a Sanity webhook pointing at a
 * Vercel deploy hook rebuilds it when content is published.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defaultLocale, localesFromArgv, resumeDataFile } from "./locales.mjs";

const projectId = "6zr8au58";
const dataset = "production";
const apiVersion = "2022-03-07";

/**
 * The published resume document the site is built from. Pinned by id so a
 * new edition can be written and published in the Studio without going live
 * until this constant changes. RESUME_ID overrides it for one build.
 */
const activeResumeId = "5cd8ab7f-d791-49ea-a436-5c42af02ad8d"; // Resume Jorge Martínez 2026
const resumeId = process.env.RESUME_ID ?? activeResumeId;

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** GROQ expression that picks a localised field's value for `locale`. */
const localised = (locale, field) =>
  locale === defaultLocale
    ? `coalesce(${field}.${defaultLocale}, ${field})`
    : `coalesce(${field}.${locale}, ${field}.${defaultLocale}, ${field})`;

const buildQuery = (locale) => {
  // Only emit the key when the document has it, so section types keep the
  // exact shape they had before localisation (no `name: null` on sliders).
  const l = (field, name = field) =>
    `defined(${field}) => { "${name}": ${localised(locale, field)} }`;
  return `*[_type == "resume" && _id == $id][0]{
  _id,
  ${l("title")},
  _updatedAt,
  "pageBuilder": pageBuilder[]{
    ...,
    ${l("name")},
    ${l("jobDescHeader")},
    ${l("titleSection")},
    ${l("subtitleSection")},
    defined(sections) => {
      "sections": sections[]{
        ...,
        ${l("company")},
        ${l("jobTitle")},
        ${l("jobDesc")}
      }
    },
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
      ${l("title")},
      phone,
      email,
      ${l("address")}
    },
    "imageDetails": image.asset->{
      url,
      metadata {
        dimensions
      }
    },
    "sliderDetails": sliderDetails->{
      ${l("name")},
      slides[] {
        "slideDetails": slides->{
          _id,
          ${l("name")},
          company,
          type,
          infoUrl,
          workDate,
          ${l("slideTitle")},
          "slideImage": slideImage.asset->{
            "src": url,
            "width": metadata.dimensions.width,
            "height": metadata.dimensions.height,
            "alt": ${localised(locale, "^.slideImage.alt")}
          },
          ${l("slideSummary")},
          ${l("slideDesc")},
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
            ${l("alt")}
          }
        }
      }
    }
  },
  "pdfResumeUrl": pdfResume.asset->url,
  slug
}`;
};

const strict = process.argv.includes("--strict");

const fetchLocale = async (locale) => {
  const outFile = resolve(root, resumeDataFile(locale));
  const url = new URL(
    `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`
  );
  url.searchParams.set("query", buildQuery(locale));
  url.searchParams.set("$id", JSON.stringify(resumeId));
  url.searchParams.set("perspective", "published");

  try {
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) {
      throw new Error(`Sanity responded with status ${response.status}`);
    }
    const { result } = await response.json();
    if (!result || !Array.isArray(result.pageBuilder)) {
      throw new Error(`Sanity has no published resume with id ${resumeId}`);
    }
    mkdirSync(dirname(outFile), { recursive: true });
    writeFileSync(outFile, `${JSON.stringify(result, null, 2)}\n`);
    console.log(
      `[fetch-resume] wrote ${outFile} ("${result.title}", ${result.pageBuilder.length} sections, updated ${result._updatedAt})`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (strict || !existsSync(outFile)) {
      console.error(`[fetch-resume] ${locale}: ${message}`);
      process.exit(1);
    }
    console.warn(`[fetch-resume] ${locale}: ${message}; keeping the existing ${outFile}`);
  }
};

for (const locale of localesFromArgv(process.argv)) {
  await fetchLocale(locale);
}
