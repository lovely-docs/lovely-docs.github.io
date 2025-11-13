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