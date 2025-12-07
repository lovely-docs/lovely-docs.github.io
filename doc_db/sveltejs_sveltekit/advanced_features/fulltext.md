

## Pages

### advanced-routing
Rest parameters `[...file]`, optional params `[[lang]]`, matchers for validation, route sorting rules, character encoding with hex/Unicode escapes, layout groups `(name)` and hierarchy breaking with `@segment`.

## Rest parameters

Use `[...file]` syntax to match variable number of segments. Example: `/[org]/[repo]/tree/[branch]/[...file]` matches `/sveltejs/kit/tree/main/documentation/docs/04-advanced-routing.md` and provides `{org: 'sveltejs', repo: 'kit', branch: 'main', file: 'documentation/docs/04-advanced-routing.md'}`.

Routes like `src/routes/a/[...rest]/z/+page.svelte` match `/a/z` (empty rest), `/a/b/z`, `/a/b/c/z`, etc. Validate rest parameter values using matchers.

### 404 pages

Rest parameters enable custom 404 handling. If route `/marx-brothers/karl` doesn't match any route, the nested `marx-brothers/+error.svelte` won't render. Create a catch-all route with rest parameter that returns 404:

```
src/routes/marx-brothers/[...path]/+page.js
```

```js
import { error } from '@sveltejs/kit';
export function load(event) {
	error(404, 'Not Found');
}
```

Unhandled 404s appear in `handleError` hook.

## Optional parameters

Wrap parameter in double brackets to make optional: `[[lang]]/home` matches both `home` and `en/home`. Optional parameters cannot follow rest parameters (`[...rest]/[[optional]]` is invalid) since rest matches greedily.

## Matching

Matchers validate route parameters. Create `src/params/fruit.js`:

```js
export function match(param) {
	return param === 'apple' || param === 'orange';
}
```

Use in route: `src/routes/fruits/[page=fruit]`. If pathname doesn't match, SvelteKit tries other routes before returning 404. Matchers run on server and browser. Test files `*.test.js` and `*.spec.js` in params directory are excluded.

## Sorting

When multiple routes match a path, SvelteKit sorts by:
1. Specificity (no parameters > one parameter > more parameters)
2. Matchers (`[name=type]` > `[name]`)
3. `[[optional]]` and `[...rest]` lowest priority unless final segment
4. Alphabetical ties

Example: `/foo-abc` matches these routes in priority order:
```
src/routes/foo-abc/+page.svelte
src/routes/foo-[c]/+page.svelte
src/routes/[[a=x]]/+page.svelte
src/routes/[b]/+page.svelte
src/routes/[...catchall]/+page.svelte
```

## Encoding

Characters with special meaning in URLs or SvelteKit use hexadecimal escape sequences `[x+nn]`:
- `\` → `[x+5c]`, `/` → `[x+2f]`, `:` → `[x+3a]`, `*` → `[x+2a]`, `?` → `[x+3f]`, `"` → `[x+22]`, `<` → `[x+3c]`, `>` → `[x+3e]`, `|` → `[x+7c]`, `#` → `[x+23]`, `%` → `[x+25]`, `[` → `[x+5b]`, `]` → `[x+5d]`, `(` → `[x+28]`, `)` → `[x+29]`

Example: `/smileys/:-)` → `src/routes/smileys/[x+3a]-[x+29]/+page.svelte`

Get hex code: `':'.charCodeAt(0).toString(16)` → `'3a'`

Unicode escapes `[u+nnnn]` (0000-10ffff) also work: `src/routes/[u+d83e][u+dd2a]/+page.svelte` equals `src/routes/🤪/+page.svelte`. Useful for `.well-known` routes: `src/routes/[x+2e]well-known/...`

## Advanced layouts

### (group)

Group routes with parentheses `(app)`, `(marketing)` — they don't affect URL pathname. Routes in different groups inherit different layouts:

```
src/routes/
├ (app)/
│ ├ dashboard/
│ ├ item/
│ └ +layout.svelte
├ (marketing)/
│ ├ about/
│ ├ testimonials/
│ └ +layout.svelte
├ admin/
└ +layout.svelte
```

`/admin` doesn't inherit `(app)` or `(marketing)` layouts. Can put `+page` directly in `(group)`.

### Breaking out of layouts

Root layout applies to all pages (defaults to `{@render children()}`). Put app inside groups except routes that shouldn't inherit common layouts.

### +page@

Pages break out of layout hierarchy per-route using `@segment`:

```
src/routes/
├ (app)/
│ ├ item/
│ │ ├ [id]/
│ │ │ ├ embed/
│ │ │ │ └ +page@(app).svelte
│ │ │ └ +layout.svelte
│ │ └ +layout.svelte
│ └ +layout.svelte
└ +layout.svelte
```

Options for `/item/[id]/embed`:
- `+page@[id].svelte` - inherits from `[id]/+layout.svelte`
- `+page@item.svelte` - inherits from `item/+layout.svelte`
- `+page@(app).svelte` - inherits from `(app)/+layout.svelte`
- `+page@.svelte` - inherits from root `+layout.svelte`

### +layout@

Layouts break out similarly: `+layout@.svelte` resets hierarchy for child routes.

```
src/routes/
├ (app)/
│ ├ item/
│ │ ├ [id]/
│ │ │ ├ embed/
│ │ │ │ └ +page.svelte
│ │ │ ├ +layout.svelte
│ │ │ └ +page.svelte
│ │ └ +layout@.svelte
│ └ +layout.svelte
└ +layout.svelte
```

### When to use layout groups

Not all cases need layout groups. Consider composition (reusable load functions, Svelte components) or conditionals:

```svelte
<!--- file: src/routes/nested/route/+layout@.svelte --->
<script>
	import ReusableLayout from '$lib/ReusableLayout.svelte';
	let { data, children } = $props();
</script>

<ReusableLayout {data}>
	{@render children()}
</ReusableLayout>
```

```js
import { reusableLoad } from '$lib/reusable-load-function';
export function load(event) {
	return reusableLoad(event);
}
```

### hooks
App-wide hooks for request handling, error management, initialization, URL routing, and type serialization across server/client boundary.

## Hooks Overview

Hooks are app-wide functions that SvelteKit calls in response to specific events. Three optional hook files exist:
- `src/hooks.server.js` — server hooks
- `src/hooks.client.js` — client hooks  
- `src/hooks.js` — universal hooks (both client and server)

Hook modules run at startup, useful for initializing database clients.

## Server Hooks

### handle
Runs on every request (including prerendering). Receives `event` and `resolve` function. Can modify response headers/bodies or bypass SvelteKit entirely.

```js
export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith('/custom')) {
		return new Response('custom response');
	}
	const response = await resolve(event);
	return response;
}
```

Defaults to `({ event, resolve }) => resolve(event)`. Static assets are not handled by SvelteKit.

`resolve` accepts optional second parameter with:
- `transformPageChunk(opts: { html: string, done: boolean }): MaybePromise<string | undefined>` — custom HTML transforms
- `filterSerializedResponseHeaders(name: string, value: string): boolean` — which headers to include in serialized responses from `load` functions
- `preload(input: { type: 'js' | 'css' | 'font' | 'asset', path: string }): boolean` — what files to preload in `<head>`

```js
export async function handle({ event, resolve }) {
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('old', 'new'),
		filterSerializedResponseHeaders: (name) => name.startsWith('x-'),
		preload: ({ type, path }) => type === 'js' || path.includes('/important/')
	});
	return response;
}
```

`resolve` never throws, always returns `Promise<Response>`. Errors elsewhere in `handle` are fatal.

### handleFetch
Modifies or replaces results of `event.fetch` calls on server/prerendering in endpoints, `load`, `action`, `handle`, `handleError`, or `reroute`.

```js
export async function handleFetch({ request, fetch }) {
	if (request.url.startsWith('https://api.yourapp.com/')) {
		request = new Request(
			request.url.replace('https://api.yourapp.com/', 'http://localhost:9999/'),
			request
		);
	}
	return fetch(request);
}
```

`event.fetch` follows browser credentials model — same-origin requests forward `cookie` and `authorization` headers unless `credentials: "omit"`. Cross-origin requests include cookies if URL is subdomain of app. Sibling subdomains don't include parent domain cookies; manually set them:

```js
export async function handleFetch({ event, request, fetch }) {
	if (request.url.startsWith('https://api.my-domain.com/')) {
		request.headers.set('cookie', event.request.headers.get('cookie'));
	}
	return fetch(request);
}
```

### handleValidationError
Called when remote function receives argument not matching Standard Schema. Must return object matching `App.Error` shape.

```js
export function handleValidationError({ issues }) {
	return {
		message: 'No thank you'
	};
}
```

## Shared Hooks (server and client)

### handleError
Called when unexpected error thrown during loading, rendering, or from endpoint. Receives `error`, `event`, `status`, `message`. Allows logging and generating safe error representation for users.

For errors from your code, status is 500 and message is "Internal Error". `error.message` may contain sensitive info; `message` is safe.

Customize error shape via `App.Error` interface:

```ts
declare global {
	namespace App {
		interface Error {
			message: string;
			errorId: string;
		}
	}
}
```

```js
// src/hooks.server.js
import * as Sentry from '@sentry/sveltekit';
Sentry.init({/*...*/})

export async function handleError({ error, event, status, message }) {
	const errorId = crypto.randomUUID();
	Sentry.captureException(error, {
		extra: { event, errorId, status }
	});
	return {
		message: 'Whoops!',
		errorId
	};
}
```

```js
// src/hooks.client.js
import * as Sentry from '@sentry/sveltekit';
Sentry.init({/*...*/})

export async function handleError({ error, event, status, message }) {
	const errorId = crypto.randomUUID();
	Sentry.captureException(error, {
		extra: { event, errorId, status }
	});
	return {
		message: 'Whoops!',
		errorId
	};
}
```

In client hooks, `handleError` type is `HandleClientError` and `event` is `NavigationEvent` not `RequestEvent`. Not called for expected errors (thrown with `error()` from `@sveltejs/kit`). During dev, syntax errors in Svelte code have `frame` property. `handleError` must never throw.

### init
Runs once when server created or app starts in browser. Useful for async initialization like database connections.

```js
import * as db from '$lib/server/database';

export async function init() {
	await db.connect();
}
```

In browser, async work delays hydration.

## Universal Hooks

### reroute
Runs before `handle`. Changes how URLs translate to routes. Returns pathname (defaults to `url.pathname`) used to select route and parameters.

```js
const translated = {
	'/en/about': '/en/about',
	'/de/ueber-uns': '/de/about',
	'/fr/a-propos': '/fr/about',
};

export function reroute({ url }) {
	if (url.pathname in translated) {
		return translated[url.pathname];
	}
}
```

Doesn't change browser address bar or `event.url`. Since v2.18, can be async:

```js
export async function reroute({ url, fetch }) {
	if (url.pathname === '/api/reroute') return;
	const api = new URL('/api/reroute', url);
	api.searchParams.set('pathname', url.pathname);
	const result = await fetch(api).then(r => r.json());
	return result.pathname;
}
```

Must be pure, idempotent function — same input always returns same output, no side effects. SvelteKit caches result on client.

### transport
Collection of transporters allowing custom types from `load` and form actions across server/client boundary. Each has `encode` (server) and `decode` (client) functions:

```js
import { Vector } from '$lib/math';

export const transport = {
	Vector: {
		encode: (value) => value instanceof Vector && [value.x, value.y],
		decode: ([x, y]) => new Vector(x, y)
	}
};
```

### errors
Expected errors via error(status, message) render +error.svelte; unexpected errors show generic message and go through handleError hook; customize fallback with src/error.html; define App.Error interface for type-safe custom properties.

## Error Objects

SvelteKit distinguishes between expected and unexpected errors, both represented as `{ message: string }` objects by default. Additional properties like `code` or `id` can be added (requires TypeScript `Error` interface redefinition).

## Expected Errors

Created with the `error()` helper from `@sveltejs/kit`. Throws an exception caught by SvelteKit, setting the response status code and rendering the nearest `+error.svelte` component where `page.error` contains the error object.

```js
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const post = await db.getPost(params.slug);
	if (!post) {
		error(404, { message: 'Not found' });
		// or with custom properties:
		error(404, { message: 'Not found', code: 'NOT_FOUND' });
		// or shorthand:
		error(404, 'Not found');
	}
	return { post };
}
```

Access in `+error.svelte`:
```svelte
<script>
	import { page } from '$app/state'; // or $app/stores in SvelteKit < 2.12
</script>
<h1>{page.error.message}</h1>
```

## Unexpected Errors

Any other exception during request handling. Not exposed to users for security; generic `{ message: "Internal Error" }` is shown instead. Printed to console/server logs and passed through the `handleError` hook for custom handling (e.g., error reporting services).

## Responses

Errors in `handle` or `+server.js` respond with fallback error page or JSON based on `Accept` headers.

Customize fallback with `src/error.html`:
```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>%sveltekit.error.message%</title>
	</head>
	<body>
		<h1>My custom error page</h1>
		<p>Status: %sveltekit.status%</p>
		<p>Message: %sveltekit.error.message%</p>
	</body>
</html>
```

SvelteKit replaces `%sveltekit.status%` and `%sveltekit.error.message%` with values.

Errors in `load` functions render nearest `+error.svelte`. If error in root `+layout.js/+layout.server.js`, fallback error page is used (since root layout contains `+error.svelte`).

## Type Safety

Customize error shape with TypeScript by declaring `App.Error` interface (typically in `src/app.d.ts`):

```ts
declare global {
	namespace App {
		interface Error {
			code: string;
			id: string;
		}
	}
}
export {};
```

Always includes `message: string` property.

### link-options
data-sveltekit-* attributes customize link navigation: preload-data/code (hover/tap/eager/viewport), reload (full-page), replacestate (history), keepfocus, noscroll; disable with "false".

SvelteKit uses standard `<a>` elements for navigation. Customize link behavior with `data-sveltekit-*` attributes applied to the link or parent element. These attributes also work on `<form method="GET">`.

**data-sveltekit-preload-data**: Preload page data on user interaction to improve perceived performance.
- `"hover"` (default): Start preloading on mouse hover (desktop) or `touchstart` (mobile)
- `"tap"`: Start preloading only on `touchstart` or `mousedown`
- Respects `navigator.connection.saveData` (won't preload if user has reduced data usage enabled)
- Can be programmatically invoked via `preloadData` from `$app/navigation`

Example:
```html
<body data-sveltekit-preload-data="hover">
	<div style="display: contents">%sveltekit.body%</div>
</body>

<a data-sveltekit-preload-data="tap" href="/stonks">
	Get current stonk values
</a>
```

**data-sveltekit-preload-code**: Preload page code with four eagerness levels (only affects code, not data).
- `"eager"`: Preload immediately
- `"viewport"`: Preload when link enters viewport
- `"hover"`: Preload on hover (code only)
- `"tap"`: Preload on tap/click (code only)
- Only applies to links in DOM immediately after navigation; dynamically added links use `hover`/`tap`
- Ignored if user has reduced data usage enabled
- Only has effect if more eager than any `data-sveltekit-preload-data` attribute

**data-sveltekit-reload**: Force full-page browser navigation instead of SvelteKit client-side navigation.
```html
<a data-sveltekit-reload href="/path">Path</a>
```
Also applied automatically to links with `rel="external"` (which are also ignored during prerendering).

**data-sveltekit-replacestate**: Replace current history entry instead of creating new one with `pushState`.
```html
<a data-sveltekit-replacestate href="/path">Path</a>
```

**data-sveltekit-keepfocus**: Retain focus on currently focused element after navigation (useful for search forms that submit while typing).
```html
<form data-sveltekit-keepfocus>
	<input type="text" name="query">
</form>
```
Avoid on links since focus would be on the `<a>` tag itself. Only use on elements that persist after navigation.

**data-sveltekit-noscroll**: Prevent automatic scroll to top (or to `#hash` target) after navigation.
```html
<a href="path" data-sveltekit-noscroll>Path</a>
```

**Disabling options**: Use `"false"` value to disable inherited attributes:
```html
<div data-sveltekit-preload-data>
	<a href="/a">a</a>
	<div data-sveltekit-preload-data="false">
		<a href="/d">d</a>
	</div>
</div>
```

Conditional application:
```svelte
<div data-sveltekit-preload-data={condition ? 'hover' : false}>
```

### service-workers
Service workers proxy requests for offline support and precaching; auto-register from `src/service-worker.js`, access build/static paths via `$service-worker`, implement install/activate/fetch handlers for cache management with network fallback.

## Purpose
Service workers act as proxy servers handling network requests, enabling offline support and precaching for faster navigation.

## Setup
Place `src/service-worker.js` (or `src/service-worker/index.js`) in your project—it's automatically bundled and registered. Disable automatic registration via configuration if you need custom logic.

Default registration:
```js
if ('serviceWorker' in navigator) {
	addEventListener('load', function () {
		navigator.serviceWorker.register('./path/to/service-worker.js');
	});
}
```

## Inside the Service Worker
Access the `$service-worker` module for paths to static assets, build files, prerendered pages, app version string, and base path. Vite's `define` config applies here too.

Example implementation with eager caching of app/static files and network-first fallback:
```js
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />
/// <reference types="../.svelte-kit/ambient.d.ts" />

import { build, files, version } from '$service-worker';
const self = /** @type {ServiceWorkerGlobalScope} */ (globalThis.self);
const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
	event.waitUntil((async () => {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	})());
});

self.addEventListener('activate', (event) => {
	event.waitUntil((async () => {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	})());
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;
	event.respondWith((async () => {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);
		
		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);
			if (response) return response;
		}
		
		try {
			const response = await fetch(event.request);
			if (!(response instanceof Response)) throw new Error('invalid response');
			if (response.status === 200) cache.put(event.request, response.clone());
			return response;
		} catch (err) {
			const response = await cache.match(event.request);
			if (response) return response;
			throw err;
		}
	})());
});
```

## Development
Service workers aren't bundled during development. Only browsers supporting ES modules in service workers work at dev time. For manual registration, use:
```js
import { dev } from '$app/environment';
navigator.serviceWorker.register('/service-worker.js', {
	type: dev ? 'module' : 'classic'
});
```
Note: `build` and `prerendered` are empty arrays during development.

## Caching Considerations
Be careful with caching—stale data can be worse than unavailable data. Avoid caching large assets like videos since browsers clear caches when full.

## Alternatives
For PWA applications, consider Workbox library or Vite PWA plugin if you prefer those approaches.

### server-only-modules
SvelteKit prevents browser code from importing server-only modules (marked with `.server` suffix or in `$lib/server/`) to prevent leaking secrets; errors on any import chain from browser code to server code, even indirect or unused imports; disabled during tests.

## Server-only modules

SvelteKit prevents accidental exposure of sensitive data (API keys, private environment variables) to the browser by enforcing server-only module restrictions.

### Private environment variables

The `$env/static/private` and `$env/dynamic/private` modules can only be imported in server-only contexts like `hooks.server.js` or `+page.server.js`.

### Server-only utilities

The `$app/server` module (containing a `read` function for filesystem access) can only be imported by server-side code.

### Creating server-only modules

Two ways to mark modules as server-only:
1. Add `.server` to filename: `secrets.server.js`
2. Place in `$lib/server/`: `$lib/server/secrets.js`

### How it works

SvelteKit analyzes import chains and errors if public-facing code (browser code) imports server-only modules, even indirectly or if only unused exports are imported.

Example that fails:
```js
// $lib/server/secrets.js
export const atlantisCoordinates = [/* redacted */];

// src/routes/utils.js
export { atlantisCoordinates } from '$lib/server/secrets.js';
export const add = (a, b) => a + b;

// src/routes/+page.svelte
<script>
  import { add } from './utils.js';  // ERROR: utils.js imports server-only code
</script>
```

Error message: "Cannot import $lib/server/secrets.ts into code that runs in the browser, as this could leak sensitive information."

The error occurs even though only `add` is used, because the secret code could end up in browser JavaScript.

Works with dynamic imports including interpolated ones like `await import(`./${foo}.js`)`.

### Testing note

Unit testing frameworks like Vitest don't distinguish between server-only and public code, so illegal import detection is disabled when `process.env.TEST === 'true'`.

### snapshots
Snapshots preserve ephemeral DOM state across navigation via capture/restore methods, stored in sessionStorage.

Preserve ephemeral DOM state (scroll positions, form input values, etc.) across navigation using snapshots.

Export a `snapshot` object from `+page.svelte` or `+layout.svelte` with `capture` and `restore` methods:

```svelte
<script>
	let comment = $state('');

	/** @type {import('./$types').Snapshot<string>} */
	export const snapshot = {
		capture: () => comment,
		restore: (value) => comment = value
	};
</script>

<form method="POST">
	<label for="comment">Comment</label>
	<textarea id="comment" bind:value={comment} />
	<button>Post comment</button>
</form>
```

When navigating away, `capture()` is called immediately before the page updates and its return value is stored in the browser's history stack. When navigating back, `restore()` is called with the stored value as soon as the page updates.

Data must be JSON-serializable to persist to `sessionStorage`, allowing restoration on page reload or navigation back from external sites. Avoid capturing very large objects as they remain in memory for the session duration and may exceed `sessionStorage` limits.

### shallow-routing
Create history entries without navigation via pushState/replaceState; access state through page.state; use preloadData to fetch route data for modals; requires JavaScript.

## Shallow Routing

Create history entries without navigating using `pushState` and `replaceState` functions. Useful for modals and overlays that should be dismissible via back button.

### Basic Usage

```svelte
import { pushState } from '$app/navigation';
import { page } from '$app/state';

function showModal() {
  pushState('', { showModal: true });
}
```

Access state via `page.state`. First argument to `pushState` is relative URL (use `''` to stay on current URL). Second argument is the new page state object.

Use `replaceState` instead of `pushState` to set state without creating a new history entry.

Type-safe state by declaring `App.PageState` interface in `src/app.d.ts`.

### Loading Data for Routes

When rendering another `+page.svelte` inside current page (e.g., photo detail in modal), preload its data using `preloadData`:

```svelte
import { preloadData, pushState, goto } from '$app/navigation';
import { page } from '$app/state';
import PhotoPage from './[id]/+page.svelte';

let { data } = $props();
```

```svelte
{#each data.thumbnails as thumbnail}
  <a
    href="/photos/{thumbnail.id}"
    onclick={async (e) => {
      if (innerWidth < 640 || e.shiftKey || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      const result = await preloadData(e.currentTarget.href);
      if (result.type === 'loaded' && result.status === 200) {
        pushState(result.data.href, { selected: result.data });
      } else {
        goto(e.currentTarget.href);
      }
    }}
  >
    <img alt={thumbnail.alt} src={thumbnail.src} />
  </a>
{/each}

{#if page.state.selected}
  <Modal onclose={() => history.back()}>
    <PhotoPage data={page.state.selected} />
  </Modal>
{/if}
```

If element uses `data-sveltekit-preload-data`, the data will already be requested and `preloadData` reuses that request.

### Caveats

- During SSR, `page.state` is always empty
- On first page load, state is not applied until user navigates
- Requires JavaScript to work; provide fallback behavior

### observability
Emit and collect OpenTelemetry spans for server-side observability (handle, load, actions, remote functions); configure via experimental flags, set up instrumentation in src/instrumentation.server.ts, annotate spans with custom attributes via event.tracing.

## Overview
SvelteKit can emit server-side OpenTelemetry spans for observability. Available since version 2.31. Experimental feature requiring opt-in via `kit.experimental.tracing.server` and `kit.experimental.instrumentation.server` in `svelte.config.js`.

## What Gets Traced
- `handle` hook and `handle` functions in `sequence` (shown as parent-child relationships)
- Server and universal `load` functions (when run on server)
- Form actions
- Remote functions

## Setup
Create `src/instrumentation.server.ts` for tracing setup. This file runs before application code is imported.

Enable in config:
```js
const config = {
	kit: {
		experimental: {
			tracing: { server: true },
			instrumentation: { server: true }
		}
	}
};
```

## Augmenting Spans
Access `root` span and `current` span via `event.tracing`. Add custom attributes:
```js
import { getRequestEvent } from '$app/server';
const event = getRequestEvent();
event.tracing.root.setAttribute('userId', user.id);
```

## Development Quickstart with Jaeger
1. Install dependencies: `npm i @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-proto import-in-the-middle`
2. Create `src/instrumentation.server.js`:
```js
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { createAddHookMessageChannel } from 'import-in-the-middle';
import { register } from 'node:module';

const { registerOptions } = createAddHookMessageChannel();
register('import-in-the-middle/hook.mjs', import.meta.url, registerOptions);

const sdk = new NodeSDK({
	serviceName: 'test-sveltekit-tracing',
	traceExporter: new OTLPTraceExporter(),
	instrumentations: [getNodeAutoInstrumentations()]
});
sdk.start();
```
3. View traces at localhost:16686

## Dependencies
`@opentelemetry/api` is an optional peer dependency. Usually satisfied by `@opentelemetry/sdk-node` or similar. Install manually if needed.

## Performance Note
Tracing and instrumentation have non-trivial overhead. Consider enabling only in development/preview environments.

### packaging
Building Svelte component libraries: use @sveltejs/package with src/lib as public API, configure package.json exports with types/svelte conditions, auto-generate type definitions, avoid SvelteKit-specific modules, use typesVersions for non-root exports, require fully-specified imports with extensions.

## Building Component Libraries with SvelteKit

Use `@sveltejs/package` to build component libraries. Structure: `src/lib` is public-facing (unlike apps where `src/routes` is public), `src/routes` can be docs/demo, `package.json` is published.

The `svelte-package` command generates a `dist` directory containing:
- All files from `src/lib` (Svelte components preprocessed, TypeScript transpiled to JavaScript)
- Auto-generated type definitions (`d.ts` files) for Svelte/JS/TS files (requires TypeScript >= 4.0.0)
- Hand-written `d.ts` files copied as-is

### package.json Fields

**name**: Package name on npmjs.com
```json
{ "name": "your-library" }
```

**license**: Use MIT or similar
```json
{ "license": "MIT" }
```

**files**: Include output folder and use `.npmignore` to exclude tests/unused modules
```json
{ "files": ["dist"] }
```

**exports**: Define entry points with export conditions (`types` for TypeScript, `svelte` for Svelte tooling, `default` for non-Svelte projects)
```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js"
    },
    "./Foo.svelte": {
      "types": "./dist/Foo.svelte.d.ts",
      "svelte": "./dist/Foo.svelte"
    }
  }
}
```
Users import as: `import { Something } from 'your-library'` or `import Foo from 'your-library/Foo.svelte'`

**svelte**: Legacy field for backwards compatibility, point to root entry point
```json
{ "svelte": "./dist/index.js" }
```

**sideEffects**: Mark files with side effects (CSS always has side effects for webpack compatibility)
```json
{ "sideEffects": ["**/*.css", "./dist/sideEffectfulFile.js"] }
```

### TypeScript

Auto-generated type definitions by default. For non-root exports, TypeScript won't resolve `types` condition by default. Two solutions:
1. Require consumers to set `moduleResolution` to `bundler` (TS 5+), `node16`, or `nodenext` in tsconfig
2. Use `typesVersions` field to map types:
```json
{
  "exports": { "./foo": { "types": "./dist/foo.d.ts", "svelte": "./dist/foo.js" } },
  "typesVersions": { ">4.0": { "foo": ["./dist/foo.d.ts"] } }
}
```

### Best Practices

- Avoid SvelteKit-specific modules like `$app/environment`; use `esm-env` instead or pass values as props
- Add aliases via `svelte.config.js` (not vite.config.js or tsconfig.json)
- Treat removal of `exports` paths or conditions as breaking changes
- Enable declaration maps with `"declarationMap": true` in tsconfig, include `src/lib` in `files` for source maps

### svelte-package Options

```
-w/--watch              watch src/lib for changes
-i/--input              input directory (default: src/lib)
-o/--output             output directory (default: dist)
-p/--preserve-output    don't delete output before packaging
-t/--types              generate d.ts files (default: true)
--tsconfig              path to tsconfig/jsconfig
```

### Publishing

```sh
npm publish
```

### Caveats

- All relative imports must be fully specified with extensions: `import { x } from './something/index.js'`
- TypeScript imports must use `.js` extension, not `.ts`
- Non-Svelte/TypeScript files copied as-is

