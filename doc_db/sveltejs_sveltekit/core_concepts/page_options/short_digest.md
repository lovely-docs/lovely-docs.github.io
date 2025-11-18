## Page Options

Export options from `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js` to control rendering behavior. Child layouts override parent values.

**prerender**: Generate static HTML at build time. Use `true`, `false`, or `'auto'`. For dynamic routes, export an `entries()` function:
```js
export function entries() { return [{ slug: 'hello-world' }]; }
export const prerender = true;
```

**ssr**: Disable server-side rendering (`export const ssr = false`).

**csr**: Disable client-side rendering—no JavaScript shipped (`export const csr = false`).

**trailingSlash**: Control trailing slashes with `'never'` (default), `'always'`, or `'ignore'`.

**config**: Adapter-specific configuration (`export const config = { runtime: 'edge' }`). Top-level merge only.