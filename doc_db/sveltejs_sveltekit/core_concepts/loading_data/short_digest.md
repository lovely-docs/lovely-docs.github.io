## Load Functions

Define in `+page.js`/`+page.server.js` or `+layout.js`/`+layout.server.js`. Return values available via `data` prop.

**Server load** (`+page.server.js`): Runs only on server, access to cookies/locals/request, must return serializable data.

**Universal load** (`+page.js`): Runs on server then browser, can return non-serializable data.

```js
// +page.server.js
export async function load({ params }) {
	return { post: await db.getPost(params.slug) };
}
```

## Key Features

- **URL data**: `url`, `route`, `params` available in load functions
- **Fetch**: Use provided `fetch` (not native) - inherits cookies, allows relative URLs, caches responses
- **Parent data**: `await parent()` to access parent layout data
- **Errors**: `error(401, 'message')` to render `+error.svelte`
- **Redirects**: `redirect(307, '/path')` to redirect users
- **Streaming**: Return unresolved promises from server load to stream data as it resolves
- **Dependency tracking**: Load functions rerun when `params`, `url`, or dependencies change
- **Manual invalidation**: `invalidate(url)` or `invalidateAll()` to rerun load functions
- **getRequestEvent**: Access current request in shared logic without passing event around