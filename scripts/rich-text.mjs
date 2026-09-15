/**
 * Portable Text -> sanitised HTML, done once at build time so the browser
 * ships neither the converter nor DOMPurify. Links open in a new tab.
 */
import blocksToHtml from "@sanity/block-content-to-html";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const { window } = new JSDOM("<!doctype html><html><body></body></html>");
const DOMPurify = createDOMPurify(window);

/** Sanitised HTML for a Portable Text array; "" for anything else. */
export const blocksToSafeHtml = (blocks, { projectId, dataset } = {}) => {
  if (!Array.isArray(blocks) || blocks.length === 0) return "";
  const html = blocksToHtml({ blocks, projectId, dataset });
  const fragment = DOMPurify.sanitize(html, { RETURN_DOM_FRAGMENT: true });
  for (const anchor of fragment.querySelectorAll("a")) {
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noreferrer noopener");
  }
  const container = window.document.createElement("div");
  container.appendChild(fragment);
  return container.innerHTML;
};

/**
 * Replaces every rich-text field of the fetched resume with its HTML in
 * place: `jobDesc` on info items and `slideDesc` on slides. Returns how
 * many fields were rendered.
 */
export const renderRichText = (resume, options) => {
  let count = 0;
  for (const section of resume?.pageBuilder ?? []) {
    for (const item of section?.sections ?? []) {
      if (Array.isArray(item?.jobDesc)) {
        item.jobDesc = blocksToSafeHtml(item.jobDesc, options);
        count += 1;
      }
    }
    for (const entry of section?.sliderDetails?.slides ?? []) {
      const slide = entry?.slideDetails;
      if (Array.isArray(slide?.slideDesc)) {
        slide.slideDesc = blocksToSafeHtml(slide.slideDesc, options);
        count += 1;
      }
    }
  }
  return count;
};
