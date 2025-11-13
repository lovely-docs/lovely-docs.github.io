

## Pages

### stores
Reactive state management through stores with automatic subscription handling via $ prefix, plus API for creating writable, readable, and derived stores.

## Stores

Access reactive values using `$` prefix in components. Svelte automatically subscribes/unsubscribes.

```svelte
<script>
	import { writable } from 'svelte/store';
	const count = writable(0);
	$count = 2; // calls count.set(2)
</script>
```

**API:**
- `writable(initial, onSubscribe?)` - Readable/writable store with `.set()` and `.update()`
- `readable(initial, onSubscribe)` - Read-only store
- `derived(store(s), callback, initial?)` - Derived store from dependencies
- `readonly(store)` - Wrap store as read-only
- `get(store)` - Synchronously read value

With Svelte 5 runes, prefer `$state` objects for shared state and runes in `.svelte.js` files for logic extraction. Stores remain useful for async data streams and manual control.

### context
Svelte's context API enables parent-to-child value passing without prop-drilling, with support for reactive state and type safety.

Context allows child components to access parent values without prop-drilling.

**Basic usage:**
```svelte
// Parent
import { setContext } from 'svelte';
setContext('my-context', 'value');

// Child
import { getContext } from 'svelte';
const value = getContext('my-context');
```

**Reactive state:** Store `$state` objects in context and mutate them (don't reassign).

**Type-safe:** Use `createContext<T>()` to get typed getter/setter functions without needing keys.

**Advantage over global state:** Context is request-isolated, preventing data leakage in SSR.

### lifecycle_hooks
Svelte 5 lifecycle hooks: onMount (initialization), onDestroy (cleanup), tick (DOM sync), with beforeUpdate/afterUpdate deprecated in favor of $effect.pre/$effect.

## Lifecycle Hooks

**`onMount`** - Runs when component mounts to DOM. Can return cleanup function (must be synchronous).

**`onDestroy`** - Runs before component unmounts. Only lifecycle hook that runs on server.

**`tick`** - Returns promise that resolves after DOM updates. Use instead of `afterUpdate`.

**Deprecated** - `beforeUpdate`/`afterUpdate` replaced by `$effect.pre`/`$effect` for granular reactivity.

Example: Auto-scroll chat on new messages using `$effect.pre`:
```svelte
$effect.pre(() => {
  messages; // trigger only on message changes
  tick().then(() => viewport.scrollTo(0, viewport.scrollHeight));
});
```

### imperative-component-api
API for imperatively creating, mounting, rendering, and hydrating Svelte components.

## Core Functions
- **`mount(Component, { target, props })`** — Instantiate and mount component to DOM. Effects don't run; use `flushSync()` if needed.
- **`unmount(app, { outro })`** — Remove component, optionally playing transitions. Returns Promise.
- **`render(Component, { props })`** — Server-only; returns `{ body, head }` for SSR.
- **`hydrate(Component, { target, props })`** — Mount component reusing SSR HTML. Effects don't run; use `flushSync()` if needed.

