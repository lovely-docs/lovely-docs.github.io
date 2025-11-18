## Installation
Install `@sveltejs/adapter-netlify` and add to `svelte.config.js`:
```js
import adapter from '@sveltejs/adapter-netlify';
const config = {
	kit: {
		adapter: adapter({
			edge: false,      // use Netlify Edge Functions (Deno-based)
			split: false      // split app into multiple functions
		})
	}
};
export default config;
```

Requires `netlify.toml` in project root with build configuration:
```toml
[build]
	command = "npm run build"
	publish = "build"
```

## Edge Functions vs Serverless
- `edge: true` - Deno-based edge functions deployed close to visitors
- `edge: false` (default) - Node-based Netlify Functions

## Netlify-Specific Features
- **Headers/Redirects**: Use `_headers` and `_redirects` files in project root for static assets
- **Redirect Rules**: Automatically appended during compilation; put custom rules in `_redirects` file, not `netlify.toml`
- **Forms**: Create HTML forms with `form-name` input, prerender the page with `export const prerender = true`
- **Functions Context**: Access Netlify Identity and context via `event.platform.context` in server endpoints

```js
export const load = async (event) => {
	const context = event.platform?.context;
};
```

## Troubleshooting
- Can't use `fs` in edge deployments; use `read()` from `$app/server` instead
- Serverless deployments don't copy files; use `read()` or prerender routes