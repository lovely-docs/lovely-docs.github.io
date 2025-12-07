## Filesystem-based routing

Routes are defined by directory structure in `src/routes`:
- `src/routes` → root route
- `src/routes/about` → `/about` route
- `src/routes/blog/[slug]` → `/blog/:slug` with dynamic parameter

Can change root directory via project config.

## Route files (identified by `+` prefix)

Rules:
- All files can run on server
- All files run on client except `+server` files
- `+layout` and `+error` files apply to subdirectories and their own directory

## +page.svelte

Defines a page component. Rendered on server (SSR) for initial request, in browser (CSR) for navigation.

```svelte
<!--- src/routes/+page.svelte --->
<script>
	let { data } = $props();
</script>
<h1>{data.title}</h1>
```

Uses `<a>` elements for navigation, not framework-specific components.

## +page.js / +page.server.js

`+page.js` exports `load()` function that runs on server during SSR and in browser during navigation:

```js
export function load({ params }) {
	if (params.slug === 'hello-world') {
		return { title: 'Hello world!', content: '...' };
	}
	error(404, 'Not found');
}
```

Can also export page options: `prerender`, `ssr`, `csr`.

`+page.server.js` - load function runs only on server (for database access, private env vars). Data must be serializable. Can also export _actions_ for form submissions.

## +error.svelte

Customizes error page. SvelteKit walks up tree to find closest error boundary:

```svelte
<script>
	import { page } from '$app/state';
</script>
<h1>{page.status}: {page.error.message}</h1>
```

Falls back to `src/routes/+error.svelte`, then `src/routes/+error.svelte`, then static `src/error.html`. Not used for errors in `handle` hook or `+server.js`.

## +layout.svelte / +layout.js / +layout.server.js

Layouts wrap pages and persist across navigation. Default layout:

```svelte
<script>
	let { children } = $props();
</script>
{@render children()}
```

Example with nav:

```svelte
<!--- src/routes/+layout.svelte --->
<script>
	let { children } = $props();
</script>
<nav>
	<a href="/">Home</a>
	<a href="/about">About</a>
</nav>
{@render children()}
```

Layouts can be nested. `+layout.js` exports `load()` function:

```js
export function load() {
	return {
		sections: [
			{ slug: 'profile', title: 'Profile' },
			{ slug: 'notifications', title: 'Notifications' }
		]
	};
}
```

Data from parent layout's load is available to child pages. `+layout.server.js` runs load only on server. Both can export page options.

## +server.js

API routes. Export functions for HTTP verbs (GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD) that take `RequestEvent` and return `Response`:

```js
export function GET({ url }) {
	const min = Number(url.searchParams.get('min') ?? '0');
	const max = Number(url.searchParams.get('max') ?? '1');
	const d = max - min;
	if (isNaN(d) || d < 0) {
		error(400, 'min and max must be numbers, and min must be less than max');
	}
	return new Response(String(min + Math.random() * d));
}
```

Can use `error()`, `redirect()`, `json()` helpers. Response can be `ReadableStream` for streaming/server-sent events.

Receiving data with POST/PUT/PATCH/DELETE:

```svelte
<!--- src/routes/add/+page.svelte --->
<script>
	async function add() {
		const response = await fetch('/api/add', {
			method: 'POST',
			body: JSON.stringify({ a, b }),
			headers: { 'content-type': 'application/json' }
		});
		total = await response.json();
	}
</script>
```

```js
export async function POST({ request }) {
	const { a, b } = await request.json();
	return json(a + b);
}
```

Fallback handler matches unhandled methods:

```js
export async function fallback({ request }) {
	return text(`I caught your ${request.method} request!`);
}
```

Content negotiation: PUT/PATCH/DELETE/OPTIONS always use `+server.js`. GET/POST/HEAD treated as page requests if `accept` header prioritizes `text/html`, else use `+server.js`. GET responses include `Vary: Accept` header.

## $types

SvelteKit generates `$types.d.ts` for type safety. Use `PageProps`/`LayoutProps` to type component props, `PageLoad`/`PageServerLoad`/`LayoutLoad`/`LayoutServerLoad` to type load functions. IDE tooling can auto-insert types.

## Other files

Files in route directories not matching `+` pattern are ignored, allowing colocating components/utilities with routes. For multi-route use, put in `$lib`.