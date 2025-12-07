

## Pages

### @sveltejs_kit_api_reference
Complete API reference for @sveltejs/kit exports: Server class, error/fail/redirect/json/text helpers, form actions (Action/ActionFailure/ActionResult), adapters (Adapter/Builder), navigation types (Navigation/Page/AfterNavigate/BeforeNavigate), load functions (Load/LoadEvent with fetch/setHeaders/parent/depends/untrack), request handling (RequestEvent/RequestHandler/Cookies), hooks (Handle/HandleError/HandleFetch/Reroute/Transport), remote functions (RemoteCommand/RemoteQuery/RemoteForm with field accessors), validation (Invalid), and utility types (Snapshot/ParamMatcher/HttpError/Redirect/CspDirectives).

## Core Exports

**Server class**: Constructor takes `SSRManifest`, has `init(ServerInitOptions)` and `respond(Request, RequestOptions)` methods.

**VERSION**: String constant for the kit version.

## Error Handling

**error(status, body)**: Throws HTTP error without invoking `handleError`. Prevents SvelteKit from handling it if caught.

**fail(status, data?)**: Creates `ActionFailure` for form submission failures.

**isActionFailure(e)**: Type guard for `ActionFailure`.

**isHttpError(e, status?)**: Type guard for HTTP errors thrown by `error()`.

**isRedirect(e)**: Type guard for redirects thrown by `redirect()`.

## Response Helpers

**json(data, init?)**: Creates JSON Response.

**text(body, init?)**: Creates text Response.

**redirect(status, location)**: Throws redirect (status 300-308). Common codes: 303 (GET after POST), 307/308 (keep method).

**normalizeUrl(url)**: Strips SvelteKit-internal suffixes and trailing slashes. Returns `{url, wasNormalized, denormalize}`. Example:
```js
const { url, denormalize } = normalizeUrl('/blog/post/__data.json');
console.log(url.pathname); // /blog/post
console.log(denormalize('/blog/post/a')); // /blog/post/a/__data.json
```

## Form Actions

**Action**: Type for form action methods in `+page.server.js`. Receives `RequestEvent`, returns `MaybePromise<OutputData>`.

**Actions**: Type for `export const actions = {...}` object.

**ActionFailure**: Interface with `status: number`, `data: T`, and unique symbol.

**ActionResult**: Union type for form action responses via fetch:
- `{type: 'success', status, data?}`
- `{type: 'failure', status, data?}`
- `{type: 'redirect', status, location}`
- `{type: 'error', status?, error}`

## Adapters

**Adapter**: Interface for deployment adapters. Properties:
- `name: string` - adapter name for logging
- `adapt(builder): MaybePromise<void>` - called after build
- `supports?: {read?, instrumentation?}` - feature support checks
- `emulate?(): MaybePromise<Emulator>` - environment emulation during dev/build

**Builder**: Object passed to `adapt()`. Methods:
- `log: Logger` - console output
- `rimraf(dir)`, `mkdirp(dir)` - file operations
- `config: ValidatedConfig` - resolved Svelte config
- `prerendered: Prerendered` - prerendered pages/assets info
- `routes: RouteDefinition[]` - all routes
- `createEntries(fn)` - deprecated, use `routes` instead
- `findServerAssets(routes)` - find assets imported by server files
- `generateFallback(dest)` - generate fallback for static servers
- `generateEnvModule()` - expose build-time env vars as `$env/dynamic/public`
- `generateManifest(opts)` - generate server manifest
- `getBuildDirectory(name)`, `getClientDirectory()`, `getServerDirectory()`, `getAppPath()` - path resolution
- `writeClient(dest)`, `writePrerendered(dest)`, `writeServer(dest)` - write build artifacts
- `copy(from, to, opts?)` - copy files with optional filter/replace
- `hasServerInstrumentationFile()` - check if instrumentation file exists (v2.31.0+)
- `instrument(args)` - instrument entrypoint with instrumentation (v2.31.0+)
- `compress(directory)` - gzip/brotli compression

## Navigation & Routing

**AfterNavigate**: Callback argument with `type` (enter/form/link/goto/popstate), `willUnload: false`, plus `Navigation` properties.

**BeforeNavigate**: Callback argument with `cancel()` method plus `Navigation` properties.

**Navigation**: Union of `NavigationExternal | NavigationFormSubmit | NavigationPopState | NavigationLink`.

**NavigationBase**: Base with `from/to: NavigationTarget | null`, `willUnload: boolean`, `complete: Promise<void>`.

**NavigationEnter**: `type: 'enter'`, no `delta` or `event`.

**NavigationFormSubmit**: `type: 'form'`, `event: SubmitEvent`.

**NavigationLink**: `type: 'link'`, `event: PointerEvent`.

**NavigationPopState**: `type: 'popstate'`, `delta: number`, `event: PopStateEvent`.

**NavigationTarget**: Info about navigation target with `params`, `route.id`, `url`.

**NavigationType**: Union of 'enter' | 'form' | 'leave' | 'link' | 'goto' | 'popstate'.

**OnNavigate**: Like `AfterNavigate` but excludes 'enter'/'leave', called before client-side navigation.

**Page**: Reactive page object with `url`, `params`, `route.id`, `status`, `error`, `data`, `state`, `form`.

## Load Functions

**Load**: Generic type for page/layout load functions. Receives `LoadEvent`, returns `MaybePromise<OutputData>`.

**LoadEvent**: Extends `NavigationEvent` with:
- `fetch: typeof fetch` - credentialed, relative-capable, internal-request-optimized fetch
- `data: Data` - server load data
- `setHeaders(headers)` - set response headers (no set-cookie)
- `parent(): Promise<ParentData>` - get parent layout data
- `depends(...deps)` - declare dependencies for invalidation
- `untrack(fn)` - opt out of dependency tracking
- `tracing: {enabled, root, current}` - tracing spans (v2.31.0+)

**ServerLoad**: Generic type for server-only load functions.

**ServerLoadEvent**: Extends `RequestEvent` with `parent()`, `depends()`, `untrack()`, `tracing`.

## Request Handling

**RequestEvent**: Server request context with:
- `cookies: Cookies` - get/set cookies
- `fetch` - enhanced fetch
- `getClientAddress()` - client IP
- `locals: App.Locals` - custom data from handle hook
- `params: Params` - route parameters
- `platform: App.Platform | undefined` - adapter-provided data
- `request: Request` - original request
- `route.id` - current route ID
- `setHeaders(headers)` - set response headers
- `url: URL` - requested URL
- `isDataRequest: boolean` - true if requesting +page/layout.server.js data
- `isSubRequest: boolean` - true for internal +server.js calls
- `isRemoteRequest: boolean` - true for remote function calls
- `tracing: {enabled, root, current}` - tracing spans (v2.31.0+)

**RequestHandler**: Type for HTTP verb handlers in `+server.js`. Receives `RequestEvent`, returns `MaybePromise<Response>`.

**RequestOptions**: Options for `Server.respond()` with `getClientAddress()` and `platform?`.

## Cookies

**Cookies**: Interface for cookie management:
- `get(name, opts?)` - get cookie value
- `getAll(opts?)` - get all cookies as `{name, value}[]`
- `set(name, value, opts)` - set cookie (httpOnly/secure true by default, sameSite defaults to lax, requires path)
- `delete(name, opts)` - delete cookie (requires matching path)
- `serialize(name, value, opts)` - serialize to Set-Cookie header string

## Hooks

**Handle**: Server hook `(input: {event, resolve}) => MaybePromise<Response>`. Runs on every request, can modify response or bypass SvelteKit.

**HandleClientError**: Client hook `(input: {error, event, status, message}) => MaybePromise<void | App.Error>`. Runs on unexpected errors during navigation.

**HandleServerError**: Server hook `(input: {error, event, status, message}) => MaybePromise<void | App.Error>`. Runs on unexpected errors during request handling.

**HandleFetch**: Hook `(input: {event, request, fetch}) => MaybePromise<Response>`. Modifies/replaces `event.fetch` results on server/prerender.

**HandleValidationError**: Hook `(input: {issues, event}) => MaybePromise<App.Error>`. Handles remote function validation failures.

**ClientInit**: `() => MaybePromise<void>`. Runs once when app starts in browser (v2.10.0+).

**ServerInit**: `() => MaybePromise<void>`. Runs before server responds to first request (v2.10.0+).

**Reroute**: `(event: {url, fetch}) => MaybePromise<void | string>`. Modifies URL before route matching (v2.3.0+).

**Transport**: `Record<string, Transporter>`. Transports custom types across server/client boundary. Example:
```ts
export const transport: Transport = {
  MyCustomType: {
    encode: (value) => value instanceof MyCustomType && [value.data],
    decode: ([data]) => new MyCustomType(data)
  }
};
```

**Transporter**: `{encode(value): false | U, decode(data): T}`. Encodes on server, decodes in browser.

## Remote Functions

**RemoteCommand**: `(arg: Input) => Promise<Output> & {updates(...queries): Promise<Output>}` with `pending` getter.

**RemoteQuery**: `Promise<Output> & {set(value), refresh(), withOverride(fn), error, loading, current, ready}`.

**RemoteQueryFunction**: `(arg: Input) => RemoteQuery<Output>`.

**RemoteForm**: Form submission with:
- `method: 'POST'`, `action: string`
- `enhance(callback)` - intercept submission
- `for(id)` - create instance for deduplication
- `preflight(schema)` - add preflight validation
- `validate(opts?)` - programmatic validation
- `result` getter - submission result
- `pending` getter - pending count
- `fields` - field accessors with `as(type)` for input props
- `buttonProps` - spread onto submit button

**RemoteFormField**: Field accessor with `name()`, `value()`, `issues()`, `as(type)` for input element props.

**RemoteFormFields**: Recursive type for form field structure with proxy access.

**RemoteFormIssue**: `{message, path: (string | number)[]}`.

**RemoteFormInput**: `{[key]: MaybeArray<string | number | boolean | File | RemoteFormInput>}`.

**RemotePrerenderFunction**: `(arg: Input) => RemoteResource<Output>`.

**RemoteResource**: `Promise<Output> & {error, loading, current, ready}`.

## Validation

**Invalid**: Function and proxy for imperative validation errors. Call `invalid(issue1, ...)` to throw. Access properties for field-specific issues: `invalid.fieldName('message')`.

## Misc Types

**Snapshot**: `{capture(): T, restore(snapshot): void}`. Export from page/layout for state preservation.

**SubmitFunction**: Form submission callback type.

**ParamMatcher**: `(param: string) => boolean`. Custom route parameter validation.

**Emulator**: `{platform?(details): MaybePromise<App.Platform>}`. Adapter environment emulation.

**ResolveOptions**: Options for `resolve()` in handle hook:
- `transformPageChunk?(input: {html, done})` - transform HTML chunks
- `filterSerializedResponseHeaders?(name, value)` - filter headers in serialized responses
- `preload?(input: {type, path})` - control preload hints

**Prerendered**: `{pages, assets, redirects, paths}` maps/arrays of prerendered content.

**RouteDefinition**: Route metadata with `id`, `api.methods`, `page.methods`, `pattern`, `prerender`, `segments`, `config`.

**SSRManifest**: Server manifest with `appDir`, `appPath`, `assets`, `mimeTypes`, private `_` object.

**ServerInitOptions**: `{env, read?(file): MaybePromise<ReadableStream | null>}`.

**CspDirectives**: Content Security Policy directives object.

**HttpError**: `{status: number, body: App.Error}`. Thrown by `error()`.

**Redirect**: `{status: 300-308, location: string}`. Thrown by `redirect()`.

**Logger**: `(msg) | success(msg) | error(msg) | warn(msg) | minor(msg) | info(msg)`.

**MaybePromise**: `T | Promise<T>`.

**TrailingSlash**: 'never' | 'always' | 'ignore'.

### hooks
sequence() chains handle middleware: transformPageChunk applies in reverse order, preload/filterSerializedResponseHeaders apply forward with first winning

## sequence

A helper function for sequencing multiple `handle` calls in a middleware-like manner.

**Behavior:**
- `transformPageChunk` is applied in reverse order and merged
- `preload` is applied in forward order, the first option "wins" and no `preload` options after it are called
- `filterSerializedResponseHeaders` behaves the same as `preload`

**Example:**
```js
import { sequence } from '@sveltejs/kit/hooks';

async function first({ event, resolve }) {
	console.log('first pre-processing');
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => {
			console.log('first transform');
			return html;
		},
		preload: () => {
			console.log('first preload');
			return true;
		}
	});
	console.log('first post-processing');
	return result;
}

async function second({ event, resolve }) {
	console.log('second pre-processing');
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => {
			console.log('second transform');
			return html;
		},
		preload: () => {
			console.log('second preload');
			return true;
		},
		filterSerializedResponseHeaders: () => {
			console.log('second filterSerializedResponseHeaders');
			return true;
		}
	});
	console.log('second post-processing');
	return result;
}

export const handle = sequence(first, second);
```

**Execution order:**
```
first pre-processing
first preload
second pre-processing
second filterSerializedResponseHeaders
second transform
first transform
second post-processing
first post-processing
```

**Type signature:**
```dts
function sequence(...handlers: Handle[]): Handle;
```

### node-polyfills
installPolyfills() function that adds crypto and File web APIs as globals in Node.js

## installPolyfills

Installs polyfills for web APIs that are not available in Node.js environments, making them available as globals.

**Polyfilled APIs:**
- `crypto` - cryptographic functions
- `File` - File API for handling file objects

**Usage:**
```js
import { installPolyfills } from '@sveltejs/kit/node/polyfills';
installPolyfills();
```

Call `installPolyfills()` once to enable these web APIs in Node.js contexts, such as server-side code or build scripts.

### node
Node.js HTTP adapter: createReadableStream, getRequest (IncomingMessage→Request), setResponse (Response→ServerResponse)

Node.js adapter utilities for converting between Node.js HTTP objects and standard Web APIs.

**createReadableStream** (since 2.4.0)
Converts a file on disk to a readable stream.
```js
import { createReadableStream } from '@sveltejs/kit/node';
const stream = createReadableStream(file);
```

**getRequest**
Converts a Node.js IncomingMessage to a standard Request object.
```js
import { getRequest } from '@sveltejs/kit/node';
const request = await getRequest({
  request: incomingMessage,
  base: '/app',
  bodySizeLimit: 1024 * 1024
});
```

**setResponse**
Writes a standard Response object to a Node.js ServerResponse.
```js
import { setResponse } from '@sveltejs/kit/node';
await setResponse(res, response);
```

### vite-plugin
sveltekit() async function exports Vite plugins array for SvelteKit integration

The `sveltekit()` function from `@sveltejs/kit/vite` returns an array of Vite plugins required for SvelteKit projects.

**Usage:**
```js
import { sveltekit } from '@sveltejs/kit/vite';
const plugins = await sveltekit();
```

**Function signature:**
- `sveltekit()`: Returns `Promise<import('vite').Plugin[]>` - an async function that resolves to an array of Vite plugin objects.

### $app_environment
$app/environment exports boolean flags (browser, building, dev) and version string to detect runtime context.

Module that exports environment-related constants for SvelteKit applications.

**Exports:**

- `browser: boolean` — True if the app is running in the browser (false during server-side rendering or build)
- `building: boolean` — True during the build step and prerendering when SvelteKit analyzes the app
- `dev: boolean` — True when the dev server is running (not guaranteed to match NODE_ENV or MODE)
- `version: string` — The value of `config.kit.version.name`

**Usage:**
```js
import { browser, building, dev, version } from '$app/environment';
```

Use these to conditionally execute code based on the runtime environment.

### forms
Form utilities: applyAction (update form/status), deserialize (parse response), enhance (intercept submission with custom/default handling)

## applyAction

Updates the `form` property of the current page with given data and updates `page.status`. Redirects to the nearest error page on error.

```js
import { applyAction } from '$app/forms';
await applyAction(result);
```

## deserialize

Deserializes the response text from a form submission into an ActionResult object.

```js
import { deserialize } from '$app/forms';

const response = await fetch('/form?/action', {
	method: 'POST',
	body: new FormData(event.target)
});
const result = deserialize(await response.text());
```

## enhance

Enhances a `<form>` element to work without JavaScript by intercepting submission.

The `submit` callback receives FormData and the action to trigger. Call `cancel()` to prevent submission. Use the `controller` to abort if another submission starts. If a function is returned, it's called with the server response.

Default behavior (if no callback or callback returns nothing):
- Updates `form` prop with returned data if action is on same page
- Updates `page.status`
- Resets form and invalidates all data on successful submission without redirect
- Redirects on redirect response
- Redirects to error page on unexpected error

Custom callback can invoke `update(options)` to use default behavior with options:
- `reset: false` - don't reset form values after successful submission
- `invalidateAll: false` - don't call invalidateAll after submission

```js
import { enhance } from '$app/forms';

<form use:enhance={(submit) => {
	return async (result) => {
		// custom handling
		await update({ reset: false });
	};
}}>
```

### $app_navigation
$app/navigation exports 12 functions: lifecycle hooks (afterNavigate, beforeNavigate, onNavigate), navigation (goto), preloading (preloadCode, preloadData), invalidation (invalidate, invalidateAll, refreshAll), scroll (disableScrollHandling), and shallow routing (pushState, replaceState).

## Navigation Functions

**afterNavigate(callback)** - Lifecycle function that runs when component mounts and on every navigation. Must be called during component initialization, remains active while mounted.

**beforeNavigate(callback)** - Navigation interceptor that triggers before navigation (link clicks, `goto()`, browser back/forward). Call `cancel()` to prevent navigation. For 'leave' type navigations (user leaving app), `cancel()` triggers browser unload dialog. `navigation.to.route.id` is `null` for non-SvelteKit routes. `navigation.willUnload` is `true` if navigation will unload document. Must be called during component initialization.

**disableScrollHandling()** - Disables SvelteKit's built-in scroll handling when called during page update (in `onMount`, `afterNavigate`, or actions). Generally discouraged as it breaks user expectations.

**goto(url, opts?)** - Programmatic navigation to given route. Returns Promise that resolves when navigation completes or rejects on failure. For external URLs use `window.location = url` instead. Options: `replaceState` (boolean), `noScroll` (boolean), `keepFocus` (boolean), `invalidateAll` (boolean), `invalidate` (array of strings/URLs/predicates), `state` (App.PageState).

**invalidate(resource)** - Re-runs `load` functions for currently active page if they depend on the given resource via `fetch` or `depends`. Argument can be string/URL (must match exactly) or function predicate. Returns Promise resolving when page updates.
```ts
invalidate((url) => url.pathname === '/path'); // Match '/path' regardless of query params
```

**invalidateAll()** - Re-runs all `load` functions for currently active page. Returns Promise resolving when page updates.

**onNavigate(callback)** - Lifecycle function running immediately before navigation to new URL (except full-page navigations). If callback returns Promise, SvelteKit waits before completing navigation (useful for `document.startViewTransition`). If callback returns function, it's called after DOM updates. Must be called during component initialization.

**preloadCode(pathname)** - Programmatically imports code for routes not yet fetched. Specify routes by pathname like `/about` or `/blog/*`. Doesn't call `load` functions. Returns Promise resolving when modules imported.

**preloadData(href)** - Preloads given page: ensures code is loaded and calls page's `load` function. Same behavior as SvelteKit triggers on `<a data-sveltekit-preload-data>`. If next navigation is to `href`, returned values are used making navigation instantaneous. Returns Promise resolving with `{type: 'loaded', status, data}` or `{type: 'redirect', location}`.

**pushState(url, state)** - Programmatically create new history entry with given `page.state`. Pass `''` as url to use current URL. Used for shallow routing.

**refreshAll(opts?)** - Re-runs all currently active remote functions and all `load` functions for currently active page (unless disabled via `includeLoadFunctions` option). Returns Promise resolving when page updates.

**replaceState(url, state)** - Programmatically replace current history entry with given `page.state`. Pass `''` as url to use current URL. Used for shallow routing.

### $app_paths
$app/paths exports asset(), resolve(), and deprecated assets/base/resolveRoute for URL/path resolution with base path and assets prefix handling.

## $app/paths

Module for resolving URLs and paths in SvelteKit applications.

### asset(file)
Resolves the URL of a static asset by prefixing with `config.kit.paths.assets` or the base path. During SSR, the base path is relative to the current page.

```js
import { asset } from '$app/paths';
<img src={asset('/potato.jpg')} />
```

### assets (deprecated)
Absolute path matching `config.kit.paths.assets`. During `vite dev` or `vite preview`, replaced with `'/_svelte_kit_assets'`. Type: `'' | 'https://...' | 'http://...' | '/_svelte_kit_assets'`. Use `asset()` instead.

### base (deprecated)
String matching `config.kit.paths.base`. Example: `<a href="{base}/your-page">Link</a>`. Type: `'' | '/${string}'`. Use `resolve()` instead.

### resolve(pathname | routeId, params?)
Resolves a pathname by prefixing with base path, or resolves a route ID by populating dynamic segments with parameters. During SSR, base path is relative to current page.

```js
import { resolve } from '$app/paths';
const resolved = resolve(`/blog/hello-world`);
const resolved = resolve('/blog/[slug]', { slug: 'hello-world' });
```

### resolveRoute (deprecated)
Alias for `resolve()`. Use `resolve()` instead.

### $app_server
$app/server exports remote function creators (command, form, query, prerender, query.batch) for server execution from browser, getRequestEvent for request context access, and read for asset loading; all support optional schema validation.

## Overview
The `$app/server` module provides utilities for server-side operations in SvelteKit, including remote function creation and asset reading.

## command (since 2.27)
Creates a remote command that executes on the server when called from the browser via fetch.

```js
import { command } from '$app/server';

// No input
const cmd1 = command(() => 'result');

// Unchecked input
const cmd2 = command('unchecked', (arg) => arg.toUpperCase());

// Schema-validated input
const cmd3 = command(mySchema, (arg) => processData(arg));
```

## form (since 2.27)
Creates a form object spreadable onto `<form>` elements for server-side form handling.

```js
import { form } from '$app/server';

// No input
const f1 = form((invalid) => ({ success: true }));

// Unchecked input
const f2 = form('unchecked', (data, invalid) => handleForm(data));

// Schema-validated input
const f3 = form(mySchema, (data, invalid) => processForm(data));
```

## getRequestEvent (since 2.20.0)
Returns the current `RequestEvent`. Usable in server hooks, server `load` functions, actions, and endpoints. Must be called synchronously in environments without `AsyncLocalStorage` (before any `await`).

```js
import { getRequestEvent } from '$app/server';
const event = getRequestEvent();
```

## prerender (since 2.27)
Creates a remote prerender function for server-side execution during build time.

```js
import { prerender } from '$app/server';

// No input
const p1 = prerender(() => generatePage());

// Unchecked input with options
const p2 = prerender('unchecked', (arg) => renderPage(arg), {
  inputs: function* () { yield 'page1'; yield 'page2'; },
  dynamic: true
});

// Schema-validated
const p3 = prerender(mySchema, (arg) => renderPage(arg), { dynamic: false });
```

## query (since 2.27)
Creates a remote query that executes on the server when called from the browser.

```js
import { query } from '$app/server';

// No input
const q1 = query(() => fetchData());

// Unchecked input
const q2 = query('unchecked', (arg) => searchData(arg));

// Schema-validated
const q3 = query(mySchema, (arg) => queryData(arg));
```

### query.batch (since 2.35)
Batches multiple query calls into a single request.

```js
// Unchecked
const bq1 = query.batch('unchecked', (args) => (arg, idx) => processItem(arg));

// Schema-validated
const bq2 = query.batch(mySchema, (args) => (arg, idx) => processItem(arg));
```

## read (since 2.4.0)
Reads the contents of an imported asset from the filesystem, returning a Response object.

```js
import { read } from '$app/server';
import somefile from './somefile.txt';

const asset = read(somefile);
const text = await asset.text();
```

### $app_state
Three read-only state objects: navigating (navigation state), page (current page data/form/state/metadata, rune-reactive only), updated (version polling with current flag and check method).

## Overview
SvelteKit provides three read-only state objects via the `$app/state` module (added in v2.12): `page`, `navigating`, and `updated`. These replace the older `$app/stores` module.

## navigating
A read-only object representing an in-progress navigation with properties: `from`, `to`, `type`, and optionally `delta` (when `type === 'popstate'`). All values are `null` when no navigation is occurring or during server rendering.

```js
import { navigating } from '$app/state';
// navigating.from, navigating.to, navigating.type, navigating.delta
```

## page
A read-only reactive object containing current page information:
- Combined `data` from all pages/layouts
- Current `form` prop value
- Page state set via `goto`, `pushState`, or `replaceState`
- Metadata: URL, route, parameters, error status

```svelte
<script>
	import { page } from '$app/state';
</script>

<p>Currently at {page.url.pathname}</p>

{#if page.error}
	<span class="red">Problem detected</span>
{:else}
	<span class="small">All systems operational</span>
{/if}
```

**Important:** Changes to `page` are only reactive with runes (`$derived`), not with legacy reactivity syntax (`$:`). Use `const id = $derived(page.params.id)` instead of `$: badId = page.params.id`.

On the server, values can only be read during rendering (not in `load` functions). In the browser, values can be read anytime.

## updated
A read-only reactive value initially `false`. When `version.pollInterval` is non-zero, SvelteKit polls for new app versions and sets `updated.current` to `true` when detected. Call `updated.check()` to force an immediate check.

```js
import { updated } from '$app/state';
// updated.current (boolean)
// updated.check() (Promise<boolean>)
```

### $app_stores
Deprecated store-based API for page, navigating, and updated; replaced by $app/state in SvelteKit 2.12+

Deprecated store-based API for accessing SvelteKit runtime data. Use `$app/state` instead for SvelteKit 2.12+.

**getStores()** - Function that returns an object containing `page`, `navigating`, and `updated` stores.

**navigating** - Readable store containing a `Navigation` object (with `from`, `to`, `type`, and optional `delta` properties) while navigation is in progress, otherwise `null`. Server-side subscription only during component initialization; browser-side subscription anytime.

**page** - Readable store containing page data. Server-side subscription only during component initialization; browser-side subscription anytime.

**updated** - Readable store with initial value `false`. When `version.pollInterval` is non-zero, SvelteKit polls for new app versions and updates the store to `true` when detected. Includes `check()` method to force immediate version check. Server-side subscription only during component initialization; browser-side subscription anytime.

```js
import { getStores, navigating, page, updated } from '$app/stores';
```

### $app_types
Auto-generated TypeScript types for routes, pathnames, and parameters with utilities like RouteParams and LayoutParams for type-safe route handling.

## Generated Type Utilities for Routes

The `$app/types` module provides auto-generated TypeScript types for your app's routes and assets (available since v2.26).

### Asset
Union of all static directory filenames plus a string wildcard for dynamically imported assets:
```ts
type Asset = '/favicon.png' | '/robots.txt' | (string & {});
```

### RouteId
Union of all route IDs in your app, used with `page.route.id` and `event.route.id`:
```ts
type RouteId = '/' | '/my-route' | '/my-other-route/[param]';
```

### Pathname
Union of all valid pathnames in your app:
```ts
type Pathname = '/' | '/my-route' | `/my-other-route/${string}` & {};
```

### ResolvedPathname
Like `Pathname` but includes optional base path prefix, used with `page.url.pathname`:
```ts
type ResolvedPathname = `${'' | `/${string}`}/` | `${'' | `/${string}`}/my-route` | `${'' | `/${string}`}/my-other-route/${string}` | {};
```

### RouteParams
Utility to extract parameters from a route ID:
```ts
type RouteParams<T extends RouteId> = { /* generated */ } | Record<string, never>;
type BlogParams = RouteParams<'/blog/[slug]'>; // { slug: string }
```

### LayoutParams
Like `RouteParams` but for layouts, includes optional parameters from child routes:
```ts
type RouteParams<T extends RouteId> = { /* generated */ } | Record<string, never>;
```

### $env_dynamic_private
Server-side runtime environment variable access module; filters by publicPrefix/privatePrefix config; dev includes .env automatically.

Module for accessing runtime environment variables that are private (server-side only).

**Purpose**: Provides access to environment variables defined by your platform at runtime. Only includes variables that don't start with `config.kit.env.publicPrefix` and do start with `config.kit.env.privatePrefix` (if configured).

**Key characteristics**:
- Server-side only - cannot be imported into client-side code
- Equivalent to `process.env` when using adapter-node or vite preview
- In dev mode, automatically includes variables from `.env`
- In prod mode, behavior depends on your adapter

**Usage**:
```ts
import { env } from '$env/dynamic/private';
console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
```

### $env_dynamic_public
Dynamic public environment variables (prefixed with PUBLIC_ by default) sent to client; prefer static variant for smaller payloads.

Dynamic environment variables that are safe to expose to client-side code. Only includes variables beginning with the configured public prefix (defaults to `PUBLIC_`).

Unlike static public environment variables, dynamic ones are sent from server to client on each request, resulting in larger network payloads. Prefer `$env/static/public` when possible.

**Usage:**
```ts
import { env } from '$env/dynamic/public';
console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
```

The public prefix is configurable via `config.kit.env.publicPrefix`.

### $env_static_private
Static private environment variables injected at build time; import from `$env/static/private`, declare in `.env`, override via CLI.

Module for accessing private environment variables that are statically injected at build time. Variables are loaded from `.env` files and `process.env` by Vite.

**Key differences from `$env/dynamic/private`:**
- Values are statically injected into the bundle at build time (enables dead code elimination)
- Cannot be imported into client-side code
- Only includes variables that don't begin with `config.kit.env.publicPrefix` and do start with `config.kit.env.privatePrefix` (if configured)

**Usage:**
```ts
import { API_KEY } from '$env/static/private';
```

**Environment variable declaration:**
All referenced variables should be declared in `.env` files, even without values:
```
MY_FEATURE_FLAG=""
```

**Override from command line:**
```sh
MY_FEATURE_FLAG="enabled" npm run dev
```

### $env_static_public
Static public environment variables (PUBLIC_* prefix) replaced at build time, safe for client-side exposure.

Public environment variables that are safely exposed to client-side code.

Only includes variables beginning with the configured public prefix (defaults to `PUBLIC_`). Values are replaced statically at build time, not at runtime.

```ts
import { PUBLIC_BASE_URL } from '$env/static/public';
```

Unlike `$env/static/private`, these variables can be safely used in browser code since they're intended to be public.

### $lib_alias
$lib alias automatically resolves to src/lib directory; customizable via config files option; enables clean imports without relative paths.

The `$lib` import alias automatically points to the `src/lib` directory, allowing you to import reusable components and utilities from anywhere in your project without relative paths.

The alias can be customized via the config file's `files` option.

Example:
```svelte
// src/lib/Component.svelte
A reusable component

// src/routes/+page.svelte
<script>
    import Component from '$lib/Component.svelte';
</script>

<Component />
```

### $service-worker
$service-worker module exports base, build, files, prerendered, version for service worker caching and deployment metadata.

Module available only to service workers that provides build and deployment metadata.

**Imports:**
```js
import { base, build, files, prerendered, version } from '$service-worker';
```

**base** (string): The base path of the deployment, calculated from `location.pathname`. Equivalent to `config.kit.paths.base` but works correctly when deployed to subdirectories. Note: `assets` is not available since service workers cannot be used with `config.kit.paths.assets`.

**build** (string[]): Array of URL strings for files generated by Vite, suitable for caching with `cache.addAll(build)`. Empty during development.

**files** (string[]): Array of URL strings for files in the static directory (or `config.kit.files.assets`). Customizable via `config.kit.serviceWorker.files`.

**prerendered** (string[]): Array of pathnames for prerendered pages and endpoints. Empty during development.

**version** (string): From `config.kit.version`. Useful for generating unique cache names so later deployments can invalidate old caches.

### configuration
SvelteKit configuration options in svelte.config.js: adapter, alias, appDir, csp, csrf, embedded, env, experimental features, file locations, inlineStyleThreshold, moduleExtensions, outDir, output bundling/preloading, paths, prerender, router type/resolution, typescript, version management.

## svelte.config.js Structure

The main configuration file at the project root. Extends `vite-plugin-svelte` options with a `kit` property for SvelteKit-specific settings.

```js
import adapter from '@sveltejs/adapter-auto';
const config = {
	kit: {
		adapter: adapter()
	}
};
export default config;
```

## Key Configuration Options

**adapter** - Runs during `vite build`, converts output for different platforms.

**alias** - Object mapping import paths to file/directory locations. Built-in `$lib` alias controlled by `config.kit.files.lib`.
```js
alias: {
	'my-file': 'path/to/my-file.js',
	'my-directory': 'path/to/my-directory',
	'my-directory/*': 'path/to/my-directory/*'
}
```

**appDir** (default: `"_app"`) - Directory for SvelteKit's static assets and internal routes. If `paths.assets` specified, creates two directories: `${paths.assets}/${appDir}` and `${paths.base}/${appDir}`.

**csp** - Content Security Policy configuration. Prevents XSS attacks by restricting resource loading sources.
```js
csp: {
	directives: { 'script-src': ['self'] },
	reportOnly: { 'script-src': ['self'], 'report-uri': ['/'] }
}
```
- `mode`: `'hash'` | `'nonce'` | `'auto'` - How to restrict inline scripts/styles. Auto uses hashes for prerendered, nonces for dynamic pages.
- Use `%sveltekit.nonce%` placeholder in `src/app.html` for manual script/link nonces.
- Prerendered pages use `<meta http-equiv>` tag (ignores `frame-ancestors`, `report-uri`, `sandbox`).
- Svelte transitions create inline `<style>` elements; must leave `style-src` unspecified or add `unsafe-inline`.

**csrf** - Cross-site request forgery protection.
- `checkOrigin` (default: `true`, deprecated) - Verify incoming origin header matches server origin for form submissions. Disable to allow cross-origin form submissions.
- `trustedOrigins` (default: `[]`) - Array of allowed origins for cross-origin form submissions (e.g., `https://payment-gateway.com`). Use `'*'` to trust all origins. Only applies in production.

**embedded** (default: `false`) - If `true`, app is embedded in larger app. Adds event listeners to parent of `%sveltekit.body%` instead of `window`, receives params from server instead of inferring from `location.pathname`. Multiple SvelteKit apps on same page not fully supported.

**env** - Environment variable configuration.
- `dir` (default: `"."`) - Directory to search for `.env` files.
- `publicPrefix` (default: `"PUBLIC_"`) - Prefix for client-safe environment variables (accessible via `$env/static/public` and `$env/dynamic/public`).
- `privatePrefix` (default: `""`, v1.21.0+) - Prefix for server-only variables (accessible via `$env/static/private` and `$env/dynamic/private`). Variables matching neither prefix are discarded.

**experimental** - Unstable features, not subject to semantic versioning.
- `tracing` (v2.31.0+, default: `{ server: false, serverFile: false }`) - OpenTelemetry tracing for `handle` hook, `load` functions, form actions, remote functions.
  - `server` (default: `false`) - Enable server-side span emission.
- `instrumentation` (v2.31.0+) - `server` (default: `false`) - Enable `instrumentation.server.js` for tracing/observability.
- `remoteFunctions` (default: `false`) - Enable experimental remote functions feature.

**files** (deprecated) - File locations within project.
- `src` (default: `"src"`, v2.28+) - Source code location.
- `assets` (default: `"static"`) - Static files with stable URLs (favicon, manifest).
- `hooks.client` (default: `"src/hooks.client"`) - Client hooks location.
- `hooks.server` (default: `"src/hooks.server"`) - Server hooks location.
- `hooks.universal` (default: `"src/hooks"`, v2.3.0+) - Universal hooks location.
- `lib` (default: `"src/lib"`) - Internal library, accessible as `$lib`.
- `params` (default: `"src/params"`) - Parameter matchers directory.
- `routes` (default: `"src/routes"`) - Route structure files.
- `serviceWorker` (default: `"src/service-worker"`) - Service worker entry point.
- `appTemplate` (default: `"src/app.html"`) - HTML response template.
- `errorTemplate` (default: `"src/error.html"`) - Fallback error response template.

**inlineStyleThreshold** (default: `0`) - Maximum CSS file size (UTF-16 code units) to inline in `<style>` block at HTML head. Reduces initial requests and improves First Contentful Paint but increases HTML size and reduces browser cache effectiveness.

**moduleExtensions** (default: `[".js", ".ts"]`) - File extensions SvelteKit treats as modules. Files not matching `config.extensions` or `config.kit.moduleExtensions` ignored by router.

**outDir** (default: `".svelte-kit"`) - Directory where SvelteKit writes files during `dev` and `build`. Exclude from version control.

**output** - Build output format options.
- `preloadStrategy` (default: `"modulepreload"`, v1.8.4+) - How to preload JavaScript modules for initial page:
  - `modulepreload` - Uses `<link rel="modulepreload">`. Best in Chromium, Firefox 115+, Safari 17+.
  - `preload-js` - Uses `<link rel="preload">`. Prevents waterfalls in Chromium/Safari but double-parses in Chromium, double-requests in Firefox. Good for iOS.
  - `preload-mjs` - Uses `<link rel="preload">` with `.mjs` extension. Prevents double-parsing in Chromium. Best overall performance if server serves `.mjs` with correct `Content-Type`.
- `bundleStrategy` (default: `'split'`, v2.13.0+) - How JavaScript/CSS files are loaded:
  - `'split'` - Multiple files loaded lazily as user navigates (recommended).
  - `'single'` - One `.js` bundle and one `.css` file for entire app.
  - `'inline'` - Inlines all JavaScript/CSS into HTML, usable without server.
  
  For `'split'`, adjust bundling with Vite's `build.rollupOptions.output.experimentalMinChunkSize` and `output.manualChunks`. For inlining assets, set Vite's `build.assetsInlineLimit` and import assets through Vite:
  ```js
  // vite.config.js
  export default defineConfig({
  	plugins: [sveltekit()],
  	build: { assetsInlineLimit: Infinity }
  });
  ```
  ```svelte
  // src/routes/+layout.svelte
  <script>
  	import favicon from './favicon.png';
  </script>
  <svelte:head>
  	<link rel="icon" href={favicon} />
  </svelte:head>
  ```

**paths** - URL path configuration.
- `assets` (default: `""`) - Absolute path where app files served from. Useful for storage buckets.
- `base` (default: `""`) - Root-relative path where app served from (e.g., `/base-path`). Must start but not end with `/` unless empty. Prepend to root-relative links using `base` from `$app/paths`: `<a href="{base}/your-page">Link</a>`.
- `relative` (default: `true`, v1.9.0+) - Use relative asset paths. If `true`, `base` and `assets` from `$app/paths` replaced with relative paths during SSR for portable HTML. If `false`, always root-relative unless `paths.assets` is external URL. Single-page app fallback pages always use absolute paths. Set to `false` if using `<base>` element.

**prerender** - Prerendering configuration (see page-options#prerender).
- `concurrency` (default: `1`) - Simultaneous pages to prerender. JS is single-threaded but useful when network-bound.
- `crawl` (default: `true`) - Follow links from `entries` to find pages to prerender.
- `entries` (default: `["*"]`) - Pages to prerender or start crawling from. `'*'` includes all routes with no required parameters, optional parameters as empty.
- `handleHttpError` (default: `"fail"`, v1.15.7+) - Handle HTTP errors during prerendering:
  - `'fail'` - Fail build.
  - `'ignore'` - Silently continue.
  - `'warn'` - Continue with warning.
  - `(details) => void` - Custom handler with `status`, `path`, `referrer`, `referenceType`, `message`. Throw to fail build.
  ```js
  handleHttpError: ({ path, referrer, message }) => {
  	if (path === '/not-found' && referrer === '/blog/how-we-built-our-404-page') return;
  	throw new Error(message);
  }
  ```
- `handleMissingId` (default: `"fail"`, v1.15.7+) - Handle hash links to missing `id` on destination page. Same options as `handleHttpError`.
- `handleEntryGeneratorMismatch` (default: `"fail"`, v1.16.0+) - Handle entry not matching generated route. Same options as `handleHttpError`.
- `handleUnseenRoutes` (default: `"fail"`, v2.16.0+) - Handle prerenderable routes not prerendered. Same options as `handleHttpError` but handler receives `routes` property with unprerendered routes.
- `origin` (default: `"http://sveltekit-prerender"`) - `url.origin` value during prerendering.

**router** - Client-side routing configuration.
- `type` (default: `"pathname"`, v2.14.0+) - Router type:
  - `'pathname'` - URL pathname determines route (default).
  - `'hash'` - `location.hash` determines route. Disables SSR/prerendering. Links must start with `#/`. Only recommended if pathname unavailable.
- `resolution` (default: `"client"`, v2.17.0+) - Route determination method:
  - `'client'` - Browser uses route manifest to determine route immediately. Manifest must load/parse before first navigation.
  - `'server'` - Server determines route for unvisited paths. Hides route list, enables middleware interception (A/B testing). Slightly slower for unvisited paths but mitigated by preloading. Prerendered routes have resolution prerendered.

**serviceWorker** - Service worker configuration (details not provided in excerpt).

**typescript** - TypeScript configuration.
- `config` (default: `(config) => config`, v1.3.0+) - Function to edit generated `tsconfig.json`. Mutate or return new config. Useful for extending shared `tsconfig.json` in monorepo. Paths should be relative to `.svelte-kit/tsconfig.json`.

**version** - Version management for client-side navigation. Detects new deployments and falls back to full-page navigation on errors.
- `name` - Current app version string. Must be deterministic (e.g., commit ref, not `Math.random()`). Defaults to build timestamp. Example using git commit hash:
  ```js
  import * as child_process from 'node:child_process';
  export default {
  	kit: {
  		version: {
  			name: child_process.execSync('git rev-parse HEAD').toString().trim()
  		}
  	}
  };
  ```
- `pollInterval` (default: `0`) - Milliseconds between version polls. If `0`, no polling. When polling detects new version, sets `updated.current` to `true`. Use with `beforeNavigate` to force full-page navigation:
  ```svelte
  <script>
  	import { beforeNavigate } from '$app/navigation';
  	import { updated } from '$app/state';
  	beforeNavigate(({ willUnload, to }) => {
  		if (updated.current && !willUnload && to?.url) {
  			location.href = to.url.href;
  		}
  	});
  </script>
  ```

### cli
SvelteKit delegates to Vite CLI (dev/build/preview); svelte-kit sync generates tsconfig.json and ./$types, runs automatically as prepare script

SvelteKit projects use Vite for most CLI operations, accessed via npm scripts:
- `vite dev` — start development server
- `vite build` — build production version
- `vite preview` — run production build locally

SvelteKit provides its own CLI command for project initialization:

**svelte-kit sync** — generates `tsconfig.json` and all type definitions (importable as `./$types` in routing files). Automatically runs as the `prepare` npm lifecycle script when creating new projects, so manual invocation is rarely needed.

### types
Auto-generated route type definitions ($types module), app.d.ts ambient types (Error, Locals, PageData, PageState, Platform), $lib aliases, tsconfig configuration.

## Generated types

SvelteKit automatically generates `.d.ts` files for each endpoint and page, providing typed `RequestHandler` and `Load` functions with route parameters.

Instead of manually typing params:
```js
/** @type {import('@sveltejs/kit').RequestHandler<{
    foo: string;
    bar: string;
    baz: string
  }>} */
export async function GET({ params }) {}
```

SvelteKit generates `.svelte-kit/types/src/routes/[foo]/[bar]/[baz]/$types.d.ts`:
```ts
import type * as Kit from '@sveltejs/kit';
type RouteParams = { foo: string; bar: string; baz: string; };
export type RequestHandler = Kit.RequestHandler<RouteParams>;
export type PageLoad = Kit.Load<RouteParams>;
```

Import via `$types` module (enabled by `rootDirs` in tsconfig):
```js
// +server.js
/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {}

// +page.js
/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {}
```

Return types available as `PageData` and `LayoutData` from `$types`. Union of all `Actions` available as `ActionData`.

Since v2.16.0, helper types `PageProps` (includes `data: PageData` and `form: ActionData`) and `LayoutProps` (includes `data: LayoutData` and `children: Snippet`):
```svelte
<script>
	/** @type {import('./$types').PageProps} */
	let { data, form } = $props();
</script>
```

Legacy (pre-2.16.0 or Svelte 4):
```svelte
<script>
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();
	// or with Svelte 4:
	export let data; // @type {import('./$types').PageData}
	export let form; // @type {import('./$types').ActionData}
</script>
```

Requires `tsconfig.json` to extend `.svelte-kit/tsconfig.json`: `{ "extends": "./.svelte-kit/tsconfig.json" }`

## Default tsconfig.json

Generated `.svelte-kit/tsconfig.json` contains programmatically-generated options (paths, rootDirs) and required options for SvelteKit:
- `verbatimModuleSyntax: true` - ensures types imported with `import type`
- `isolatedModules: true` - Vite compiles one module at a time
- `noEmit: true` - type-checking only
- `lib: ["esnext", "DOM", "DOM.Iterable"]`
- `moduleResolution: "bundler"`
- `module: "esnext"`
- `target: "esnext"`

Extend or modify via `typescript.config` in `svelte.config.js`.

## $lib

Alias to `src/lib` (or configured `config.kit.files.lib`). Avoids relative path imports.

### $lib/server

Subdirectory of `$lib`. SvelteKit prevents importing `$lib/server` modules into client-side code (server-only modules).

## app.d.ts

Contains ambient types available without explicit imports. Includes `App` namespace with types influencing SvelteKit features.

### App.Error

Shape of expected/unexpected errors. Expected errors thrown via `error()` function. Unexpected errors handled by `handleError` hooks.
```ts
interface Error {
  message: string;
}
```

### App.Locals

Interface defining `event.locals`, accessible in server hooks (`handle`, `handleError`), server-only `load` functions, and `+server.js` files.
```ts
interface Locals {}
```

### App.PageData

Shape of `page.data` state and `$page.data` store (data shared between all pages). `Load` and `ServerLoad` functions narrowed accordingly. Use optional properties for page-specific data; avoid index signatures.
```ts
interface PageData {}
```

### App.PageState

Shape of `page.state` object, manipulated via `pushState()` and `replaceState()` from `$app/navigation`.
```ts
interface PageState {}
```

### App.Platform

Platform-specific context from adapter via `event.platform`.
```ts
interface Platform {}
```

