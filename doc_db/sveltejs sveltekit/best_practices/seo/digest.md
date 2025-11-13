## Out of the box

**SSR**: Server-side rendering is enabled by default and should be kept on for better search engine indexing. Dynamic rendering can be implemented if needed.

**Performance**: Core Web Vitals impact rankings. Svelte/SvelteKit have minimal overhead. Use hybrid rendering mode and optimize images. Test with PageSpeed Insights or Lighthouse.

**Normalized URLs**: Trailing slashes are automatically redirected to maintain consistent URLs for SEO.

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

**AMP**: Set `inlineStyleThreshold: Infinity` in config, disable `csr` in root layout, add `amp` attribute to `<html>`, and transform HTML in `src/hooks.server.js` using `@sveltejs/amp`. Optionally use `dropcss` to remove unused CSS.