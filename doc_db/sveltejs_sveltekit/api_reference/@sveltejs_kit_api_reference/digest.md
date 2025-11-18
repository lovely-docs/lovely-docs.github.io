## Core Exports

**Server class**: Initializes with SSRManifest, provides `init()` and `respond()` methods for handling requests.

**Response helpers**:
- `json(data, init?)` - Create JSON Response
- `text(body, init?)` - Create text Response
- `error(status, body)` - Throw HTTP error (prevents handleError hook)
- `redirect(status, location)` - Throw redirect (status 300-308)
- `fail(status, data?)` - Create ActionFailure for form submissions

**Type guards**:
- `isHttpError(e, status?)` - Check if error thrown by error()
- `isRedirect(e)` - Check if redirect thrown by redirect()
- `isActionFailure(e)` - Check if failure thrown by fail()

**Utilities**:
- `normalizeUrl(url)` - Strip SvelteKit suffixes and trailing slashes, returns {url, wasNormalized, denormalize}
- `VERSION` - SvelteKit version string

## Request/Response Types

**RequestEvent**: Contains cookies, fetch, params, url, locals, platform, request, route info, setHeaders(), getClientAddress(), isDataRequest, isSubRequest, isRemoteRequest, tracing.

**LoadEvent** (extends RequestEvent): Adds fetch, data, setHeaders(), parent(), depends(), untrack(), tracing.

**Page**: Contains url, params, route.id, status, error, data, state, form.

## Form Actions

**Action**: `(event: RequestEvent) => MaybePromise<OutputData>`

**Actions**: Record of named Action functions

**ActionResult**: Union of {type: 'success'|'failure'|'redirect'|'error', ...}

**ActionFailure**: {status, data, [uniqueSymbol]}

## Hooks

**Handle**: `(input: {event, resolve}) => Response` - Runs on every request

**HandleError** (server/client): `(input: {error, event, status, message}) => App.Error` - Handles unexpected errors

**HandleFetch**: `(input: {event, request, fetch}) => Response` - Modifies fetch results

**HandleValidationError**: `(input: {issues, event}) => App.Error` - Handles validation failures

**Reroute**: `(event: {url, fetch}) => void | string` - Modify URL before routing

**Transport**: Custom type serialization across server/client boundary

**ClientInit/ServerInit**: `() => MaybePromise<void>` - Initialize before first request/response

## Adapter API

**Adapter interface**: {name, adapt(builder), supports?, emulate?}

**Builder**: Provides log, rimraf, mkdirp, config, prerendered, routes, createEntries, findServerAssets, generateFallback, generateEnvModule, generateManifest, getBuildDirectory, getClientDirectory, getServerDirectory, getAppPath, writeClient, writePrerendered, writeServer, copy, hasServerInstrumentationFile, instrument, compress.

## Navigation

**Navigation types**: NavigationLink, NavigationFormSubmit, NavigationPopState, NavigationExternal, NavigationEnter

**AfterNavigate**: Navigation with type (enter|form|link|goto|popstate) and willUnload: false

**BeforeNavigate**: Navigation with cancel() method

**OnNavigate**: Navigation with type (form|link|goto|popstate) and willUnload: false

## Remote Functions

**RemoteCommand**: `(arg: Input) => Promise<Output>` with pending property and updates() method

**RemoteForm**: Form object with method, action, enhance(), for(), preflight(), validate(), result, pending, fields, buttonProps

**RemoteQuery**: Promise-like with error, loading, current, ready, set(), refresh(), withOverride()

**RemotePrerenderFunction**: `(arg: Input) => RemoteResource<Output>`

## Cookies

**Cookies interface**: get(name, opts?), getAll(opts?), set(name, value, opts), delete(name, opts), serialize(name, value, opts)

## Validation

**Invalid**: Function and proxy for creating validation errors. Call `invalid(issue1, issue2)` or `invalid.fieldName('message')`

## Other Types

**Snapshot**: {capture(), restore(snapshot)} - Preserve component state during navigation

**ParamMatcher**: `(param: string) => boolean` - Custom route parameter validation

**SubmitFunction**: Enhanced form submission handler with access to formData, action, result, update()

**Cookies**: Get/set/delete cookies with httpOnly and secure defaults

**Config/KitConfig**: SvelteKit configuration (see configuration reference)

**Emulator**: {platform?(details)} - Influence environment during dev/build/prerendering