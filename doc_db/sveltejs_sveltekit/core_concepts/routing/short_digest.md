## Filesystem routing

Routes defined by `src/routes` directory structure. Files with `+` prefix are route files.

## Route file types

- **+page.svelte**: Page component, receives `data` prop
- **+page.js/+page.server.js**: Export `load()` function for data fetching
- **+layout.svelte/+layout.js/+layout.server.js**: Persistent layout with `{@render children()}`
- **+error.svelte**: Custom error page
- **+server.js**: API endpoints, export HTTP handlers (`GET`, `POST`, etc.)

## Examples

Page with data:
```js
// +page.server.js
export async function load({ params }) {
	return { title: 'Hello' };
}
```

API endpoint:
```js
// +server.js
export function GET({ url }) {
	return new Response(url.searchParams.get('value'));
}
```

Layout:
```svelte
<!-- +layout.svelte -->
<script>
	let { children } = $props();
</script>
<nav>...</nav>
{@render children()}
```