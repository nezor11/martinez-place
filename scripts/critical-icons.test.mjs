import { describe, expect, it } from "vitest";
import { criticalIconNames } from "./critical-icons.mjs";

describe("criticalIconNames", () => {
  it("collects header skill icons and section title icons, deduplicated and sorted", () => {
    const resume = {
      pageBuilder: [
        { icons: [{ iconDetails: { name: "ReactIcon" } }, { iconDetails: { name: "HTML5Icon" } }, { iconDetails: {} }] },
        { iconTitleDetails: { name: "CameraIcon" } },
        { iconTitleDetails: { name: "ReactIcon" }, icons: null },
      ],
    };
    expect(criticalIconNames(resume)).toEqual(["CameraIcon", "HTML5Icon", "ReactIcon"]);
  });

  it("tolerates missing data", () => {
    expect(criticalIconNames(undefined)).toEqual([]);
    expect(criticalIconNames({})).toEqual([]);
  });
});
