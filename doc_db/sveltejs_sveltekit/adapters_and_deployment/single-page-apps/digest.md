## Single-Page Apps (SPA) Mode

Turn a SvelteKit app into a fully client-rendered SPA by specifying a fallback page that serves any URLs not handled by other means (prerendered pages, etc).

### Performance Warnings

SPA mode has significant drawbacks:
- Multiple network round trips required (HTML, JavaScript, data) before content displays
- Delays startup, especially on mobile with high latency
- Harms SEO: sites often downranked for performance, fails Core Web Vitals, excluded from search engines that don't render JS
- Makes app inaccessible if JavaScript fails or is disabled

Mitigation: prerender as many pages as possible (especially homepage). If all pages can be prerendered, use static site generation instead. Otherwise, use an adapter supporting server-side rendering.

### Usage

Disable SSR for pages to serve via fallback:
```js
// src/routes/+layout.js
export const ssr = false;
```

With no server-side logic, use `adapter-static`:
```js
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter({
			fallback: '200.html' // host-dependent
		})
	}
};

export default config;
```

The fallback page is HTML generated from your template (e.g. `app.html`) that loads the app and navigates to the correct route. Different hosts use different fallback names (e.g., Surge uses `200.html`). Avoid `index.html` to prevent conflicts with prerendering. Fallback pages always use absolute asset paths (starting with `/`) regardless of `paths.relative` config.

### Prerendering Individual Pages

Re-enable `ssr` and `prerender` for specific pages:
```js
// src/routes/my-prerendered-page/+page.js
export const prerender = true;
export const ssr = true;
```

No Node server needed to deploy; page is server-rendered during build to output static `.html`.

### Apache Configuration

Add `static/.htaccess` to route requests to fallback:
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