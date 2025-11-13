## Stores
Reactive state via `writable()`, `readable()`, `derived()`. Access with `$` prefix. Custom stores need `.subscribe()` method.

## Context
Parent-to-child value passing with `setContext(key, value)` / `getContext(key)`. Use `createContext<T>()` for type safety.

## Lifecycle
`onMount()` - runs after mount with optional cleanup. `onDestroy()` - runs before unmount. `tick()` - promise resolving after DOM updates. Replace `beforeUpdate`/`afterUpdate` with `$effect.pre`/`$effect`.

## Imperative API
`mount(Component, { target, props })` - mount to DOM. `unmount(component)` - remove. `render(Component, { props })` - SSR. `hydrate(Component, { target, props })` - rehydrate SSR output.