## Breaking Changes in SvelteKit 2

### error() and redirect() no longer need to be thrown
```js
// Before
throw error(500, 'something went wrong');
// After
error(500, 'something went wrong');
```
Use `isHttpError` and `isRedirect` from `@sveltejs/kit` to distinguish them from unexpected errors in try blocks.

### Cookies require explicit path
```js
cookies.set(name, value, { path: '/' });
cookies.delete(name, { path: '/' });
cookies.serialize(name, value, { path: '/' });
```
Path can be `'/'` (domain-wide), `''` (current path), or `'.'` (current directory).

### Top-level promises no longer auto-awaited
```js
// Single promise
export async function load({ fetch }) {
	const response = await fetch(url).then(r => r.json());
	return { response };
}

// Multiple promises - use Promise.all to avoid waterfalls
export async function load({ fetch }) {
	const [a, b] = await Promise.all([
		fetch(url1).then(r => r.json()),
		fetch(url2).then(r => r.json()),
	]);
	return { a, b };
}
```

### goto() changes
- No longer accepts external URLs; use `window.location.href = url` instead
- `state` object now determines `$page.state` and must adhere to `App.PageState` interface

### Paths are relative by default
`paths.relative` now defaults to `true` (was inconsistent in v1). Affects `%sveltekit.assets%`, `base`, and `assets` from `$app/paths`.

### Server fetches no longer trackable
`dangerZone.trackServerFetches` setting removed due to security concerns.

### preloadCode() changes
- Arguments must be prefixed with `base` (consistent with `preloadData`)
- Now takes single argument instead of multiple arguments

### resolvePath() replaced with resolveRoute()
```js
// Before
import { resolvePath } from '@sveltejs/kit';
import { base } from '$app/paths';
const path = base + resolvePath('/blog/[slug]', { slug });

// After
import { resolveRoute } from '$app/paths';
const path = resolveRoute('/blog/[slug]', { slug });
```

### Improved error handling
`handleError` hooks now receive `status` and `message` properties. For thrown errors, status is `500` and message is `Internal Error`. `message` is safe to expose to users, unlike `error.message`.

### Dynamic environment variables cannot be used during prerendering
Use `$env/static/public` and `$env/static/private` during prerendering instead of `$env/dynamic/*`. SvelteKit requests updated dynamic values from `/_app/env.js` when landing on prerendered pages.

### use:enhance callback changes
`form` and `data` properties removed; use `formElement` and `formData` instead.

### Forms with file inputs require multipart/form-data
```html
<form enctype="multipart/form-data">
	<input type="file">
</form>
```
SvelteKit 2 throws error during `use:enhance` submission if missing.

### Generated tsconfig.json stricter
- Warns against `paths` or `baseUrl` in tsconfig.json
- Use `alias` config in `svelte.config.js` instead
- Now uses `"moduleResolution": "bundler"` and `verbatimModuleSyntax`
- Remove `importsNotUsedAsValues` and `preserveValueImports` if present

### getRequest() no longer throws immediately
Errors from `@sveltejs/kit/node` `getRequest()` are deferred until request body is read.

### vitePreprocess no longer exported from @sveltejs/kit/vite
Import directly from `@sveltejs/vite-plugin-svelte` instead.

### Dependency requirements
- Node 18.13+
- svelte@4, vite@5, typescript@5
- @sveltejs/vite-plugin-svelte@3 (now peerDependency)
- Adapter versions: cloudflare@3, cloudflare-workers@2, netlify@3, node@2, static@3, vercel@4

### SvelteKit 2.12: $app/stores deprecated
Use `$app/state` instead (Svelte 5 runes API):
```svelte
<!-- Before -->
<script>
	import { page } from '$app/stores';
</script>
{$page.data}

<!-- After -->
<script>
	import { page } from '$app/state';
</script>
{page.data}
```
Use `npx sv migrate app-state` for auto-migration.