## Page Options

Export options from `+page.js`, `+page.server.js`, `+layout.js`, `+layout.server.js` to control rendering per-page/layout. Child values override parent values.

**prerender**: Generate static HTML at build time. `true`/`false`/`'auto'`. Crawls links from entry points; specify additional routes via `entries()` function or config. Cannot prerender pages with form actions or that access `url.searchParams`.

**ssr**: Disable server rendering (`export const ssr = false`). Renders empty shell; useful for browser-only code but not recommended. Setting in root layout makes entire app SPA.

**csr**: Disable client-side rendering (`export const csr = false`). No JavaScript shipped; works HTML/CSS only. Can conditionally enable in dev: `export const csr = dev`.

**trailingSlash**: `'never'` (default), `'always'`, or `'ignore'`. Affects prerendering output structure.

**config**: Adapter-specific configuration object. Top-level keys merged from layouts to pages.

**entries**: Export async function from dynamic route to specify prerender parameter combinations.