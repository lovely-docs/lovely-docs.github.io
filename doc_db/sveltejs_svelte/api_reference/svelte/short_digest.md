## Svelte 5 API

**Mounting**: `mount(component, options)`, `hydrate()`, `unmount()`

**Lifecycle**: `onMount()`, `onDestroy()` (use `$effect` for `beforeUpdate`/`afterUpdate`)

**State**: `tick()`, `settled()`, `flushSync()`, `untrack()`

**Context**: `setContext()`, `getContext()`, `createContext()` (type-safe), `getAllContexts()`, `hasContext()`

**Events**: `createEventDispatcher()` (deprecated, use callback props)

**Advanced**: `fork()` for speculative state changes, `getAbortSignal()` for fetch cancellation, `createRawSnippet()`

**Types**: `Component<Props, Exports>`, `ComponentProps<Comp>`, `Snippet<Parameters>`, `MountOptions`