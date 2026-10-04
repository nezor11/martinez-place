import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CONSENT_STORAGE_KEY,
  analyticsEnabled,
  config,
  currentProject,
  linkEvent,
  storedConsent,
  track,
} from "./analytics";

const origin = "https://martinez.place";

describe("linkEvent", () => {
  it("reports tagged contact links by method, never by value", () => {
    expect(linkEvent({ href: "obfuscated", contact: "phone" }, origin)).toEqual([
      "contact_click",
      { method: "phone" },
    ]);
    expect(linkEvent({ href: "mailto:someone@example.com" }, origin)).toEqual([
      "contact_click",
      { method: "email" },
    ]);
    expect(linkEvent({ href: "tel:+34600000000" }, origin)).toEqual([
      "contact_click",
      { method: "phone" },
    ]);
  });

  it("reports the language of a language switcher link", () => {
    expect(linkEvent({ href: `${origin}/es/`, language: "es" }, origin)).toEqual(
      ["language_switch", { site_language: "es" }],
    );
  });

  it("reports PDF downloads on the site", () => {
    expect(linkEvent({ href: `${origin}/resume.es.pdf` }, origin)).toEqual([
      "cv_download",
      { file_name: "/resume.es.pdf" },
    ]);
  });

  it("reports outbound links without query string or www", () => {
    expect(
      linkEvent({ href: "https://www.github.com/nezor11/fetro-app?tab=readme" }, origin),
    ).toEqual([
      "outbound_click",
      {
        link_domain: "github.com",
        link_url: "https://www.github.com/nezor11/fetro-app",
      },
    ]);
  });

  it("ignores internal navigation and non-web links", () => {
    expect(linkEvent({ href: `${origin}/project/agm/` }, origin)).toBeNull();
    expect(linkEvent({ href: "#slide-2" }, origin)).toBeNull();
    expect(linkEvent({ href: "javascript:void(0)" }, origin)).toBeNull();
  });
});

describe("consent gate", () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    vi.stubGlobal("window", {
      dataLayer: undefined as unknown[] | undefined,
      localStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => void store.set(key, value),
      },
      location: { hash: "", pathname: "/" },
    });
    config.gtmId = "GTM-TEST123";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    config.gtmId = "";
  });

  it("is off without a container id", () => {
    config.gtmId = "";
    expect(analyticsEnabled()).toBe(false);
    store.set(CONSENT_STORAGE_KEY, "granted");
    track("theme_toggle", { theme: "dark" });
    expect(window.dataLayer).toBeUndefined();
  });

  it("drops events until consent is granted", () => {
    expect(storedConsent()).toBeNull();
    track("theme_toggle", { theme: "dark" });
    store.set(CONSENT_STORAGE_KEY, "denied");
    track("theme_toggle", { theme: "dark" });
    expect(window.dataLayer).toBeUndefined();

    store.set(CONSENT_STORAGE_KEY, "granted");
    track("project_open", { project: "agm", source: "card" });
    expect(window.dataLayer).toEqual([
      { event: "project_open", project: "agm", source: "card" },
    ]);
  });

  it("ignores stored values it does not know", () => {
    store.set(CONSENT_STORAGE_KEY, "yes");
    expect(storedConsent()).toBeNull();
  });

  it("reads the project on screen from the hash or the path", () => {
    expect(currentProject()).toBeUndefined();
    window.location.hash = "#project-power-planet-online";
    expect(currentProject()).toBe("power-planet-online");
    window.location.hash = "";
    window.location.pathname = "/es/proyecto/fetroapp/";
    expect(currentProject()).toBe("fetroapp");
  });
});
