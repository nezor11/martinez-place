/**
 * Analytics through Google Tag Manager, behind consent.
 *
 * Nothing is requested from Google until the visitor accepts in the consent
 * banner: the GTM script is only injected then, and `track()` drops events
 * while consent is missing or denied. The choice lives in localStorage, so
 * the site itself sets no cookie. The container id comes from the GTM_ID
 * build variable (see vite.config.js); builds without it have no banner and
 * no tracking at all.
 */

export type ConsentChoice = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export const CONSENT_STORAGE_KEY = "analytics-consent";
/** Fired on `window` when the stored choice changes or the banner is asked for. */
export const CONSENT_EVENT = "analytics-consent";
export const CONSENT_OPEN_EVENT = "analytics-consent-open";

/** Mutable so unit tests can set an id without a build. */
export const config = {
  gtmId: typeof __GTM_ID__ === "string" ? __GTM_ID__ : "",
};

export const analyticsEnabled = (): boolean =>
  /^GTM-[A-Z0-9]+$/.test(config.gtmId);

export const storedConsent = (): ConsentChoice | null => {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
};

const dataLayer = (): unknown[] => {
  window.dataLayer = window.dataLayer ?? [];
  return window.dataLayer;
};

// Consent Mode commands only work when pushed as an `arguments` object, the
// way Google's gtag() snippet does it; a plain array is ignored.
function gtag(..._args: unknown[]) {
  // biome-ignore lint/complexity/noArguments: Consent Mode needs the arguments object itself.
  dataLayer().push(arguments);
}

let loaded = false;

const loadGtm = () => {
  if (loaded) return;
  loaded = true;
  // Analytics only: the advertising signals stay denied.
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  });
  dataLayer().push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(config.gtmId)}`;
  document.head.appendChild(script);
};

/** Removes the Google Analytics cookies after consent is withdrawn. */
const clearAnalyticsCookies = () => {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!name.startsWith("_ga")) continue;
    for (const domain of domains) {
      // biome-ignore lint/suspicious/noDocumentCookie: the Cookie Store API is not in Firefox or Safari yet.
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
};

export const setConsent = (choice: ConsentChoice) => {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Private mode without storage: the choice lasts for this page only.
  }
  if (choice === "granted") {
    if (loaded) gtag("consent", "update", { analytics_storage: "granted" });
    else loadGtm();
  } else {
    if (loaded) gtag("consent", "update", { analytics_storage: "denied" });
    clearAnalyticsCookies();
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
};

/** Asks the consent banner to show again (the "Cookie settings" link). */
export const openConsentBanner = () => {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
};

export type AnalyticsEvent =
  | "project_open"
  | "portfolio_filter"
  | "portfolio_search"
  | "video_play"
  | "copy_link"
  | "contact_click"
  | "cv_download"
  | "outbound_click"
  | "language_switch"
  | "theme_toggle";

/** Pushes an event to the data layer; a no-op without consent. */
export const track = (
  event: AnalyticsEvent,
  params: Record<string, string | number | boolean | undefined> = {},
) => {
  if (typeof window === "undefined") return;
  if (!analyticsEnabled() || storedConsent() !== "granted") return;
  dataLayer().push({ event, ...params });
};

/** Slug of the project on screen: the open popup's hash or the project page. */
export const currentProject = (): string | undefined => {
  const { hash, pathname } = window.location;
  const fromHash = /^#project-(.+)$/.exec(hash)?.[1];
  if (fromHash) return decodeURIComponent(fromHash);
  return /\/(?:project|proyecto)\/([^/]+)\/?$/.exec(pathname)?.[1];
};

export interface LinkInfo {
  /** Absolute URL of the link. */
  href: string;
  /** `data-contact` on the link: phone, email or map. */
  contact?: string | null;
  /** `hreflang` of a language switcher link. */
  language?: string | null;
}

export type LinkEvent = [
  AnalyticsEvent,
  Record<string, string | undefined>,
];

/**
 * Which event a clicked link stands for, if any. Contact links are tagged in
 * the markup because their href is obfuscated until someone interacts; the
 * values themselves (address, number) are never sent.
 */
export const linkEvent = (link: LinkInfo, origin: string): LinkEvent | null => {
  if (link.contact) return ["contact_click", { method: link.contact }];
  // Named apart from GA4's own `language` (the browser's) and in line with
  // its built-in `file_name`, `link_domain` and `link_url` parameters.
  if (link.language) {
    return ["language_switch", { site_language: link.language }];
  }
  let url: URL;
  try {
    url = new URL(link.href, origin);
  } catch {
    return null;
  }
  if (url.protocol === "mailto:") return ["contact_click", { method: "email" }];
  if (url.protocol === "tel:") return ["contact_click", { method: "phone" }];
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (url.origin === origin) {
    return url.pathname.toLowerCase().endsWith(".pdf")
      ? ["cv_download", { file_name: url.pathname }]
      : null;
  }
  return [
    "outbound_click",
    {
      link_domain: url.hostname.replace(/^www\./, ""),
      link_url: `${url.origin}${url.pathname}`,
    },
  ];
};

const onDocumentClick = (event: MouseEvent) => {
  const target = event.target instanceof Element ? event.target : null;
  const anchor = target?.closest("a");
  if (!anchor) return;
  const found = linkEvent(
    {
      href: anchor.href,
      contact: anchor.getAttribute("data-contact"),
      language: anchor.closest(".language-switcher")
        ? anchor.getAttribute("hreflang")
        : null,
    },
    window.location.origin,
  );
  if (found) track(found[0], found[1]);
};

let started = false;

/**
 * Call once on the client: loads GTM when consent was already given on an
 * earlier visit and starts listening for link clicks.
 */
export const initAnalytics = () => {
  if (started || !analyticsEnabled()) return;
  started = true;
  if (storedConsent() === "granted") loadGtm();
  document.addEventListener("click", onDocumentClick, { capture: true });
};
