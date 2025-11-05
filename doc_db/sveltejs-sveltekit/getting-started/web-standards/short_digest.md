SvelteKit uses standard Web APIs available in modern browsers and environments like Cloudflare Workers and Deno.

**Fetch**: Available in hooks, server routes, and browser. Special version in `load` functions and server hooks allows direct endpoint invocation during SSR without HTTP calls.

**Request/Response**: `event.request` in hooks/routes provides `json()` and `formData()` methods. Responses returned from `+server.js` handlers.

**Headers**: Read `request.headers` and set `response.headers`:
```js
export function GET({ request }) {
	return json({ userAgent: request.headers.get('user-agent') }, 
		{ headers: { 'x-custom-header': 'potato' } });
}
```

**FormData**: Handle form submissions:
```js
export async function POST(event) {
	const body = await event.request.formData();
	return json({ name: body.get('name') ?? 'world' });
}
```

**Streams**: ReadableStream, WritableStream, TransformStream for large/chunked responses.

**URL/URLSearchParams**: Access query parameters via `url.searchParams.get('foo')`.

**Web Crypto**: `crypto.randomUUID()` and other operations.