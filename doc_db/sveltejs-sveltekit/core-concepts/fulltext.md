

## Pages

### routing
Filesystem-based routing with special `+` prefixed files for pages, layouts, API endpoints, and error handling.

Routes defined by `src/routes` directory structure with `+` prefixed files. `+page.svelte` for pages, `+page.js`/`+page.server.js` for load functions, `+layout.svelte` for shared markup, `+server.js` for API endpoints, `+error.svelte` for error pages. Load functions run on server/client or server-only. `+server.js` exports HTTP handlers. Use `$types` for type safety.

### loading-data
Define load functions in route files to fetch and return data to components, with separate universal and server-only variants offering different capabilities and execution contexts.

## Load Functions

Define in `+page.js`/`+page.server.js` or `+layout.js`/`+layout.server.js`:

```js
// Universal (server + browser)
export function load({ params }) {
	return { data: 'value' };
}

// Server-only
export async function load({ params }) {
	return { data: await db.query() };
}
```

## Universal vs Server

- **Universal**: Run on server (SSR) then browser. Can return non-serializable data.
- **Server**: Run only on server. Must return serializable data. Use for DB/secrets.

## Key Features

- **Layout data**: Available to child layouts and pages
- **URL data**: Access `url`, `route`, `params`
- **Fetch**: Use provided `fetch()` (inherits cookies, allows relative URLs)
- **Cookies**: Server load can access/set via `cookies.get/set()`
- **Headers**: Set response headers with `setHeaders()`
- **Parent data**: Access parent load data with `await parent()`
- **Errors/Redirects**: Use `error()` and `redirect()` helpers
- **Streaming**: Return unresolved promises from server load
- **Rerun**: Triggered by param/url changes or `invalidate()`
- **Auth**: Use `getRequestEvent()` in shared auth functions

### form-actions
Server-side form actions in +page.server.js handle POST requests with progressive enhancement support via use:enhance.

## Form Actions Basics

Export `actions` from `+page.server.js` to handle POST requests:

```js
export const actions = {
	default: async (event) => {},
	login: async (event) => {},
	register: async (event) => {}
};
```

Invoke with `<form method="POST" action="?/login">` or `<button formaction="?/register">`.

## Handling Data & Errors

Read form data and return results:

```js
export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		if (!data.get('email')) {
			return fail(400, { missing: true });
		}
		return { success: true };
	}
};
```

Access in component via `form` prop. Use `redirect()` for redirects.

## Progressive Enhancement

Add `use:enhance` for client-side form handling without full-page reloads:

```svelte
<script>
	import { enhance, applyAction } from '$app/forms';
</script>

<form method="POST" use:enhance={({ formData }) => {
	return async ({ result }) => {
		await applyAction(result);
	};
}>
```

Use `deserialize` when implementing custom fetch-based handlers.

### page-options
Export page options from layout and page files to control server rendering, prerendering, client rendering, trailing slashes, and adapter-specific configuration.

## prerender
`export const prerender = true/false/'auto'` generates static HTML at build time. Specify dynamic routes via `entries()` function. Pages must return identical content for all users.

## ssr
`export const ssr = false` skips server rendering, sends empty shell. Setting in root layout makes entire app client-only (SPA).

## csr
`export const csr = false` disables client-side rendering—no JavaScript shipped, HTML/CSS only, full-page navigation.

## trailingSlash
`export const trailingSlash = 'never' | 'always' | 'ignore'` controls URL trailing slash behavior.

## config
`export const config = { ... }` sets adapter-specific configuration, merged at top level only.

### state-management
Guidelines for managing state in server-rendered and client-side applications, covering shared state pitfalls, load function purity, context API usage, component lifecycle preservation, and state persistence strategies.

**Avoid shared state on server** — don't store data in shared variables; use cookies and databases instead.

**No side-effects in load** — return data instead of writing to stores:
```js
export async function load({ fetch }) {
	return { user: await fetch('/api/user').then(r => r.json()) };
}
```

**Use context API for safe state sharing** — pass functions into context to maintain reactivity across SSR boundaries.

**Component state is preserved** — make dependent values reactive with `$derived` when data changes.

**URL search parameters** — store state that needs to survive reloads: `?sort=price&order=ascending`.

**Snapshots** — preserve ephemeral UI state across navigation.

### remote-functions
Type-safe client-server communication with query, form, command, and prerender functions that run on server and support validation, progressive enhancement, and single-flight mutations.

Remote functions enable type-safe client-server communication, always running on server. Four types: `query` (read), `query.batch` (batch reads), `form` (write with progressive enhancement), `command` (write from anywhere), `prerender` (build-time static data).

**query**:
```js
export const getPost = query(v.string(), async (slug) => {
  const [post] = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
  return post;
});
```
Use with `await getPost(slug)` or access `.loading`, `.error`, `.current`. Call `.refresh()` to re-fetch.

**form**:
```js
export const createPost = form(v.object({title: v.string(), content: v.string()}), async (data) => {
  await db.insert(data);
  redirect(303, '/blog');
});
```
Spread onto `<form>`, access fields via `createPost.fields.title.as('text')`. Validate with `validate()`, get issues via `field.issues()`. Single-flight mutations: `submit().updates(query())`.

**command**: Like form but callable from anywhere, no progressive enhancement. Update queries via `.updates(query())`.

**prerender**: Build-time execution for static data. Specify `inputs: () => [...]`.

Enable in config: `kit: { experimental: { remoteFunctions: true } }`

### core-concepts
Index page for core SvelteKit concepts and foundational topics.

Overview page introducing fundamental SvelteKit concepts and architectural patterns.

