/**
 * Icon component names the prerendered HTML contains: the header skills and
 * each section's title icon. vite.config.js turns them into the
 * `virtual:critical-icons` module so those components ship in the main
 * bundle and hydration never waits for them; every other icon loads on
 * demand (see src/stories/components/molecules/IconGallery/registry.tsx).
 */
export const criticalIconNames = (resume) => {
  const names = new Set();
  for (const section of resume?.pageBuilder ?? []) {
    for (const icon of section?.icons ?? []) {
      if (icon?.iconDetails?.name) names.add(icon.iconDetails.name);
    }
    if (section?.iconTitleDetails?.name) names.add(section.iconTitleDetails.name);
  }
  return [...names].sort();
};
