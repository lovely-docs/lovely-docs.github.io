## Page Options

Control rendering behavior per-page or per-layout by exporting options from `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js`. Child layouts/pages override parent values.

### prerender
Generate static HTML files at build time for routes that serve identical content to all users.

```js
export const prerender = true;  // prerender this route
export const prerender = false; // don't prerender
export const prerender = 'auto'; // prerender but include in dynamic SSR manifest
```

Prerenderer crawls from root following `<a>` links. Specify additional routes via `config.kit.prerender.entries` or export an `entries()` function from dynamic routes:

```js
// src/routes/blog/[slug]/+page.server.js
export function entries() {
	return [
		{ slug: 'hello-world' },
		{ slug: 'another-blog-post' }
	];
}
export const prerender = true;
```

Also applies to `+server.js` files. Prerender value is `true` during build (check via `building` from `$app/environment`).

**When not to prerender:** Content must be identical for all users. Cannot prerender pages with form actions. Cannot access `url.searchParams` during prerendering. Avoid route conflicts: use file extensions like `foo.json/+server.js` instead of `foo/+server.js`.

**Troubleshooting:** If marked prerenderable but not prerendered, ensure SvelteKit can discover the route via links from entry points or other prerendered pages, or change to `prerender = 'auto'`.

### ssr
Disable server-side rendering to render only an empty shell on server (useful for browser-only code using `document` etc., but generally not recommended).

```js
export const ssr = false;
```

Setting in root `+layout.js` converts entire app to SPA. If both `ssr` and `csr` are `false`, nothing renders.

### csr
Disable client-side rendering/hydration. Page works with HTML/CSS only, no JavaScript shipped.

```js
export const csr = false;
```

Effects: no `<script>` tags, no form progressive enhancement, full-page navigation, no HMR. Can conditionally enable during dev:

```js
import { dev } from '$app/environment';
export const csr = dev;
```

If both `csr` and `ssr` are `false`, nothing renders.

### trailingSlash
Control trailing slash behavior: `'never'` (default, redirects `/about/` to `/about`), `'always'`, or `'ignore'`.

```js
export const trailingSlash = 'always';
```

Affects prerendering: `'always'` creates `about/index.html`, otherwise `about.html`. Not recommended to ignore — relative path semantics differ and SEO is harmed.

### config
Adapter-specific configuration object. Top-level keys are merged (not nested levels).

```js
export const config = {
	runtime: 'edge',
	regions: 'all',
	foo: { bar: true }
};
```

Layout config `{ runtime: 'edge', regions: 'all', foo: { bar: true } }` merged with page config `{ regions: ['us1', 'us2'], foo: { baz: true } }` results in `{ runtime: 'edge', regions: ['us1', 'us2'], foo: { baz: true } }`.

### entries
Export `entries()` function from dynamic route's `+page.js`, `+page.server.js`, or `+server.js` to specify which parameter combinations to prerender. Can be async to fetch from CMS/database.

```js
export function entries() {
	return [{ slug: 'hello-world' }, { slug: 'another-blog-post' }];
}
export const prerender = true;
```

### Static evaluation
If all page options are boolean or string literals, SvelteKit evaluates them statically. Otherwise imports the file at build/runtime, so browser-only code must not run at module load — import it in `+page.svelte` or `+layout.svelte` instead.