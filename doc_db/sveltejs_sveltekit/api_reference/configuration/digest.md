## svelte.config.js Structure

The main configuration file at the project root. Extends `vite-plugin-svelte` options with a `kit` property for SvelteKit-specific settings.

```js
import adapter from '@sveltejs/adapter-auto';
const config = {
	kit: {
		adapter: adapter()
	}
};
export default config;
```

## Key Configuration Options

**adapter** - Runs during `vite build`, converts output for different platforms.

**alias** - Object mapping import paths to file/directory locations. Built-in `$lib` alias controlled by `config.kit.files.lib`.
```js
alias: {
	'my-file': 'path/to/my-file.js',
	'my-directory': 'path/to/my-directory',
	'my-directory/*': 'path/to/my-directory/*'
}
```

**appDir** (default: `"_app"`) - Directory for SvelteKit's static assets and internal routes. If `paths.assets` specified, creates two directories: `${paths.assets}/${appDir}` and `${paths.base}/${appDir}`.

**csp** - Content Security Policy configuration. Prevents XSS attacks by restricting resource loading sources.
```js
csp: {
	directives: { 'script-src': ['self'] },
	reportOnly: { 'script-src': ['self'], 'report-uri': ['/'] }
}
```
- `mode`: `'hash'` | `'nonce'` | `'auto'` - How to restrict inline scripts/styles. Auto uses hashes for prerendered, nonces for dynamic pages.
- Use `%sveltekit.nonce%` placeholder in `src/app.html` for manual script/link nonces.
- Prerendered pages use `<meta http-equiv>` tag (ignores `frame-ancestors`, `report-uri`, `sandbox`).
- Svelte transitions create inline `<style>` elements; must leave `style-src` unspecified or add `unsafe-inline`.

**csrf** - Cross-site request forgery protection.
- `checkOrigin` (default: `true`, deprecated) - Verify incoming origin header matches server origin for form submissions. Disable to allow cross-origin form submissions.
- `trustedOrigins` (default: `[]`) - Array of allowed origins for cross-origin form submissions (e.g., `https://payment-gateway.com`). Use `'*'` to trust all origins. Only applies in production.

**embedded** (default: `false`) - If `true`, app is embedded in larger app. Adds event listeners to parent of `%sveltekit.body%` instead of `window`, receives params from server instead of inferring from `location.pathname`. Multiple SvelteKit apps on same page not fully supported.

**env** - Environment variable configuration.
- `dir` (default: `"."`) - Directory to search for `.env` files.
- `publicPrefix` (default: `"PUBLIC_"`) - Prefix for client-safe environment variables (accessible via `$env/static/public` and `$env/dynamic/public`).
- `privatePrefix` (default: `""`, v1.21.0+) - Prefix for server-only variables (accessible via `$env/static/private` and `$env/dynamic/private`). Variables matching neither prefix are discarded.

**experimental** - Unstable features, not subject to semantic versioning.
- `tracing` (v2.31.0+, default: `{ server: false, serverFile: false }`) - OpenTelemetry tracing for `handle` hook, `load` functions, form actions, remote functions.
  - `server` (default: `false`) - Enable server-side span emission.
- `instrumentation` (v2.31.0+) - `server` (default: `false`) - Enable `instrumentation.server.js` for tracing/observability.
- `remoteFunctions` (default: `false`) - Enable experimental remote functions feature.

**files** (deprecated) - File locations within project.
- `src` (default: `"src"`, v2.28+) - Source code location.
- `assets` (default: `"static"`) - Static files with stable URLs (favicon, manifest).
- `hooks.client` (default: `"src/hooks.client"`) - Client hooks location.
- `hooks.server` (default: `"src/hooks.server"`) - Server hooks location.
- `hooks.universal` (default: `"src/hooks"`, v2.3.0+) - Universal hooks location.
- `lib` (default: `"src/lib"`) - Internal library, accessible as `$lib`.
- `params` (default: `"src/params"`) - Parameter matchers directory.
- `routes` (default: `"src/routes"`) - Route structure files.
- `serviceWorker` (default: `"src/service-worker"`) - Service worker entry point.
- `appTemplate` (default: `"src/app.html"`) - HTML response template.
- `errorTemplate` (default: `"src/error.html"`) - Fallback error response template.

**inlineStyleThreshold** (default: `0`) - Maximum CSS file size (UTF-16 code units) to inline in `<style>` block at HTML head. Reduces initial requests and improves First Contentful Paint but increases HTML size and reduces browser cache effectiveness.

**moduleExtensions** (default: `[".js", ".ts"]`) - File extensions SvelteKit treats as modules. Files not matching `config.extensions` or `config.kit.moduleExtensions` ignored by router.

**outDir** (default: `".svelte-kit"`) - Directory where SvelteKit writes files during `dev` and `build`. Exclude from version control.

**output** - Build output format options.
- `preloadStrategy` (default: `"modulepreload"`, v1.8.4+) - How to preload JavaScript modules for initial page:
  - `modulepreload` - Uses `<link rel="modulepreload">`. Best in Chromium, Firefox 115+, Safari 17+.
  - `preload-js` - Uses `<link rel="preload">`. Prevents waterfalls in Chromium/Safari but double-parses in Chromium, double-requests in Firefox. Good for iOS.
  - `preload-mjs` - Uses `<link rel="preload">` with `.mjs` extension. Prevents double-parsing in Chromium. Best overall performance if server serves `.mjs` with correct `Content-Type`.
- `bundleStrategy` (default: `'split'`, v2.13.0+) - How JavaScript/CSS files are loaded:
  - `'split'` - Multiple files loaded lazily as user navigates (recommended).
  - `'single'` - One `.js` bundle and one `.css` file for entire app.
  - `'inline'` - Inlines all JavaScript/CSS into HTML, usable without server.
  
  For `'split'`, adjust bundling with Vite's `build.rollupOptions.output.experimentalMinChunkSize` and `output.manualChunks`. For inlining assets, set Vite's `build.assetsInlineLimit` and import assets through Vite:
  ```js
  // vite.config.js
  export default defineConfig({
  	plugins: [sveltekit()],
  	build: { assetsInlineLimit: Infinity }
  });
  ```
  ```svelte
  // src/routes/+layout.svelte
  <script>
  	import favicon from './favicon.png';
  </script>
  <svelte:head>
  	<link rel="icon" href={favicon} />
  </svelte:head>
  ```

**paths** - URL path configuration.
- `assets` (default: `""`) - Absolute path where app files served from. Useful for storage buckets.
- `base` (default: `""`) - Root-relative path where app served from (e.g., `/base-path`). Must start but not end with `/` unless empty. Prepend to root-relative links using `base` from `$app/paths`: `<a href="{base}/your-page">Link</a>`.
- `relative` (default: `true`, v1.9.0+) - Use relative asset paths. If `true`, `base` and `assets` from `$app/paths` replaced with relative paths during SSR for portable HTML. If `false`, always root-relative unless `paths.assets` is external URL. Single-page app fallback pages always use absolute paths. Set to `false` if using `<base>` element.

**prerender** - Prerendering configuration (see page-options#prerender).
- `concurrency` (default: `1`) - Simultaneous pages to prerender. JS is single-threaded but useful when network-bound.
- `crawl` (default: `true`) - Follow links from `entries` to find pages to prerender.
- `entries` (default: `["*"]`) - Pages to prerender or start crawling from. `'*'` includes all routes with no required parameters, optional parameters as empty.
- `handleHttpError` (default: `"fail"`, v1.15.7+) - Handle HTTP errors during prerendering:
  - `'fail'` - Fail build.
  - `'ignore'` - Silently continue.
  - `'warn'` - Continue with warning.
  - `(details) => void` - Custom handler with `status`, `path`, `referrer`, `referenceType`, `message`. Throw to fail build.
  ```js
  handleHttpError: ({ path, referrer, message }) => {
  	if (path === '/not-found' && referrer === '/blog/how-we-built-our-404-page') return;
  	throw new Error(message);
  }
  ```
- `handleMissingId` (default: `"fail"`, v1.15.7+) - Handle hash links to missing `id` on destination page. Same options as `handleHttpError`.
- `handleEntryGeneratorMismatch` (default: `"fail"`, v1.16.0+) - Handle entry not matching generated route. Same options as `handleHttpError`.
- `handleUnseenRoutes` (default: `"fail"`, v2.16.0+) - Handle prerenderable routes not prerendered. Same options as `handleHttpError` but handler receives `routes` property with unprerendered routes.
- `origin` (default: `"http://sveltekit-prerender"`) - `url.origin` value during prerendering.

**router** - Client-side routing configuration.
- `type` (default: `"pathname"`, v2.14.0+) - Router type:
  - `'pathname'` - URL pathname determines route (default).
  - `'hash'` - `location.hash` determines route. Disables SSR/prerendering. Links must start with `#/`. Only recommended if pathname unavailable.
- `resolution` (default: `"client"`, v2.17.0+) - Route determination method:
  - `'client'` - Browser uses route manifest to determine route immediately. Manifest must load/parse before first navigation.
  - `'server'` - Server determines route for unvisited paths. Hides route list, enables middleware interception (A/B testing). Slightly slower for unvisited paths but mitigated by preloading. Prerendered routes have resolution prerendered.

**serviceWorker** - Service worker configuration (details not provided in excerpt).

**typescript** - TypeScript configuration.
- `config` (default: `(config) => config`, v1.3.0+) - Function to edit generated `tsconfig.json`. Mutate or return new config. Useful for extending shared `tsconfig.json` in monorepo. Paths should be relative to `.svelte-kit/tsconfig.json`.

**version** - Version management for client-side navigation. Detects new deployments and falls back to full-page navigation on errors.
- `name` - Current app version string. Must be deterministic (e.g., commit ref, not `Math.random()`). Defaults to build timestamp. Example using git commit hash:
  ```js
  import * as child_process from 'node:child_process';
  export default {
  	kit: {
  		version: {
  			name: child_process.execSync('git rev-parse HEAD').toString().trim()
  		}
  	}
  };
  ```
- `pollInterval` (default: `0`) - Milliseconds between version polls. If `0`, no polling. When polling detects new version, sets `updated.current` to `true`. Use with `beforeNavigate` to force full-page navigation:
  ```svelte
  <script>
  	import { beforeNavigate } from '$app/navigation';
  	import { updated } from '$app/state';
  	beforeNavigate(({ willUnload, to }) => {
  		if (updated.current && !willUnload && to?.url) {
  			location.href = to.url.href;
  		}
  	});
  </script>
  ```