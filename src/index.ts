import { init, parseMeta, renderToHtml } from "md4x";
import { createSlugger } from "./_slug.ts";
import type {
  AstroMarkdownOptions,
  AstroMarkdownProcessorOptions,
  MarkdownHeading,
  MarkdownProcessor,
  MarkdownProcessorRenderResult,
  SyntaxHighlightConfig,
} from "./types.ts";

export { extractFrontmatter, isFrontmatterValid, parseFrontmatter } from "./_frontmatter.ts";

export type {
  AstroMarkdownOptions,
  AstroMarkdownProcessorOptions,
  MarkdownHeading,
  MarkdownProcessor,
  MarkdownProcessorRenderOptions,
  MarkdownProcessorRenderResult,
  ParseFrontmatterOptions,
  ParseFrontmatterResult,
  RehypePlugin,
  RehypePlugins,
  RemarkPlugin,
  RemarkPlugins,
  RemarkRehype,
  ShikiConfig,
  SyntaxHighlightConfig,
  SyntaxHighlightConfigType,
} from "./types.ts";

export const syntaxHighlightDefaults: Required<SyntaxHighlightConfig> = {
  type: "shiki",
  excludeLangs: ["math"],
};

export const markdownConfigDefaults: Required<AstroMarkdownOptions> = {
  syntaxHighlight: syntaxHighlightDefaults,
  shikiConfig: {
    langs: [],
    theme: "github-dark",
    themes: {},
    wrap: false,
    transformers: [],
    langAlias: {},
  },
  remarkPlugins: [],
  rehypePlugins: [],
  remarkRehype: {},
  gfm: true,
  smartypants: true,
};

let _initialized = false;

/**
 * Create a markdown processor to render multiple markdown files.
 * API-compatible with `@astrojs/markdown-remark`'s `createMarkdownProcessor`.
 */
export async function createMarkdownProcessor(
  _opts?: AstroMarkdownProcessorOptions,
): Promise<MarkdownProcessor> {
  if (!_initialized) {
    await init();
    _initialized = true;
  }

  return {
    async render(content, renderOpts): Promise<MarkdownProcessorRenderResult> {
      const frontmatter = renderOpts?.frontmatter ?? {};

      // Extract headings metadata via parseMeta
      const meta = parseMeta(content);
      const rawHeadings: { level: number; text: string }[] = meta.headings ?? [];

      // Build heading metadata with slugs
      const slugger = createSlugger();
      const headings: MarkdownHeading[] = rawHeadings.map((h) => ({
        depth: h.level,
        text: h.text,
        slug: slugger.slug(h.text),
      }));

      // Render to HTML
      let html = renderToHtml(content);

      // Inject heading IDs into HTML (matching Astro behavior)
      html = injectHeadingIds(html, headings);

      return {
        code: html,
        metadata: {
          headings,
          localImagePaths: [],
          remoteImagePaths: [],
          frontmatter,
        },
      };
    },
  };
}

// --- Internal helpers ---

const headingTagRE = /(<h([1-6]))(>)/g;

function injectHeadingIds(html: string, headings: MarkdownHeading[]): string {
  let headingIndex = 0;
  return html.replace(headingTagRE, (match, open, _level, close) => {
    const heading = headings[headingIndex++];
    if (heading) {
      return `${open} id="${heading.slug}"${close}`;
    }
    return match;
  });
}
