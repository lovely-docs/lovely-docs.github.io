## Complete API Reference

### Core Exports
- **Server class**: Constructor takes `SSRManifest`, methods: `init(ServerInitOptions)`, `respond(Request, RequestOptions)`
- **VERSION**: String constant for kit version

### Error Handling & Responses
- **error(status, body)**: Throws HTTP error without invoking `handleError`
- **fail(status, data?)**: Creates `ActionFailure` for form submission failures
- **redirect(status, location)**: Throws redirect (status 300-308)
- **json(data, init?)**, **text(body, init?)**: Create JSON/text Response
- **normalizeUrl(url)**: Strips SvelteKit-internal suffixes, returns `{url, wasNormalized, denormalize}`
- Type guards: **isActionFailure(e)**, **isHttpError(e, status?)**, **isRedirect(e)**

### Form Actions
- **Action**: Type for form action methods in `+page.server.js`, receives `RequestEvent`, returns `MaybePromise<OutputData>`
- **ActionFailure**: Interface with `status: number`, `data: T`, unique symbol
- **ActionResult**: Union type for form responses: `{type: 'success'|'failure'|'redirect'|'error', ...}`

### Adapters
- **Adapter**: Interface with `name`, `adapt(builder)`, optional `supports` and `emulate()`
- **Builder**: Object passed to `adapt()` with methods:
  - File ops: `rimraf(dir)`, `mkdirp(dir)`, `copy(from, to, opts?)`
  - Config access: `log`, `config`, `prerendered`, `routes`
  - Path resolution: `getBuildDirectory(name)`, `getClientDirectory()`, `getServerDirectory()`, `getAppPath()`
  - Build generation: `generateManifest(opts)`, `generateFallback(dest)`, `generateEnvModule()`
  - Write artifacts: `writeClient(dest)`, `writePrerendered(dest)`, `writeServer(dest)`
  - Instrumentation (v2.31.0+): `hasServerInstrumentationFile()`, `instrument(args)`
  - Compression: `compress(directory)` for gzip/brotli

### Navigation & Routing
- **Navigation**: Union of `NavigationExternal | NavigationFormSubmit | NavigationPopState | NavigationLink`
- **NavigationBase**: Base with `from/to: NavigationTarget | null`, `willUnload: boolean`, `complete: Promise<void>`
- **NavigationTarget**: Info about target with `params`, `route.id`, `url`
- **AfterNavigate**: Callback with `type` (enter/form/link/goto/popstate), `willUnload: false`, plus Navigation properties
- **BeforeNavigate**: Callback with `cancel()` method plus Navigation properties
- **Page**: Reactive object with `url`, `params`, `route.id`, `status`, `error`, `data`, `state`, `form`

### Load Functions
- **Load**: Generic type for page/layout load functions, receives `LoadEvent`, returns `MaybePromise<OutputData>`
- **LoadEvent**: Extends `NavigationEvent` with:
  - `fetch: typeof fetch` - credentialed, relative-capable, internal-request-optimized
  - `data: Data` - server load data
  - `setHeaders(headers)` - set response headers (no set-cookie)
  - `parent(): Promise<ParentData>` - get parent layout data
  - `depends(...deps)` - declare dependencies for invalidation
  - `untrack(fn)` - opt out of dependency tracking
  - `tracing: {enabled, root, current}` - tracing spans (v2.31.0+)
- **ServerLoad**: Server-only load function type
- **ServerLoadEvent**: Extends `RequestEvent` with `parent()`, `depends()`, `untrack()`, `tracing`

### Request Handling
- **RequestEvent**: Server request context with:
  - `cookies: Cookies`, `fetch`, `getClientAddress()`, `locals: App.Locals`, `params`, `platform`, `request`, `route.id`, `setHeaders()`, `url`, `isDataRequest`, `isSubRequest`, `isRemoteRequest`, `tracing`
- **RequestHandler**: Type for HTTP verb handlers in `+server.js`, receives `RequestEvent`, returns `MaybePromise<Response>`
- **RequestOptions**: Options for `Server.respond()` with `getClientAddress()`, `platform?`

### Cookies
- **Cookies**: Interface with methods:
  - `get(name, opts?)` - get cookie value
  - `getAll(opts?)` - get all cookies as `{name, value}[]`
  - `set(name, value, opts)` - set cookie (httpOnly/secure true by default, sameSite defaults to lax, requires path)
  - `delete(name, opts)` - delete cookie (requires matching path)
  - `serialize(name, value, opts)` - serialize to Set-Cookie header string

### Hooks
- **Handle**: `(input: {event, resolve}) => MaybePromise<Response>`. Runs on every request
- **HandleClientError**: `(input: {error, event, status, message}) => MaybePromise<void | App.Error>`. Client-side unexpected errors
- **HandleServerError**: `(input: {error, event, status, message}) => MaybePromise<void | App.Error>`. Server-side unexpected errors
- **HandleFetch**: `(input: {event, request, fetch}) => MaybePromise<Response>`. Modifies `event.fetch` results
- **HandleValidationError**: `(input: {issues, event}) => MaybePromise<App.Error>`. Remote function validation failures
- **ClientInit**: `() => MaybePromise<void>`. Runs once when app starts in browser (v2.10.0+)
- **ServerInit**: `() => MaybePromise<void>`. Runs before server responds to first request (v2.10.0+)
- **Reroute**: `(event: {url, fetch}) => MaybePromise<void | string>`. Modifies URL before route matching (v2.3.0+)
- **Transport**: `Record<string, Transporter>`. Transports custom types across server/client boundary
- **Transporter**: `{encode(value): false | U, decode(data): T}`. Encodes on server, decodes in browser

### Remote Functions
- **RemoteCommand**: `(arg: Input) => Promise<Output> & {updates(...queries): Promise<Output>}` with `pending` getter
- **RemoteQuery**: `Promise<Output> & {set(value), refresh(), withOverride(fn), error, loading, current, ready}`
- **RemoteQueryFunction**: `(arg: Input) => RemoteQuery<Output>`
- **RemoteForm**: Form submission with:
  - `method: 'POST'`, `action: string`
  - `enhance(callback)` - intercept submission
  - `for(id)` - create instance for deduplication
  - `preflight(schema)` - add preflight validation
  - `validate(opts?)` - programmatic validation
  - `result` getter - submission result
  - `pending` getter - pending count
  - `fields` - field accessors with `as(type)` for input props
  - `buttonProps` - spread onto submit button
- **RemoteFormField**: Field accessor with `name()`, `value()`, `issues()`, `as(type)`
- **RemoteFormIssue**: `{message, path: (string | number)[]}`

### Validation
- **Invalid**: Function and proxy for imperative validation errors. Call `invalid(issue1, ...)` to throw. Access properties for field-specific issues: `invalid.fieldName('message')`

### Misc Types
- **Snapshot**: `{capture(): T, restore(snapshot): void}`. Export from page/layout for state preservation
- **ParamMatcher**: `(param: string) => boolean`. Custom route parameter validation
- **Emulator**: `{platform?(details): MaybePromise<App.Platform>}`. Adapter environment emulation
- **ResolveOptions**: Options for `resolve()` in handle hook with `transformPageChunk`, `filterSerializedResponseHeaders`, `preload`
- **Prerendered**: `{pages, assets, redirects, paths}` maps/arrays of prerendered content
- **RouteDefinition**: Route metadata with `id`, `api.methods`, `page.methods`, `pattern`, `prerender`, `segments`, `config`
- **SSRManifest**: Server manifest with `appDir`, `appPath`, `assets`, `mimeTypes`, private `_` object
- **ServerInitOptions**: `{env, read?(file): MaybePromise<ReadableStream | null>}`
- **CspDirectives**: Content Security Policy directives object
- **HttpError**: `{status: number, body: App.Error}`. Thrown by `error()`
- **Redirect**: `{status: 300-308, location: string}`. Thrown by `redirect()`
- **Logger**: `(msg) | success(msg) | error(msg) | warn(msg) | minor(msg) | info(msg)`
- **MaybePromise**: `T | Promise<T>`
- **TrailingSlash**: 'never' | 'always' | 'ignore'

### Hooks Helper
- **sequence(...handlers: Handle[]): Handle** - Chains multiple handle middleware. `transformPageChunk` applied in reverse order, `preload`/`filterSerializedResponseHeaders` applied forward with first winning

### Node.js Utilities
- **createReadableStream(file)** - Converts file on disk to readable stream (since 2.4.0)
- **getRequest({request, base, bodySizeLimit})** - Converts Node.js IncomingMessage to Request
- **setResponse(res, response)** - Writes Response to Node.js ServerResponse
- **installPolyfills()** - Adds crypto and File web APIs as globals in Node.js

### Vite Integration
- **sveltekit()** - Returns `Promise<import('vite').Plugin[]>` - async function resolving to array of Vite plugins

### Environment & Paths
- **$app/environment**: `browser`, `building`, `dev`, `version` boolean flags and version string
- **$app/paths**: `asset(file)`, `resolve(pathname | routeId, params?)` for URL resolution with base path handling
- **$app/forms**: `applyAction(result)`, `deserialize(text)`, `enhance(form, callback)` for form handling
- **$app/navigation**: `afterNavigate()`, `beforeNavigate()`, `disableScrollHandling()`, `goto()`, `invalidate()`, `invalidateAll()`, `onNavigate()`, `preloadCode()`, `preloadData()`, `pushState()`, `refreshAll()`, `replaceState()`
- **$app/server**: `command()`, `form()`, `getRequestEvent()`, `prerender()`, `query()`, `query.batch()`, `read()` for server-side operations
- **$app/state**: `navigating`, `page`, `updated` read-only state objects (v2.12+)
- **$app/stores**: Deprecated store-based API; use `$app/state` instead
- **$app/types**: Auto-generated types `Asset`, `RouteId`, `Pathname`, `ResolvedPathname`, `RouteParams<T>`, `LayoutParams<T>`
- **$env/dynamic/private**: Runtime private environment variables (server-only)
- **$env/dynamic/public**: Runtime public environment variables (PUBLIC_ prefix)
- **$env/static/private**: Build-time private environment variables (server-only)
- **$env/static/public**: Build-time public environment variables (PUBLIC_ prefix)
- **$lib**: Alias to `src/lib` directory
- **$service-worker**: `base`, `build`, `files`, `prerendered`, `version` for service worker caching

### Configuration (svelte.config.js)
- **adapter** - Deployment adapter
- **alias** - Import path mappings
- **appDir** (default: `"_app"`) - SvelteKit static assets directory
- **csp** - Content Security Policy with `directives`, `reportOnly`, `mode` ('hash'|'nonce'|'auto')
- **csrf** - CSRF protection with `checkOrigin` (deprecated), `trustedOrigins`
- **embedded** (default: `false`) - App embedded in larger app
- **env** - Environment variables with `dir`, `publicPrefix` (default: `"PUBLIC_"`), `privatePrefix` (default: `""`)
- **experimental** - Unstable features:
  - `tracing` (v2.31.0+) - OpenTelemetry tracing with `server`, `serverFile` flags
  - `instrumentation` (v2.31.0+) - `instrumentation.server.js` support
  - `remoteFunctions` (default: `false`) - Enable experimental remote functions
- **files** - File locations: `src`, `assets`, `hooks.client`, `hooks.server`, `hooks.universal`, `lib`, `params`, `routes`, `serviceWorker`, `appTemplate`, `errorTemplate`
- **inlineStyleThreshold** (default: `0`) - Max CSS file size to inline
- **moduleExtensions** (default: `[".js", ".ts"]`) - Module file extensions
- **outDir** (default: `".svelte-kit"`) - Build output directory
- **output** - Build output options:
  - `preloadStrategy` ('modulepreload'|'preload-js'|'preload-mjs', default: 'modulepreload')
  - `bundleStrategy` ('split'|'single'|'inline', default: 'split')
- **paths** - URL paths with `assets`, `base`, `relative` (default: `true`)
- **prerender** - Prerendering with `concurrency`, `crawl`, `entries`, `handleHttpError`, `handleMissingId`, `handleEntryGeneratorMismatch`, `handleUnseenRoutes`, `origin`
- **router** - Client-side routing:
  - `type` ('pathname'|'hash', default: 'pathname')
  - `resolution` ('client'|'server', default: 'client')
- **typescript** - TypeScript with `config(config)` function
- **version** - Version management with `name` (deterministic string), `pollInterval` (default: `0`)

### Type Definitions
- **Generated types**: `.svelte-kit/types/src/routes/[param]/$types.d.ts` with `RequestHandler`, `PageLoad`, `PageData`, `LayoutData`, `ActionData`, `PageProps`, `LayoutProps`
- **app.d.ts**: Ambient types with `App.Error`, `App.Locals`, `App.PageData`, `App.PageState`, `App.Platform`
- **$lib/server**: Subdirectory preventing client-side imports of server-only modules

### CLI
- **vite dev** - Start development server
- **vite build** - Build production version
- **vite preview** - Run production build locally
- **svelte-kit sync** - Generate `tsconfig.json` and type definitions (runs automatically as prepare script)