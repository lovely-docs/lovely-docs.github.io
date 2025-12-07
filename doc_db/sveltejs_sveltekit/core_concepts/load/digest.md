## Load Functions

Load functions run before page/layout components render to fetch data. Define them in `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js` files.

### Page Data

`+page.js` exports a `load` function whose return value is available via the `data` prop:

```js
// +page.js
export function load({ params }) {
	return { post: { title: `Title for ${params.slug}` } };
}
```

```svelte
<!-- +page.svelte -->
<script>
	let { data } = $props();
</script>
<h1>{data.post.title}</h1>
```

### Layout Data

`+layout.js` or `+layout.server.js` can also export `load` functions. Data is available to the layout and all child pages:

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

Child pages access parent layout data via `data` prop. Access page data from parent layouts using `page.data`:

```svelte
<!-- root +layout.svelte -->
<script>
	import { page } from '$app/state';
</script>
<svelte:head>
	<title>{page.data.title}</title>
</svelte:head>
```

### Universal vs Server Load

**Universal** (`+page.js`, `+layout.js`): Run on server during SSR, then in browser. Can return any values including custom classes. Use when fetching from external APIs without private credentials.

**Server** (`+page.server.js`, `+layout.server.js`): Run only on server. Must return serializable data (JSON, BigInt, Date, Map, Set, RegExp, promises). Use when accessing databases, filesystems, or private environment variables.

When both exist, server load return value becomes the `data` property of universal load:

```js
// +page.server.js
export async function load() {
	return { serverMessage: 'hello from server' };
}

// +page.js
export async function load({ data }) {
	return { serverMessage: data.serverMessage, universalMessage: 'hello from browser' };
}
```

### URL Data

Load functions receive:
- **url**: URL instance with `origin`, `hostname`, `pathname`, `searchParams`
- **route**: Route directory name (e.g., `/a/[b]/[...c]`)
- **params**: Derived from pathname and route (e.g., `{ b: 'x', c: 'y/z' }`)

### Fetch Requests

Use the provided `fetch` function (not native fetch) to make requests:

```js
export async function load({ fetch, params }) {
	const res = await fetch(`/api/items/${params.id}`);
	return { item: await res.json() };
}
```

Features:
- Inherits cookies and authorization headers on server
- Makes relative requests on server
- Internal requests bypass HTTP overhead
- Response inlined into HTML during SSR
- Response reused from HTML during hydration

Cookies only pass through if target host is same domain or subdomain.

### Headers

Both universal and server load can call `setHeaders()` to set response headers (server-side only):

```js
export async function load({ fetch, setHeaders }) {
	const response = await fetch('https://cms.example.com/products.json');
	setHeaders({
		'cache-control': response.headers.get('cache-control')
	});
	return response.json();
}
```

Each header can only be set once. Use `cookies.set()` for set-cookie headers.

### Parent Data

Access parent load data with `await parent()`:

```js
// +layout.js
export function load() {
	return { a: 1 };
}

// +layout.js (child)
export async function load({ parent }) {
	const { a } = await parent();
	return { b: a + 1 };
}

// +page.js
export async function load({ parent }) {
	const { a, b } = await parent();
	return { c: a + b };
}
```

In `+page.server.js`/`+layout.server.js`, `parent()` returns data from parent server layouts. In universal load, it returns parent universal layout data, treating missing `+layout.js` as a passthrough function that also returns parent server layout data.

Avoid waterfalls: call non-dependent operations before `await parent()`.

### Errors

Throw errors in load functions to render nearest `+error.svelte`:

```js
import { error } from '@sveltejs/kit';

export function load({ locals }) {
	if (!locals.user) {
		error(401, 'not logged in');
	}
	if (!locals.user.isAdmin) {
		error(403, 'not an admin');
	}
}
```

Use `error()` helper for expected errors with HTTP status codes. Unexpected errors invoke `handleError` hook and render 500.

### Redirects

Use `redirect()` helper to redirect users:

```js
import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
	if (!locals.user) {
		redirect(307, '/login');
	}
}
```

Don't use inside try/catch blocks. In browser, use `goto()` from `$app/navigation` for programmatic navigation outside load.

### Streaming with Promises

Server load can return unresolved promises to stream data as it resolves:

```js
export async function load({ params }) {
	return {
		comments: loadComments(params.slug),  // unresolved
		post: await loadPost(params.slug)     // resolved
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
	<p>error: {error.message}</p>
{/await}
```

Attach `.catch(() => {})` to promises to prevent unhandled rejection errors. Streaming only works with JavaScript enabled. Headers/status cannot change after streaming starts.

### Dependency Tracking & Rerunning

SvelteKit tracks load function dependencies to avoid unnecessary reruns. Load functions rerun when:
- Referenced `params` property changes
- Referenced `url` property changes (pathname, search, searchParams)
- `await parent()` called and parent reran
- Dependency declared via `fetch(url)` or `depends(url)` and invalidated with `invalidate(url)`
- `invalidateAll()` called

Untrack dependencies with `untrack()`:

```js
export async function load({ untrack, url }) {
	if (untrack(() => url.pathname === '/')) {
		return { message: 'Welcome!' };
	}
}
```

Manually invalidate with `invalidate(url)` or `invalidateAll()`:

```js
export async function load({ fetch, depends }) {
	const response = await fetch('https://api.example.com/random-number');
	depends('app:random');
	return { number: await response.json() };
}
```

```svelte
<script>
	import { invalidate, invalidateAll } from '$app/navigation';
	function rerun() {
		invalidate('app:random');
		invalidate('https://api.example.com/random-number');
		invalidate(url => url.href.includes('random-number'));
		invalidateAll();
	}
</script>
<button onclick={rerun}>Update</button>
```

Rerunning load updates `data` prop but doesn't recreate component, preserving internal state. Use `afterNavigate()` callback or `{#key}` block to reset state if needed.

### Cookies

Server load can get/set cookies:

```js
export async function load({ cookies }) {
	const sessionid = cookies.get('sessionid');
	return { user: await db.getUser(sessionid) };
}
```

### Authentication

Layout load functions don't rerun on every request (e.g., client-side navigation between child routes). Strategies:
- Use hooks to protect routes before load functions run
- Use auth guards in `+page.server.js` for route-specific protection
- Auth guards in `+layout.server.js` require all child pages to call `await parent()`

### getRequestEvent

Retrieve the `event` object in server load functions using `getRequestEvent()` for shared logic:

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

// +page.server.js
import { requireLogin } from '$lib/server/auth';
export function load() {
	const user = requireLogin();
	return { message: `hello ${user.name}!` };
}
```