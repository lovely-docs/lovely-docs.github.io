## Page Options

Control rendering behavior on a per-page or per-layout basis by exporting options from `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js`. Child layouts and pages override parent values.

### prerender
Generate static HTML files at build time for routes that serve identical content to all users.

```js
export const prerender = true;  // prerender this route
export const prerender = false; // don't prerender
export const prerender = 'auto'; // prerender but include in dynamic SSR manifest
```

The prerenderer crawls from entry points following `<a>` links. For dynamic routes like `/blog/[slug]`, export an `entries` function to specify which parameter values to prerender:

```js
export function entries() {
	return [{ slug: 'hello-world' }, { slug: 'another-post' }];
}
export const prerender = true;
```

Don't prerender pages with form actions (they need server to handle POST), pages requiring `url.searchParams`, or personalized content. Prerendering also applies to `+server.js` files.

### ssr
Disable server-side rendering to render only an empty shell on the server. Useful for pages using browser-only globals, but generally not recommended.

```js
export const ssr = false;
```

### csr
Disable client-side rendering to ship no JavaScript. The page must work with HTML and CSS only. Forms cannot be progressively enhanced, links trigger full-page navigation, and HMR is disabled.

```js
export const csr = false;
```

### trailingSlash
Control trailing slash behavior: `'never'` (default, redirects `/about/` to `/about`), `'always'`, or `'ignore'`.

```js
export const trailingSlash = 'always';
```

### config
Adapter-specific configuration as key-value pairs. Objects merge at top level only.

```js
export const config = { runtime: 'edge', regions: 'all' };
```