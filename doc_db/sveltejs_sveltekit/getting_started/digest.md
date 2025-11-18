## Project Creation

Run `npx sv create my-app` to scaffold a new SvelteKit project. Start the dev server with `npm run dev` on localhost:5173.

## Core Architecture

- Pages are Svelte components in `src/routes`
- Server-renders on first visit for SEO/performance, then client-side app takes over
- Use Visual Studio Code with Svelte extension

## Project Structure

```
src/
├ lib/              # Utilities, components (via $lib)
│ └ server/         # Server-only code (via $lib/server)
├ params/           # Param matchers
├ routes/           # Application routes
├ app.html          # Page template with %sveltekit.head%, %sveltekit.body%, %sveltekit.assets%, %sveltekit.nonce%, %sveltekit.env.[NAME]%, %sveltekit.version%
├ error.html        # Error page with %sveltekit.status%, %sveltekit.error.message%
├ hooks.client.js   # Client hooks
├ hooks.server.js   # Server hooks
├ service-worker.js # Service worker
└ tracing.server.js # Observability
static/             # Static assets
package.json        # Requires @sveltejs/kit, svelte, vite as devDependencies
svelte.config.js    # Configuration
tsconfig.json       # Extends .svelte-kit/tsconfig.json
vite.config.js      # Uses @sveltejs/kit/vite plugin
```

## Rendering & Deployment Patterns

**Default**: SSR initial load, then CSR for navigation

**Static**: `adapter-static` for prerendering, or `prerender` option for selective pages. `adapter-vercel` supports ISR.

**SPA**: Client-side only with `adapter-auto` or serverless adapters

**Multi-page**: Set `csr = false` to render subsequent links on server, or use `data-sveltekit-reload` for specific links

**Separate backend**: Use `adapter-node` or serverless adapters

**Serverless**: `adapter-auto` (zero-config), `adapter-vercel`, `adapter-netlify`, `adapter-cloudflare`

**Own server/VPS/Container**: `adapter-node`

**Library**: `@sveltejs/package` with `sv create` library option

**PWA/Offline**: Full service worker support

**Mobile/Desktop**: Convert SPA with Tauri, Capacitor, Wails, or Electron. Use `bundleStrategy: 'single'` for HTTP/1 limitations

**Browser extension**: `adapter-static` or community adapters

**Embedded device**: `bundleStrategy: 'single'` to reduce concurrent requests

## Web APIs

SvelteKit builds on standard Web APIs: Fetch, Request, Response, Headers, FormData, Streams, URL, Web Crypto.

**Fetch**: Available in hooks, server routes, and browser. Special version in `load` functions and server hooks allows direct endpoint invocation during SSR without HTTP calls. Server-side `fetch` outside `load` requires explicit `cookie`/`authorization` headers. Relative URLs supported in `load` functions only.

**Request/Response**: Accessible as `event.request` in hooks and server routes. Handlers in `+server.js` return Response objects.

**Headers**: Read from `request.headers`, set in response:
```js
import { json } from '@sveltejs/kit';
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

**Streams**: ReadableStream, WritableStream, TransformStream for large/chunked responses

**URL**: Access query parameters via `url.searchParams` (URLSearchParams)

**Web Crypto**: `crypto.randomUUID()` for UUID generation