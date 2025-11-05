## Out of the box

**SSR**: SvelteKit uses server-side rendering by default, which search engines index more reliably than client-side rendered content. Keep it enabled unless you have a specific reason to disable it.

**Performance**: Core Web Vitals impact search rankings. Svelte/SvelteKit have minimal overhead. Use hybrid rendering mode and optimize images. Test with PageSpeed Insights or Lighthouse.

**Normalized URLs**: SvelteKit automatically redirects trailing slash variants to prevent duplicate URL issues.

## Manual setup

**Title and Meta**: Every page needs unique `<title>` and `<meta name="description">` in `<svelte:head>`. Common pattern: return SEO data from page `load` functions and use it in root layout's `<svelte:head>`.

**Sitemaps**: Create dynamically via endpoint at `src/routes/sitemap.xml/+server.js`:
```js
export async function GET() {
	return new Response(
		`<?xml version="1.0" encoding="UTF-8" ?>
		<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
			<!-- <url> elements go here -->
		</urlset>`,
		{ headers: { 'Content-Type': 'application/xml' } }
	);
}
```

**AMP**: To create AMP versions, set `inlineStyleThreshold: Infinity` in config, disable `csr` in root layout, add `amp` attribute to `<html>`, and transform HTML in `src/hooks.server.js` using `@sveltejs/amp`. Optionally use `dropcss` to remove unused CSS.