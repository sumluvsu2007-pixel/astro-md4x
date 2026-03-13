# astromd4x — What's Missing

## High priority (needed for real-world Astro compatibility)

- [ ] **Syntax highlighting via `highlighter` callback** — md4x supports `renderToHtml(md, { highlighter })`. Wire it up to accept a user-provided highlighter function or integrate with shiki. Astro expects `syntaxHighlight: 'shiki' | 'prism' | false` config.
- [ ] **Image path collection** — `metadata.localImagePaths` and `metadata.remoteImagePaths` always return `[]`. Need to walk md4x AST (`parseAST`) to collect `![](...)` image sources and classify local vs remote.
- [ ] **Heading ID on existing `id` attrs** — Current regex assumes no existing `id` on heading tags. Should respect user-set IDs (e.g., from MDX or custom attributes).
- [ ] **`createShikiHighlighter` export** — Astro re-exports this. Needs a shiki wrapper or stub.

## Medium priority (edge cases and completeness)

- [ ] **TOML frontmatter (`+++`)** — Only YAML `---` is supported. Original supports TOML via `smol-toml`. Low usage but part of the API contract.
- [ ] **Smartypants** — Typographic quotes/dashes. md4x doesn't have this built-in. Could post-process HTML or add as optional dep.
- [ ] **Remark/Rehype plugin support** — The unified plugin pipeline doesn't apply. Could offer a post-processing hook or HTML transform API as alternative.
- [ ] **`remarkCollectImages` / `rehypeHeadingIds` / `rehypePrism` / `rehypeShiki` exports** — Astro exports these individually. Need stubs or implementations.

## Low priority (nice to have)

- [ ] **`fileURL` render option** — Used for resolving relative image paths. Currently ignored.
- [ ] **Error handling with file path context** — Original wraps errors with `"Failed to parse Markdown file"` prefix. Add similar.
- [ ] **Performance benchmark CI** — Automate benchmark runs in CI and track regressions.
- [ ] **Comprehensive HTML output parity tests** — Snapshot-compare HTML output between both processors for a large fixture set.
- [ ] **MDX compatibility testing** — Verify the package works when Astro processes `.mdx` files.
