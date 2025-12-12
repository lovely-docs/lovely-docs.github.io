# mdsvex

Markdown preprocessor for Svelte (MDX for Svelte). Use Svelte components in markdown and vice versa.

## Installation & Setup

```bash
npm i --save-dev mdsvex
```

Add to bundler (rollup/webpack) or use `svelte.preprocess()` directly. Handles `.svx` files by default.

## Core Options

**extensions**: Custom file extensions (default `[".svx"]`)

**smartypants**: ASCII → fancy punctuation (default `true`)

**layout**: Wrap documents in layout component(s) receiving frontmatter as props. Supports named layouts with auto-detection by folder name.

**Custom components**: Export HTML element names from layout's `context="module"` script to replace markdown elements.

**remarkPlugins/rehypePlugins**: Extend via remark/rehype plugin ecosystem

**highlight**: Syntax highlighting (default: PrismJS 100+ languages). Custom highlighter or shiki integration supported.

**frontmatter**: YAML by default. Custom marker and parser (e.g., TOML) supported.

## Frontmatter

Variables available in component and exported as `metadata` object for import.

## Limitations

4-space code block indentation doesn't work. Don't indent fenced code blocks.