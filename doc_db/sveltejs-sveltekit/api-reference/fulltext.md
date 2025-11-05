

## Pages

### hooks
Server-side hooks module for intercepting and customizing request/response handling in SvelteKit.

The `@sveltejs/kit/hooks` module provides server-side hooks (`handle`, `handleError`, `handleFetch`) for intercepting and customizing the request/response lifecycle. Define them in `hooks.server.js` at your project root.

### node-polyfills
Polyfills module for using browser APIs in Node.js server-side SvelteKit environments.

Module that provides Node.js polyfills for browser APIs in SvelteKit server-side contexts.

### node
Node.js runtime module for SvelteKit server deployment and SSR.

Node.js runtime adapter for SvelteKit server-side rendering and backend deployment.

### vite-integration
Module for integrating Vite as the build tool in SvelteKit projects.

Vite plugin module for SvelteKit that provides build system integration and configuration utilities.

### $app∕environment
Module for accessing environment variables and runtime information in SvelteKit.

The `$app/environment` module provides access to environment variables and runtime information in SvelteKit applications, allowing you to detect build modes and access environment configuration.

### $app∕forms
Module for managing form submissions and form-related utilities in SvelteKit.

The `$app/forms` module provides utilities for handling form submissions and form data in SvelteKit applications.

### $app∕navigation
Navigation utilities for programmatic routing and data invalidation in SvelteKit.

The `$app/navigation` module provides `goto()` for programmatic navigation, `invalidateAll()` to re-run all load functions, and `invalidate(url)` to invalidate specific data dependencies.

### $app∕paths
Module providing access to configured application base and assets paths.

The `$app/paths` module exports `base` and `assets` paths configured in `svelte.config.js`. Use `base` for routing and `assets` for static resources.

### $app∕server
Module reference for server-side utilities in SvelteKit applications.

Server-side module providing utilities and APIs for server-only operations in SvelteKit. Available in hooks, routes, and server load functions.

### $app∕state
Read-only state objects available via $app/state module: page, navigating, and updated (SvelteKit 2.12+)

The `$app/state` module (added in 2.12) exports three read-only state objects: `page`, `navigating`, and `updated`. Use `$app/stores` for earlier SvelteKit versions.

### $app∕stores
$app/stores is a deprecated module for accessing application state via stores; use $app/state in SvelteKit 2.12+.

Legacy module providing store-based state equivalents. Use `$app/state` instead for SvelteKit 2.12+.

### $app∕types
Auto-generated TypeScript types for type-safe access to routes, pathnames, and parameters in your SvelteKit app.

## Generated Route and Asset Types

Auto-generated TypeScript utilities for type-safe route handling:

- **Asset**: Union of static files plus dynamic imports
- **RouteId**: All route IDs in your app
- **Pathname**: All valid pathnames
- **ResolvedPathname**: Pathnames with base path prefix
- **RouteParams**: Get parameters for a route: `RouteParams<'/blog/[slug]'>` → `{ slug: string }`
- **LayoutParams**: Route parameters including optional child route params

### $env∕dynamic∕private
Access private environment variables at runtime in SvelteKit server-side code.

Module for accessing private environment variables at runtime on the server side. Use for sensitive configuration like API keys and database credentials.

### $env∕dynamic∕public
Runtime access to public environment variables in SvelteKit applications.

The `$env/dynamic/public` module provides runtime access to public environment variables (prefixed with `PUBLIC_`) in both server and client code.

```javascript
import { env } from '$env/dynamic/public';
console.log(env.PUBLIC_API_URL);
```

### $env∕static∕private
Module for accessing private, server-only environment variables that are statically replaced at build time.

Server-only module for accessing private environment variables at build time. Statically replaced during build, never exposed to client. Use for sensitive secrets like API keys and credentials.

### $env∕static∕public
Access public environment variables in SvelteKit applications via the $env/static/public module.

Module for accessing public environment variables (prefixed with `PUBLIC_`) that are statically injected at build time and safe to expose in client-side code.

### $lib-import-alias
$lib is an automatic import alias for the src/lib directory in SvelteKit projects.

`$lib` is an automatic import alias pointing to `src/lib`. Customize its target in the config file.

```svelte
import Component from '$lib/Component.svelte';
```

### $service-worker
Module for accessing and configuring service worker functionality in SvelteKit.

The `$service-worker` module provides access to service worker functionality in SvelteKit applications.

### configuration
SvelteKit projects are configured via svelte.config.js file with a kit property that accepts various configuration options.

Configuration lives in `svelte.config.js` at project root. The `kit` property configures SvelteKit with options like adapter selection:

```js
import adapter from '@sveltejs/adapter-auto';

const config = {
	kit: { adapter: adapter() }
};

export default config;
```

### command-line-interface
SvelteKit leverages Vite's CLI for development and building, with an additional svelte-kit sync command for generating project configuration and types.

SvelteKit uses Vite CLI via npm scripts (`vite dev`, `vite build`, `vite preview`). The `svelte-kit sync` command generates `tsconfig.json` and `./$types` definitions, running automatically as the `prepare` script.

### types
SvelteKit auto-generates typed `$types` modules for routes to provide type-safe params, load data, and actions without manual type annotations.

SvelteKit generates `.d.ts` files for routes that export typed `RequestHandler`, `Load`, `PageData`, `LayoutData`, and `ActionData`. Import types from `./$types` instead of manually typing params. Helper types `PageProps` and `LayoutProps` (v2.16.0+) combine data with form/children. Your `tsconfig.json` must extend `./.svelte-kit/tsconfig.json`. `$lib` aliases `src/lib` and `$lib/server` prevents client-side imports.

