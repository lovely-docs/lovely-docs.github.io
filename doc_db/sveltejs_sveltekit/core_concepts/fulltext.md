

## Pages

### routing
SvelteKit uses filesystem-based routing with special `+` prefixed files for pages, layouts, API endpoints, and error handling.

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

### loading_data
Load functions in +page.js/+page.server.js and +layout.js/+layout.server.js fetch data before rendering, with server-only and universal variants offering different capabilities and constraints.

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

### form_actions
Server-side form handling in SvelteKit using actions exported from +page.server.js, with support for validation, redirects, and progressive enhancement.

## Form Actions

Export `actions` from `+page.server.js` to handle `POST` requests. Use `default` or named actions:

```js
export const actions = {
  login: async ({ cookies, request }) => {
    const data = await request.formData();
    // process and return { success: true } or fail(400, { error: true })
  }
};
```

Invoke with `<form method="POST" action="?/login">` or `<button formaction="?/register">`.

Return validation errors with `fail(status, data)`. Data is available as `form` prop in the page.

Use `redirect(status, location)` to redirect after action completion.

Progressively enhance with `use:enhance`:

```svelte
<script>
  import { enhance } from '$app/forms';
</script>

<form method="POST" use:enhance>
```

Customize with a `SubmitFunction` callback or implement custom handling with `deserialize` and `applyAction`.

### page_options
Export page options from layout and page files to control per-route rendering behavior: prerendering, SSR, CSR, trailing slashes, and adapter config.

## Page Options

Export options from `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js` to control rendering behavior. Child layouts override parent values.

**prerender**: Generate static HTML at build time. Use `true`, `false`, or `'auto'`. For dynamic routes, export an `entries()` function:
```js
export function entries() { return [{ slug: 'hello-world' }]; }
export const prerender = true;
```

**ssr**: Disable server-side rendering (`export const ssr = false`).

**csr**: Disable client-side rendering—no JavaScript shipped (`export const csr = false`).

**trailingSlash**: Control trailing slashes with `'never'` (default), `'always'`, or `'ignore'`.

**config**: Adapter-specific configuration (`export const config = { runtime: 'edge' }`). Top-level merge only.

### state_management
Best practices for managing state in SvelteKit apps that span server and client, avoiding shared state pitfalls and using context API, derived values, and URL parameters appropriately.

## Key patterns

**Avoid shared state on server** - Don't store data in shared variables; use cookies and databases instead.

**No side-effects in load** - Return data instead of writing to stores:
```js
export async function load({ fetch }) {
	return { user: await fetch('/api/user').then(r => r.json()) };
}
```

**Use context API** - Pass state through component tree with `setContext`/`getContext` instead of globals.

**Preserve component state** - Use `$derived` for reactive values that depend on props; use `{#key}` to force remounting.

**URL for persistent state** - Use search parameters for filters/sorting that should survive reloads.

**Snapshots for ephemeral state** - Persist UI state across navigation without URL/database.

### remote_functions
Type-safe client-server communication via remote functions that always execute on the server, supporting queries, forms, commands, and prerendering with validation and progressive enhancement.

Remote functions enable type-safe client-server communication via `.remote.js`/`.remote.ts` files. Four types: **query** (read data, caches per page, supports `.refresh()`), **query.batch** (batches simultaneous calls), **form** (progressive enhancement with validation and field management), **command** (imperative mutations), **prerender** (build-time static data).

```js
// query
export const getPost = query(v.string(), async (slug) => {
  return await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
});

// form
export const createPost = form(v.object({title: v.string()}), async ({title}) => {
  await db.sql`INSERT INTO post (title) VALUES (${title})`;
});

// command
export const addLike = command(v.string(), async (id) => {
  await db.sql`UPDATE item SET likes = likes + 1 WHERE id = ${id}`;
});
```

Enable with `kit.experimental.remoteFunctions: true` in config. Validate arguments with Standard Schema. Use `getRequestEvent()` for cookies/auth inside handlers.

