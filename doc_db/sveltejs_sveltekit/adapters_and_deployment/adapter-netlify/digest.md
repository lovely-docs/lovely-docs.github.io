## Installation and Setup

Install with `npm i -D @sveltejs/adapter-netlify` and add to `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-netlify';

const config = {
	kit: {
		adapter: adapter({
			edge: false,      // use Netlify Edge Functions (Deno-based) instead of Node
			split: false      // split app into multiple functions instead of one
		})
	}
};
export default config;
```

Requires a `netlify.toml` file in project root:
```toml
[build]
	command = "npm run build"
	publish = "build"
```

If missing, defaults to `publish = "build"`. Node LTS is used by default for new projects.

## Netlify Edge Functions

Set `edge: true` to deploy server-side rendering to Deno-based edge functions deployed close to visitors, instead of Node-based Netlify Functions.

## Netlify-Specific Features

**`_headers` and `_redirects` files**: Place in project root for static asset responses. Redirect rules are automatically appended to `_redirects` during compilation. Note: `_redirects` has higher priority than `[[redirects]]` in `netlify.toml`, so always use the `_redirects` file. Avoid custom catch-all rules like `/* /foobar/:splat` as they prevent automatic rules from being applied.

**Netlify Forms**: Create HTML forms as described in Netlify docs. Forms must be prerendered as HTML—add `export const prerender = true` to the page or set `kit.prerender.force: true`. If using custom success messages like `<form netlify ... action="/success">`, ensure the corresponding success page exists and is prerendered.

**Netlify Functions**: SvelteKit endpoints are hosted as Netlify Functions. Access Netlify context (including Identity info) via `event.platform.context` in hooks and server endpoints:

```js
export const load = async (event) => {
	const context = event.platform?.context;
	console.log(context);
};
```

Add custom functions by creating a directory and configuring in `netlify.toml`:
```toml
[functions]
	directory = "functions"
```

## Troubleshooting

**File system access**: Can't use `fs` in edge deployments. In serverless deployments, files aren't copied to deployment, so use the `read` function from `$app/server` instead (works in both edge and serverless). Alternatively, prerender routes.