## svelte.config.js Configuration

Main config file at project root with `kit` property for SvelteKit settings.

**Core options:**
- `adapter` - Converts build output for different platforms
- `alias` - Map import paths to files/directories
- `appDir` - Directory for static assets and internal routes (default: `"_app"`)
- `csp` - Content Security Policy with `mode` (hash/nonce/auto), `directives`, `reportOnly`
- `csrf` - CSRF protection: `checkOrigin` (default true), `trustedOrigins` array
- `embedded` - If true, app embedded in larger app
- `env` - Environment variables: `dir`, `publicPrefix` (default `"PUBLIC_"`), `privatePrefix`
- `experimental` - Unstable features: `tracing`, `instrumentation`, `remoteFunctions`
- `files` - File locations (deprecated): `src`, `assets`, `hooks.*`, `lib`, `params`, `routes`, `serviceWorker`, `appTemplate`, `errorTemplate`
- `inlineStyleThreshold` - Max CSS size to inline in HTML head
- `moduleExtensions` - File extensions treated as modules (default: `[".js", ".ts"]`)
- `outDir` - Build output directory (default: `".svelte-kit"`)
- `output.preloadStrategy` - Module preloading: `modulepreload` (default), `preload-js`, `preload-mjs`
- `output.bundleStrategy` - Bundle format: `split` (default, lazy load), `single`, `inline`
- `paths.assets` - Absolute path for asset serving
- `paths.base` - Root-relative app path (e.g., `/base-path`)
- `paths.relative` - Use relative asset paths (default: true)
- `prerender` - Prerendering: `concurrency`, `crawl`, `entries`, `handleHttpError`, `handleMissingId`, `handleEntryGeneratorMismatch`, `handleUnseenRoutes`, `origin`
- `router.type` - `pathname` (default) or `hash`
- `router.resolution` - `client` (default) or `server` route determination
- `typescript.config` - Function to modify generated `tsconfig.json`
- `version.name` - Deterministic version string for deployment detection
- `version.pollInterval` - Poll interval for version changes (default: 0)