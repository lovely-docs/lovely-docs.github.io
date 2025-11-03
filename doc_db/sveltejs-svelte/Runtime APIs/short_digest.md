**Stores:** `writable()`, `readable()`, `derived()`, `readonly()`, `get()` for reactive state. Any object with `.subscribe(fn)` works as a store.

**Context:** `setContext(key, value)` and `getContext(key)` for parent-child value passing without prop-drilling.

**Lifecycle:** `onMount()`, `onDestroy()`, `tick()`. Use `$effect` runes instead of deprecated beforeUpdate/afterUpdate.

**Component APIs:** `mount()`, `unmount()`, `render()` (SSR), `hydrate()` for imperative component control.