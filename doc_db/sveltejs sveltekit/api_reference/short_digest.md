## Core Exports

**Response helpers**: `json()`, `text()`, `error()`, `redirect()`, `fail()`

**Type guards**: `isHttpError()`, `isRedirect()`, `isActionFailure()`

**RequestEvent**: cookies, fetch, params, url, locals, platform, request, setHeaders(), getClientAddress()

**LoadEvent**: Extends RequestEvent with fetch, data, parent(), depends(), untrack()

## Hooks

**Handle**: `(input: {event, resolve}) => Response`

**HandleError**: `(input: {error, event, status, message}) => App.Error`

**sequence()**: Chain handle middleware with different execution orders

## Navigation

**goto(url, opts)**: Programmatic navigation with invalidate, replaceState, noScroll, keepFocus, state

**beforeNavigate(callback)**: Intercept navigation, call cancel() to prevent

**afterNavigate(callback)**: Runs on mount and every navigation

**invalidate(resource)**: Re-run load functions depending on resource

**onNavigate(callback)**: Runs before navigation, can return Promise to delay

**pushState/replaceState(url, state)**: Create/replace history entry

## Remote Functions

**command(fn, opts?)**: Remote command executed on server

**query(fn, opts?)**: Remote query executed on server

**form(fn, opts?)**: Form object for `<form>` elements

**prerender(fn, opts?)**: Remote prerender function

**getRequestEvent()**: Get current RequestEvent in server context

## Forms

**enhance(form)**: Enhance `<form>` without JavaScript. Default: updates form prop, resets on success, redirects on error

**applyAction(result)**: Update form property and page.status

**deserialize(text)**: Deserialize form submission response

## App State ($app/state, v2.12+)

**navigating**: In-progress navigation or null

**page**: Current page with data, form, state, url, route, params

**updated**: Boolean, true when new version detected. Call updated.check() to force check.

## Configuration (svelte.config.js)

**adapter**: Platform adapter

**paths**: `assets` (CDN), `base` (root path), `relative` (SSR relative paths)

**prerender**: `concurrency`, `crawl`, `entries`, error handlers, `origin`

**csp**: Content Security Policy with mode, directives, reportOnly

**version**: `name` (deterministic), `pollInterval` (ms for polling)

**output**: `preloadStrategy`, `bundleStrategy`

## Types

**$app/types** auto-generated:
- `RouteId`, `Pathname`, `Asset`, `RouteParams<RouteId>`

**Per route** (`./$types`):
- `PageData`, `LayoutData`, `ActionData`, `PageProps`, `LayoutProps`

**app.d.ts**:
- `App.Error`, `App.Locals`, `App.PageData`, `App.PageState`, `App.Platform`

## Utilities

**$app/environment**: `browser`, `building`, `dev`, `version`

**$app/paths**: `asset(file)`, `resolve(pathname | routeId, params?)`

**$env/static/public|private**: Build-time environment variables

**$env/dynamic/public|private**: Runtime environment variables

**$service-worker**: `base`, `build`, `files`, `prerendered`, `version`

**Node.js**: `createReadableStream()`, `getRequest()`, `setResponse()`, `installPolyfills()`