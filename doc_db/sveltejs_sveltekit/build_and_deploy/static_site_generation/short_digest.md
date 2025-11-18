## Setup

Install `@sveltejs/adapter-static` and add to `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		})
	}
};

export default config;
```

Add `export const prerender = true;` to root layout.

## Key Options

- **pages/assets**: Output directories
- **fallback**: For SPA mode (e.g., `200.html` or `404.html`)
- **precompress**: Generate `.br` and `.gz` files
- **strict**: Validate all pages are prerendered (default: true)

## GitHub Pages

Set `config.kit.paths.base` to repo name and use `fallback: '404.html'`. Add `.nojekyll` to `static` directory.