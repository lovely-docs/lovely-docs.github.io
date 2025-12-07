## Overview
SvelteKit builds on standard Web APIs available in modern browsers and non-browser environments (Cloudflare Workers, Deno, Vercel Functions, Node via polyfills). Your existing web development skills apply directly.

## Fetch APIs
`fetch` is available in hooks, server routes, and the browser. A special version in `load` functions, server hooks, and API routes allows invoking endpoints directly during SSR without HTTP calls while preserving credentials. Server-side `fetch` outside `load` requires explicit `cookie`/`authorization` headers. Relative requests are supported in these special contexts.

**Request**: Accessible as `event.request` in hooks and server routes. Provides methods like `request.json()` and `request.formData()`.

**Response**: Returned from `await fetch(...)` and handlers in `+server.js` files. A SvelteKit app fundamentally transforms a `Request` into a `Response`.

**Headers**: Read incoming `request.headers` and set outgoing `response.headers`.

Example:
```js
import { json } from '@sveltejs/kit';

export function GET({ request }) {
	console.log(...request.headers);
	return json({
		userAgent: request.headers.get('user-agent')
	}, {
		headers: { 'x-custom-header': 'potato' }
	});
}
```

## FormData
Handle HTML form submissions with `FormData` objects:
```js
export async function POST(event) {
	const body = await event.request.formData();
	console.log([...body]);
	return json({ name: body.get('name') ?? 'world' });
}
```

## Stream APIs
For large or chunked responses, use ReadableStream, WritableStream, and TransformStream from the Streams API.

## URL APIs
URLs use the `URL` interface with properties like `origin`, `pathname`, `hash`. Appears in `event.url` (hooks/server routes), `page.url` (pages), `from`/`to` (navigation callbacks).

**URLSearchParams**: Access query parameters via `url.searchParams.get('foo')`.

## Web Crypto
The Web Crypto API is available via the `crypto` global. Used internally for CSP headers. Example: `const uuid = crypto.randomUUID();`