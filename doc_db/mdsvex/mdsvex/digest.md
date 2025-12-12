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