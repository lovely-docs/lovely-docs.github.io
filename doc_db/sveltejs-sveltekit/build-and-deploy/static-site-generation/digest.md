## Installation and Setup

Install `@sveltejs/adapter-static` and configure in `svelte.config.js`:

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

Add `export const prerender = true;` to your root layout (`src/routes/+layout.js`).

## Configuration Options

- **pages**: Output directory for prerendered pages (default: `build`)
- **assets**: Output directory for static assets (default: same as `pages`)
- **fallback**: Fallback page for SPA mode (e.g., `200.html` or `404.html`). Has negative performance/SEO impacts
- **precompress**: Generate `.br` and `.gz` compressed files when `true`
- **strict**: Validates all pages/endpoints are prerendered or fallback is set (default: `true`)

## Important Notes

Set `trailingSlash: 'always'` in your root layout if your host doesn't serve `/a.html` for requests to `/a`.

For partial prerendering, use a different adapter with the `prerender` option instead of `adapter-static`.

## GitHub Pages Deployment

Update `config.kit.paths.base` to your repo name since the site is served from `https://your-username.github.io/your-repo-name`.

Generate a `404.html` fallback page:

```js
const config = {
	kit: {
		adapter: adapter({ fallback: '404.html' }),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		}
	}
};
```

Use GitHub Actions to automate deployment (example workflow provided in documentation).

Add `.nojekyll` file to `static/` directory if not using GitHub Actions to prevent Jekyll interference.