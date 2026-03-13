import { parseMeta } from "md4x";
import type { ParseFrontmatterOptions, ParseFrontmatterResult } from "./types.ts";

// Capture frontmatter wrapped with `---`, including any characters and new lines within it.
const frontmatterRE = /(?:^\uFEFF?|^\s*\n)(?:---)([\s\S]*?\n)(?:---)/;

export function extractFrontmatter(code: string): string | undefined {
  return frontmatterRE.exec(code)?.[1];
}

export function isFrontmatterValid(frontmatter: Record<string, any>): boolean {
  try {
    JSON.stringify(frontmatter);
  } catch {
    return false;
  }
  return typeof frontmatter === "object" && frontmatter !== null;
}

export function parseFrontmatter(
  code: string,
  options?: ParseFrontmatterOptions,
): ParseFrontmatterResult {
  const rawFrontmatter = extractFrontmatter(code);

  if (rawFrontmatter == null) {
    return { frontmatter: {}, rawFrontmatter: "", content: code };
  }

  // Use md4x's parseMeta for YAML parsing
  const meta = parseMeta(code);
  const { headings: _, ...frontmatter } = meta;

  let content: string;
  const delims = "---";
  switch (options?.frontmatter ?? "remove") {
    case "preserve":
      content = code;
      break;
    case "remove":
      content = code.replace(`${delims}${rawFrontmatter}${delims}`, "");
      break;
    case "empty-with-spaces":
      content = code.replace(
        `${delims}${rawFrontmatter}${delims}`,
        `   ${rawFrontmatter.replace(/[^\r\n]/g, " ")}   `,
      );
      break;
    case "empty-with-lines":
      content = code.replace(
        `${delims}${rawFrontmatter}${delims}`,
        rawFrontmatter.replace(/[^\r\n]/g, ""),
      );
      break;
  }

  return {
    frontmatter,
    rawFrontmatter,
    content,
  };
}
