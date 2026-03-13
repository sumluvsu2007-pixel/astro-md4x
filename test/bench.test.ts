import { describe, expect, it } from "vitest";
import {
  createMarkdownProcessor as createAstroProcessor,
  parseFrontmatter as astroParseFrontmatter,
} from "astro-markdown-remark";
import {
  createMarkdownProcessor as createMd4xProcessor,
  parseFrontmatter as md4xParseFrontmatter,
} from "../src/index.ts";
import { complex, simple, withFrontmatter } from "./_fixtures.ts";

// Astro expects frontmatter to be stripped before render()
function stripFrontmatter(md: string): string {
  return astroParseFrontmatter(md).content;
}

describe("benchmark validation", () => {
  it("both processors render simple markdown", async () => {
    const astro = await createAstroProcessor({ syntaxHighlight: false });
    const md4x = await createMd4xProcessor();

    const astroResult = await astro.render(simple);
    const md4xResult = await md4x.render(simple);

    expect(astroResult.code).toContain("<h1");
    expect(md4xResult.code).toContain("<h1");
    expect(astroResult.code).toContain("<strong>bold</strong>");
    expect(md4xResult.code).toContain("<strong>bold</strong>");
    expect(astroResult.code).toContain("<em>italic</em>");
    expect(md4xResult.code).toContain("<em>italic</em>");
  });

  it("both processors handle content with frontmatter", async () => {
    const astro = await createAstroProcessor({ syntaxHighlight: false });
    const md4x = await createMd4xProcessor();

    const stripped = stripFrontmatter(withFrontmatter);
    const astroResult = await astro.render(stripped);
    const md4xResult = await md4x.render(withFrontmatter);

    // Neither should contain frontmatter in output
    expect(astroResult.code).not.toContain("title: Test Post");
    expect(md4xResult.code).not.toContain("title: Test Post");

    // Both should render headings
    expect(astroResult.code).toContain("Getting Started");
    expect(md4xResult.code).toContain("Getting Started");

    // Both should return heading metadata with matching slugs
    expect(astroResult.metadata.headings.length).toBeGreaterThan(0);
    expect(md4xResult.metadata.headings.length).toBe(astroResult.metadata.headings.length);
    expect(astroResult.metadata.headings[0]!.slug).toBe("getting-started");
    expect(md4xResult.metadata.headings[0]!.slug).toBe("getting-started");
  });

  it("both processors extract headings with correct depth", async () => {
    const astro = await createAstroProcessor({ syntaxHighlight: false });
    const md4x = await createMd4xProcessor();

    const stripped = stripFrontmatter(complex);
    const astroResult = await astro.render(stripped);
    const md4xResult = await md4x.render(complex);

    // Same heading count
    expect(md4xResult.metadata.headings.length).toBe(astroResult.metadata.headings.length);

    // Same depths and slugs
    for (let i = 0; i < astroResult.metadata.headings.length; i++) {
      expect(md4xResult.metadata.headings[i]!.depth).toBe(astroResult.metadata.headings[i]!.depth);
      expect(md4xResult.metadata.headings[i]!.slug).toBe(astroResult.metadata.headings[i]!.slug);
    }
  });

  it("both processors render GFM tables", async () => {
    const astro = await createAstroProcessor({ syntaxHighlight: false });
    const md4x = await createMd4xProcessor();

    const stripped = stripFrontmatter(complex);
    const astroResult = await astro.render(stripped);
    const md4xResult = await md4x.render(complex);

    expect(astroResult.code).toContain("<table>");
    expect(md4xResult.code).toContain("<table>");
  });

  it("both processors render GFM task lists", async () => {
    const astro = await createAstroProcessor({ syntaxHighlight: false });
    const md4x = await createMd4xProcessor();

    const stripped = stripFrontmatter(complex);
    const astroResult = await astro.render(stripped);
    const md4xResult = await md4x.render(complex);

    expect(astroResult.code).toContain("checked");
    expect(md4xResult.code).toContain("checked");
  });

  it("both processors render strikethrough", async () => {
    const astro = await createAstroProcessor({ syntaxHighlight: false });
    const md4x = await createMd4xProcessor();

    const stripped = stripFrontmatter(complex);
    const astroResult = await astro.render(stripped);
    const md4xResult = await md4x.render(complex);

    expect(astroResult.code).toContain("<del>");
    expect(md4xResult.code).toContain("<del>");
  });

  it("parseFrontmatter produces same results", () => {
    const astroResult = astroParseFrontmatter(withFrontmatter);
    const md4xResult = md4xParseFrontmatter(withFrontmatter);

    expect(md4xResult.frontmatter.title).toBe(astroResult.frontmatter.title);
    expect(md4xResult.rawFrontmatter).toBe(astroResult.rawFrontmatter);
  });
});
