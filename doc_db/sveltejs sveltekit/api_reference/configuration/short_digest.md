## svelte.config.js Structure

```js
import adapter from '@sveltejs/adapter-auto';

const config = {
	kit: {
		adapter: adapter()
	}
};
export default config;
```

## Essential Options

**adapter** - Platform conversion during build.

**alias** - Import path mappings.

**appDir** - Asset directory (default: "_app").

**csp** - Content Security Policy with mode ('hash'|'nonce'|'auto'), directives, reportOnly.

**csrf** - CSRF protection: `checkOrigin` or `trustedOrigins` array (production only).

**env** - Environment variables: `dir`, `publicPrefix` ("PUBLIC_"), `privatePrefix` ("").

**inlineStyleThreshold** - Max CSS size to inline in `<style>`.

**outDir** - Build output (default: ".svelte-kit").

**output.bundleStrategy** - 'split' (lazy) | 'single' | 'inline' (no server).

**paths** - `assets` (CDN), `base` (root path), `relative` (SSR paths).

**prerender** - `entries`, `crawl`, `concurrency`, error handlers.

**router.type** - 'pathname' (default) | 'hash'.

**router.resolution** - 'client' (manifest) | 'server' (per-navigation).

**version** - `name` (deterministic string), `pollInterval` (ms).