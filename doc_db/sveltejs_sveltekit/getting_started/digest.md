## Creating a Project

Initialize with `npx sv create my-app`, then `npm run dev` starts dev server on localhost:5173. CLI scaffolds project and optionally sets up TypeScript. Each page is a Svelte component in `src/routes`. Pages are server-rendered on first visit for speed, then client-side app takes over. Recommended: VS Code with Svelte extension.

## Project Types & Deployment

SvelteKit supports multiple configurations:

- **Default (SSR+CSR)**: Server-side rendering for initial load (SEO, perceived performance), then client-side rendering for subsequent pages (faster navigation). Called transitional apps.
- **Static (SSG)**: Use `adapter-static` to prerender site. Prerender only some pages with prerender option. For large sites, use ISR with `adapter-vercel` to avoid long builds.
- **SPA**: Client-side only. Write backend in SvelteKit or separate language.
- **MPA**: Remove JavaScript with `csr = false` or use `data-sveltekit-reload` for specific links.
- **Separate backend**: Deploy frontend separately using `adapter-node` or serverless adapters.
- **Serverless**: Use `adapter-auto` (zero config), `adapter-vercel`, `adapter-netlify`, or `adapter-cloudflare`. Some offer edge option.
- **Own server/VPS**: Use `adapter-node`.
- **Container**: Use `adapter-node` with Docker/LXC.
- **Library**: Use `@sveltejs/package` with `sv create` library option.
- **PWA/Offline**: Full service worker support.
- **Mobile**: Convert SPA with Tauri or Capacitor. Use `bundleStrategy: 'single'` to limit concurrent requests.
- **Desktop**: Convert SPA with Tauri, Wails, or Electron.
- **Browser extension**: Use `adapter-static` or community adapters.
- **Embedded device**: Use `bundleStrategy: 'single'` for low-power devices with limited connections.

## Directory Structure

Standard layout:
```
my-project/
├ src/
│ ├ lib/                    [utilities, components; import via $lib]
│ │ └ server/              [server-only code; import via $lib/server]
│ ├ params/                [param matchers]
│ ├ routes/                [application routes]
│ ├ app.html               [page template with %sveltekit.* placeholders]
│ ├ error.html             [fallback error page]
│ ├ hooks.client.js        [client hooks]
│ ├ hooks.server.js        [server hooks]
│ ├ service-worker.js      [service worker]
│ └ instrumentation.server.js [observability setup]
├ static/                  [static assets served as-is]
├ tests/                   [Playwright tests]
├ package.json             [must include @sveltejs/kit, svelte, vite as devDependencies]
├ svelte.config.js         [Svelte/SvelteKit config]
├ tsconfig.json            [TypeScript config; extends .svelte-kit/tsconfig.json]
└ vite.config.js           [Vite config using @sveltejs/kit/vite plugin]
```

`app.html` placeholders: `%sveltekit.head%` (links/scripts), `%sveltekit.body%` (rendered markup), `%sveltekit.assets%` (asset path), `%sveltekit.nonce%` (CSP nonce), `%sveltekit.env.[NAME]%` (environment variables starting with publicPrefix), `%sveltekit.version%` (app version).

`error.html` placeholders: `%sveltekit.status%` (HTTP status), `%sveltekit.error.message%` (error message).

Unit tests with Vitest use `.test.js` extension in `src`. `.svelte-kit/` is auto-generated and can be deleted anytime.

## Web Standards APIs

Standard Web APIs available in hooks, server routes, and browser:

**fetch**: Special version in `load` functions, server hooks, and API routes allows invoking endpoints directly during SSR without HTTP calls while preserving credentials. Server-side `fetch` outside these contexts requires explicit `cookie`/`authorization` headers. Relative requests supported in special contexts.

**Request/Response/Headers**: `event.request` in hooks/server routes provides methods like `request.json()` and `request.formData()`. Set response headers via `response.headers`.

Example:
```js
import { json } from '@sveltejs/kit';

export function GET({ request }) {
	console.log(...request.headers);
	return json(
		{ userAgent: request.headers.get('user-agent') },
		{ headers: { 'x-custom-header': 'potato' } }
	);
}

export async function POST(event) {
	const body = await event.request.formData();
	return json({ name: body.get('name') ?? 'world' });
}
```

**Streams**: ReadableStream, WritableStream, TransformStream for large/chunked responses.

**URL/URLSearchParams**: `event.url` in hooks/server routes, `page.url` in pages, `from`/`to` in navigation callbacks. Access query params via `url.searchParams.get('foo')`.

**Web Crypto**: Available via `crypto` global. Example: `const uuid = crypto.randomUUID();`