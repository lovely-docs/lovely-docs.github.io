

## Pages

### routing
Filesystem-based routing with `src/routes` directory structure; route files use `+` prefix (+page.svelte, +page.js/.server.js, +layout.svelte/.js/.server.js, +server.js, +error.svelte); pages render SSR/CSR, layouts persist across navigation, +server.js handles HTTP verbs with content negotiation (GET/POST/HEAD as pages if accept:text/html else API, PUT/PATCH/DELETE/OPTIONS always API), +error.svelte walks tree for error boundaries, $types.d.ts provides type safety.

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

### load
Load functions in +page.js/+page.server.js/+layout.js/+layout.server.js fetch data before rendering; universal load runs server+browser (any return type), server load runs server-only (serializable data); access via data prop or page.data; supports fetch with cookie inheritance, setHeaders, parent(), error()/redirect(), promise streaming, dependency tracking with invalidate(), and getRequestEvent() for shared auth.

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

### form-actions
Server-side form actions in +page.server.js using POST with optional progressive enhancement; supports default/named actions, validation errors via fail(), redirects, and use:enhance directive for client-side handling.

## Form Actions

Server-side form handling in SvelteKit via `+page.server.js` exporting `actions` object. Forms use `POST` requests (never `GET` for side-effects) and work without JavaScript, with optional progressive enhancement.

### Default Actions

```js
// src/routes/login/+page.server.js
export const actions = {
  default: async (event) => {
    // handle form submission
  }
};
```

```svelte
<form method="POST">
  <input name="email" type="email">
  <input name="password" type="password">
  <button>Log in</button>
</form>
```

Invoke from other pages with `<form method="POST" action="/login">`.

### Named Actions

Multiple actions per page using query parameters:

```js
export const actions = {
  login: async (event) => { /* ... */ },
  register: async (event) => { /* ... */ }
};
```

```svelte
<form method="POST" action="?/login">
  <!-- form fields -->
  <button>Log in</button>
  <button formaction="?/register">Register</button>
</form>
```

Cannot mix default and named actions (query parameter would persist in URL).

### Action Anatomy

Actions receive `RequestEvent`, read form data with `request.formData()`, return data available as `form` prop on page and `page.form` app-wide:

```js
import * as db from '$lib/server/db';

export async function load({ cookies }) {
  const user = await db.getUserFromSession(cookies.get('sessionid'));
  return { user };
}

export const actions = {
  login: async ({ cookies, request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');
    
    const user = await db.getUser(email);
    cookies.set('sessionid', await db.createSession(user), { path: '/' });
    return { success: true };
  }
};
```

```svelte
<script>
  let { data, form } = $props();
</script>

{#if form?.success}
  <p>Successfully logged in! Welcome back, {data.user.name}</p>
{/if}
```

### Validation Errors

Use `fail(statusCode, data)` to return validation errors with form values:

```js
import { fail } from '@sveltejs/kit';

export const actions = {
  login: async ({ cookies, request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');
    
    if (!email) {
      return fail(400, { email, missing: true });
    }
    
    const user = await db.getUser(email);
    if (!user || user.password !== db.hash(password)) {
      return fail(400, { email, incorrect: true });
    }
    
    cookies.set('sessionid', await db.createSession(user), { path: '/' });
    return { success: true };
  }
};
```

```svelte
<form method="POST" action="?/login">
  {#if form?.missing}<p class="error">Email required</p>{/if}
  {#if form?.incorrect}<p class="error">Invalid credentials</p>{/if}
  <input name="email" type="email" value={form?.email ?? ''}>
  <input name="password" type="password">
  <button>Log in</button>
</form>
```

Returned data must be JSON-serializable. Use `id` property or similar to distinguish multiple forms.

### Redirects

Use `redirect(statusCode, location)` after successful action:

```js
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  login: async ({ cookies, request, url }) => {
    // ... validation and login logic ...
    
    if (url.searchParams.has('redirectTo')) {
      redirect(303, url.searchParams.get('redirectTo'));
    }
    return { success: true };
  }
};
```

### Loading Data

Page's `load` functions run after action completes. `handle` runs before action and doesn't rerun before `load`, so manually update `event.locals` when setting/deleting cookies:

```js
// src/hooks.server.js
export async function handle({ event, resolve }) {
  event.locals.user = await getUser(event.cookies.get('sessionid'));
  return resolve(event);
}
```

```js
// src/routes/account/+page.server.js
export function load(event) {
  return { user: event.locals.user };
}

export const actions = {
  logout: async (event) => {
    event.cookies.delete('sessionid', { path: '/' });
    event.locals.user = null;
  }
};
```

### Progressive Enhancement with use:enhance

Add `use:enhance` directive for client-side form handling without full-page reload:

```svelte
<script>
  import { enhance } from '$app/forms';
  let { form } = $props();
</script>

<form method="POST" use:enhance>
  <!-- form fields -->
</form>
```

Without arguments, `use:enhance` emulates browser behavior: updates `form`/`page.form`/`page.status`, resets form, invalidates all data on success, calls `goto` on redirect, renders error boundary on error, resets focus.

Customize with `SubmitFunction`:

```svelte
<form
  method="POST"
  use:enhance={({ formElement, formData, action, cancel, submitter }) => {
    // runs before submission
    return async ({ result, update }) => {
      // runs after submission
      // result is ActionResult object
      // call update() for default behavior
    };
  }}
>
```

Use `applyAction` to manually handle results:

```svelte
<script>
  import { enhance, applyAction } from '$app/forms';
  let { form } = $props();
</script>

<form
  method="POST"
  use:enhance={({ formElement, formData, action, cancel }) => {
    return async ({ result }) => {
      if (result.type === 'redirect') {
        goto(result.location);
      } else {
        await applyAction(result);
      }
    };
  }}
>
```

`applyAction(result)` behavior:
- `success`, `failure`: sets `page.status` to `result.status`, updates `form` and `page.form` to `result.data`
- `redirect`: calls `goto(result.location, { invalidateAll: true })`
- `error`: renders nearest error boundary with `result.error`

### Custom Event Listener

Implement progressive enhancement manually:

```svelte
<script>
  import { invalidateAll, goto } from '$app/navigation';
  import { applyAction, deserialize } from '$app/forms';
  let { form } = $props();

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget, event.submitter);
    
    const response = await fetch(event.currentTarget.action, {
      method: 'POST',
      body: data
    });
    
    const result = deserialize(await response.text());
    
    if (result.type === 'success') {
      await invalidateAll();
    }
    
    applyAction(result);
  }
</script>

<form method="POST" onsubmit={handleSubmit}>
  <!-- form fields -->
</form>
```

Must use `deserialize` from `$app/forms` (not `JSON.parse`) to handle `Date` and `BigInt` objects.

To POST to `+page.server.js` action when `+server.js` exists, use header:

```js
const response = await fetch(this.action, {
  method: 'POST',
  body: data,
  headers: { 'x-sveltekit-action': 'true' }
});
```

### Alternatives

Use `+server.js` files for JSON APIs instead of form actions:

```svelte
<script>
  function rerun() {
    fetch('/api/ci', { method: 'POST' });
  }
</script>

<button onclick={rerun}>Rerun CI</button>
```

```js
// src/routes/api/ci/+server.js
export function POST() {
  // do something
}
```

### GET vs POST

Use `method="GET"` (or no method) for forms that don't POST data (e.g., search). SvelteKit treats them like `<a>` elements, using client-side router without full-page navigation. Invokes `load` function but not actions. Supports `data-sveltekit-reload`, `data-sveltekit-replacestate`, `data-sveltekit-keepfocus`, `data-sveltekit-noscroll` attributes.

```html
<form action="/search">
  <input name="q">
</form>
```

Navigates to `/search?q=...` without invoking action.

### page-options
Page options (prerender, ssr, csr, trailingSlash, config, entries) exported from layout/page files control per-route rendering: static generation, server-side, client-side, trailing slashes, adapter config, and dynamic route prerender parameters.

## Page Options

Control rendering behavior per-page or per-layout by exporting options from `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js`. Child layouts/pages override parent values.

### prerender
Generate static HTML files at build time for routes that serve identical content to all users.

```js
export const prerender = true;  // prerender this route
export const prerender = false; // don't prerender
export const prerender = 'auto'; // prerender but include in dynamic SSR manifest
```

Prerenderer crawls from root following `<a>` links. Specify additional routes via `config.kit.prerender.entries` or export an `entries()` function from dynamic routes:

```js
// src/routes/blog/[slug]/+page.server.js
export function entries() {
	return [
		{ slug: 'hello-world' },
		{ slug: 'another-blog-post' }
	];
}
export const prerender = true;
```

Also applies to `+server.js` files. Prerender value is `true` during build (check via `building` from `$app/environment`).

**When not to prerender:** Content must be identical for all users. Cannot prerender pages with form actions. Cannot access `url.searchParams` during prerendering. Avoid route conflicts: use file extensions like `foo.json/+server.js` instead of `foo/+server.js`.

**Troubleshooting:** If marked prerenderable but not prerendered, ensure SvelteKit can discover the route via links from entry points or other prerendered pages, or change to `prerender = 'auto'`.

### ssr
Disable server-side rendering to render only an empty shell on server (useful for browser-only code using `document` etc., but generally not recommended).

```js
export const ssr = false;
```

Setting in root `+layout.js` converts entire app to SPA. If both `ssr` and `csr` are `false`, nothing renders.

### csr
Disable client-side rendering/hydration. Page works with HTML/CSS only, no JavaScript shipped.

```js
export const csr = false;
```

Effects: no `<script>` tags, no form progressive enhancement, full-page navigation, no HMR. Can conditionally enable during dev:

```js
import { dev } from '$app/environment';
export const csr = dev;
```

If both `csr` and `ssr` are `false`, nothing renders.

### trailingSlash
Control trailing slash behavior: `'never'` (default, redirects `/about/` to `/about`), `'always'`, or `'ignore'`.

```js
export const trailingSlash = 'always';
```

Affects prerendering: `'always'` creates `about/index.html`, otherwise `about.html`. Not recommended to ignore — relative path semantics differ and SEO is harmed.

### config
Adapter-specific configuration object. Top-level keys are merged (not nested levels).

```js
export const config = {
	runtime: 'edge',
	regions: 'all',
	foo: { bar: true }
};
```

Layout config `{ runtime: 'edge', regions: 'all', foo: { bar: true } }` merged with page config `{ regions: ['us1', 'us2'], foo: { baz: true } }` results in `{ runtime: 'edge', regions: ['us1', 'us2'], foo: { baz: true } }`.

### entries
Export `entries()` function from dynamic route's `+page.js`, `+page.server.js`, or `+server.js` to specify which parameter combinations to prerender. Can be async to fetch from CMS/database.

```js
export function entries() {
	return [{ slug: 'hello-world' }, { slug: 'another-blog-post' }];
}
export const prerender = true;
```

### Static evaluation
If all page options are boolean or string literals, SvelteKit evaluates them statically. Otherwise imports the file at build/runtime, so browser-only code must not run at module load — import it in `+page.svelte` or `+layout.svelte` instead.

### state-management
State management patterns: avoid shared server state, use context API instead of globals, make load functions pure, use $derived for reactive calculations, store persistent state in URL, use snapshots for ephemeral UI state.

## Avoid shared state on the server

Servers are stateless and shared by multiple users. Never store data in shared variables:

```js
// ❌ WRONG - shared across all users
let user;
export function load() {
	return { user };
}
export const actions = {
	default: async ({ request }) => {
		user = { name: data.get('name'), secret: data.get('secret') };
	}
}
```

Instead, authenticate users with cookies and persist data to a database.

## No side-effects in load functions

Load functions must be pure. Don't write to stores or global state:

```js
// ❌ WRONG - shared state
import { user } from '$lib/user';
export async function load({ fetch }) {
	const response = await fetch('/api/user');
	user.set(await response.json()); // Never do this
}

// ✅ CORRECT - return data
export async function load({ fetch }) {
	const response = await fetch('/api/user');
	return { user: await response.json() };
}
```

Pass data to components or use `page.data`.

## Using state and stores with context

Use Svelte's context API to avoid global state. Server-side app state uses `setContext`/`getContext`:

```svelte
<!-- +layout.svelte -->
<script>
	import { setContext } from 'svelte';
	let { data } = $props();
	setContext('user', () => data.user);
</script>

<!-- user/+page.svelte -->
<script>
	import { getContext } from 'svelte';
	const user = getContext('user');
</script>
<p>Welcome {user().name}</p>
```

Pass functions into context to maintain reactivity. On the server, context-based state updates in child components won't affect parent components (already rendered), but on the client they will. Pass state down rather than up to avoid flashing during hydration.

If not using SSR, you can safely keep state in a shared module.

## Component and page state is preserved

When navigating, SvelteKit reuses layout and page components. The `data` prop updates but lifecycle methods don't rerun:

```svelte
// ❌ WRONG - estimatedReadingTime won't recalculate on navigation
const wordCount = data.content.split(' ').length;
const estimatedReadingTime = wordCount / 250;

// ✅ CORRECT - use $derived
let wordCount = $derived(data.content.split(' ').length);
let estimatedReadingTime = $derived(wordCount / 250);
```

Use `afterNavigate` and `beforeNavigate` if lifecycle code must rerun. To destroy/remount on navigation:

```svelte
<script>
	import { page } from '$app/state';
</script>
{#key page.url.pathname}
	<BlogPost title={data.title} content={data.content} />
{/key}
```

## Storing state in the URL

For state that should survive reload or affect SSR (filters, sorting), use URL search parameters:

```
?sort=price&order=ascending
```

Set via `<a href="...">`, `<form action="...">`, or `goto('?key=value')`. Access in load functions via `url` parameter, in components via `page.url.searchParams`.

## Storing ephemeral state in snapshots

For disposable UI state (accordion open/closed) that should persist across navigation but not reload, use snapshots to associate component state with history entries.

### remote-functions
Type-safe RPC: query (read), form (write+progressive), command (write), prerender (build-time); validate args with Standard Schema; single-flight mutations; getRequestEvent for auth/cookies.

## Remote Functions

Type-safe client-server communication tool. Functions are called from anywhere but always execute on the server, enabling safe access to server-only modules (environment variables, database clients). Requires opt-in via `kit.experimental.remoteFunctions: true` in `svelte.config.js`.

### Overview

Remote functions are exported from `.remote.js` or `.remote.ts` files. On the client, they're transformed to `fetch` wrappers that invoke server counterparts via generated HTTP endpoints. Four types: `query`, `form`, `command`, `prerender`.

### query

Reads dynamic data from server. Returns a Promise that resolves to the result.

```js
// src/routes/blog/data.remote.js
import { query } from '$app/server';
import * as db from '$lib/server/database';

export const getPosts = query(async () => {
	const posts = await db.sql`SELECT title, slug FROM post ORDER BY published_at DESC`;
	return posts;
});
```

```svelte
<script>
	import { getPosts } from './data.remote';
</script>

<h1>Recent posts</h1>
{#each await getPosts() as { title, slug }}
	<li><a href="/blog/{slug}">{title}</a></li>
{/each}
```

Alternative to `await`: use `query.loading`, `query.error`, `query.current` properties.

**Query arguments**: Accept single argument, validate with Standard Schema (Zod, Valibot):

```js
import * as v from 'valibot';
import { query } from '$app/server';

export const getPost = query(v.string(), async (slug) => {
	const [post] = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
	if (!post) error(404, 'Not found');
	return post;
});
```

**Refreshing**: Call `getPosts().refresh()` to re-fetch latest value. Queries are cached per page (`getPosts() === getPosts()`).

**query.batch**: Batches requests within same macrotask to solve n+1 problem. Server callback receives array of arguments, must return function `(input, index) => output`:

```js
export const getWeather = query.batch(v.string(), async (cities) => {
	const weather = await db.sql`SELECT * FROM weather WHERE city = ANY(${cities})`;
	const lookup = new Map(weather.map(w => [w.city, w]));
	return (city) => lookup.get(city);
});
```

### form

Writes data to server. Takes callback receiving `data` from submitted FormData. Returns object with `method` and `action` properties for progressive enhancement.

```js
import * as v from 'valibot';
import { form } from '$app/server';

export const createPost = form(
	v.object({
		title: v.pipe(v.string(), v.nonEmpty()),
		content: v.pipe(v.string(), v.nonEmpty())
	}),
	async ({ title, content }) => {
		const user = await auth.getUser();
		if (!user) error(401, 'Unauthorized');
		const slug = title.toLowerCase().replace(/ /g, '-');
		await db.sql`INSERT INTO post (slug, title, content) VALUES (${slug}, ${title}, ${content})`;
		redirect(303, `/blog/${slug}`);
	}
);
```

```svelte
<script>
	import { createPost } from '../data.remote';
</script>

<form {...createPost}>
	<input {...createPost.fields.title.as('text')} />
	<textarea {...createPost.fields.content.as('text')}></textarea>
	<button>Publish!</button>
</form>
```

**Fields**: Call `.as(inputType)` on field to get attributes. Supports nested objects/arrays, strings, numbers, booleans, Files. For checkboxes/radios with same field, pass value as second argument: `.as('radio', 'windows')`. Unchecked checkboxes not included in FormData, so must be optional in schema.

**Programmatic validation**: Use `invalid` function inside handler to mark fields invalid for cases unknown until runtime:

```js
export const buyHotcakes = form(
	v.object({ qty: v.pipe(v.number(), v.minValue(1)) }),
	async (data, invalid) => {
		try {
			await db.buy(data.qty);
		} catch (e) {
			if (e.code === 'OUT_OF_STOCK') {
				invalid(invalid.qty(`we don't have enough hotcakes`));
			}
		}
	}
);
```

**Validation**: Invalid fields show `issues()` array and `aria-invalid="true"`. Call `validate()` programmatically. Use `preflight(schema)` for client-side validation before sending to server. Get all issues with `fields.allIssues()`.

**Getting/setting inputs**: `field.value()` returns current value, auto-updated as user interacts. `fields.value()` returns object of all values. Use `set(...)` to update: `createPost.fields.set({ title: '...', content: '...' })`.

**Sensitive data**: Prefix field name with underscore to prevent sending back on invalid submission: `register.fields._password.as('password')`.

**Single-flight mutations**: By default all queries refresh after successful form submission. Specify which queries to refresh:
- Server-side: `await getPosts().refresh()` or `await getPost(id).set(result)` inside form handler
- Client-side: `await submit().updates(getPosts())` or with override: `await submit().updates(getPosts().withOverride(posts => [newPost, ...posts]))`

**Returns and redirects**: Form handler can `redirect(...)` or `return data`. Returned data available as `createPost.result` (ephemeral).

**enhance**: Customize submission with `enhance(async ({ form, data, submit }) => {...})`. Must call `form.reset()` manually. Use `submit().updates(...)` for single-flight mutations.

**Multiple instances**: Use `modifyTodo.for(id)` to create isolated form instances for repeated forms.

**buttonProps**: Different buttons can submit to different URLs via `formaction`. Use `register.buttonProps` on button to submit to different form.

### command

Writes data without being tied to form element. Can be called from anywhere (not during render). Like `form`, accepts optional validated argument.

```js
import * as v from 'valibot';
import { command } from '$app/server';

export const addLike = command(v.string(), async (id) => {
	await db.sql`UPDATE item SET likes = likes + 1 WHERE id = ${id}`;
});
```

```svelte
<button onclick={async () => {
	try {
		await addLike(item.id);
	} catch (error) {
		showToast('Something went wrong!');
	}
}}>
	add like
</button>
```

**Updating queries**: Refresh queries inside command or when calling: `await addLike(id).updates(getLikes(id))`. Use `withOverride` for optimistic updates: `await addLike(id).updates(getLikes(id).withOverride(n => n + 1))`.

### prerender

Invoked at build time to prerender result. For data that changes at most once per redeployment. In browser, prerendered data saved via Cache API, survives page reloads, cleared on new deployment.

```js
import { prerender } from '$app/server';

export const getPosts = prerender(async () => {
	const posts = await db.sql`SELECT title, slug FROM post ORDER BY published_at DESC`;
	return posts;
});
```

**Prerender arguments**: Accept validated argument. Calls found during crawling saved automatically. Specify values via `inputs` option:

```js
export const getPost = prerender(
	v.string(),
	async (slug) => { /* ... */ },
	{
		inputs: () => ['first-post', 'second-post', 'third-post']
	}
);
```

By default excluded from server bundle (can't call with non-prerendered args). Set `dynamic: true` to allow runtime calls.

### Validation errors

Generic 400 Bad Request returned for invalid data. Control message via `handleValidationError` server hook:

```js
// src/hooks.server.ts
export function handleValidationError({ event, issues }) {
	return { message: 'Nice try, hacker!' };
}
```

Opt out of validation with `'unchecked'` string instead of schema.

### getRequestEvent

Use `getRequestEvent()` inside `query`, `form`, `command` to access current RequestEvent. Useful for cookie/auth abstractions. Note: cannot set headers (except cookies in form/command), `route`/`params`/`url` relate to calling page not endpoint.

### Redirects

`redirect(...)` works inside `query`, `form`, `prerender` but not `command`.

