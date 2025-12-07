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