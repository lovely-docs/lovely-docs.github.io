## Breaking Changes in SvelteKit 2

**Error and Redirect Handling**
- `error()` and `redirect()` no longer need to be thrown; calling them is sufficient
- Use `isHttpError` and `isRedirect` to distinguish them from unexpected errors in try blocks

**Cookie Path Requirement**
- `cookies.set()`, `cookies.delete()`, and `cookies.serialize()` now require a `path` parameter
- Most commonly use `path: '/'` for domain-wide cookies

**Top-level Promises**
- Load functions no longer auto-await top-level promise properties
- Use `async/await` and `Promise.all()` to prevent waterfalls:
```js
export async function load({ fetch }) {
  const [a, b] = await Promise.all([
    fetch(url1).then(r => r.json()),
    fetch(url2).then(r => r.json()),
  ]);
  return { a, b };
}
```

**Navigation Changes**
- `goto()` no longer accepts external URLs; use `window.location.href` instead
- `state` object now determines `$page.state` and must adhere to `App.PageState`

**Path Handling**
- Paths are now relative by default (controlled by `paths.relative`, defaults to `true`)
- `%sveltekit.assets%`, `base`, and `assets` behavior is now consistent

**Preload Functions**
- `preloadCode()` now requires paths prefixed with `base` (consistent with `preloadData`)
- `preloadCode()` takes a single argument instead of multiple

**Path Resolution**
- `resolvePath()` removed; use `resolveRoute()` from `$app/paths` instead (includes `base` automatically)

**Error Handling**
- `handleError` hooks now receive `status` and `message` properties
- `message` is safe for user exposure; `error.message` may contain sensitive info

**Environment Variables**
- Dynamic environment variables (`$env/dynamic/*`) cannot be used during prerendering
- Use `$env/static/*` instead; SvelteKit requests updated values from `/_app/env.js`

**Form Enhancements**
- `form` and `data` properties removed from `use:enhance` callbacks (use `formElement` and `formData`)
- Forms with file inputs must have `enctype="multipart/form-data"` or `use:enhance` will error

**Other Changes**
- `getRequest()` from `@sveltejs/kit/node` no longer throws on Content-Length errors (throws later)
- `vitePreprocess` no longer exported from `@sveltejs/kit/vite`; import from `@sveltejs/vite-plugin-svelte`
- Generated `tsconfig.json` uses `"moduleResolution": "bundler"` and `verbatimModuleSyntax`

**Dependency Requirements**
- Node 18.13+, Svelte 4+, Vite 5+, TypeScript 5+
- `@sveltejs/vite-plugin-svelte@3` now required as peer dependency
- Adapter minimum versions: cloudflare@3, cloudflare-workers@2, netlify@3, node@2, static@3, vercel@4

**SvelteKit 2.12+**
- `$app/stores` deprecated in favor of `$app/state` (Svelte 5 runes API)
- `page` object is now fine-grained; updates to `page.state` don't invalidate `page.data`