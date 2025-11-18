## Creating SPAs with SvelteKit

Disable SSR in your root layout to serve all pages via a fallback page:
```js
// src/routes/+layout.js
export const ssr = false;
```

Use `adapter-static` with the `fallback` option to generate your SPA:
```js
// svelte.config.js
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

The fallback page is an HTML file that loads your app and navigates to the correct route. The specific filename depends on your hosting platform (e.g., `200.html` for Surge).

## Prerendering specific pages

Re-enable SSR and add `prerender` for pages you want prerendered:
```js
// src/routes/my-prerendered-page/+page.js
export const prerender = true;
export const ssr = true;
```

## Apache configuration

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

**Important notes:** SPAs have significant performance drawbacks (multiple network round trips, poor Core Web Vitals, SEO harm, JavaScript dependency). Prerender as many pages as possible, especially your homepage. If you can prerender all pages, use static site generation instead. Otherwise, consider server-side rendering adapters.