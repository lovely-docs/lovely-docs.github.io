## Setup

Install `@sveltejs/adapter-cloudflare` and configure in `svelte.config.js` with options for config path, platformProxy, fallback behavior, and routes.

## Cloudflare Workers

Create `wrangler.jsonc` with `main: ".svelte-kit/cloudflare/_worker.js"` and `assets` binding.

## Cloudflare Pages

Build command: `npm run build`, output: `.svelte-kit/cloudflare`. Use SvelteKit server endpoints instead of `/functions` directory.

## Runtime APIs

Access bindings via `platform.env` after installing `@cloudflare/workers-types` and declaring in `src/app.d.ts`.

## Troubleshooting

- Enable Node.js: `"compatibility_flags": ["nodejs_compat"]`
- File access: Use `read()` from `$app/server` instead of `fs`
- Large libraries: Import client-side only