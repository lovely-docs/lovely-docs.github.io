## Context API

Avoid prop-drilling by using `setContext(key, value)` in parent and `getContext(key)` in child components.

```svelte
// Parent
setContext('my-context', 'value');

// Child
const value = getContext('my-context');
```

Store reactive state in context by mutating objects rather than reassigning them. Wrap `setContext`/`getContext` in helper functions for type safety. Context is request-isolated (safe for SSR), unlike global module state.