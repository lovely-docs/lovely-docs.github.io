## Runes

`$`-prefixed compiler keywords for Svelte's reactivity system:

- **$state**: Creates reactive state; arrays/objects become deeply reactive proxies. Use `$state.raw` for non-reactive, `$state.snapshot()` to convert to plain objects.
- **$derived**: Auto-updating derived state with `$derived.by()` for complex logic. Can temporarily reassign for optimistic UI.
- **$effect**: Runs side effects with automatic dependency tracking. Return teardown function for cleanup. Use `$effect.pre()` for pre-DOM updates, `$effect.root()` for manual control.
- **$props**: Receives component inputs with destructuring and defaults. `$props.id()` generates unique instance IDs.
- **$bindable**: Enables two-way binding for component props via `bind:` directive.
- **$inspect**: Dev-only reactive logging with `.with()` callback and `.trace()` for debugging.
- **$host**: Access host element in custom elements to dispatch events.