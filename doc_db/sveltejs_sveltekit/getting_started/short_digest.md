## Quick Start

`npx sv create my-app` scaffolds a project. `npm run dev` starts dev server on localhost:5173.

## Structure

Pages are Svelte components in `src/routes`. Key files: `src/app.html` (page template), `src/error.html` (error page), `svelte.config.js`, `vite.config.js`.

## Rendering Patterns

Default: SSR initial load → CSR navigation. Also supports static generation, SPA, multi-page, serverless, containers, PWA, mobile/desktop apps, browser extensions.

## Web APIs

Standard APIs: Fetch (special server-side version for direct endpoint invocation), Request, Response, Headers, FormData, Streams, URL, Web Crypto.