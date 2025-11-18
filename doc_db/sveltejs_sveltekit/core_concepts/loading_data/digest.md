## Load Functions

Define `load` functions in `+page.js`/`+page.server.js` or `+layout.js`/`+layout.server.js` files to fetch data before rendering components. Return values are available via the `data` prop.

```js
// +page.js - runs on server and browser
export function load({ params }) {
	return { post: { title: `Title for ${params.slug}` } };
}

// +page.server.js - runs only on server
import * as db from '$lib/server/database';
export async function load({ params }) {
	return { post: await db.getPost(params.slug) };
}
```

## Universal vs Server Load Functions

**Server load** (`+page.server.js`, `+layout.server.js`):
- Always runs on server
- Access to `cookies`, `locals`, `request`, `platform`, `clientAddress`
- Must return serializable data (JSON, BigInt, Date, Map, Set, RegExp, promises)
- Use for database access, private environment variables

**Universal load** (`+page.js`, `+layout.js`):
- Runs on server during SSR, then in browser on navigation
- Can return non-serializable data (custom classes, component constructors)
- Use for external API calls, non-sensitive data

When both exist, server load runs first and its return value becomes the `data` property of universal load's argument.

## URL Data

Load functions receive `url` (URL instance with origin, hostname, pathname, searchParams), `route` (current route directory), and `params` (derived from pathname and route).

```js
export function load({ route, params, url }) {
	console.log(route.id); // '/a/[b]/[...c]'
	console.log(params); // { b: 'x', c: 'y/z' }
	console.log(url.searchParams.get('query'));
}
```

## Fetch Requests

Use the provided `fetch` function (not native fetch) to make requests. It:
- Inherits cookies and authorization headers on server
- Allows relative URLs on server
- Caches responses during SSR and hydration
- Handles internal `+server.js` routes without HTTP overhead

```js
export async function load({ fetch, params }) {
	const res = await fetch(`/api/items/${params.id}`);
	return { item: await res.json() };
}
```

## Cookies

Server load functions can get and set cookies. Cookies are only passed through `fetch` if the target host is the same domain or a subdomain.

```js
export async function load({ cookies }) {
	const sessionid = cookies.get('sessionid');
	return { user: await db.getUser(sessionid) };
}
```

## Headers and Caching

Use `setHeaders` in load functions to set response headers (server-side only). Useful for caching:

```js
export async function load({ fetch, setHeaders }) {
	const response = await fetch('https://cms.example.com/products.json');
	setHeaders({
		'cache-control': response.headers.get('cache-control')
	});
	return response.json();
}
```

## Parent Data

Access parent layout data with `await parent()`. In `+page.server.js`/`+layout.server.js`, it returns data from parent server layouts. In `+page.js`/`+layout.js`, it returns data from parent universal layouts (and parent server layouts not shadowed by a universal layout).

```js
// +layout.js
export function load() { return { a: 1 }; }

// +page.js
export async function load({ parent }) {
	const { a } = await parent();
	return { c: a + 1 };
}
```

## Error Handling

Throw errors using the `error` helper to render the nearest `+error.svelte`:

```js
import { error } from '@sveltejs/kit';

export function load({ locals }) {
	if (!locals.user) {
		error(401, 'not logged in');
	}
}
```

## Redirects

Use the `redirect` helper to redirect users:

```js
import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
	if (!locals.user) {
		redirect(307, '/login');
	}
}
```

## Streaming Promises

Server load functions can return unresolved promises, which stream to the browser as they resolve. Useful for slow, non-essential data:

```js
export async function load({ params }) {
	return {
		post: await loadPost(params.slug),
		comments: loadComments(params.slug) // unresolved promise
	};
}
```

```svelte
{#await data.comments}
	Loading...
{:then comments}
	{#each comments as comment}
		<p>{comment.content}</p>
	{/each}
{/await}
```

## Dependency Tracking and Rerunning

Load functions rerun when:
- Referenced `params` properties change
- Referenced `url` properties change (pathname, search, searchParams)
- `await parent()` is called and parent reruns
- A dependency declared via `fetch(url)` or `depends(url)` is invalidated

Manually rerun with `invalidate(url)` or `invalidateAll()`:

```js
export async function load({ depends }) {
	depends('app:random');
	return { number: Math.random() };
}
```

```svelte
<button onclick={() => invalidate('app:random')}>Refresh</button>
```

Use `untrack` to exclude something from dependency tracking:

```js
export async function load({ untrack, url }) {
	if (untrack(() => url.pathname === '/')) {
		return { message: 'Welcome!' };
	}
}
```

## getRequestEvent

Retrieve the current request event in shared logic using `getRequestEvent()`:

```js
// src/lib/server/auth.js
import { getRequestEvent } from '$app/server';

export function requireLogin() {
	const { locals, url } = getRequestEvent();
	if (!locals.user) {
		redirect(307, '/login');
	}
	return locals.user;
}
```

## Data Merging

Data from multiple load functions merges with later values overriding earlier ones. Layout data is available to child layouts and pages.