## Load Functions

Define `load` functions in `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js` to fetch data before rendering.

**Universal** (`+page.js`, `+layout.js`): Run on server then browser, return any values. Use for external APIs.

**Server** (`+page.server.js`, `+layout.server.js`): Run only on server, return serializable data. Use for databases and private credentials.

```js
// +page.server.js
export async function load({ params, fetch, cookies, setHeaders }) {
	const res = await fetch(`/api/items/${params.id}`);
	setHeaders({ 'cache-control': 'max-age=3600' });
	return { item: await res.json() };
}

// +page.js (universal)
export async function load({ data, parent, url, route, params, depends, untrack }) {
	const parentData = await parent();
	depends('app:custom');
	return { ...data, ...parentData };
}
```

Data available to components via `data` prop. Parent layout data accessible via `page.data` or `await parent()`.

**Errors & Redirects**: Throw `error(status, message)` or `redirect(status, url)` to handle errors and redirects.

**Streaming**: Return unresolved promises from server load to stream data as it resolves.

**Rerunning**: Load functions rerun when `params`, `url`, or dependencies change. Use `invalidate(url)` or `invalidateAll()` to manually trigger reruns. Untrack dependencies with `untrack()`.

**Cookies**: Server load can access/set cookies via `cookies` parameter.

**getRequestEvent**: Use `getRequestEvent()` in server load to access request event for shared auth logic.