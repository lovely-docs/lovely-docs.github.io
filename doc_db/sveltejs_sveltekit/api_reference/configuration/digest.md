## svelte.config.js

Project configuration lives in `svelte.config.js` at the root. The config object is used by SvelteKit and other Svelte tooling.

```js
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
```

## Key Configuration Options

**adapter** - Runs during `vite build`, converts output for different platforms.

**alias** - Object mapping import paths to file locations. Built-in `$lib` alias is controlled by `config.kit.files.lib`.

**appDir** - Directory for SvelteKit assets (default: `"_app"`). If `paths.assets` is specified, creates two directories: `${paths.assets}/${appDir}` and `${paths.base}/${appDir}`.

**csp** - Content Security Policy configuration with `mode` ('hash' | 'nonce' | 'auto'), `directives`, and `reportOnly`. SvelteKit augments directives with nonces/hashes for inline styles/scripts. Use `%sveltekit.nonce%` placeholder in `src/app.html` for manual scripts.

**csrf** - CSRF protection via `checkOrigin` (default: true, deprecated) or `trustedOrigins` array. Only applies in production.

**embedded** - If true, adds event listeners to parent of `%sveltekit.body%` instead of `window`.

**env** - Environment variables: `dir` (search location), `publicPrefix` (default: "PUBLIC_"), `privatePrefix` (default: "").

**experimental** - Unstable features: `tracing` (OpenTelemetry), `instrumentation`, `remoteFunctions`.

**files** - Deprecated. Locations of source files (src, assets, hooks, lib, params, routes, serviceWorker, appTemplate, errorTemplate).

**inlineStyleThreshold** - Max CSS file size (UTF-16 code units) to inline in `<style>` block. Improves First Contentful Paint but increases HTML size.

**moduleExtensions** - File extensions treated as modules (default: `[".js", ".ts"]`).

**outDir** - Build output directory (default: `".svelte-kit"`).

**output** - Build format options:
- `preloadStrategy`: 'modulepreload' (default, best for modern browsers) | 'preload-js' | 'preload-mjs'
- `bundleStrategy`: 'split' (default, lazy load) | 'single' (one bundle) | 'inline' (no server needed)

**paths** - URL configuration:
- `assets` - Absolute path for serving files (e.g., CDN)
- `base` - Root-relative path where app is served (e.g., `/base-path`). Use `base` from `$app/paths` in links.
- `relative` - Use relative asset paths during SSR (default: true)

**prerender** - Prerendering options:
- `concurrency` - Simultaneous pages (default: 1)
- `crawl` - Follow links from entries (default: true)
- `entries` - Pages to prerender (default: `["*"]`)
- `handleHttpError`, `handleMissingId`, `handleEntryGeneratorMismatch`, `handleUnseenRoutes` - Error handlers ('fail' | 'ignore' | 'warn' | custom function)
- `origin` - URL origin during prerendering (default: "http://sveltekit-prerender")

**router** - Client-side routing:
- `type`: 'pathname' (default) | 'hash' (no SSR/prerendering)
- `resolution`: 'client' (default, loads manifest) | 'server' (server determines route per navigation)

**typescript** - `config` function to modify generated `tsconfig.json`.

**version** - Version management for deployments:
- `name` - App version string (must be deterministic, e.g., git commit hash)
- `pollInterval` - Poll interval in ms for version changes (default: 0). When detected, sets `updated.current` to true.