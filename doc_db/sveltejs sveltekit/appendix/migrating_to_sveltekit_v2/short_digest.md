## Key Breaking Changes

- `error()` and `redirect()` no longer need `throw`
- `cookies.set/delete/serialize()` require `path` parameter
- Top-level promises in load functions no longer auto-awaited; use `async/await`
- `goto()` rejects external URLs; use `window.location.href`
- Paths relative by default (`paths.relative: true`)
- `resolvePath()` → `resolveRoute()` (includes `base`)
- `preloadCode()` requires `base` prefix and takes single argument
- Dynamic env vars blocked during prerendering; use static vars
- `use:enhance` callbacks: `form`/`data` removed, use `formElement`/`formData`
- Forms with file inputs must have `enctype="multipart/form-data"`
- Node 18.13+, Svelte 4+, Vite 5+, TypeScript 5+ required
- `$app/stores` deprecated; migrate to `$app/state`