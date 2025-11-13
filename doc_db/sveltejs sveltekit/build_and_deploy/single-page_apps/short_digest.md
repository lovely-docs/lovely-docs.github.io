## Creating SPAs

Disable SSR in root layout and use `adapter-static` with `fallback` option:
```js
// src/routes/+layout.js
export const ssr = false;

// svelte.config.js
import adapter from '@sveltejs/adapter-static';
const config = {
	kit: { adapter: adapter({ fallback: '200.html' }) }
};
```

Prerender specific pages by setting both `prerender` and `ssr` to true. SPAs have major performance and SEO drawbacks—prerender as many pages as possible.