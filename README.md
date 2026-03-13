# astromd4x

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/astromd4x?color=yellow)](https://npmjs.com/package/astromd4x)
[![npm downloads](https://img.shields.io/npm/dm/astromd4x?color=yellow)](https://npm.chart.dev/astromd4x)

<!-- /automd -->

Drop-in replacement for [`@astrojs/markdown-remark`](https://github.com/withastro/astro/tree/main/packages/markdown/remark) powered by [md4x](https://github.com/pi0/md4x).

**~50-70x faster** markdown rendering with a single native dependency.

## Benchmarks

| Scenario                  | astromd4x   | @astrojs/markdown-remark | Speedup   |
| ------------------------- | ----------- | ------------------------ | --------- |
| `createMarkdownProcessor` | 11.8M ops/s | 1.8M ops/s               | **6.5x**  |
| render: simple            | 443K ops/s  | 8.2K ops/s               | **53.7x** |
| render: with frontmatter  | 155K ops/s  | 4.5K ops/s               | **34.5x** |
| render: complex document  | 49K ops/s   | 670 ops/s                | **73x**   |

## Usage

Install the package:

```sh
npx nypm install astromd4x
```

Override `@astrojs/markdown-remark` in your root `package.json`:

```json
{
  "pnpm": {
    "overrides": {
      "@astrojs/markdown-remark": "npm:astromd4x@latest"
    }
  }
}
```

Or use directly:

```ts
import { createMarkdownProcessor, parseFrontmatter } from "astromd4x";

const processor = await createMarkdownProcessor();
const { code, metadata } = await processor.render("# Hello World");

console.log(code); // <h1 id="hello-world">Hello World</h1>
console.log(metadata.headings); // [{ depth: 1, slug: 'hello-world', text: 'Hello World' }]
```

## API

### `createMarkdownProcessor(opts?)`

Creates a reusable markdown processor. Returns `{ render(content, opts?) }`.

```ts
const processor = await createMarkdownProcessor();
const result = await processor.render(markdown);
// result.code - HTML string
// result.metadata.headings - { depth, slug, text }[]
// result.metadata.frontmatter - Record<string, any>
```

### `parseFrontmatter(code, options?)`

Parses YAML frontmatter from markdown content.

```ts
const { frontmatter, rawFrontmatter, content } = parseFrontmatter(markdown);
```

Options for `frontmatter`: `'preserve'` | `'remove'` (default) | `'empty-with-spaces'` | `'empty-with-lines'`

### `extractFrontmatter(code)`

Returns raw frontmatter string or `undefined`.

### `isFrontmatterValid(frontmatter)`

Returns `true` if the frontmatter object is JSON-serializable.

### `markdownConfigDefaults` / `syntaxHighlightDefaults`

Default configuration objects matching `@astrojs/markdown-remark` defaults.

## Features

- GFM (tables, task lists, strikethrough, autolinks)
- YAML frontmatter parsing
- Heading ID generation (github-slugger compatible)
- Heading metadata extraction
- Full type compatibility with `@astrojs/markdown-remark`

## Current Limitations

This is an early release focused on core rendering performance. Some `@astrojs/markdown-remark` features are not yet implemented:

- Shiki/Prism syntax highlighting (md4x supports a `highlighter` callback — wiring planned)
- Remark/Rehype plugin pipeline
- Image path collection (`localImagePaths`/`remoteImagePaths`)
- Smartypants typography
- TOML frontmatter

See [plan.md](./plan.md) for the full roadmap.

## Development

<details>

<summary>local development</summary>

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`
- Run benchmarks using `pnpm vitest bench test/bench.bench.ts`

</details>

## License

Published under the [MIT](https://github.com/pi0/astromd4x/blob/main/LICENSE) license.
