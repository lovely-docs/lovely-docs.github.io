## Quick Start

Run `npx sv create my-app` then `npm run dev` (localhost:5173).

## Project Structure

```
src/
├ lib/              # Library code ($lib alias)
├ routes/           # Pages (Svelte components)
├ app.html          # Page template
├ error.html        # Error page
├ hooks.client.js   # Client hooks
├ hooks.server.js   # Server hooks
static/             # Static assets
```

## Deployment

Adapters configure rendering and deployment: `adapter-node` (own servers), `adapter-static` (static), `adapter-vercel/netlify/cloudflare` (serverless).

## Web APIs

SvelteKit uses standard Web APIs: Fetch, Request/Response, Headers, FormData, Streams, URL, Web Crypto.

```js
export function GET({ request }) {
	return json({ userAgent: request.headers.get('user-agent') }, 
		{ headers: { 'x-custom-header': 'potato' } });
}
```