## Common Svelte Errors

- **invalid_default_snippet**: Can't use `{@render children()}` with `let:` directives; use named snippets instead
- **invalid_snippet_arguments**: Snippets only instantiated via `{@render ...}`
- **lifecycle_outside_component**: Lifecycle methods (e.g., `onMount`) must be called at top level of instance script, not in functions
- **missing_context**: `createContext()` `get` throws if `set` wasn't called in parent
- **snippet_without_render_tag**: Use `{@render snippet()}` not `{snippet}` to render snippets to DOM
- **store_invalid_shape**: Store must have `subscribe` method
- **svelte_element_invalid_this_value**: `<svelte:element this={...}>` requires string value