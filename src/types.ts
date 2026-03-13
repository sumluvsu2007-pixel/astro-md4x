// API-compatible types with @astrojs/markdown-remark

export interface MarkdownHeading {
  depth: number;
  slug: string;
  text: string;
}

export interface MarkdownProcessorRenderOptions {
  /** The URL of the file being rendered, used for resolving relative image paths */
  fileURL?: URL;
  /** Used for frontmatter injection plugins */
  frontmatter?: Record<string, any>;
}

export interface MarkdownProcessorRenderResult {
  code: string;
  metadata: {
    headings: MarkdownHeading[];
    localImagePaths: string[];
    remoteImagePaths: string[];
    frontmatter: Record<string, any>;
  };
}

export interface MarkdownProcessor {
  render: (
    content: string,
    opts?: MarkdownProcessorRenderOptions,
  ) => Promise<MarkdownProcessorRenderResult>;
}

// Plugin types (simplified — no unified/hast/mdast deps)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RemarkPlugin<PluginParameters extends any[] = any[]> = (
  ...args: PluginParameters
) => any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RehypePlugin<PluginParameters extends any[] = any[]> = (
  ...args: PluginParameters
) => any;

export type RemarkPlugins = (string | [string, any] | RemarkPlugin | [RemarkPlugin, any])[];
export type RehypePlugins = (string | [string, any] | RehypePlugin | [RehypePlugin, any])[];

export type RemarkRehype = Record<string, any>;

export type SyntaxHighlightConfigType = "shiki" | "prism";

export interface SyntaxHighlightConfig {
  type: SyntaxHighlightConfigType;
  excludeLangs?: string[];
}

export interface ShikiConfig {
  langs?: any[];
  theme?: string;
  themes?: Record<string, any>;
  wrap?: boolean | null;
  transformers?: any[];
  langAlias?: Record<string, string>;
  defaultColor?: "light" | "dark" | string | false;
}

export interface AstroMarkdownOptions {
  syntaxHighlight?: SyntaxHighlightConfig | SyntaxHighlightConfigType | false;
  shikiConfig?: ShikiConfig;
  remarkPlugins?: RemarkPlugins;
  rehypePlugins?: RehypePlugins;
  remarkRehype?: RemarkRehype;
  gfm?: boolean;
  smartypants?: boolean;
}

export type AstroMarkdownProcessorOptions = AstroMarkdownOptions;

export interface ParseFrontmatterOptions {
  /**
   * How the frontmatter should be handled in the returned `content` string.
   * - `preserve`: Keep the frontmatter.
   * - `remove`: Remove the frontmatter.
   * - `empty-with-spaces`: Replace the frontmatter with empty spaces. (preserves sourcemap line/col/offset)
   * - `empty-with-lines`: Replace the frontmatter with empty line breaks. (preserves sourcemap line/col)
   *
   * @default 'remove'
   */
  frontmatter: "preserve" | "remove" | "empty-with-spaces" | "empty-with-lines";
}

export interface ParseFrontmatterResult {
  frontmatter: Record<string, any>;
  rawFrontmatter: string;
  content: string;
}
