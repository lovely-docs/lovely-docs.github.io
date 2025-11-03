## Stores
Reactive state accessed with `$` prefix. Svelte 5 runes reduce need for stores, but they remain useful for async data streams and manual control.

**Built-in store types:**
- `writable(initial, startFn?)` - Mutable store with `.set()` and `.update()`
- `readable(initial, startFn)` - Immutable store
- `derived(stores, callback, initial?)` - Computed store
- `readonly(store)` - Read-only wrapper
- `get(store)` - Get current value without subscribing

Any object with `.subscribe(fn)` implementing the store contract can be a store.

## Context API
Pass values from parent to child components without prop-drilling using `setContext(key, value)` and `getContext(key)`.

Store reactive state by mutating objects rather than reassigning. Wrap context helpers for type safety. Context is request-isolated, safe for SSR.

## Lifecycle Hooks
- `onMount()` - Runs when component mounts to DOM. Can return synchronous cleanup function. Doesn't run on server.
- `onDestroy()` - Runs before component unmounts. Only lifecycle hook that runs on server.
- `tick()` - Returns promise resolving after pending state changes apply.

Use `$effect` and `$effect.pre` runes instead of deprecated `beforeUpdate`/`afterUpdate` for granular state-change reactions.

## Component APIs
- `mount(Component, options)` - Instantiate and mount component to DOM
- `unmount(component)` - Remove component, returns promise resolving after transitions
- `render(Component, props)` - Server-only, returns `{ body, head }` for SSR
- `hydrate(Component, options)` - Like mount but reuses server-rendered HTML