## Directory Layout

A SvelteKit project has this structure:

```
my-project/
├ src/
│ ├ lib/              # Library code, utilities, components (imported via $lib)
│ │ └ server/         # Server-only code (imported via $lib/server)
│ ├ params/           # Param matchers
│ ├ routes/           # Application routes
│ ├ app.html          # Page template
│ ├ error.html        # Error page
│ ├ hooks.client.js   # Client hooks
│ ├ hooks.server.js   # Server hooks
│ ├ service-worker.js # Service worker
│ └ tracing.server.js # Observability setup
├ static/             # Static assets (robots.txt, favicon.png, etc.)
├ tests/              # Playwright tests
├ package.json
├ svelte.config.js
├ tsconfig.json
└ vite.config.js
```

## Key Files

**src/app.html** - Page template with placeholders:
- `%sveltekit.head%` - Links and scripts
- `%sveltekit.body%` - Rendered page markup (wrap in div, not directly in body)
- `%sveltekit.assets%` - Asset path
- `%sveltekit.nonce%` - CSP nonce
- `%sveltekit.env.[NAME]%` - Environment variables (PUBLIC_ prefix)
- `%sveltekit.version%` - App version

**src/error.html** - Error page with placeholders:
- `%sveltekit.status%` - HTTP status
- `%sveltekit.error.message%` - Error message

**package.json** - Must include `@sveltejs/kit`, `svelte`, and `vite` as devDependencies. Uses `"type": "module"` for ES modules.

**svelte.config.js** - Svelte and SvelteKit configuration

**tsconfig.json** - TypeScript configuration (extends generated `.svelte-kit/tsconfig.json`)

**vite.config.js** - Vite configuration using `@sveltejs/kit/vite` plugin

## Generated Files

`.svelte-kit/` directory is auto-generated during dev/build and can be safely deleted.