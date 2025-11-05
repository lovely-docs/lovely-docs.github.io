## Server Hooks

**handle** — Runs on every request (including prerendering). Receives `event` and `resolve` function. Allows modifying response headers/bodies or bypassing SvelteKit entirely.

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

`resolve` accepts optional second parameter with:
- `transformPageChunk(opts)` — Transform HTML chunks
- `filterSerializedResponseHeaders(name, value)` — Control which headers serialize in `load` fetch responses
- `preload(input)` — Determine which files preload in `<head>`

**handleFetch** — Modifies/replaces `event.fetch` calls on server or during prerendering. Useful for redirecting API calls to localhost during SSR or manually forwarding cookies for sibling subdomains.

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

**handleValidationError** — Called when remote function receives invalid argument against Standard Schema. Must return object matching `App.Error` shape.

## Shared Hooks (server and client)

**handleError** — Called for unexpected errors during loading, rendering, or endpoints. Receives `error`, `event`, `status`, `message`. Allows logging and returning safe error representation for `$page.error`. Customize error shape via `App.Error` interface.

```js
export async function handleError({ error, event, status, message }) {
	const errorId = crypto.randomUUID();
	Sentry.captureException(error, { extra: { event, errorId, status } });
	return { message: 'Whoops!', errorId };
}
```

**init** — Runs once when server starts or app loads in browser. Useful for async initialization like database connections. Note: async work delays browser hydration.

## Universal Hooks (src/hooks.js)

**reroute** — Runs before `handle`. Changes URL-to-route translation by returning modified pathname. Can be async (since v2.18) to fetch data for routing decisions.

```js
const translated = {
	'/de/ueber-uns': '/de/about',
	'/fr/a-propos': '/fr/about',
};
export function reroute({ url }) {
	return translated[url.pathname];
}
```

**transport** — Collection of transporters for passing custom types across server/client boundary. Each has `encode` (server) and `decode` (client) functions.

```js
export const transport = {
	Vector: {
		encode: (value) => value instanceof Vector && [value.x, value.y],
		decode: ([x, y]) => new Vector(x, y)
	}
};
```

Files: `src/hooks.server.js`, `src/hooks.client.js`, `src/hooks.js` (all optional).