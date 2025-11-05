## Key Changes

- `error()` and `redirect()` no longer need `throw`
- `cookies.set/delete` require `path` parameter
- Top-level promises must be explicitly `await`ed
- `goto()` rejects external URLs
- `preloadCode` requires `base` prefix
- `resolvePath` → `resolveRoute`
- Dynamic env vars blocked during prerendering
- `$app/stores` deprecated → use `$app/state`
- Forms with file inputs need `enctype="multipart/form-data"`
- Node 18.13+, Svelte 4, Vite 5, TypeScript 5 required

Run `npx sv migrate sveltekit-2` for automatic migration.