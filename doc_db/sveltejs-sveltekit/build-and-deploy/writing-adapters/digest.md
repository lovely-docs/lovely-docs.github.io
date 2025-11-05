## Adapter API

Adapter packages must export a default function that returns an `Adapter` object with:

**Required properties:**
- `name`: string identifier for the adapter
- `adapt(builder)`: async function implementing the adapter

**Optional properties:**
- `emulate()`: returns platform-specific object that becomes `event.platform` during dev/build/preview
- `supports`: object with methods to declare feature support:
  - `read({ config, route })`: returns boolean if route can use `read` from `$app/server` in production
  - `tracing()`: returns boolean if adapter supports loading `tracing.server.js`

## Adapt Method Requirements

The `adapt` method must:
- Clear the build directory
- Write output using `builder.writeClient()`, `builder.writeServer()`, `builder.writePrerendered()`
- Generate code that:
  - Imports `Server` from `${builder.getServerDirectory()}/index.js`
  - Instantiates app with manifest from `builder.generateManifest({ relativePath })`
  - Listens for platform requests, converts to standard `Request`, calls `server.respond(request, { getClientAddress })` to get `Response`
  - Exposes platform info via `platform` option to `server.respond`
  - Shims `fetch` globally if needed (use `@sveltejs/kit/node/polyfills` for Node-compatible platforms)
- Bundle output to avoid runtime dependency installation if necessary
- Place static files and generated JS/CSS in platform-appropriate location

Store adapter output under `build/` with intermediate files under `.svelte-kit/[adapter-name]`.