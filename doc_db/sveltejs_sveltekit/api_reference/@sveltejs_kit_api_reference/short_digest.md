## Core
- **Server**: Constructor(SSRManifest), init(ServerInitOptions), respond(Request, RequestOptions)
- **VERSION**: String constant
- **error(status, body)**: Throw HTTP error
- **fail(status, data?)**: Create ActionFailure
- **json/text(data, init?)**: Create Response
- **redirect(status, location)**: Throw redirect (300-308)
- **normalizeUrl(url)**: Strip suffixes/slashes, returns {url, wasNormalized, denormalize}

## Forms & Actions
- **Action/Actions**: Form action types for +page.server.js
- **ActionFailure/ActionResult**: Form submission result types
- **isActionFailure/isHttpError/isRedirect**: Type guards

## Adapters
- **Adapter**: {name, adapt(builder), supports?, emulate?}
- **Builder**: Methods for file I/O, path resolution, artifact writing, compression, instrumentation

## Navigation
- **Navigation/NavigationBase/NavigationEnter/NavigationFormSubmit/NavigationLink/NavigationPopState**: Navigation event types
- **NavigationTarget/NavigationType**: Navigation metadata
- **AfterNavigate/BeforeNavigate/OnNavigate**: Hook callback types
- **Page**: Reactive page object {url, params, route, status, error, data, state, form}

## Load Functions
- **Load/ServerLoad**: Load function types
- **LoadEvent/ServerLoadEvent**: Load context with fetch, data, setHeaders, parent(), depends(), untrack(), tracing

## Requests
- **RequestEvent**: Server context {cookies, fetch, getClientAddress, locals, params, platform, request, route, setHeaders, url, isDataRequest, isSubRequest, isRemoteRequest, tracing}
- **RequestHandler**: HTTP verb handler type
- **Cookies**: {get, getAll, set, delete, serialize}

## Hooks
- **Handle**: (input: {event, resolve}) => Response
- **HandleClientError/HandleServerError**: Error handlers
- **HandleFetch**: Modify fetch results
- **HandleValidationError**: Validation error handler
- **ClientInit/ServerInit**: Initialization hooks
- **Reroute**: Modify URL before routing
- **Transport/Transporter**: Custom type serialization

## Remote Functions
- **RemoteCommand/RemoteQuery/RemoteQueryFunction**: Query/command types with pending/updates
- **RemoteForm**: Form with enhance, validate, fields, buttonProps
- **RemoteFormField/RemoteFormFields/RemoteFormIssue**: Field accessors and validation
- **RemotePrerenderFunction/RemoteResource**: Prerender and resource types

## Validation & Misc
- **Invalid**: Imperative validation error creation
- **Snapshot**: State preservation {capture, restore}
- **ParamMatcher**: Route param validator
- **Emulator/ResolveOptions/Prerendered/RouteDefinition/SSRManifest**: Adapter and build metadata
- **HttpError/Redirect**: Error/redirect objects
- **CspDirectives/Logger/MaybePromise/TrailingSlash**: Utility types