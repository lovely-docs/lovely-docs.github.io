Hooks are app-wide functions that SvelteKit calls in response to specific events. Three optional hook files exist:
- `src/hooks.server.js` — server hooks
- `src/hooks.client.js` — client hooks  
- `src/hooks.js` — universal hooks (both client and server)

**Server Hooks:**

`handle` runs on every request and determines the response. Receives `event` and `resolve` function. Can modify response headers/body or bypass SvelteKit entirely. Supports optional second parameter with `transformPageChunk`, `filterSerializedResponseHeaders`, and `preload` options.

```js
export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith('/custom')) {
		return new Response('custom response');
	}
	const response = await resolve(event);
	response.headers.set('x-custom-header', 'value');
	return response;
}
```

`handleFetch` modifies or replaces results of `event.fetch` calls on the server. Useful for redirecting API calls to localhost during SSR instead of public URLs.

```js
export async function handleFetch({ request, fetch }) {
	if (request.url.startsWith('https://api.yourapp.com/')) {
		request = new Request(
			request.url.replace('https://api.yourapp.com/', 'http://localhost:9999/'),
			request
		);
	}
	return fetch(request);
}
```

`handleValidationError` called when a remote function receives invalid arguments. Must return an object matching `App.Error` shape.

`locals` allows adding custom data to `event.locals` which is passed to handlers and server load functions.

**Shared Hooks (server and client):**

`handleError` called when unexpected errors occur during loading, rendering, or endpoints. Allows logging and generating safe error representations for users. Can customize `App.Error` interface to include additional properties like tracking IDs.

`init` runs once when server starts or app loads in browser. Useful for async initialization like database connections.

**Universal Hooks:**

`reroute` runs before `handle` and changes how URLs map to routes. Returns modified pathname. Can be async since v2.18 to fetch data from backend.

```js
const translated = {
	'/de/ueber-uns': '/de/about',
	'/fr/a-propos': '/fr/about',
};
export function reroute({ url }) {
	return translated[url.pathname];
}
```

`transport` defines custom type transporters with `encode` and `decode` functions to pass custom types across server/client boundary.

```js
export const transport = {
	Vector: {
		encode: (value) => value instanceof Vector && [value.x, value.y],
		decode: ([x, y]) => new Vector(x, y)
	}
};
```