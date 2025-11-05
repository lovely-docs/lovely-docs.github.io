## Installation and Setup

Install `@sveltejs/adapter-netlify` and add to `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-netlify';

const config = {
	kit: {
		adapter: adapter({
			edge: false,      // Use Netlify Edge Functions (Deno-based)
			split: false      // Split app into multiple functions
		})
	}
};
export default config;
```

Create `netlify.toml` in project root:
```toml
[build]
	command = "npm run build"
	publish = "build"
```

## Netlify Edge Functions

Set `edge: true` to deploy server-side rendering to Deno-based edge functions deployed near visitors, instead of Node-based Netlify Functions.

## Netlify-Specific Features

**`_headers` and `_redirects` files**: Place in project root for static asset responses. Redirect rules are automatically appended to `_redirects` during compilation—don't use `[[redirects]]` in `netlify.toml` as `_redirects` has higher priority.

**Netlify Forms**: Create HTML form in route (e.g., `/routes/contact/+page.svelte`), add hidden `form-name` input, and prerender the page with `export const prerender = true` or `kit.prerender.force: true`.

**Netlify Functions**: SvelteKit endpoints become Netlify Functions. Access Netlify context via `event.platform.context` in hooks and server endpoints:

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

**File system access**: Can't use `fs` in edge deployments. In serverless deployments, use `read()` from `$app/server` instead, which works in both environments. Alternatively, prerender routes.