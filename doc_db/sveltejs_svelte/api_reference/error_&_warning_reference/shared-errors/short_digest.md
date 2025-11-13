## Common Svelte Errors

- **invalid_default_snippet**: Can't mix `{@render children(...)}` with `let:` directives
- **invalid_snippet_arguments**: Snippets must use `{@render ...}`
- **lifecycle_outside_component**: Lifecycle methods only work at top level of instance script
- **missing_context**: Context `get` fails if `set` wasn't called in parent
- **snippet_without_render_tag**: Use `{@render snippet()}` not `{snippet}`
- **store_invalid_shape**: Store must have `subscribe` method
- **svelte_element_invalid_this_value**: `<svelte:element this={...}>` requires string value