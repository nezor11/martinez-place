#!/usr/bin/env node
/**
 * Builds public/resume.pdf (and resume.<locale>.pdf for every other
 * language) from src/data/resume.<locale>.json, the same content the site
 * renders, with @react-pdf/renderer, so the downloadable resume never drifts
 * from the page. Runs before the Vite build; Vite copies public/ to dist/,
 * so the files ship as /resume.pdf and /resume.es.pdf.
 *
 * Usage: node scripts/build-pdf.mjs [--locale es]
 */
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import {
  Document,
  Font,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  renderToFile,
} from "@react-pdf/renderer";
import { localeFile, localePath, localesFromArgv, pdfMessages, resumeRawFile } from "./locales.mjs";
import { framedPhoto } from "./photo-frame.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://martinez.place";
const h = React.createElement;

// --- fonts -----------------------------------------------------------------
// TTF versions of the site's Raleway subsets (react-pdf embeds TTF/OTF only;
// WOFF2 loads but renders no glyphs). Generated from public/font with
// fontTools: TTFont(woff2).flavor = None; save(ttf).
const fontDir = resolve(root, "scripts/fonts");
const raleway = [
  ["Raleway-Regular.ttf", 400, "normal"],
  ["Raleway-Italic.ttf", 400, "italic"],
  ["Raleway-Medium.ttf", 500, "normal"],
  ["Raleway-Bold.ttf", 700, "normal"],
];
let family = "Helvetica";
try {
  Font.register({
    family: "Raleway",
    fonts: raleway.map(([file, fontWeight, fontStyle]) => ({
      src: resolve(fontDir, file),
      fontWeight,
      fontStyle,
    })),
  });
  family = "Raleway";
} catch (error) {
  console.warn(`[build-pdf] could not register Raleway, using Helvetica: ${error}`);
}
Font.registerHyphenationCallback((word) => [word]);

// --- content helpers -------------------------------------------------------
const year = (iso) => (iso ? new Date(iso).getUTCFullYear() : null);
const dateRange = (start, finish, t) => {
  const a = year(start);
  const b = year(finish);
  if (!a) return "";
  if (!finish) return `${a} > ${t.current}`;
  return a === b ? `${a}` : `${a} > ${b}`;
};

const linkDefs = (block) => (block?.markDefs || []).filter((def) => def._type === "link" && def.href);

/** Portable text blocks -> [{ bullet, runs: [{ text, bold, italic, href }] }]. */
const blocksToParagraphs = (blocks) =>
  (Array.isArray(blocks) ? blocks : [])
    .filter((block) => block?._type === "block")
    .map((block) => ({
      bullet: Boolean(block.listItem),
      runs: (block.children || []).map((child) => ({
        text: child.text || "",
        bold: (child.marks || []).includes("strong"),
        italic: (child.marks || []).includes("em"),
        href: linkDefs(block).find((def) => (child.marks || []).includes(def._key))?.href,
      })),
    }))
    .filter((p) => p.runs.some((r) => r.text.trim()));

/** The site shows the whole profile; the PDF keeps its opening paragraphs. */
const profileParagraphs = 3;
const isProfile = (section) => section._type === "infoSection" && (section.sections || []).every((item) => !item.company);
const profileBlocks = (section) =>
  (section.sections || [])
    .flatMap((item) => (Array.isArray(item.jobDesc) ? item.jobDesc : []))
    .filter((block) => block?._type === "block" && (block.children || []).some((c) => (c.text || "").trim()));
const profileItems = (section) => [{ _key: "profile", jobDesc: profileBlocks(section).slice(0, profileParagraphs) }];
/**
 * Paragraphs past the summary that carry links (LinkedIn, GitHub...) go
 * under the contact line, where the photo leaves room for them.
 */
const profileLinks = (resume) =>
  resume.pageBuilder
    .filter(isProfile)
    .flatMap((section) => profileBlocks(section).slice(profileParagraphs))
    .filter((block) => linkDefs(block).length > 0);

/**
 * Skills on one flowing line. Non-breaking spaces keep a name such as
 * "React Native" whole and its separator beside it, so no line starts
 * with a dot.
 */
const skillsLine = (skills) => skills.map((skill) => skill.replace(/ /g, "\u00A0")).join("\u00A0\u00A0·\u00A0 ");

/** The profile subtitle is stored as HTML lines; turn it into bullets. */
const htmlToLines = (html) =>
  String(html || "")
    .split(/<br\s*\/?>/i)
    .map((line) => line.replace(/<[^>]+>/g, "").trim().replace(/^_/, "").trim())
    .filter(Boolean);

const titleCase = (value) =>
  String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const iconLabel = (name) =>
  ({
    HTML5Icon: "HTML5",
    CSS3Icon: "CSS3",
    JavaScriptIcon: "JavaScript",
    TypeScriptIcon: "TypeScript",
    NodeJSIcon: "Node.js",
    WebPackIcon: "Webpack",
    NextJSIcon: "Next.js",
    VueIcon: "Vue",
    ViteIcon: "Vite",
    NuxtIcon: "Nuxt",
    ReactIcon: "React",
    WordpressIcon: "WordPress",
    PhpIcon: "PHP",
    GitBranchIcon: "Git",
    CommercetoolsIcon: "commercetools",
    KotlinIcon: "Kotlin",
    ReactNativeIcon: "React Native",
    AndroidIcon: "Android",
    JetpackComposeIcon: "Jetpack Compose",
    TailwindIcon: "Tailwind CSS",
    ExpoIcon: "Expo",
    StorybookIcon: "Storybook",
    SanityIcon: "Sanity",
    GraphqlIcon: "GraphQL",
  })[name] || name.replace(/Icon$/, "");

// --- styles ----------------------------------------------------------------
const rose = "#e11d48";
const ink = "#111827";
const muted = "#4b5563";
const styles = StyleSheet.create({
  // No ligatures: some text extractors drop the fi/fl glyphs ("workfows").
  page: { fontFamily: family, fontFeatureSettings: { liga: false }, fontSize: 9.5, color: ink, paddingTop: 40, paddingBottom: 48, paddingHorizontal: 44, lineHeight: 1.35 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerMain: { flex: 1, paddingRight: 16 },
  // The polaroid frame as on the site: the tape overlaps the top margin.
  photo: { width: 112, height: 112, marginTop: -16, marginRight: -12 },
  name: { fontSize: 24, fontWeight: 700, letterSpacing: 0.5, lineHeight: 1.15 },
  role: { fontSize: 12, color: rose, textTransform: "uppercase", marginTop: 6, letterSpacing: 1 },
  contact: { marginTop: 6, color: muted, fontSize: 9 },
  contactLinks: { marginTop: 2, color: muted, fontSize: 9 },
  sectionTitle: { marginTop: 16, fontSize: 11, fontWeight: 700, color: rose, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6, paddingBottom: 3, borderBottomWidth: 0.8, borderBottomColor: "#fecdd3" },
  item: { marginBottom: 8 },
  itemHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  company: { fontSize: 10.5, fontWeight: 700 },
  jobTitle: { fontWeight: 500, color: muted, marginBottom: 2 },
  date: { color: muted, fontSize: 8.5 },
  paragraph: { marginBottom: 2 },
  bullet: { flexDirection: "row", marginBottom: 1 },
  bulletDot: { width: 10, color: rose },
  bold: { fontWeight: 700 },
  italic: { fontStyle: "italic" },
  skills: { color: muted },
  columns: { flexDirection: "row", gap: 18 },
  column: { flex: 1 },
  project: { flexDirection: "row", marginBottom: 4 },
  projectYear: { width: 30, color: muted, fontSize: 8, paddingTop: 1 },
  projectBody: { flex: 1 },
  link: { color: rose, textDecoration: "none" },
  footer: { position: "absolute", bottom: 22, left: 44, right: 44, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, color: "#9ca3af" },
});

// --- components ------------------------------------------------------------
/**
 * Room a section title wants below it, or it moves to the next page with
 * its content. Titles and items are direct children of the page so the
 * rule applies between them.
 */
const titlePresence = 80;

const Runs = ({ runs }) =>
  h(
    Text,
    null,
    ...runs.map((run, i) =>
      run.href
        ? h(Link, { key: i, src: run.href, style: [styles.link, run.bold && styles.bold, run.italic && styles.italic].filter(Boolean) }, run.text)
        : h(Text, { key: i, style: [run.bold && styles.bold, run.italic && styles.italic].filter(Boolean) }, run.text)
    )
  );

/** One paragraph or bullet; it never splits across pages. */
const Paragraph = (p, i) =>
  p.bullet
    ? h(View, { key: i, style: styles.bullet, wrap: false }, h(Text, { style: styles.bulletDot }, "•"), h(View, { style: { flex: 1 } }, h(Runs, { runs: p.runs })))
    : h(View, { key: i, style: styles.paragraph, wrap: false }, h(Runs, { runs: p.runs }));

const Bullets = ({ lines }) =>
  h(View, null, ...lines.map((line, i) => h(View, { key: i, style: styles.bullet }, h(Text, { style: styles.bulletDot }, "•"), h(Text, { style: { flex: 1 } }, line))));

/** Short bullets side by side: the profile traits take half the height. */
const BulletColumns = ({ lines }) => {
  const half = Math.ceil(lines.length / 2);
  return h(
    View,
    { style: styles.columns },
    h(View, { style: styles.column }, h(Bullets, { lines: lines.slice(0, half) })),
    h(View, { style: styles.column }, h(Bullets, { lines: lines.slice(half) }))
  );
};

const InfoSection = ({ section, t }) =>
  h(
    React.Fragment,
    null,
    h(Text, { style: styles.sectionTitle, minPresenceAhead: titlePresence }, section.titleSection),
    section.subtitleSection ? h(View, { style: { marginBottom: 6 } }, h(BulletColumns, { lines: htmlToLines(section.subtitleSection) })) : null,
    // An item may continue on the next page, but only between paragraphs,
    // and its heading always stays with the first one.
    ...(isProfile(section) ? profileItems(section) : section.sections || []).map((item) => {
      const [first, ...rest] = blocksToParagraphs(item.jobDesc);
      return h(
        View,
        { key: item._key, style: styles.item },
        h(
          View,
          { wrap: false },
          item.company
            ? h(
                View,
                { style: styles.itemHead },
                item.infoUrl ? h(Link, { src: item.infoUrl, style: [styles.company, styles.link] }, item.company) : h(Text, { style: styles.company }, item.company),
                h(Text, { style: styles.date }, dateRange(item.startDate, item.finishDate, t))
              )
            : null,
          item.jobTitle ? h(Text, { style: styles.jobTitle }, item.jobTitle) : null,
          first ? Paragraph(first, 0) : null
        ),
        ...rest.map((p, i) => Paragraph(p, i + 1))
      );
    })
  );

const Portfolio = ({ section, t }) => {
  const slides = (section.sliderDetails?.slides || [])
    .map((s) => s.slideDetails)
    .filter(Boolean)
    .sort((a, b) => String(b.workDate || "").localeCompare(String(a.workDate || "")));
  // Split where both columns are about as tall: long titles wrap, so an
  // even count left the first column a project longer than the page.
  const lines = (s) =>
    Math.ceil(`${s.slideTitle || s.name}  ·  ${titleCase(s.company)}`.length / 40) + Math.ceil(String(s.slideSummary || "").length / 48);
  const total = slides.reduce((sum, s) => sum + lines(s), 0);
  let half = 0;
  for (let sum = 0; half < slides.length && sum + lines(slides[half]) / 2 <= total / 2; half += 1) sum += lines(slides[half]);
  const Project = (s) =>
    h(
      View,
      { key: s._id, style: styles.project, wrap: false },
      h(Text, { style: styles.projectYear }, String(year(s.workDate) ?? "")),
      h(
        View,
        { style: styles.projectBody },
        h(
          Text,
          null,
          h(Text, { style: styles.bold }, s.slideTitle || s.name),
          s.company ? h(Text, { style: { color: muted } }, `  ·  ${titleCase(s.company)}`) : null
        ),
        s.slideSummary ? h(Text, { style: { color: muted, fontSize: 8.5 } }, s.slideSummary) : null
      )
    );
  return h(
    React.Fragment,
    null,
    // The portfolio starts its own page: the columns below break on their
    // own, so the title could otherwise stay behind at the foot of a page.
    h(Text, { style: styles.sectionTitle, break: true }, section.titleSection || t.portfolio),
    h(
      View,
      { style: styles.columns },
      h(View, { style: styles.column }, ...slides.slice(0, half).map(Project)),
      h(View, { style: styles.column }, ...slides.slice(half).map(Project))
    )
  );
};

const generated = new Date().toISOString().slice(0, 10);
// Composed once: the same header photo, mask and frame the site renders.
const photo = await framedPhoto();

const buildPdf = async (locale) => {
  const t = pdfMessages[locale];
  // The raw Sanity result: the PDF lays out Portable Text itself.
  const dataFile = resolve(root, resumeRawFile(locale));
  const outFile = resolve(root, "public", localeFile("resume", "pdf", locale));
  const pageUrl = `${siteUrl}${localePath(locale)}`;
  if (!existsSync(dataFile)) {
    console.error(`[build-pdf] ${dataFile} is missing; run fetch-resume first`);
    process.exit(1);
  }
  const resume = JSON.parse(readFileSync(dataFile, "utf8"));
  const header = resume.pageBuilder.find((s) => s._type === "header") || {};
  const contact = header.contactDetails || {};
  const skills = (header.icons || []).map((i) => iconLabel(i.iconDetails?.name || "")).filter(Boolean);

  const doc = h(
    Document,
    { title: `${header.name} – ${header.jobDescHeader}`, author: header.name, subject: t.subject, creator: siteUrl, language: locale },
    h(
      Page,
      { size: "A4", style: styles.page },
      h(
        View,
        { style: styles.header },
        h(
          View,
          { style: styles.headerMain },
          h(Text, { style: styles.name }, header.name),
          h(Text, { style: styles.role }, header.jobDescHeader),
          h(
            Text,
            { style: styles.contact },
            [contact.email, contact.phone, contact.address].filter(Boolean).join("   ·   "),
            "   ·   ",
            h(Link, { src: pageUrl, style: styles.link }, "martinez.place")
          ),
          ...blocksToParagraphs(profileLinks(resume)).map((p, i) => h(View, { key: i, style: styles.contactLinks }, h(Runs, { runs: p.runs })))
        ),
        h(Image, { src: photo, style: styles.photo })
      ),
      skills.length ? h(React.Fragment, null, h(Text, { style: styles.sectionTitle, minPresenceAhead: titlePresence }, t.skills), h(Text, { style: styles.skills }, skillsLine(skills))) : null,
      ...resume.pageBuilder.map((section) =>
        section._type === "infoSection"
          ? h(InfoSection, { key: section._key, section, t })
          : section._type === "sliderSection"
            ? h(Portfolio, { key: section._key, section, t })
            : null
      ),
      h(
        View,
        { style: styles.footer, fixed: true },
        h(Text, null, `${header.name} · ${siteUrl} · ${t.generated} ${generated}`),
        h(Text, { render: ({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}` })
      )
    )
  );

  mkdirSync(dirname(outFile), { recursive: true });
  await renderToFile(doc, outFile);
  console.log(`[build-pdf] wrote ${outFile} (${family})`);
};

for (const locale of localesFromArgv(process.argv)) {
  await buildPdf(locale);
}
