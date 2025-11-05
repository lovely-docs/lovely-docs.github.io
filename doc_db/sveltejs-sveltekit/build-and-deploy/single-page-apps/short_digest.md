## Single-Page App Setup

Disable SSR globally and use `adapter-static` with a fallback page:

```js
// src/routes/+layout.js
export const ssr = false;

// svelte.config.js
import adapter from '@sveltejs/adapter-static';
const config = {
	kit: { adapter: adapter({ fallback: '200.html' }) }
};
```

Prerender specific pages by enabling SSR and prerender for those routes:

```js
export const prerender = true;
export const ssr = true;
```

For Apache, add `.htaccess` to route unmatched requests to the fallback page.

**Warning:** SPAs have poor performance, SEO, and accessibility. Prerender as many pages as possible or use static site generation instead.