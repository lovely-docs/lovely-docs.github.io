## Adapter API

An adapter package must export a default function that returns an `Adapter` object:

```js
export default function (options) {
	const adapter = {
		name: 'adapter-package-name',
		async adapt(builder) {
			// adapter implementation
		},
		async emulate() {
			return {
				async platform({ config, prerender }) {
					// becomes event.platform during dev, build, preview
				}
			}
		},
		supports: {
			read: ({ config, route }) => {
				// Return true if route can use read() from $app/server in production
			},
			tracing: () => {
				// Return true if adapter supports loading tracing.server.js
			}
		}
	};
	return adapter;
}
```

Required properties: `name` and `adapt`. Optional: `emulate` and `supports`.

## Adapt Method Requirements

The `adapt` method must:

1. Clear the build directory
2. Write SvelteKit output using `builder.writeClient()`, `builder.writeServer()`, `builder.writePrerendered()`
3. Output code that:
   - Imports `Server` from `${builder.getServerDirectory()}/index.js`
   - Instantiates app with manifest from `builder.generateManifest({ relativePath })`
   - Listens for platform requests, converts to standard `Request` if needed
   - Calls `server.respond(request, { getClientAddress })` to generate `Response`
   - Exposes platform-specific info via `platform` option to `server.respond()`
   - Globally shims `fetch` if necessary (SvelteKit provides `@sveltejs/kit/node/polyfills` for undici-compatible platforms)
4. Bundle output to avoid requiring dependencies on target platform (if necessary)
5. Place static files and generated JS/CSS in correct location for target platform

Recommended: place adapter output under `build/` with intermediate output under `.svelte-kit/[adapter-name]`.