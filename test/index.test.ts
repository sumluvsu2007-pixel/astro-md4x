import { describe, expect, it } from "vitest";
import {
  createMarkdownProcessor,
  extractFrontmatter,
  isFrontmatterValid,
  parseFrontmatter,
} from "../src/index.ts";

describe("createMarkdownProcessor", () => {
  it("renders basic markdown to HTML", async () => {
    const processor = await createMarkdownProcessor();
    const result = await processor.render("# Hello\n\nWorld");

    expect(result.code).toContain("<h1");
    expect(result.code).toContain("Hello");
    expect(result.code).toContain("<p>World</p>");
  });

  it("returns heading metadata with slugs", async () => {
    const processor = await createMarkdownProcessor();
    const result = await processor.render("# Hello World\n## Sub Heading\n### Third");

    expect(result.metadata.headings).toEqual([
      { depth: 1, text: "Hello World", slug: "hello-world" },
      { depth: 2, text: "Sub Heading", slug: "sub-heading" },
      { depth: 3, text: "Third", slug: "third" },
    ]);
  });

  it("injects heading IDs into HTML", async () => {
    const processor = await createMarkdownProcessor();
    const result = await processor.render("# Hello World");

    expect(result.code).toContain('id="hello-world"');
  });

  it("deduplicates heading slugs", async () => {
    const processor = await createMarkdownProcessor();
    const result = await processor.render("# Hello\n## Hello\n### Hello");

    expect(result.metadata.headings).toEqual([
      { depth: 1, text: "Hello", slug: "hello" },
      { depth: 2, text: "Hello", slug: "hello-1" },
      { depth: 3, text: "Hello", slug: "hello-2" },
    ]);
  });

  it("strips frontmatter from output", async () => {
    const processor = await createMarkdownProcessor();
    const result = await processor.render("---\ntitle: Test\n---\n# Hello");

    expect(result.code).not.toContain("title: Test");
    expect(result.code).toContain("Hello");
  });

  it("passes through frontmatter from render options", async () => {
    const processor = await createMarkdownProcessor();
    const result = await processor.render("# Hello", {
      frontmatter: { title: "Custom" },
    });

    expect(result.metadata.frontmatter).toEqual({ title: "Custom" });
  });

  it("renders GFM tables", async () => {
    const processor = await createMarkdownProcessor();
    const result = await processor.render("| a | b |\n|---|---|\n| 1 | 2 |");

    expect(result.code).toContain("<table>");
    expect(result.code).toContain("<td>1</td>");
  });

  it("renders GFM task lists", async () => {
    const processor = await createMarkdownProcessor();
    const result = await processor.render("- [x] done\n- [ ] todo");

    expect(result.code).toContain("checked");
    expect(result.code).toContain("task-list-item");
  });

  it("renders strikethrough", async () => {
    const processor = await createMarkdownProcessor();
    const result = await processor.render("~~deleted~~");

    expect(result.code).toContain("<del>deleted</del>");
  });

  it("returns empty arrays for image paths", async () => {
    const processor = await createMarkdownProcessor();
    const result = await processor.render("# Hello");

    expect(result.metadata.localImagePaths).toEqual([]);
    expect(result.metadata.remoteImagePaths).toEqual([]);
  });
});

describe("parseFrontmatter", () => {
  it("parses YAML frontmatter", () => {
    const result = parseFrontmatter("---\ntitle: Hello\n---\nContent");

    expect(result.frontmatter).toEqual({ title: "Hello" });
    expect(result.rawFrontmatter).toBe("\ntitle: Hello\n");
    expect(result.content).toBe("\nContent");
  });

  it("returns empty for no frontmatter", () => {
    const result = parseFrontmatter("# Hello");

    expect(result.frontmatter).toEqual({});
    expect(result.rawFrontmatter).toBe("");
    expect(result.content).toBe("# Hello");
  });

  it("preserves frontmatter when option set", () => {
    const code = "---\ntitle: Hello\n---\nContent";
    const result = parseFrontmatter(code, { frontmatter: "preserve" });

    expect(result.content).toBe(code);
  });

  it("removes frontmatter by default", () => {
    const result = parseFrontmatter("---\ntitle: Hello\n---\nContent");

    expect(result.content).not.toContain("title:");
    expect(result.content).toContain("Content");
  });
});

describe("extractFrontmatter", () => {
  it("extracts raw frontmatter string", () => {
    const result = extractFrontmatter("---\ntitle: Hello\n---\nContent");

    expect(result).toBe("\ntitle: Hello\n");
  });

  it("returns undefined for no frontmatter", () => {
    expect(extractFrontmatter("# Hello")).toBeUndefined();
  });
});

describe("isFrontmatterValid", () => {
  it("validates JSON-serializable objects", () => {
    expect(isFrontmatterValid({ title: "Hello" })).toBe(true);
  });

  it("rejects circular references", () => {
    const obj: any = {};
    obj.self = obj;
    expect(isFrontmatterValid(obj)).toBe(false);
  });
});
