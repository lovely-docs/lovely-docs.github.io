

## Pages

### creating-a-project
Initialize project with `npx sv create my-app`, run `npm run dev` on localhost:5173; pages are Svelte components in src/routes with server-side rendering then client-side takeover; VS Code + Svelte extension recommended.

## Creating a Project

Start a new SvelteKit app with:
```sh
npx sv create my-app
cd my-app
npm run dev
```

The CLI scaffolds a new project and optionally sets up TypeScript and other tooling. See CLI docs for options and integrations page for additional tooling setup.

`npm run dev` starts the development server on localhost:5173 (install dependencies first if not done during creation).

### Core Concepts

- Each page is a Svelte component
- Create pages by adding files to `src/routes` directory
- Pages are server-rendered on first visit for speed, then client-side app takes over

### Editor Setup

Recommended: Visual Studio Code with the Svelte extension. Other editors also supported via sveltesociety.dev resources.

### project_types
SvelteKit deployment options: SSR+CSR (default), SSG (adapter-static/ISR), SPA, MPA, separate backend, serverless (adapter-auto/vercel/netlify/cloudflare), node, containers, libraries, PWA, mobile (Tauri/Capacitor), desktop (Tauri/Wails/Electron), browser extensions, embedded devices; use bundleStrategy: 'single' for limited connections.

SvelteKit supports multiple rendering and deployment configurations:

**Default rendering**: Server-side rendering (SSR) for initial page load (improves SEO and perceived performance), then client-side rendering (CSR) for subsequent pages (faster navigation, no flash). Called transitional apps.

**Static site generation (SSG)**: Use `adapter-static` to fully prerender your site. Can prerender only some pages with the prerender option and use a different adapter for dynamic rendering of others. For very large sites, use Incremental Static Regeneration (ISR) with `adapter-vercel` to avoid long build times.

**Single-page app (SPA)**: Exclusively use client-side rendering. Can write backend in SvelteKit or another language. Skip server file documentation if using no backend or separate backend.

**Multi-page app (MPA)**: Not typical for SvelteKit, but can remove JavaScript with `csr = false` to render subsequent links on server, or use `data-sveltekit-reload` for specific links.

**Separate backend**: Deploy SvelteKit frontend separately from backend (Go, Java, PHP, Ruby, Rust, C#, etc.) using `adapter-node` or serverless adapters. Can also deploy as SPA served by backend (worse SEO/performance). Skip server file documentation.

**Serverless app**: Use `adapter-auto` (zero config), `adapter-vercel`, `adapter-netlify`, or `adapter-cloudflare`. Some adapters offer edge option for edge rendering and improved latency.

**Own server/VPS**: Use `adapter-node`.

**Container**: Use `adapter-node` with Docker or LXC.

**Library**: Use `@sveltejs/package` add-on with `sv create` library option.

**Offline/PWA**: Full service worker support.

**Mobile app**: Convert SPA to mobile app with Tauri or Capacitor. Use `bundleStrategy: 'single'` to limit concurrent requests (e.g., Capacitor uses HTTP/1).

**Desktop app**: Convert SPA to desktop app with Tauri, Wails, or Electron.

**Browser extension**: Use `adapter-static` or community adapters for browser extensions.

**Embedded device**: Use `bundleStrategy: 'single'` to reduce concurrent requests on low-power devices with limited connections.

### project_structure
Standard SvelteKit directory layout: src/{lib,params,routes,app.html,error.html,hooks.{client,server}.js,service-worker.js,instrumentation.server.js}, static/, tests/, plus config files (package.json, svelte.config.js, tsconfig.json, vite.config.js); .svelte-kit/ auto-generated.

## Directory Structure

A typical SvelteKit project has this layout:

```
my-project/
├ src/
│ ├ lib/
│ │ ├ server/          [server-only lib files]
│ │ └ [lib files]
│ ├ params/            [param matchers]
│ ├ routes/            [routes]
│ ├ app.html
│ ├ error.html
│ ├ hooks.client.js
│ ├ hooks.server.js
│ ├ service-worker.js
│ └ tracing.server.js
├ static/              [static assets]
├ tests/               [tests]
├ package.json
├ svelte.config.js
├ tsconfig.json
└ vite.config.js
```

## src Directory

The `src` directory contains the project core. Everything except `src/routes` and `src/app.html` is optional.

- **lib**: Library code (utilities, components). Import via `$lib` alias or package with `svelte-package`
  - **server**: Server-only code. Import via `$lib/server` alias. SvelteKit prevents client-side imports
- **params**: Param matchers for advanced routing
- **routes**: Application routes. Can colocate route-specific components here
- **app.html**: Page template with placeholders:
  - `%sveltekit.head%` — `<link>` and `<script>` elements, plus `<svelte:head>` content
  - `%sveltekit.body%` — rendered page markup (should be inside a `<div>` or similar, not directly in `<body>`)
  - `%sveltekit.assets%` — either `paths.assets` or relative path to `paths.base`
  - `%sveltekit.nonce%` — CSP nonce for manually included links/scripts
  - `%sveltekit.env.[NAME]%` — replaced at render time with environment variable (must start with `publicPrefix`, usually `PUBLIC_`). Fallback: `''`
  - `%sveltekit.version%` — app version from configuration
- **error.html**: Fallback error page with placeholders:
  - `%sveltekit.status%` — HTTP status
  - `%sveltekit.error.message%` — error message
- **hooks.client.js**: Client hooks
- **hooks.server.js**: Server hooks
- **service-worker.js**: Service worker
- **instrumentation.server.js**: Observability setup (requires adapter support, runs before app code)

Unit tests with Vitest live in `src` with `.test.js` extension.

## Other Directories

- **static**: Static assets served as-is (robots.txt, favicon.png, etc.)
- **tests**: Playwright browser tests (if added during setup)

## Configuration Files

- **package.json**: Must include `@sveltejs/kit`, `svelte`, `vite` as devDependencies. Includes `"type": "module"` for ES modules (`.cjs` for CommonJS)
- **svelte.config.js**: Svelte and SvelteKit configuration
- **tsconfig.json** or **jsconfig.json**: TypeScript configuration. SvelteKit generates `.svelte-kit/tsconfig.json` which your config extends
- **vite.config.js**: Vite configuration using `@sveltejs/kit/vite` plugin

## Generated Files

- **.svelte-kit**: Generated during development/build (configurable as `outDir`). Can be deleted anytime; regenerated on next dev/build

### web-standards
Standard Web APIs available in SvelteKit: fetch (with SSR-optimized version), Request/Response/Headers, FormData, Streams, URL/URLSearchParams, Web Crypto.

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

