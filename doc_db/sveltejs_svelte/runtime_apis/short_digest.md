**Stores**: Reactive containers via `svelte/store` — `writable(initial, startFn)`, `readable(initial, startFn)`, `derived(stores, callback)`, `readonly(store)`, `get(store)`. Use `$store` in components for auto-subscription. Store contract: `.subscribe(fn)` returns unsubscribe function, optional `.set()`.

**Context**: `setContext(key, value)` / `getContext(key)` / `hasContext(key)` / `getAllContexts()` for passing values down tree. Type-safe via `createContext<T>()`. Reactive state objects work directly; request-isolated for SSR.

**Lifecycle**: `onMount(fn)` (after DOM mount, optional cleanup), `onDestroy(fn)` (before unmount, runs on server), `tick()` (promise for DOM updates). Replace deprecated `beforeUpdate`/`afterUpdate` with `$effect.pre`/`$effect`.

**Imperative API**: `mount(Component, {target, props})`, `unmount(app, {outro})`, `render(Component, {props})` (server), `hydrate(Component, {target, props})` (server reuse). Effects don't run during mount/hydrate — use `flushSync()`.