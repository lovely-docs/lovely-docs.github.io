## Routing

Routes defined by directory structure in `src/routes`. Files with `+` prefix are special: `+page.svelte` (component), `+page.js`/`+page.server.js` (load functions), `+layout.svelte`/`+layout.js`/`+layout.server.js` (persistent wrappers), `+server.js` (API endpoints), `+error.svelte` (error boundaries).

Pages render SSR initially, CSR on navigation. Layouts persist across navigation. Dynamic routes use `[param]` syntax, rest parameters with `[...rest]`.

`+server.js` exports HTTP verb handlers (GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD). Content negotiation: GET/POST/HEAD treated as pages if `accept: text/html`, else API. PUT/PATCH/DELETE/OPTIONS always API. Handlers receive `RequestEvent`, return `Response`. Can use `error()`, `redirect()`, `json()` helpers.

`+error.svelte` walks tree for closest error boundary. Falls back to root, then static `src/error.html`.

`$types.d.ts` auto-generated for type safety with `PageProps`, `LayoutProps`, `PageLoad`, `PageServerLoad`, `LayoutLoad`, `LayoutServerLoad`.

## Load Functions

Run before rendering to fetch data. Universal load (`+page.js`, `+layout.js`) runs server+browser, can return any type. Server load (`+page.server.js`, `+layout.server.js`) runs server-only, must return serializable data (JSON, BigInt, Date, Map, Set, RegExp, promises).

Receive: `url` (with `origin`, `hostname`, `pathname`, `searchParams`), `route`, `params`, `fetch` (inherits cookies/auth on server, makes relative requests, bypasses HTTP overhead, inlines response into HTML), `cookies`, `setHeaders()`, `parent()` (access parent layout data), `depends(url)`, `untrack()`.

Throw `error(status, message)` to render nearest `+error.svelte`. Use `redirect(status, location)` to redirect. Return unresolved promises to stream data as it resolves.

Dependency tracking: load reruns when referenced `params`/`url` changes, `await parent()` called and parent reran, `fetch(url)` or `depends(url)` invalidated with `invalidate(url)` or `invalidateAll()`. Use `untrack()` to exclude dependencies.

Data available via `data` prop on page/layout, or `page.data` app-wide.

## Form Actions

Server-side form handling via `actions` object in `+page.server.js`. Forms use POST (never GET for side-effects), work without JavaScript with optional progressive enhancement.

Default action: `export const actions = { default: async (event) => {...} }`. Named actions: `export const actions = { login: async (event) => {...}, register: async (event) => {...} }` invoked with `?/actionName` query parameter.

Actions receive `RequestEvent`, read form data with `request.formData()`, return data available as `form` prop and `page.form` app-wide. Use `fail(statusCode, data)` for validation errors with form values. Use `redirect(statusCode, location)` after success.

`use:enhance` directive for progressive enhancement: `<form method="POST" use:enhance>`. Without args, emulates browser behavior (updates `form`/`page.form`, resets form, invalidates data on success, redirects on redirect, renders error boundary on error). Customize with `SubmitFunction` callback receiving `{ formElement, formData, action, cancel, submitter }` returning async callback with `{ result, update }`. Use `applyAction(result)` to manually handle results.

`deserialize()` from `$app/forms` handles Date/BigInt objects (not `JSON.parse`).

## Page Options

Export from `+page.js`, `+page.server.js`, `+layout.js`, `+layout.server.js` to control rendering:

- `prerender`: `true` (static HTML at build), `false` (dynamic), `'auto'` (prerender but include in SSR manifest). Prerenderer crawls from root following `<a>` links. Specify additional routes via `config.kit.prerender.entries` or export `entries()` function from dynamic routes returning array of param objects.
- `ssr`: `false` disables server-side rendering (renders empty shell on server, browser-only).
- `csr`: `false` disables client-side rendering (HTML/CSS only, no JavaScript).
- `trailingSlash`: `'never'` (default, redirects `/about/` to `/about`), `'always'`, `'ignore'`.
- `config`: Adapter-specific configuration object. Top-level keys merged (not nested).
- `entries()`: Function exporting parameter combinations to prerender for dynamic routes. Can be async.

If all options are boolean/string literals, evaluated statically. Otherwise imports file at build/runtime, so browser-only code must not run at module load.

## State Management

Never store shared state in server variables (servers are stateless, shared by multiple users). Authenticate with cookies, persist to database.

Load functions must be pure—don't write to stores or global state. Return data instead, pass to components or use `page.data`.

Use Svelte's context API with `setContext`/`getContext` instead of globals. Pass functions into context to maintain reactivity. On server, context updates in child components don't affect already-rendered parents; on client they do. Pass state down rather than up to avoid hydration flashing.

Component/page state preserved on navigation—`data` prop updates but lifecycle doesn't rerun. Use `$derived` for reactive calculations. Use `afterNavigate`/`beforeNavigate` if lifecycle code must rerun. Use `{#key}` block to destroy/remount on navigation.

For state affecting SSR or surviving reload (filters, sorting), store in URL search parameters. Set via `<a href="...">`, `<form action="...">`, or `goto('?key=value')`. Access in load via `url`, in components via `page.url.searchParams`.

For ephemeral UI state (accordion open/closed) persisting across navigation but not reload, use snapshots.

## Remote Functions

Type-safe client-server RPC. Functions exported from `.remote.js`/`.remote.ts` files execute on server, transformed to `fetch` wrappers on client. Requires `kit.experimental.remoteFunctions: true` in `svelte.config.js`.

**query**: Reads dynamic data. Returns Promise. Accepts single validated argument (Standard Schema: Zod, Valibot). Cached per page. Call `.refresh()` to re-fetch. Use `query.batch()` to batch requests solving n+1 problem—server callback receives array of arguments, returns function `(input, index) => output`.

**form**: Writes data with progressive enhancement. Takes callback receiving validated data from FormData. Returns object with `method`/`action` for form spreading. Fields accessed via `createPost.fields.title.as('text')` etc. Supports nested objects/arrays, strings, numbers, booleans, Files. Use `invalid(invalid.field(...))` for runtime validation errors. Call `validate()` programmatically. Prefix field name with `_` to prevent sending back on invalid submission. Single-flight mutations: `await submit().updates(getQuery())` or `await getQuery().refresh()` inside handler. Form handler can `redirect(...)` or `return data`. Customize with `enhance(async ({ form, data, submit }) => {...})`. Use `modifyTodo.for(id)` for repeated forms. Different buttons submit to different URLs via `formaction` and `register.buttonProps`.

**command**: Writes without form element, called from anywhere (not during render). Like form, accepts optional validated argument. Refresh queries: `await addLike(id).updates(getQuery())` or with optimistic update: `.withOverride(n => n + 1)`.

**prerender**: Invoked at build time. Data saved via Cache API in browser, survives reloads, cleared on new deployment. Accepts validated argument. Specify values via `inputs` option. By default excluded from server bundle; set `dynamic: true` to allow runtime calls.

Validation errors return 400 Bad Request. Control message via `handleValidationError` server hook. Opt out with `'unchecked'` string instead of schema.

Use `getRequestEvent()` inside query/form/command to access current RequestEvent for cookie/auth abstractions. Cannot set headers (except cookies in form/command).

`redirect(...)` works in query/form/prerender but not command.