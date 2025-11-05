## Creating a Project

Run `npx sv create my-app` to scaffold a project, then `npm run dev` to start the dev server on localhost:5173.

## Project Structure

```
src/
├ lib/              # Library code ($lib alias)
│ └ server/         # Server-only code ($lib/server alias)
├ params/           # Param matchers
├ routes/           # Routes (Svelte components, server-rendered then client-side)
├ app.html          # Page template with placeholders: %sveltekit.head%, %sveltekit.body%, %sveltekit.assets%, %sveltekit.nonce%, %sveltekit.env.[NAME]%, %sveltekit.version%
├ error.html        # Error page with placeholders: %sveltekit.status%, %sveltekit.error.message%
├ hooks.client.js   # Client hooks
├ hooks.server.js   # Server hooks
├ service-worker.js # Service worker
└ tracing.server.js # Observability
static/             # Static assets
tests/              # Playwright tests
```

**package.json** requires `@sveltejs/kit`, `svelte`, `vite` as devDependencies with `"type": "module"`.

## Rendering Modes & Deployment

SvelteKit supports: SSR + CSR (default), static site generation, SPAs, and multi-page apps. Adapters configure deployment targets:
- `adapter-node` for own servers/containers
- `adapter-static` for static generation
- `adapter-vercel`, `adapter-netlify`, `adapter-cloudflare` for serverless
- For HTTP/1 limits (mobile/embedded), use `bundleStrategy: 'single'`

## Web Standards

SvelteKit uses standard Web APIs: Fetch, Request/Response, Headers, FormData, Streams, URL, Web Crypto.

**Fetch**: Available in hooks, server routes, and browser. Special version in `load` functions and server hooks allows direct endpoint invocation during SSR without HTTP calls.

**Request/Response/Headers**:
```js
export function GET({ request }) {
	return json({ userAgent: request.headers.get('user-agent') }, 
		{ headers: { 'x-custom-header': 'potato' } });
}
```

**FormData**:
```js
export async function POST(event) {
	const body = await event.request.formData();
	return json({ name: body.get('name') ?? 'world' });
}
```

**Streams**: ReadableStream, WritableStream, TransformStream for large/chunked responses.

**URL/URLSearchParams**: Access query parameters via `url.searchParams.get('foo')`.

**Web Crypto**: `crypto.randomUUID()` and other operations.