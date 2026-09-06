#!/usr/bin/env node
/**
 * Fetches the published resume from Sanity and writes it to
 * src/data/resume.json so the site can import it at build time.
 *
 * Usage:
 *   node scripts/fetch-resume.mjs            keep the existing file if the
 *                                            request fails (local dev)
 *   node scripts/fetch-resume.mjs --strict   fail when the request fails
 *                                            (production builds)
 *
 * The site never talks to Sanity at runtime; a Sanity webhook pointing at a
 * Vercel deploy hook rebuilds it when content is published.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectId = "6zr8au58";
const dataset = "production";
const apiVersion = "2022-03-07";

const query = `*[_type == "resume" && !(_id in path('drafts.**'))] | order(_updatedAt desc)[0]{
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
}`;

const strict = process.argv.includes("--strict");
const outFile = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/data/resume.json"
);

const url = new URL(
  `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`
);
url.searchParams.set("query", query);
url.searchParams.set("perspective", "published");

try {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Sanity responded with status ${response.status}`);
  }
  const { result } = await response.json();
  if (!result || !Array.isArray(result.pageBuilder)) {
    throw new Error("Sanity returned no published resume");
  }
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, `${JSON.stringify(result, null, 2)}\n`);
  console.log(
    `[fetch-resume] wrote ${outFile} (${result.pageBuilder.length} sections, updated ${result._updatedAt})`
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  if (strict || !existsSync(outFile)) {
    console.error(`[fetch-resume] ${message}`);
    process.exit(1);
  }
  console.warn(`[fetch-resume] ${message}; keeping the existing ${outFile}`);
}
