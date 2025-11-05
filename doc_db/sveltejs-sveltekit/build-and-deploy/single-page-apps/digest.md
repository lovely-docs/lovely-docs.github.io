## Creating a Single-Page App

Turn a SvelteKit app into a fully client-rendered SPA by specifying a fallback page that serves any URLs not handled by other means.

### Setup

Disable SSR for pages you don't want to prerender in your root layout:

```js
/// file: src/routes/+layout.js
export const ssr = false;
```

Use `adapter-static` with the `fallback` option:

```js
/// file: svelte.config.js
import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter({
			fallback: '200.html'
		})
	}
};

export default config;
```

The fallback page is an HTML file created from your app template that loads your app and navigates to the correct route. The specific filename depends on your host (e.g., Surge uses `200.html`).

### Prerendering Individual Pages

Re-enable SSR and add prerender for specific pages:

```js
/// file: src/routes/my-prerendered-page/+page.js
export const prerender = true;
export const ssr = true;
```

These pages render at build time and output as static `.html` files, requiring no Node server to deploy.

### Apache Configuration

Add `static/.htaccess` to route requests to the fallback page:

```
<IfModule mod_rewrite.c>
	RewriteEngine On
	RewriteBase /
	RewriteRule ^200\.html$ - [L]
	RewriteCond %{REQUEST_FILENAME} !-f
	RewriteCond %{REQUEST_FILENAME} !-d
	RewriteRule . /200.html [L]
</IfModule>
```

### Performance Considerations

SPAs have significant drawbacks: multiple network round trips delay startup, harm SEO through performance penalties and Core Web Vitals failures, exclude non-JS-rendering search engines, and fail when JavaScript is disabled. Prerender as many pages as possible, especially the homepage. If all pages can be prerendered, use static site generation instead. Otherwise, use an adapter supporting server-side rendering.