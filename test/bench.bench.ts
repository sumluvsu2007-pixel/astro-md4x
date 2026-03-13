import { bench, describe } from "vitest";
import {
  createMarkdownProcessor as createAstroProcessor,
  parseFrontmatter,
} from "astro-markdown-remark";
import { createMarkdownProcessor as createMd4xProcessor } from "../src/index.ts";
import { complex, simple, withFrontmatter } from "./_fixtures.ts";

// Astro expects frontmatter stripped before render — include that cost in benchmarks
const withFrontmatterStripped = parseFrontmatter(withFrontmatter).content;
const complexStripped = parseFrontmatter(complex).content;

describe("createMarkdownProcessor", () => {
  bench("astromd4x", async () => {
    await createMd4xProcessor();
  });

  bench("@astrojs/markdown-remark", async () => {
    await createAstroProcessor({ syntaxHighlight: false });
  });
});

describe("render: simple", async () => {
  const astro = await createAstroProcessor({ syntaxHighlight: false });
  const md4x = await createMd4xProcessor();

  bench("astromd4x", async () => {
    await md4x.render(simple);
  });

  bench("@astrojs/markdown-remark", async () => {
    await astro.render(simple);
  });
});

describe("render: with frontmatter", async () => {
  const astro = await createAstroProcessor({ syntaxHighlight: false });
  const md4x = await createMd4xProcessor();

  bench("astromd4x", async () => {
    await md4x.render(withFrontmatter);
  });

  bench("@astrojs/markdown-remark", async () => {
    await astro.render(withFrontmatterStripped);
  });
});

describe("render: complex document", async () => {
  const astro = await createAstroProcessor({ syntaxHighlight: false });
  const md4x = await createMd4xProcessor();

  bench("astromd4x", async () => {
    await md4x.render(complex);
  });

  bench("@astrojs/markdown-remark", async () => {
    await astro.render(complexStripped);
  });
});
