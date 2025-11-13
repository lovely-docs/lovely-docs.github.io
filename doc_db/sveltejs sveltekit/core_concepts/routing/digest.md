## Filesystem-based routing

Routes are defined by directory structure in `src/routes`:
- `src/routes` → root route
- `src/routes/about` → `/about` route
- `src/routes/blog/[slug]` → `/blog/:slug` with dynamic parameter

## Route files (identified by `+` prefix)

**Execution rules:**
- All files run on server
- All files run on client except `+server` files
- `+layout` and `+error` files apply to subdirectories and their own directory

## +page.svelte

Defines a page component. Receives data via `data` prop from `load` functions:

```svelte
<script>
	let { data } = $props();
</script>
<h1>{data.title}</h1>
```

## +page.js / +page.server.js

Export `load` function to fetch data before rendering:

```js
export function load({ params }) {
	return { title: 'Hello world!' };
}
```

Use `+page.server.js` for server-only operations (database access, private env vars). Data must be serializable.

Both can export page options: `prerender`, `ssr`, `csr`.

`+page.server.js` can also export `actions` for form submissions.

## +error.svelte

Customizes error pages. SvelteKit walks up the tree to find the closest error boundary. If none exists, renders default error page (customizable via `src/error.html`).

```svelte
<script>
	import { page } from '$app/state';
</script>
<h1>{page.status}: {page.error.message}</h1>
```

## +layout.svelte / +layout.js / +layout.server.js

Layouts wrap pages and persist across navigation. Must include `{@render children()}`:

```svelte
<script>
	let { children } = $props();
</script>
<nav>...</nav>
{@render children()}
```

Layouts can be nested. Data from `+layout.js` is available to all child pages.

## +server.js

API routes. Export HTTP verb handlers (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`, `HEAD`) that return `Response`:

```js
export function GET({ url }) {
	const min = Number(url.searchParams.get('min') ?? '0');
	return new Response(String(Math.random() * (max - min) + min));
}
```

Export `fallback` handler to match unhandled methods. Can receive data via `request.json()`.

Content negotiation: `GET`/`POST`/`HEAD` treated as page requests if `accept` header prioritizes `text/html`, otherwise handled by `+server.js`.

## $types

SvelteKit generates `$types.d.ts` for type safety. Use `PageProps`/`LayoutProps` for component props, `PageLoad`/`PageServerLoad`/`LayoutLoad`/`LayoutServerLoad` for load functions. Modern IDEs auto-inject these types.