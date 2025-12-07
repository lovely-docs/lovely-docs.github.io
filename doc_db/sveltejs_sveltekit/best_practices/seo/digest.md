## SEO Best Practices for SvelteKit

### Out of the Box Features

**SSR (Server-Side Rendering)**
- SvelteKit uses SSR by default, which is more reliably indexed by search engines than client-side rendering
- Can be disabled in `handle` hook but not recommended unless necessary
- Dynamic rendering is possible if needed but not generally recommended

**Performance**
- Core Web Vitals impact search engine ranking
- Svelte/SvelteKit have minimal overhead, making high-performance sites easier to build
- Test with Google PageSpeed Insights or Lighthouse
- Use hybrid rendering mode and optimize images to improve speed

**Normalized URLs**
- SvelteKit automatically redirects trailing slash variants to maintain canonical URLs (configurable via `trailingSlash` option)

### Manual Setup

**Title and Meta Tags**
- Every page needs unique `<title>` and `<meta name="description">` in `<svelte:head>`
- Common pattern: return SEO data from page `load` functions, use in root layout's `<svelte:head>` via `page.data`

**Sitemaps**
- Create dynamically using an endpoint at `src/routes/sitemap.xml/+server.js`:
```js
export async function GET() {
	return new Response(
		`<?xml version="1.0" encoding="UTF-8" ?>
		<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" ...>
			<!-- <url> elements go here -->
		</urlset>`.trim(),
		{ headers: { 'Content-Type': 'application/xml' } }
	);
}
```

**AMP (Accelerated Mobile Pages)**
- Set `inlineStyleThreshold: Infinity` in `svelte.config.js` to inline all styles (since `<link rel="stylesheet">` isn't allowed in AMP)
- Disable CSR in root layout: `export const csr = false;`
- Add `amp` attribute to `<html>` in `app.html`
- Transform HTML in `src/hooks.server.js`:
```js
import * as amp from '@sveltejs/amp';

export async function handle({ event, resolve }) {
	let buffer = '';
	return await resolve(event, {
		transformPageChunk: ({ html, done }) => {
			buffer += html;
			if (done) return amp.transform(buffer);
		}
	});
}
```
- Optionally use `dropcss` to remove unused CSS after AMP transformation:
```js
import * as amp from '@sveltejs/amp';
import dropcss from 'dropcss';

export async function handle({ event, resolve }) {
	let buffer = '';
	return await resolve(event, {
		transformPageChunk: ({ html, done }) => {
			buffer += html;
			if (done) {
				let css = '';
				const markup = amp.transform(buffer)
					.replace('⚡', 'amp')
					.replace(/<style amp-custom([^>]*?)>([^]+?)<\/style>/, (match, attributes, contents) => {
						css = contents;
						return `<style amp-custom${attributes}></style>`;
					});
				css = dropcss({ css, html: markup }).css;
				return markup.replace('</style>', `${css}</style>`);
			}
		}
	});
}
```
- Validate transformed HTML with `amphtml-validator` in `handle` hook (only for prerendered pages due to performance)