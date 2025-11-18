## Core Exports

**Server class**: Initializes with SSRManifest, provides `init()` and `respond()` methods.

**Response helpers**: `json(data, init?)`, `text(body, init?)`, `error(status, body)`, `redirect(status, location)`, `fail(status, data?)`

**Type guards**: `isHttpError(e, status?)`, `isRedirect(e)`, `isActionFailure(e)`

**Utilities**: `normalizeUrl(url)` returns `{url, wasNormalized, denormalize}`, `VERSION`

## Request/Response Types

**RequestEvent**: cookies, fetch, params, url, locals, platform, request, route info, setHeaders(), getClientAddress(), isDataRequest, isSubRequest, isRemoteRequest, tracing

**LoadEvent** (extends RequestEvent): Adds fetch, data, setHeaders(), parent(), depends(), untrack(), tracing

**Page**: url, params, route.id, status, error, data, state, form

## Form Actions & Hooks

**Action**: `(event: RequestEvent) => MaybePromise<OutputData>`

**ActionFailure**: `{status, data, [uniqueSymbol]}`

**Handle**: `(input: {event, resolve}) => Response` - runs on every request

**HandleError**: `(input: {error, event, status, message}) => App.Error`

**HandleFetch**: `(input: {event, request, fetch}) => Response`

**HandleValidationError**: `(input: {issues, event}) => App.Error`

**Reroute**: `(event: {url, fetch}) => void | string`

**sequence()**: Chains multiple handle middleware. `transformPageChunk` applied in reverse order, `preload` and `filterSerializedResponseHeaders` in forward order (first wins).

## Adapter API

**Adapter interface**: `{name, adapt(builder), supports?, emulate?}`

**Builder**: log, rimraf, mkdirp, config, prerendered, routes, createEntries, findServerAssets, generateFallback, generateEnvModule, generateManifest, getBuildDirectory, getClientDirectory, getServerDirectory, getAppPath, writeClient, writePrerendered, writeServer, copy, hasServerInstrumentationFile, instrument, compress

## Navigation

**Navigation types**: NavigationLink, NavigationFormSubmit, NavigationPopState, NavigationExternal, NavigationEnter

**afterNavigate(callback)**: Runs on mount and every navigation

**beforeNavigate(callback)**: Intercept navigation, call `cancel()` to prevent

**goto(url, opts)**: Programmatic navigation with `replaceState`, `noScroll`, `keepFocus`, `invalidateAll`, `invalidate`, `state` options

**invalidate(resource)**: Re-run load functions depending on resource (string/URL or predicate function)

**invalidateAll()**: Re-run all load functions

**onNavigate(callback)**: Runs before navigation, can return Promise to delay

**preloadCode(pathname)**: Import code without calling load functions

**preloadData(href)**: Preload page by loading code and calling load functions

**pushState(url, state)** / **replaceState(url, state)**: Create/replace history entry with page state

## Remote Functions

**command(fn, opts?)**: Remote command executed on server when called from browser

**query(fn, opts?)**: Remote query executed on server when called from browser

**query.batch()**: Collect multiple query calls into single request (v2.35+)

**form(fn, opts?)**: Form object for spreading onto `<form>` elements

**prerender(fn, opts?)**: Remote prerender function with optional `inputs` generator and `dynamic` flag

**getRequestEvent()**: Returns current RequestEvent in server hooks, load functions, actions, endpoints

**read(asset)**: Read imported asset contents from filesystem

## Forms

**enhance(form)**: Enhance `<form>` to work without JavaScript. Callback receives FormData, action, cancel(), controller. Returns callback for server response. Default: updates `form` prop, resets form, invalidates data on success, redirects on redirect/error.

**applyAction(result)**: Update `form` property and `page.status`, redirect to error page on error

**deserialize(text)**: Deserialize form submission response into ActionResult

## App State

**$app/state** (v2.12+): Three read-only reactive objects:
- `navigating`: In-progress navigation with `from`, `to`, `type`, `delta` (popstate only), or `null`
- `page`: Current page with `data`, `form`, `state`, `url`, `route`, `params`
- `updated`: Boolean, set to `true` when new version detected (if `version.pollInterval` > 0). Call `updated.check()` to force check.

**$app/stores** (deprecated): Store equivalents via `getStores()` returning `{page, navigating, updated}`

## Paths & Assets

**asset(file)**: Resolve static directory asset URLs with base path prefix

**resolve(pathname | routeId, params?)**: Resolve pathname with base path or route ID with dynamic segments populated

**Deprecated**: `assets`, `base`, `resolveRoute()`

## Environment Variables

**$env/static/public**: Public variables (PUBLIC_ prefix) injected at build time

**$env/static/private**: Private variables injected at build time, server-only

**$env/dynamic/public**: Public variables sent from server to client at runtime

**$env/dynamic/private**: Private variables at runtime, server-only

## Node.js Integration

**@sveltejs/kit/node**:
- `createReadableStream(path)`: Convert file to readable stream (v2.4.0+)
- `getRequest({request, base, bodySizeLimit?})`: Convert IncomingMessage to Request
- `setResponse(serverResponse, response)`: Write Response to ServerResponse

**@sveltejs/kit/node/polyfills**:
- `installPolyfills()`: Enable web APIs (crypto, File) in Node.js

## Vite Integration

**@sveltejs/kit/vite**: `sveltekit()` returns array of Vite plugins

## Service Worker

**$service-worker**: Build-time constants available only in service workers:
- `base`: Deployment base path from `location.pathname`
- `build`: Array of Vite-generated file URLs for caching
- `files`: Array of static directory file URLs
- `prerendered`: Array of prerendered page pathnames
- `version`: From `config.kit.version`

## Configuration

**svelte.config.js** key options:
- `adapter`: Platform adapter
- `alias`: Import path mappings
- `appDir`: SvelteKit assets directory (default: "_app")
- `csp`: Content Security Policy with `mode` ('hash'|'nonce'|'auto'), `directives`, `reportOnly`
- `csrf`: CSRF protection via `checkOrigin` or `trustedOrigins`
- `embedded`: Add listeners to parent of body instead of window
- `env`: `dir`, `publicPrefix` (default: "PUBLIC_"), `privatePrefix`
- `experimental`: `tracing`, `instrumentation`, `remoteFunctions`
- `inlineStyleThreshold`: Max CSS size to inline
- `moduleExtensions`: File extensions as modules (default: [".js", ".ts"])
- `outDir`: Build output directory (default: ".svelte-kit")
- `output`: `preloadStrategy` ('modulepreload'|'preload-js'|'preload-mjs'), `bundleStrategy` ('split'|'single'|'inline')
- `paths`: `assets` (CDN path), `base` (root-relative path), `relative` (use relative paths in SSR)
- `prerender`: `concurrency`, `crawl`, `entries`, error handlers, `origin`
- `router`: `type` ('pathname'|'hash'), `resolution` ('client'|'server')
- `typescript`: `config` function to modify tsconfig.json
- `version`: `name` (deterministic version string), `pollInterval` (ms for version polling)

## Types

**$app/types** auto-generated:
- `Asset`: Union of static filenames + wildcard
- `RouteId`: Union of all route IDs
- `Pathname`: Union of all valid pathnames
- `ResolvedPathname`: Pathnames with base path prefix
- `RouteParams<RouteId>`: Parameters for given route
- `LayoutParams`: Parameters including optional from child routes

**Generated per route** (`./$types`):
- `PageData`: Return type of page load
- `LayoutData`: Return type of layout load
- `ActionData`: Union of all Actions return types
- `PageProps` (v2.16.0+): `{data: PageData, form: ActionData}`
- `LayoutProps` (v2.16.0+): `{data: LayoutData, children: Snippet}`

**app.d.ts** ambient types:
- `App.Error`: Error shape (has `message: string`)
- `App.Locals`: Type of `event.locals`
- `App.PageData`: Shared data across pages
- `App.PageState`: Shape of `page.state`
- `App.Platform`: Platform-specific context from adapters

## CLI

**Vite commands** (via npm scripts):
- `vite dev`: Development server
- `vite build`: Production build
- `vite preview`: Run production build locally

**SvelteKit command**:
- `svelte-kit sync`: Generate tsconfig.json and type definitions

## Utilities

**$app/environment**: Runtime detection constants:
- `browser: boolean`
- `building: boolean`
- `dev: boolean`
- `version: string`

**$lib**: Automatic alias to `src/lib` (configurable via `config.kit.files.lib`)

**Cookies**: `get(name, opts?)`, `getAll(opts?)`, `set(name, value, opts)`, `delete(name, opts)`, `serialize(name, value, opts)`

**Invalid**: Create validation errors via `invalid(issue1, issue2)` or `invalid.fieldName('message')`

**Snapshot**: `{capture(), restore(snapshot)}` - preserve component state during navigation

**ParamMatcher**: `(param: string) => boolean` - custom route parameter validation

**SubmitFunction**: Enhanced form submission handler with formData, action, result, update()