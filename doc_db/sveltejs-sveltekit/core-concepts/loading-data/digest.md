## Load Functions

Define `load` functions in `+page.js`/`+page.server.js` or `+layout.js`/`+layout.server.js` files. Return values are available to components via the `data` prop.

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

```svelte
<script>
	let { data } = $props();
</script>
<h1>{data.post.title}</h1>
```

## Universal vs Server Load

- **Universal** (`+page.js`, `+layout.js`): Run on server during SSR, then in browser. Can return non-serializable data (classes, components). Use for external API calls.
- **Server** (`+page.server.js`, `+layout.server.js`): Run only on server. Must return serializable data (JSON, BigInt, Date, Map, Set, RegExp). Use for database access and private environment variables.

When both exist, server load runs first and its return value becomes the `data` property of the universal load's argument.

## Layout Data

Layout `load` functions return data available to child layouts and pages. Data from multiple `load` functions merges, with later values overwriting earlier ones.

```js
// +layout.server.js
export async function load() {
	return { posts: await db.getPostSummaries() };
}
```

```svelte
<!-- +layout.svelte -->
<script>
	let { data, children } = $props();
</script>
<main>{@render children()}</main>
<aside>
	{#each data.posts as post}
		<a href="/blog/{post.slug}">{post.title}</a>
	{/each}
</aside>
```

Access parent data in child pages via `page.data` or by importing `page` from `$app/state`.

## URL Data

Load functions receive:
- **`url`**: URL instance with `origin`, `hostname`, `pathname`, `searchParams`
- **`route`**: Route directory name (e.g., `/a/[b]/[...c]`)
- **`params`**: Parsed route parameters (e.g., `{ b: 'x', c: 'y/z' }`)

## Fetch Requests

Use the provided `fetch` function (not native fetch):
- Inherits cookies and authorization headers on server
- Allows relative URLs on server
- Internal requests bypass HTTP overhead
- Responses are captured and inlined during SSR
- Responses are reused during hydration

```js
export async function load({ fetch, params }) {
	const res = await fetch(`/api/items/${params.id}`);
	return { item: await res.json() };
}
```

## Cookies

Server load functions can access and set cookies:

```js
export async function load({ cookies }) {
	const sessionid = cookies.get('sessionid');
	return { user: await db.getUser(sessionid) };
}
```

Cookies are only passed through `fetch` if the target is the same host or a subdomain.

## Headers

Both universal and server load functions can call `setHeaders()` to set response headers (server-side only):

```js
export async function load({ fetch, setHeaders }) {
	const response = await fetch('https://cms.example.com/products.json');
	setHeaders({
		'cache-control': response.headers.get('cache-control')
	});
	return response.json();
}
```

Cannot set `set-cookie` headers; use `cookies.set()` instead.

## Parent Data

Access parent load function data with `await parent()`:

```js
// +layout.js
export function load() {
	return { a: 1 };
}

// +page.js
export async function load({ parent }) {
	const { a } = await parent();
	return { c: a + 1 };
}
```

In server load functions, `parent()` returns data from parent server layouts. In universal load functions, it returns data from parent universal layouts (treating missing layouts as pass-through functions).

## Errors and Redirects

Throw errors with the `error` helper to render the nearest `+error.svelte`:

```js
import { error } from '@sveltejs/kit';

export function load({ locals }) {
	if (!locals.user) {
		error(401, 'not logged in');
	}
}
```

Use `redirect` helper to redirect users:

```js
import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
	if (!locals.user) {
		redirect(307, '/login');
	}
}
```

## Streaming Promises

Server load functions can return unresolved promises, which stream to the browser as they resolve:

```js
export async function load({ params }) {
	return {
		post: await loadPost(params.slug),
		comments: loadComments(params.slug) // unresolved
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
{:catch error}
	<p>Error: {error.message}</p>
{/await}
```

Attach a noop `.catch()` to unhandled promises to prevent crashes.

## Dependency Tracking and Rerunning

Load functions rerun when:
- Referenced `params` properties change
- Referenced `url` properties change (pathname, search, searchParams)
- `await parent()` is called and parent reruns
- A dependency declared via `fetch(url)` or `depends(url)` is invalidated

Manually rerun load functions with `invalidate(url)` or `invalidateAll()`:

```js
export async function load({ fetch, depends }) {
	depends('app:random');
	return { number: await fetch('/api/random').json() };
}
```

```svelte
<script>
	import { invalidate } from '$app/navigation';
	function refresh() {
		invalidate('app:random');
	}
</script>
<button onclick={refresh}>Refresh</button>
```

Exclude values from tracking with `untrack()`:

```js
export async function load({ untrack, url }) {
	if (untrack(() => url.pathname === '/')) {
		return { message: 'Welcome!' };
	}
}
```

## Authentication

For auth checks:
- Use hooks to protect routes before load functions run
- Use auth guards in `+page.server.js` for route-specific protection
- Use `getRequestEvent()` from `$app/server` to access request context in shared functions

```js
// src/lib/server/auth.js
import { redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

export function requireLogin() {
	const { locals, url } = getRequestEvent();
	if (!locals.user) {
		redirect(307, `/login?redirectTo=${url.pathname}`);
	}
	return locals.user;
}
```

```js
// +page.server.js
import { requireLogin } from '$lib/server/auth';

export function load() {
	const user = requireLogin();
	return { message: `hello ${user.name}!` };
}
```