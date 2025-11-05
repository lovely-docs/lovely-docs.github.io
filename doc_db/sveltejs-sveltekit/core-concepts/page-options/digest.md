## prerender
Export `export const prerender = true` from `+page.js`, `+page.server.js`, `+server.js`, or layout files to generate static HTML at build time. Use `prerender = false` to disable for specific pages when enabled globally. Use `prerender = 'auto'` to allow dynamic server rendering as fallback.

Pages must return identical content for all users to be prerenderable. Cannot prerender pages with form actions. Specify which dynamic routes to prerender via `entries()` function:
```js
export function entries() {
  return [{ slug: 'hello-world' }, { slug: 'another-blog-post' }];
}
export const prerender = true;
```

## ssr
Set `export const ssr = false` to skip server-side rendering and send an empty shell to the client instead. Useful for pages using browser-only APIs. Setting in root layout converts entire app to SPA.

## csr
Set `export const csr = false` to disable client-side rendering. Results in no JavaScript shipped to client—pages work with HTML/CSS only, no script tags, no form progressive enhancement, full-page navigation only.

Can conditionally enable during development:
```js
import { dev } from '$app/environment';
export const csr = dev;
```

## trailingSlash
Control trailing slash behavior with `export const trailingSlash = 'never' | 'always' | 'ignore'` (default: `'never'`). Affects both routing and prerendering output structure.

## config
Export adapter-specific configuration as `export const config = { ... }`. Objects merge at top level only, allowing child pages to override parent layout values without repeating unchanged properties.