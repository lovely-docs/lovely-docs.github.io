## mdsvex Preprocessor

Markdown preprocessor for Svelte enabling MDX-style component embedding. Two main exports: `mdsvex` (preprocessor, preferred) and `compile` (direct compilation).

**Installation & Setup:**
```bash
npm i --save-dev mdsvex
```

Integrates with bundlers via preprocessor:
- Rollup + rollup-plugin-svelte: add `preprocess: mdsvex()` to svelte plugin options
- Webpack + svelte-loader: add `preprocess: mdsvex()` to loader options
- Direct: `svelte.preprocess(source, mdsvex(opts))`

**Direct Compilation:**
```js
import { compile } from 'mdsvex';
const transformed = await compile(`<script>import Chart from './Chart.svelte';</script>\n# Hello\n<Chart />`, options);
```

**Configuration Options:**

- `extensions` (default: `[".svx"]`): Custom file extensions. To import `.md` files as components, add to both bundler config and mdsvex options.
- `smartypants` (default: `true`): ASCII punctuation to typographic entities. Options: `quotes`, `ellipses`, `backticks`, `dashes` (true/'oldschool'/'inverted').
- `layout`: Wraps document in layout component receiving frontmatter as props. Can be string path or object with named layouts (`blog`, `article`, `_` fallback). Auto-detects by folder name. Disable per-file with `layout: false` in frontmatter. Layout can export custom components (h1, p, li, etc.) to replace HTML elements.
- `remarkPlugins` / `rehypePlugins`: Plugin arrays, each plugin as `plugin` or `[plugin, options]`. Pipeline: source → remark (markdown AST) → rehype (HTML AST) → Svelte component.
- `highlight`: Code syntax highlighting. Default: PrismJS with 100+ languages on-demand. Options: `highlighter(code, lang)` function, `alias` object for language aliases, `optimise` boolean (false places code in `@html`). Custom example with Shiki: `highlighter: async (code, lang) => { const html = await codeToHtml(code, {lang, theme: 'github-dark'}); return \`{@html \\\`${escapeSvelte(html)}\\\`}\`; }`
- `frontmatter`: YAML by default with `---` marker. Options: `marker` (custom delimiter like `+`), `parse(frontmatter, messages)` function for custom parsers (e.g., TOML).

**Frontmatter & Metadata:**

YAML variables available in component and exported as `metadata`:
```mdsvex
---
title: My article
author: Dr. Fabuloso
---
# {title} by {author}
```
Import: `import { metadata } from "./file.svx";`

**Limitations:**

- 4-space indentation for code blocks doesn't work (XML conflict). Use fenced code blocks without indentation.
- Supports all Svelte syntax and almost all markdown syntax.

## SVAST - Svelte Abstract Syntax Tree

Unist-based AST specification for Svelte. All custom node types are camelCased and prefixed with `svelte`.

**Base Unist Nodes:**
- `UnistNode`: `type`, `data?`, `position?`
- `UnistPosition`: `start` and `end` UnistPoint, optional `indent`
- `UnistPoint`: `line` (1-indexed), `column` (1-indexed), `offset` (0-indexed)
- `UnistParent`: `children: [UnistNode]`

**SVAST Node Types:**

- `Root`: Root of tree
- `SvelteTag` (type: `svelteTag`): Special svelte-namespaced tags like `<svelte:self this={Component} />`
- `Element` (type: `svelteElement`): DOM elements with directives
- `Component` (type: `svelteComponent`): PascalCased component tags
- `Script` (type: `svelteScript`): Script tags with text child
- `Style` (type: `svelteStyle`): Style tags with text child
- `Property` (type: `svelteProperty`): HTML/SVG/ARIA attributes. Shorthand: `{prop}` (expression) or `prop` (boolean)
- `Directive` (type: `svelteDirective`): Svelte directives `x:y={z}`. `name` is directive type, `specifier` is implementation. Modifiers array for `|` modifiers.
- `Comment` (type: `comment`): HTML comments
- `Text` (type: `text`): Bare text
- `VoidBlock` (type: `svelteVoidBlock`): Void blocks like `{@html expr}` with `name` and `expression`
- `BranchingBlock` (type: `svelteBranchingBlock`): Blocks with branches (if/else, custom). `name`, `branches: [Branch]`
- `EachBlock` (type: `svelteEachBlock`): Each loops with `expression`, `itemName`, optional `itemIndex`, optional `itemKey` (keyed)
- `Branch` (type: `svelteBranch`): Block branch with `name`, `expression`, `children`

All tag nodes have: `tagName`, `properties: [Property | Directive]`, `selfClosing`, `children`.

## svelte-parse

Permissive Svelte syntax parser generating SVAST. Performs no validation, language-agnostic (doesn't parse JS expression contents), error-tolerant.

**Installation:**
```bash
npm i svelte-parse
```

**API:**

`parse(options)` - Parses entire document:
```ts
interface ParseOptions { value: string; generatePositions?: boolean; }
interface ParseResult { ast: Root; errors: unknown[]; }
```

`parseNode(options)` - Parses single node for composable parsing:
```ts
interface ParseNodeOptions {
  value: string;
  currentPosition?: Point & { index?: number };
  childParser: (opts) => [Node[], Point, number];
  block?: boolean;
  silent?: boolean;
  generatePositions: boolean;
}
interface Result { chomped: string; unchomped: string; parsed: Node; position?: Point; }
```

Usage pattern: call `parseNode()` in loop, passing `unchomped` as next `value` and `position` as next `currentPosition`.

**Limitations:**

- JS expressions: Matches braces, ignores quoted values. Fails if regexes contain unbalanced braces.
- HTML parsing: Rudimentary. Void tags treated same (`<input/>` = `<input>`). Doesn't auto-close unclosed tags.
- Each blocks: Parsed as `BranchingBlock` (language-agnostic limitation). Expression, name, index, key stored as blob in expression field.

## svast-utils

Utilities for working with svast trees. Operations are mutable for performance.

**Installation:**
```bash
npm i svast-utils
```

**API:**

`walk(tree, callback)` - Recursively visits every node:
```ts
type walk = (tree: Node, cb: (node: Node, parent?: Node) => void | boolean) => Node;
```
Return `false` to skip children of that node. Returns same tree (mutated). Uses recursion; large trees may overflow stack.

`cleanPositions(tree)` - Removes all `position` properties from every node. Returns same tree (mutated).

Example:
```js
import { walk, cleanPositions } from 'svast-utils';
const tree = { type: 'root', children: [{type: 'hello'}, {type: 'other', children: [...]}] };
walk(tree, (node, parent) => {
  if (node.type === 'other') return false; // skip children
});
cleanPositions(tree); // strip position metadata
```