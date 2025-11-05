## Filesystem-based routing

Routes are defined by directory structure in `src/routes`:
- `src/routes` → `/`
- `src/routes/about` → `/about`
- `src/routes/blog/[slug]` → `/blog/:slug` (dynamic parameter)

## Route files (identified by `+` prefix)

**Rules:**
- All files can run on server
- All files run on client except `+server` files
- `+layout` and `+error` files apply to subdirectories and their own directory

## +page.svelte / +page.js / +page.server.js

`+page.svelte` defines a page component. Pages render on server (SSR) initially, then in browser (CSR) for navigation.

`+page.js` exports a `load` function that runs on both server and client:
```js
export function load({ params }) {
	return { title: 'Hello', content: 'Welcome...' };
}
```

`+page.server.js` is for server-only load functions (database access, private env vars). Data is serialized via devalue for client-side navigation.

Both can export page options: `prerender`, `ssr`, `csr`.

`+page.server.js` can also export `actions` for form submissions.

## +error.svelte

Customizes error pages. SvelteKit walks up the tree to find the closest error boundary. If none exists, renders default error page (customizable via `src/error.html`).

## +layout.svelte / +layout.js / +layout.server.js

`+layout.svelte` wraps pages with shared markup (nav, footer). Must include `{@render children()}` for page content.

Layouts can be nested. Child layouts inherit parent layouts.

`+layout.js` exports `load` function providing data to layout and all child pages:
```js
export function load() {
	return { sections: [{ slug: 'profile', title: 'Profile' }] };
}
```

`+layout.server.js` for server-only load functions.

Layout `load` functions are intelligently rerun only when necessary.

## +server.js

API routes. Export HTTP verb handlers (`GET`, `POST`, `PATCH`, `PUT`, `DELETE`, `OPTIONS`, `HEAD`) that receive `RequestEvent` and return `Response`:
```js
export function GET({ url }) {
	const min = Number(url.searchParams.get('min') ?? '0');
	return new Response(String(min + Math.random()));
}
```

Can export `fallback` handler for unhandled methods.

Use `error()`, `redirect()`, `json()` helpers from `@sveltejs/kit`.

Errors return JSON or fallback error page (not `+error.svelte`).

**Content negotiation:** When `+server.js` and `+page` coexist:
- `PUT`/`PATCH`/`DELETE`/`OPTIONS` → always `+server.js`
- `GET`/`POST`/`HEAD` → `+server.js` if `accept` header doesn't prioritize `text/html`, else page request
- `GET` responses include `Vary: Accept` header

## $types

SvelteKit generates `$types.d.ts` for type safety. Use `PageProps`/`LayoutProps` for component props, `PageLoad`/`PageServerLoad`/`LayoutLoad`/`LayoutServerLoad` for load functions. IDE tooling can auto-insert these types.