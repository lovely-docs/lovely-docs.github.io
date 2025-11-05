## Directory structure

A SvelteKit project has the following layout:

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
├ tests/              # Playwright browser tests
├ package.json
├ svelte.config.js
├ tsconfig.json
└ vite.config.js
```

## Key files

**src/app.html** - Page template with placeholders:
- `%sveltekit.head%` - Links and scripts
- `%sveltekit.body%` - Rendered page markup (wrap in div, not directly in body)
- `%sveltekit.assets%` - Asset path
- `%sveltekit.nonce%` - CSP nonce
- `%sveltekit.env.[NAME]%` - Environment variables (must start with PUBLIC_)
- `%sveltekit.version%` - App version

**src/error.html** - Error page with placeholders:
- `%sveltekit.status%` - HTTP status
- `%sveltekit.error.message%` - Error message

**package.json** - Must include `@sveltejs/kit`, `svelte`, and `vite` as devDependencies. Uses `"type": "module"` for ES modules.

**svelte.config.js** - Svelte and SvelteKit configuration

**tsconfig.json** - TypeScript configuration (extends generated `.svelte-kit/tsconfig.json`)

**vite.config.js** - Vite configuration using `@sveltejs/kit/vite` plugin

## Generated files

**.svelte-kit** - Auto-generated directory (can be deleted, regenerated on dev/build)