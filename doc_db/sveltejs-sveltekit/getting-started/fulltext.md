

## Pages

### creating-a-project
How to create a new SvelteKit project and understand its basic structure.

Run `npx sv create my-app` to scaffold a project, then `npm run dev` to start the dev server on localhost:5173. Pages are Svelte components in `src/routes` that are server-rendered initially, then client-side.

### project-types
SvelteKit supports multiple rendering strategies and deployment targets through configurable adapters.

SvelteKit supports multiple rendering modes: default (SSR + CSR), static site generation, SPAs, multi-page apps, and various deployment targets (serverless, own server, containers, mobile, desktop, browser extensions). Use adapter-node for own servers/containers, adapter-static for static generation, adapter-vercel/netlify/cloudflare for serverless. For mobile/embedded with HTTP/1 limits, use `bundleStrategy: 'single'`.

### project-structure
Standard directory layout and configuration files for a SvelteKit project.

## Directory structure

```
src/
├ lib/              # Library code ($lib alias)
│ └ server/         # Server-only code ($lib/server alias)
├ params/           # Param matchers
├ routes/           # Routes
├ app.html          # Page template
├ error.html        # Error page
├ hooks.client.js   # Client hooks
├ hooks.server.js   # Server hooks
├ service-worker.js # Service worker
└ tracing.server.js # Observability
static/             # Static assets
tests/              # Playwright tests
```

**app.html** placeholders: `%sveltekit.head%`, `%sveltekit.body%`, `%sveltekit.assets%`, `%sveltekit.nonce%`, `%sveltekit.env.[NAME]%`, `%sveltekit.version%`

**error.html** placeholders: `%sveltekit.status%`, `%sveltekit.error.message%`

**package.json** requires `@sveltejs/kit`, `svelte`, `vite` as devDependencies with `"type": "module"`

### web-standards
SvelteKit builds on standard Web APIs (Fetch, Request, Response, Headers, FormData, Streams, URL, Web Crypto) available across modern browsers and server environments.

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

