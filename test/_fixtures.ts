export const simple = `# Hello World

This is a simple paragraph with **bold** and *italic* text.
`;

export const withFrontmatter = `---
title: Test Post
date: 2024-01-15
tags:
  - javascript
  - markdown
---

# Getting Started

Welcome to this guide.

## Installation

Run the following command:

\`\`\`bash
npm install my-package
\`\`\`

## Usage

Import and use:

\`\`\`js
import { something } from "my-package";
something();
\`\`\`

That's it!
`;

export const complex = `---
title: Complex Document
author: Test Author
---

# Main Title

Some introductory text with a [link](https://example.com) and an ![image](./photo.jpg).

## Lists and Tables

### Unordered List

- Item one with **bold**
- Item two with \`inline code\`
- Item three
  - Nested item A
  - Nested item B

### Ordered List

1. First step
2. Second step
3. Third step

### Table

| Feature | Status | Notes |
|---------|--------|-------|
| Parsing | Done | Fast |
| Rendering | Done | Correct |
| Highlighting | WIP | Optional |

## Code Blocks

\`\`\`typescript
interface Config {
  name: string;
  version: number;
  plugins: string[];
}

function createConfig(name: string): Config {
  return {
    name,
    version: 1,
    plugins: [],
  };
}
\`\`\`

## GFM Features

- [x] Task completed
- [ ] Task pending

~~Deleted text~~ and normal text.

## Blockquote

> This is a blockquote with **formatted** text.
> It spans multiple lines.

## Headings

### Third Level

#### Fourth Level

##### Fifth Level

---

Final paragraph with various inline elements: **bold**, *italic*, \`code\`, and [links](https://example.com).
`;
