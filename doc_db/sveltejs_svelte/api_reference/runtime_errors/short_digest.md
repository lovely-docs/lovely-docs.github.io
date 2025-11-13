## Client Errors
- **async_derived_orphan**: Async deriveds must be created inside effects
- **bind_invalid_checkbox_value**: Use `bind:checked` not `bind:value` for checkboxes
- **bind_invalid_export**: Use `bind:this` then access property, not `bind:key`
- **bind_not_bindable**: Mark properties bindable with `let { key = $bindable() } = $props()`
- **component_api_changed/invalid_new**: Components are no longer classes in Svelte 5
- **derived_references_self**: Deriveds cannot reference themselves
- **each_key_duplicate**: Keyed each blocks need unique keys
- **effect_update_depth_exceeded**: Effect reads and writes same state. Use `untrack()` if necessary: `$effect(() => { count += 1; })`
- **invalid_snippet**: Use optional chaining: `{@render snippet?.()}`
- **state_unsafe_mutation**: Cannot update state in `$derived(...)`. Make everything derived instead
- **svelte_boundary_reset_onerror**: Use `await tick()` before calling reset in onerror

## Server Errors
- **await_invalid**: Async work in sync render. Await render or use `<svelte:boundary>` with pending snippet
- **html_deprecated**: Use `body` instead of `html` property

## Shared Errors
- **invalid_default_snippet**: Cannot use `{@render children(...)}` with `let:` directives
- **lifecycle_outside_component**: Lifecycle methods only work at top level of instance script
- **missing_context**: Context not set in parent component
- **snippet_without_render_tag**: Use `{@render snippet()}` not `{snippet}`