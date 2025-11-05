## Breaking Changes

**`redirect` and `error` no longer require throwing:**
```js
// Before
throw error(500, 'something went wrong');
// After
error(500, 'something went wrong');
```

**`path` is required when setting cookies:**
```js
cookies.set(name, value, { path: '/' });
cookies.delete(name, { path: '/' });
```

**Top-level promises are no longer awaited:**
```js
// Before: automatically awaited
export function load({ fetch }) {
  const response = fetch(url).then(r => r.json());
  return { response };
}
// After: must explicitly await
export async function load({ fetch }) {
  const response = await fetch(url).then(r => r.json());
  return { response };
}
```

**`goto()` no longer accepts external URLs** — use `window.location.href` instead.

**Paths are now relative by default** — `paths.relative` defaults to `true` for more portable apps.

**`preloadCode` arguments must be prefixed with `base`** and now takes a single argument instead of multiple.

**`resolvePath` replaced with `resolveRoute`:**
```js
// Before
import { resolvePath } from '@sveltejs/kit';
import { base } from '$app/paths';
const path = base + resolvePath('/blog/[slug]', { slug });
// After
import { resolveRoute } from '$app/paths';
const path = resolveRoute('/blog/[slug]', { slug });
```

**Improved error handling** — `handleError` hooks now receive `status` and `message` properties.

**Dynamic environment variables cannot be used during prerendering** — use `$env/static/public` and `$env/static/private` instead.

**`form` and `data` removed from `use:enhance` callbacks** — use `formElement` and `formData` instead.

**Forms with file inputs must have `enctype="multipart/form-data"`** or SvelteKit will throw an error.

**`vitePreprocess` no longer exported from `@sveltejs/kit/vite`** — import from `@sveltejs/vite-plugin-svelte` instead.

**Minimum dependency versions:** Node 18.13+, Svelte 4, Vite 5, TypeScript 5, and updated adapter versions.

**SvelteKit 2.12: `$app/stores` deprecated** in favor of `$app/state`:
```svelte
// Before
import { page } from '$app/stores';
{$page.data}
// After
import { page } from '$app/state';
{page.data}
```

Use `npx sv migrate sveltekit-2` to automatically apply most changes.