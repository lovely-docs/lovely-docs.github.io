## $app/state Module

Three read-only state objects available via `$app/state` (added in SvelteKit 2.12):

### navigating
Represents an in-progress navigation with properties: `from`, `to`, `type`, and `delta` (if `type === 'popstate'`). Returns `null` when no navigation is occurring or during server rendering.

### page
Reactive object with current page information:
- `data`: combined data from all pages/layouts
- `form`: current form prop value
- `state`: page state set through `goto`, `pushState`, or `replaceState`
- `url`, `route`, `params`: metadata about current location and route

Must use runes for reactivity; legacy `$:` syntax won't reflect changes:
```svelte
<script>
  import { page } from '$app/state';
  const id = $derived(page.params.id); // Correct
  $: badId = page.params.id; // Won't update
</script>
```

On server: readable only during rendering (not in `load` functions). In browser: readable anytime.

### updated
Reactive value initially `false`. When `version.pollInterval` is non-zero, SvelteKit polls for new app versions and sets `updated.current` to `true` when detected. Call `updated.check()` to force immediate check.