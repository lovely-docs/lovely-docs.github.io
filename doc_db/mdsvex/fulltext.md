

## Pages

### getting_started
Markdown preprocessor for Svelte with component embedding, configurable syntax highlighting, layout wrapping, custom markdown element replacement, remark/rehype plugin support, and YAML/custom frontmatter parsing.

# mdsvex

Markdown preprocessor for Svelte components (MDX for Svelte). Allows using Svelte components in markdown and markdown in Svelte components.

## Installation

```bash
npm i --save-dev mdsvex
# or
yarn add --dev mdsvex
```

## Usage

Two main exports: `mdsvex` (preprocessor, preferred) and `compile` (direct compilation).

### mdsvex preprocessor

Add to your bundler config:

**Rollup + rollup-plugin-svelte:**
```js
import { mdsvex } from "mdsvex";

export default {
	plugins: [
		svelte({
			extensions: [".svelte", ".svx"],
			preprocess: mdsvex()
		})
	]
};
```

**Webpack + svelte-loader:**
```js
const { mdsvex } = require('mdsvex');
const extensions = ['.mjs', '.js', '.json', '.svelte', '.html', '.svx'];

module.exports = {
	module: {
		rules: [{
			test: /\.(svelte|html|svx)$/,
			use: {
				loader: 'svelte-loader',
				options: {
					preprocess: mdsvex()
				}
			}
		}]
	}
};
```

**Direct with svelte.preprocess:**
```js
const svelte = require('svelte/compiler');
const { mdsvex } = require('mdsvex');

const preprocessed = await svelte.preprocess(source, mdsvex(mdsvex_opts));
const compiled = svelte.compile(preprocessed, compiler_options);
```

### compile function

Direct compilation without bundler integration:
```js
import { compile } from 'mdsvex';

const transformed_code = await compile(`
<script>
  import Chart from './Chart.svelte';
</script>

# Hello friends

<Chart />
`, mdsvexOptions);
```

Accepts optional `filename` property in options (extension must match configured extensions).

## Options

```typescript
interface MdsvexOptions {
	extensions: string[];
	smartypants: boolean | smartypantsOptions;
	layout: string | { [name: string]: string };
	remarkPlugins: Array<plugin> | Array<[plugin, plugin_options]>;
	rehypePlugins: Array<plugin> | Array<[plugin, plugin_options]>;
	highlight: { highlighter: Function, alias: { [alias]: lang }, optimise: boolean };
	frontmatter: { parse: Function; marker: string };
}
```

### extensions

Default: `[".svx"]`

Custom file extensions. Must be passed to bundler plugin/loader config.

```js
svelte({
	extensions: [".svelte", ".custom"],
	preprocess: mdsvex({ extensions: [".custom"] })
})
```

To import `.md` files as components:
```js
// svelte.config.js
export default {
  extensions: ['.svelte', '.svx', '.md'],
  preprocess: mdsvex({ extensions: ['.svx', '.md'] }),
}
```

TypeScript declaration:
```ts
declare module '*.md' {
	import type { SvelteComponent } from 'svelte'
	export default class Comp extends SvelteComponent{}
	export const metadata: Record<string, unknown>
}
```

### smartypants

Default: `true`

Transforms ASCII punctuation to fancy typographic HTML entities. Can be boolean or options object:

```ts
{
	quotes: boolean = true;           // "words" → "words"
	ellipses: boolean = true;         // words... → words…
	backticks: boolean | 'all' = true; // ``words'' → "words"
	dashes: boolean | 'oldschool' | 'inverted' = true;
	// true: -- → —
	// 'oldschool': -- → –, --- → —
	// 'inverted': -- → —, --- → –
}
```

### layout

Wraps mdsvex document in a layout component that receives all frontmatter as props:

```js
mdsvex({ layout: "./path/to/layout.svelte" })
```

Layout component:
```svelte
<script>
  export let title;
  export let author;
  export let date;
</script>

<h1>{title}</h1>
<p>by: {author}</p>
<slot></slot>
```

**Named layouts** for different document types:
```js
mdsvex({
	layout: {
		blog: "./path/to/blog/layout.svelte",
		article: "./path/to/article/layout.svelte",
		_: "./path/to/fallback/layout.svelte"
	}
});
```

Specify in frontmatter:
```mdsvex
---
layout: blog
---
```

Auto-detection by folder name: documents in `blog/` folder use `blog` layout, `article/` uses `article` layout. Checks singular and pluralized names. Fallback (`_`) used if no match.

Disable layout for specific file:
```mdsvex
---
layout: false
---
```

**Custom components** via layout exports:
```svelte
<script context="module">
  import { h1, p, li } from './components.js';
  export { h1, p, li };
</script>
```

Named exports matching HTML element names replace those elements. Receives element attributes as props.

### remarkPlugins / rehypePlugins

Pipeline: source → Markdown AST (remark plugins) → HTML AST (rehype plugins) → Svelte component.

```js
import containers from "remark-containers";
import github from "remark-github";

mdsvex({
	remarkPlugins: [
		[containers, container_opts],
		github,
		[another_plugin, more_options]
	],
	rehypePlugins: [/* ... */]
});
```

Plugins can be passed as array of plugins or array of `[plugin, options]` pairs, mixed as needed.

### highlight

Default: PrismJS with 100+ languages, loaded on-demand.

```ts
{
	highlighter: (code: string, lang: string) => string | Promise<string>;
	alias: { [lang: string]: string };
	optimise: boolean;
}
```

Custom aliases:
```js
mdsvex({
	highlight: {
		alias: { yavascript: "javascript" }
	}
})
```

Custom highlighter:
```js
function highlighter(code, lang) {
	return `<pre><code>${code}</code></pre>`;
}

mdsvex({ highlight: { highlighter } })
```

Disable optimization (places code blocks in `@html`):
```js
mdsvex({ highlight: { optimise: false } })
```

### frontmatter

Default: YAML with `---` marker.

```ts
{ parse: Function, marker: string }
```

Custom marker:
```js
mdsvex({
	frontmatter: { marker: "+" }
});
// Now use +++ instead of ---
```

Custom parser (e.g., TOML):
```js
mdsvex({
	frontmatter: {
		marker: "+",
		parse(frontmatter, messages) {
			try {
				return toml.parse(frontmatter);
			} catch (e) {
				messages.push(`Parsing error on line ${e.line}: ${e.message}`);
			}
		}
	}
});
```

## Frontmatter

YAML frontmatter variables available directly in component and exported as `metadata`:

```mdsvex
---
title: My article
author: Dr. Fabuloso
---

# {title} by {author}
```

Exported as:
```js
import { metadata } from "./some-mdsvex-file.svx";
// metadata = { title: "My article", author: "Dr. Fabuloso" }
```

## Integration: Shiki

Use shiki instead of Prism:
```js
import { escapeSvelte } from 'mdsvex';
import { codeToHtml } from 'shiki';

const mdsvexOptions = {
	highlight: {
		async highlighter(code, lang = 'text') {
			const html = await codeToHtml(code, { lang, theme: 'github-dark' });
			return `{@html \`${escapeSvelte(html)}\` }`;
		}
	}
}
```

## Limitations

**Indentation:** 4-space indentation for code blocks doesn't work (conflicts with XML). Use fenced code blocks instead. Do not indent fenced code blocks—it breaks parsing.

```mdsvex
// ✓ Correct
\`\`\`js
console.log('Hello')
\`\`\`

// ✗ Wrong - don't indent
		\`\`\`js
		console.log('Hello')
		\`\`\`
```

Supports all Svelte syntax and almost all markdown syntax.

### svast-utils
Two mutable utility functions: `walk()` for tree traversal with optional child-skipping, and `cleanPositions()` to strip position metadata from nodes.

## Overview

Utilities for working with svast trees, which have non-standard structures with arrays of child nodes in unusual places. Operations are mutable (not immutable) for performance reasons.

## Installation

```bash
npm i svast-utils
```

## API

### `walk(tree, callback)`

Recursively visits every node in a svast tree.

**Signature:**
```ts
type walk = (tree: Node, cb: walkCallback) => Node;
type walkCallback = (node: Node, parent: Node | undefined) => void | boolean;
```

**Behavior:**
- Returns the same tree object (mutated, not copied)
- Callback receives current node and parent node (undefined at root)
- Return `false` from callback to skip walking children of that node (doesn't halt entire walk)
- No copying occurs; safe to mutate tree during walk, but avoid changing array lengths during iteration
- Uses recursion; very large trees may cause stack overflow

**Example:**
```js
import { walk } from 'svast-utils';

const tree = {
  type: 'root',
  children: [
    { type: 'hello' },
    { type: 'hello' },
    { type: 'somethingelse', children: [...] },
  ]
};

const node_names = [];
walk(tree, (node, parent) => {
  node_names.push(node.type);
  if (node.type === 'somethingelse') return false; // skip children
});
// node_names === ['root', 'hello', 'hello', 'somethingelse']
```

### `cleanPositions(tree)`

Removes all `position` properties from every node in a tree.

**Behavior:**
- Returns the same tree object (mutated, not copied)
- Useful for reducing tree size when positional data is no longer needed

**Example:**
```js
import { cleanPositions } from 'svast-utils';

const tree = {
  type: 'root',
  children: [
    { type: 'hello', position: { start: {...}, end: {...} } },
    { type: 'hello', position: { start: {...}, end: {...} } },
  ],
  position: { start: {...}, end: {...} }
};

const clean_tree = cleanPositions(tree);
// Returns same tree with all position properties removed
```

### svast
Unist-based AST specification for Svelte with svelte-prefixed nodes for elements, components, directives, properties, and control blocks (each, if, await, custom)

# SVAST - Svelte Abstract Syntax Tree

SVAST is an AST implementation following the Unist spec. All custom node types are camelCased and prefixed with `svelte`. The AST is language-agnostic with no opinion on expression contents.

## Base Unist Nodes

**UnistNode**: Base interface with `type: string`, `data: UnistData?`, `position: UnistPosition?`

**UnistPosition**: Represents node location with `start` and `end` UnistPoint, optional `indent`

**UnistPoint**: Represents a location with `line` (1-indexed), `column` (1-indexed), `offset` (0-indexed)

**UnistData**: Ecosystem-reserved space for node metadata

**UnistParent**: Node with `children: [UnistNode]`

## SVAST Nodes

**Parent**: Container with children including elements, components, comments, text, expressions, and blocks

**Literal**: Generic node with `type` and `value: string`

**Root**: Root node of the tree

**BaseTag**: Base for elements/components with `tagName`, `properties: [Property | Directive]`, `selfClosing: boolean`

**SvelteTag** (`type: "svelteMeta"`): Special svelte-namespaced tags like `<svelte:self />`
```js
<svelte:self this={Component} />
// →
{
  type: 'svelteTag',
  tagName: 'self',
  properties: [{
    type: 'svelteProperty',
    name: 'this',
    modifiers: [],
    value: [{ type: 'svelteExpression', value: 'Component' }]
  }],
  selfClosing: true,
  children: []
}
```

**Element** (`type: "svelteElement"`): DOM elements
```js
<input on:click|preventDefault={handleClick} />
// →
{
  type: 'svelteElement',
  tagName: 'input',
  properties: [{
    type: 'svelteDirective',
    name: 'on',
    specifier: 'click',
    modifiers: [{ type: 'modifier', value: 'preventDefault' }],
    value: [{ type: 'svelteExpression', value: 'handleClick' }]
  }],
  selfClosing: true,
  children: []
}
```

**Component** (`type: "svelteComponent"`): PascalCased component tags (same structure as Element)

**Script** (`type: "svelteScript"`): Script tags with single text child
```js
<script>console.log('boo');</script>
// →
{
  type: 'svelteScript',
  tagName: 'script',
  properties: [],
  selfClosing: false,
  children: [{ type: 'text', value: '\n  console.log(\'boo\');\n' }]
}
```

**Style** (`type: "svelteStyle"`): Style tags with single text child (same structure as Script)

**BaseProperty**: Base with `name`, `shorthand: 'none' | 'boolean' | 'expression'`, `value: [Text | Expression]`, `modifiers: [Literal]`

**Property** (`type: 'svelteProperty'`): HTML/SVG/ARIA/XML attributes. Shorthand syntax: `{prop}` (expression) or `prop` (boolean)
```js
<a name="hello {friend}!" />
// →
{
  type: 'svelteElement',
  tagName: 'a',
  properties: [{
    type: 'svelteProperty',
    name: 'name',
    value: [
      { type: 'text', value: 'hello' },
      { type: 'svelteExpression', value: 'friend' },
      { type: 'text', value: '!' }
    ],
    shorthand: 'none',
    modifiers: []
  }],
  selfClosing: true,
  children: []
}
```

**Directive** (`type: 'svelteDirective'`): Svelte directives `x:y={z}`. `name` is directive type (before `:`), `specifier` is implementation (after `:`). With shorthand, `value` is one Expression with value equal to specifier.
```js
<a class:myclass={x ? y : z} on:click|preventDefault={(e) => fn(e)} />
// →
{
  type: 'svelteElement',
  tagName: 'a',
  properties: [
    {
      type: 'svelteDirective',
      name: 'class',
      specifier: 'myclass',
      value: [{ type: 'svelteExpression', value: 'x ? y : z' }],
      shorthand: 'none',
      modifiers: []
    },
    {
      type: 'svelteDirective',
      name: 'on',
      specifier: 'click',
      value: [{ type: 'svelteExpression', value: '(e) => fn(e)' }],
      shorthand: 'none',
      modifiers: [{ type: 'svelteModifier', value: 'preventDefault' }]
    }
  ],
  selfClosing: true,
  children: []
}
```

**Comment** (`type: "comment"`): HTML comments with `value` containing comment text
```js
<!--Some thing here-->
// → { type: 'comment', value: 'Some thing here' }
```

**Text** (`type: "text"`): Bare text with `value`
```js
<div>Hello there</div>
// → { type: 'svelteElement', tagName: 'div', properties: [], selfClosing: false, children: [{ type: 'text', value: 'Hello there' }] }
```

**VoidBlock** (`type: 'svelteVoidBlock'`): Void blocks (no branches) with `name` and `expression: Expression`
```js
{@html `<p>something</p>`}
// →
{
  type: 'svelteVoidBlock',
  name: 'html',
  expression: { type: 'svelteExpression', value: '<p>something</p>' }
}
```

**BranchingBlock** (`type: 'svelteBranchingBlock'`): Blocks with arbitrary named branches. `name` is block name, `branches: [Branch]` (at least one)
```js
{#custom someExpression}Hello{/custom}
// →
{
  type: 'svelteBranchingBlock',
  name: 'custom',
  branches: [{
    type: 'svelteBranch',
    name: 'custom',
    expression: { type: 'svelteExpression', value: 'someExpression' },
    children: [{ type: 'text', value: 'Hello' }]
  }]
}
```

**EachBlock** (`type: 'svelteEachBlock'`): Each blocks with `expression` (collection), `itemName` (loop variable), optional `itemIndex`, optional `itemKey` (keyed each)
```js
{#each array.filter(v => v.prop) as { some, thing }, index (thing)}
  <p>{some}</p>
{/each}
// →
{
  type: 'svelteEachBlock',
  itemName: { type: 'svelteExpression', value: '{ some, thing }' },
  itemIndex: { type: 'svelteExpression', value: 'index' },
  itemKey: { type: 'svelteExpression', value: 'thing' },
  children: [{
    type: 'svelteElement',
    tagName: 'p',
    properties: [],
    selfClosing: false,
    children: [{ type: 'svelteExpression', value: 'some' }]
  }]
}
```

**Branch** (`type: 'svelteBranch'`): Branch of a block with `name`, `expression`, and `children`

### svelte-parse
Permissive Svelte parser generating SVAST with `parse()` for documents and `parseNode()` for composable parsing; limitations in JS expression handling, HTML parsing, and each block structure.

## Overview

A Svelte syntax parser that generates SVAST (Svelte Abstract Syntax Tree). It performs no validation and allows permissive parsing of Svelte syntax.

## Key Characteristics

- **Not a drop-in replacement** for the official Svelte parser
- **Permissive parsing**: allows invalid syntax that looks valid
- **Language agnostic**: doesn't parse content inside expressions and script elements
- **Error tolerant**: continues parsing and reports errors separately rather than throwing
- **No validation** for directives, modifiers, special tags, script/style elements

## Limitations

- **JavaScript expressions**: Matches curly braces and ignores quoted values. Fails if regular expressions contain unbalanced braces
- **HTML parsing**: Rudimentary implementation. Handles void tags (`<input/>` and `<input>` treated the same) but doesn't auto-close unclosed tags like `<p>`
- **Each blocks**: Currently parsed as `BranchingBlock` instead of `EachBlock` because language-agnostic parsing is difficult. Expression, name, index, and key stored as a blob in the expression field

## Installation

```bash
npm i svelte-parse
```

## API

### `parse(options)`

Parses entire Svelte document and returns AST.

```ts
interface ParseOptions {
  value: string;
  generatePositions?: boolean; // default = false
}
```

Returns:
```ts
interface ParseResult {
  ast: Root;
  errors: unknown[]; // WIP/TODO
}

interface Root {
  type: 'root';
  children: (SvelteElement | SvelteComponent | Comment | Text | SvelteExpression | VoidBlock | BranchingBlock | IfBlock | EachBlock | AwaitBlock | SvelteTag)[];
}
```

Example:
```js
import { parse } from 'svelte-parse';

const { ast, errors } = parse({ 
  value: `{@html someHTML}\n<div><input on:input={(e) => console.log(e)}/></div>`,
  generatePositions: true 
});
```

### `parseNode(options)`

Parses a single node from source string. Designed for composing parsers in hybrid languages. Returns the parsed node, positional info, and remaining unparsed content.

```ts
interface ParseNodeOptions {
  value: string;
  currentPosition?: Point & { index?: number };
  childParser: (options: ParseNodeOptions) => [Node[], Point & { index?: number }, number];
  block?: boolean;
  silent?: boolean;
  generatePositions: boolean;
}

interface Result {
  chomped: string;        // parsed portion
  unchomped: string;      // remaining portion
  parsed: Node;           // AST node
  position?: Point & { index?: number };
}
```

The `childParser` function should parse children and return `[nodes, position, index]`. It receives the same options as `parseNode` and should know when to yield to its caller.

### `Point`

Position tracking object:
```ts
interface Point {
  line: number;      // 1-indexed
  column: number;    // 1-indexed
  offset: number;    // 0-indexed character offset
}
```

## Usage Pattern

For document-level parsing, use `parse()`. For composable parsing (e.g., in hybrid language parsers), use `parseNode()` in a loop, passing `unchomped` back as `value` and `position` back as `currentPosition` in subsequent calls. See the library's `parse()` and `parse_siblings()` implementations for reference.

