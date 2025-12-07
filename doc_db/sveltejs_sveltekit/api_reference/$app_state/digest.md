## Overview
SvelteKit provides three read-only state objects via the `$app/state` module (added in v2.12): `page`, `navigating`, and `updated`. These replace the older `$app/stores` module.

## navigating
A read-only object representing an in-progress navigation with properties: `from`, `to`, `type`, and optionally `delta` (when `type === 'popstate'`). All values are `null` when no navigation is occurring or during server rendering.

```js
import { navigating } from '$app/state';
// navigating.from, navigating.to, navigating.type, navigating.delta
```

## page
A read-only reactive object containing current page information:
- Combined `data` from all pages/layouts
- Current `form` prop value
- Page state set via `goto`, `pushState`, or `replaceState`
- Metadata: URL, route, parameters, error status

```svelte
<script>
	import { page } from '$app/state';
</script>

<p>Currently at {page.url.pathname}</p>

{#if page.error}
	<span class="red">Problem detected</span>
{:else}
	<span class="small">All systems operational</span>
{/if}
```

**Important:** Changes to `page` are only reactive with runes (`$derived`), not with legacy reactivity syntax (`$:`). Use `const id = $derived(page.params.id)` instead of `$: badId = page.params.id`.

On the server, values can only be read during rendering (not in `load` functions). In the browser, values can be read anytime.

## updated
A read-only reactive value initially `false`. When `version.pollInterval` is non-zero, SvelteKit polls for new app versions and sets `updated.current` to `true` when detected. Call `updated.check()` to force an immediate check.

```js
import { updated } from '$app/state';
// updated.current (boolean)
// updated.check() (Promise<boolean>)
```