## Client Errors
- **async_derived_orphan**: Async deriveds with `await` must be inside effects
- **bind_invalid_checkbox_value**: Use `bind:checked` not `bind:value` for checkboxes
- **bind_invalid_export**: Use `bind:this` then access property, not `bind:key` on exports
- **bind_not_bindable**: Mark properties bindable: `let { key = $bindable() } = $props()`
- **component_api_changed/invalid_new**: Components no longer classes in Svelte 5
- **derived_references_self**: Deriveds can't reference themselves
- **each_key_duplicate**: Keyed each blocks have duplicate keys
- **effect_in_teardown**: No runes in effect cleanup functions
- **effect_orphan**: Runes only in effects during initialization
- **effect_update_depth_exceeded**: Effect reads and writes same state (infinite loop). Fix: use normal variables or `untrack()`:
```js
let count = $state(0);
$effect(() => { count += 1; }); // ERROR
// Fix: let count = 0; or use untrack(() => count += 1)
```
- **flush_sync_in_effect**: Can't use `flushSync` inside effects
- **invalid_snippet**: Use optional chaining: `{@render snippet?.()}`
- **props_invalid_value**: Can't bind undefined to props with fallback
- **state_unsafe_mutation**: Can't update state in `$derived`, `$inspect`, or templates. Make everything derived or use `$effect`
- **svelte_boundary_reset_onerror**: Don't call `reset()` synchronously in `onerror`, await `tick()` first

## Server Errors
- **await_invalid**: Can't render async components synchronously; await or use `<svelte:boundary>`
- **lifecycle_function_unavailable**: Methods like `mount` unavailable on server

## Shared Errors
- **invalid_default_snippet**: Can't use `{@render children()}` with parent `let:` directives
- **lifecycle_outside_component**: Lifecycle methods only at top level of instance script
- **missing_context**: Context not set in parent via `setContext`
- **snippet_without_render_tag**: Use `{@render snippet()}` not `{snippet}`