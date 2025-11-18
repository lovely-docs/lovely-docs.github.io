

## Pages

### @sveltejs_kit_api_reference
Complete TypeScript API reference for @sveltejs/kit exports including Server class, response helpers, hooks, form actions, navigation types, remote functions, adapter builder, and utility types.

## Core Exports
- **Response helpers**: `json()`, `text()`, `error()`, `redirect()`, `fail()`
- **Type guards**: `isHttpError()`, `isRedirect()`, `isActionFailure()`
- **Utilities**: `normalizeUrl()`, `VERSION`
- **Server class**: Initialize with manifest, handle requests via `init()` and `respond()`

## Key Types
- **RequestEvent**: cookies, fetch, params, url, locals, platform, setHeaders()
- **LoadEvent**: Extends RequestEvent, adds parent(), depends(), untrack()
- **Page**: url, params, route.id, status, error, data, state, form
- **ActionResult**: {type: 'success'|'failure'|'redirect'|'error', ...}

## Hooks
- **Handle**: `(input: {event, resolve}) => Response`
- **HandleError**: `(input: {error, event, status, message}) => App.Error`
- **HandleFetch**: Modify fetch results
- **Reroute**: Modify URL before routing
- **Transport**: Custom type serialization

## Forms & Navigation
- **Action**: `(event: RequestEvent) => OutputData`
- **Navigation types**: Link, FormSubmit, PopState, External, Enter
- **AfterNavigate/BeforeNavigate**: Navigation callbacks with type and cancel()

## Remote Functions
- **RemoteCommand**: `(arg) => Promise<Output>` with pending, updates()
- **RemoteForm**: Form with enhance(), validate(), fields, result
- **RemoteQuery**: Promise-like with error, loading, current, ready, set(), refresh()

## Adapter API
- **Builder**: log, rimraf, mkdirp, config, routes, write methods, generateManifest(), instrument()
- **Cookies**: get(), set(), delete(), serialize() with httpOnly/secure defaults

### hooks
The sequence helper chains multiple handle middleware functions with different execution orders for different options.

## sequence

Chains multiple `handle` middleware with specific ordering:
- `transformPageChunk`: reverse order, merged
- `preload`: forward order, first wins
- `filterSerializedResponseHeaders`: forward order, first wins

```js
import { sequence } from '@sveltejs/kit/hooks';
export const handle = sequence(first, second);
```

### node_polyfills
Function to install Node.js polyfills for web APIs like crypto and File.

The `installPolyfills()` function makes web APIs (`crypto`, `File`) available as globals in Node.js:

```js
import { installPolyfills } from '@sveltejs/kit/node/polyfills';
installPolyfills();
```

### node_adapter_api_reference
API reference for @sveltejs/kit/node module providing Node.js HTTP server integration utilities.

Three utilities for Node.js integration: `createReadableStream()` converts files to streams, `getRequest()` converts Node's `IncomingMessage` to Web `Request`, and `setResponse()` writes Web `Response` to Node's `ServerResponse`.

### @sveltejs_kit_vite
The sveltekit() function exports Vite plugins needed to integrate SvelteKit with Vite.

Import `sveltekit` from `@sveltejs/kit/vite` and call it to get an array of Vite plugins for SvelteKit integration.

```js
import { sveltekit } from '@sveltejs/kit/vite';
const plugins = await sveltekit();
```

### $app_environment
Runtime environment detection constants for SvelteKit apps.

Export four constants from `$app/environment`:
- `browser: boolean` — running in browser
- `building: boolean` — during build/prerender
- `dev: boolean` — dev server running
- `version: string` — from `config.kit.version.name`

### $app_forms
API for handling form submissions in SvelteKit with functions to apply actions, deserialize responses, and enhance forms.

## applyAction
Updates `form` property and `page.status`, redirects to error page on error.

## deserialize
Converts form submission response text to ActionResult.

## enhance
Enhances `<form>` to work without JavaScript. Intercepts submission with `submit` callback, supports `cancel()` and `controller` to abort. Default behavior updates form, resets on success, redirects on redirect/error. Custom callback can invoke `update({ reset: false, invalidateAll: false })` for default behavior with options.

### $app_navigation
API reference for navigation, lifecycle hooks, data invalidation, and history state management in SvelteKit.

## $app/navigation API

**Navigation**: `goto(url, opts)` - programmatic navigation with options for scroll, focus, invalidation, and state.

**Lifecycle**: `beforeNavigate(callback)` and `afterNavigate(callback)` - intercept/react to navigation. `onNavigate(callback)` - runs before navigation, can return Promise or cleanup function.

**Data**: `invalidate(resource)` or `invalidateAll()` - re-run load functions. `preloadData(href)` - preload page. `preloadCode(pathname)` - import route code.

**State**: `pushState(url, state)` and `replaceState(url, state)` - manage history for shallow routing.

**Scroll**: `disableScrollHandling()` - disable automatic scroll handling.

### $app_paths
API for resolving asset URLs and pathnames with base path prefixing and dynamic route parameter population.

## $app/paths exports

**asset(file)** - Resolve static asset URLs with proper path prefixing
```js
import { asset } from '$app/paths';
<img src={asset('/potato.jpg')} />
```

**resolve(pathname | routeId, params?)** - Resolve pathnames with base path or populate route parameters
```js
resolve(`/blog/hello-world`);
resolve('/blog/[slug]', { slug: 'hello-world' });
```

Deprecated: `assets`, `base`, `resolveRoute()`

### $app_server
API reference for $app/server module providing remote functions (command, query, form, prerender) and utilities (getRequestEvent, read) for server-side operations in SvelteKit.

## Server-side utilities for SvelteKit

- **command**: Remote function that executes on server via fetch
- **form**: Form handler with optional validation
- **getRequestEvent**: Access current RequestEvent in server context
- **prerender**: Remote prerender function with optional inputs generator
- **query**: Remote query function with optional validation
- **query.batch**: Batch multiple queries into single request (since 2.35)
- **read**: Read imported asset contents from filesystem

### $app_state
Read-only reactive state objects for navigation, page data, and app updates in SvelteKit.

## $app/state

Three read-only reactive state objects:

- **navigating**: In-progress navigation with `from`, `to`, `type`, `delta` properties (null when idle)
- **page**: Current page info including `data`, `form`, `state`, `url`, `route`, `params`. Use `$derived()` for reactivity, not `$:` syntax
- **updated**: Boolean `current` value and `check()` method for app version polling

### $app_stores
Deprecated store-based API for accessing page, navigation, and update state; replaced by $app/state in SvelteKit 2.12+.

## Deprecated $app/stores API

Store-based equivalents of `$app/state` (use `$app/state` instead in SvelteKit 2.12+).

- **getStores()** — returns `{page, navigating, updated}`
- **navigating** — Readable store with Navigation object during navigation, null otherwise
- **page** — Readable store with page data
- **updated** — Readable store (boolean) + `check()` method for version polling

### $app_types
Auto-generated TypeScript types for type-safe access to routes, pathnames, and parameters in your SvelteKit app.

## Generated Route & Asset Types

Auto-generated TypeScript utilities for type-safe route handling:

- **Asset**: Union of static files + dynamic imports
- **RouteId**: All route IDs in your app
- **Pathname**: All valid pathnames
- **ResolvedPathname**: Pathnames with base path prefix
- **RouteParams**: Get parameters for a route: `RouteParams<'/blog/[slug]'>` → `{ slug: string }`
- **LayoutParams**: Like RouteParams but includes child route parameters

### $env_dynamic_private
Module for accessing private runtime environment variables on the server side.

Access runtime private environment variables via `import { env } from '$env/dynamic/private'`. Server-side only. Filters based on `config.kit.env.publicPrefix` and `config.kit.env.privatePrefix` configuration.

### $env_dynamic_public
Module for accessing public dynamic environment variables that are safe to expose to client-side code.

Access public dynamic environment variables (prefixed with `PUBLIC_` by default) that are sent to the client:

```ts
import { env } from '$env/dynamic/public';
console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
```

Use `$env/static/public` instead when possible for better performance.

### $env_static_private
Static private environment variables that are injected at build time for server-side use only.

Static private environment variables injected at build time from `.env` files. Cannot be used in client-side code. Values are statically injected enabling dead code elimination.

```ts
import { API_KEY } from '$env/static/private';
```

Declare all referenced variables in `.env` and override via command line: `MY_FEATURE_FLAG="enabled" npm run dev`

### $env_static_public
Module for importing public environment variables that are statically replaced at build time and safe to expose to client-side code.

Access public environment variables (prefixed with `PUBLIC_` by default) that are safe for client-side code. Values are replaced at build time.

```ts
import { PUBLIC_BASE_URL } from '$env/static/public';
```

### $lib_alias
$lib is an automatic import alias for the src/lib directory in SvelteKit projects.

The `$lib` alias automatically points to `src/lib` and can be configured in the config file.

```svelte
import Component from '$lib/Component.svelte';
```

### $service-worker
API reference for the $service-worker module that provides build-time constants for caching and deployment configuration in service workers.

The `$service-worker` module exports build-time constants for service workers: `base` (deployment path), `build` (Vite files), `files` (static assets), `prerendered` (prerendered routes), and `version` (for cache invalidation).

```js
import { base, build, files, prerendered, version } from '$service-worker';
caches.open(`cache-${version}`).then(cache => cache.addAll([...build, ...files]));
```

### configuration
SvelteKit configuration options in svelte.config.js for adapters, routing, CSP, prerendering, environment variables, and deployment versioning.

## svelte.config.js Structure

```js
import adapter from '@sveltejs/adapter-auto';

const config = {
	kit: {
		adapter: adapter()
	}
};
export default config;
```

## Essential Options

**adapter** - Platform conversion during build.

**alias** - Import path mappings.

**appDir** - Asset directory (default: "_app").

**csp** - Content Security Policy with mode ('hash'|'nonce'|'auto'), directives, reportOnly.

**csrf** - CSRF protection: `checkOrigin` or `trustedOrigins` array (production only).

**env** - Environment variables: `dir`, `publicPrefix` ("PUBLIC_"), `privatePrefix` ("").

**inlineStyleThreshold** - Max CSS size to inline in `<style>`.

**outDir** - Build output (default: ".svelte-kit").

**output.bundleStrategy** - 'split' (lazy) | 'single' | 'inline' (no server).

**paths** - `assets` (CDN), `base` (root path), `relative` (SSR paths).

**prerender** - `entries`, `crawl`, `concurrency`, error handlers.

**router.type** - 'pathname' (default) | 'hash'.

**router.resolution** - 'client' (manifest) | 'server' (per-navigation).

**version** - `name` (deterministic string), `pollInterval` (ms).

### command_line_interface
SvelteKit CLI overview: Vite commands for development/building and svelte-kit sync for type generation.

SvelteKit uses Vite CLI via npm scripts (`vite dev`, `vite build`, `vite preview`). The `svelte-kit sync` command generates `tsconfig.json` and `./$types` type definitions, running automatically as the `prepare` script.

### types
SvelteKit automatically generates typed `$types` modules for routes and pages, with ambient types defined in app.d.ts.

## Generated Types

SvelteKit generates `.d.ts` files for routes, exporting typed `RequestHandler` and `PageLoad` from `$types`:
```js
/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {}
```

`$types` exports: `PageData`, `LayoutData`, `ActionData`, `PageProps`, `LayoutProps`.

Extend `tsconfig.json` from `.svelte-kit/tsconfig.json` to enable `$types` imports.

## app.d.ts Ambient Types

Define `App.Error`, `App.Locals`, `App.PageData`, `App.PageState`, `App.Platform` in `app.d.ts` to type SvelteKit features globally.

