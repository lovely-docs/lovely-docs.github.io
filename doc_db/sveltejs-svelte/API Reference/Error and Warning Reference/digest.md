## Client-side Runtime Errors

**Binding**: Use `bind:checked` for checkboxes, `bind:this` for component access, mark properties with `$bindable()`.

**Component API (Svelte 5)**: Cannot call methods on instances or use `new` to instantiate.

**State**: Cannot mutate state in `$derived()` or template expressions; use `$effect` for side-effects. Derived values cannot reference themselves.

**Effects**: Only usable during component initialization; cannot be in cleanup functions or unowned derived values.

**Each blocks**: In runes mode use array index: `array[i] = 4` instead of `entry = 4`.

**Lifecycle methods**: `mount` and similar cannot be called during server render.

**Other**: Keyed each blocks need unique keys, hydration can fail, snippets need null checks, runes only in `.svelte` files.

## Client-side Runtime Warnings

**binding_property_non_reactive**: Binding targets non-reactive property.

**console_log_state**: Use `$inspect()` or `$state.snapshot()` instead of logging `$state` proxies.

**event_handler_invalid**: Event handler is not a function.

**hydration_mismatch**: Server/client values or DOM structure don't match. Ensure they match or use `svelte-ignore`. Force update by unsetting and resetting in `$effect`.

**invalid_raw_snippet_render**: `createRawSnippet` render must return single element HTML.

**ownership_invalid_binding**: Use `bind:` in parent instead of just passing property.

**ownership_invalid_mutation**: Use `bind:` or callbacks instead of mutating unbound props, or mark as `$bindable`.

**select_multiple_invalid_value**: `<select multiple>` value must be array or null/undefined.

**transition_slide_display**: `slide` transition requires `display: block/flex/grid`, not `inline/*` or `table/*`.

**state_proxy_equality_mismatch**: `$state()` proxies have different identity; compare consistently.

## Compiler Errors

**Runes**: `$derived()` cannot reference itself; use `$effect` for side-effects.

**Exports/Props**: Use `$props()` instead of `export let`; mark bindable properties with `$bindable()`.

**Bindings**: `bind_invalid_target` — cannot bind to non-reactive properties.

**Each blocks**: `each_item_invalid_assignment` — use array index: `array[i] = 4` instead of `entry = 4`.

**Slots**: Cannot mix `<slot>` and `{@render}` directives.

**Snippets**: Use `{@render snippet()}` not `{snippet}`; snippets cannot mix `{@render children(...)}` with parent `let:` directives.

**CSS**: Split `:global` and scoped selectors; `slide` transition requires `display: block/flex/grid`.

**Lifecycle**: Lifecycle methods must be called at top level of component script, not in functions.

**Stores**: Stores need `subscribe` method.

**Server context**: Methods like `mount` are unavailable on server; guard for client-only execution.

## Compiler Warnings

**Accessibility (a11y_*)**: No `accesskey` or `autofocus`; interactive elements need keyboard handlers and `tabindex`; labels need associated controls; media needs captions; ARIA attributes must match element roles.

**Code Quality**: Empty blocks; lowercase component names; unused CSS (use `:global` to preserve); deprecated syntax (`context="module"`, `<slot>`, `<svelte:component>`, `<svelte:self>`); reassigned state loses reactivity unless wrapped in function.