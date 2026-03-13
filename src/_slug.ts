/**
 * GitHub-slugger compatible slug generation.
 * Tracks used slugs to deduplicate within a render call.
 */
export function createSlugger() {
  const occurrences = new Map<string, number>();

  return {
    slug(value: string): string {
      let slug = value
        .toLowerCase()
        .trim()
        .replace(/[\s+]/g, "-")
        .replace(/[^\p{L}\p{M}\p{N}\p{Pc}-]/gu, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      const count = occurrences.get(slug) ?? 0;
      occurrences.set(slug, count + 1);

      if (count > 0) {
        slug = `${slug}-${count}`;
      }

      return slug;
    },
  };
}
