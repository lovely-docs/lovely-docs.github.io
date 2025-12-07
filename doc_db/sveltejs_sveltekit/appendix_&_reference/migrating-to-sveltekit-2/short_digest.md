## Key Breaking Changes

**error() and redirect()** no longer need `throw`:
```js
error(500, 'msg'); // not throw error(...)
```

**Cookies require path**:
```js
cookies.set(name, value, { path: '/' });
```

**Top-level promises not auto-awaited**:
```js
export async function load({ fetch }) {
	const [a, b] = await Promise.all([fetch(url1), fetch(url2)]);
	return { a, b };
}
```

**goto()** no external URLs; use `window.location.href`

**Paths relative by default** (`paths.relative: true`)

**resolvePath → resolveRoute**:
```js
import { resolveRoute } from '$app/paths';
const path = resolveRoute('/blog/[slug]', { slug });
```

**use:enhance** removes `form`/`data` props; use `formElement`/`formData`

**Forms with files need** `enctype="multipart/form-data"`

**tsconfig.json** stricter; use `alias` in `svelte.config.js` instead of `paths`/`baseUrl`

**Dependencies**: Node 18.13+, svelte@4, vite@5, typescript@5, updated adapters

**$app/stores deprecated** → use `$app/state` (Svelte 5 runes)