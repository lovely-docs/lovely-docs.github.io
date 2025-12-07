## Client Error Reference

**Reactivity**: `async_derived_orphan` (async deriveds need effects), `derived_references_self`, `effect_orphan` (effects only in effects), `effect_update_depth_exceeded` (effect reads/writes same state - use `untrack()`), `state_unsafe_mutation` (no state updates in deriveds - make everything derived instead).

**Binding**: `bind_invalid_checkbox_value` (use `bind:checked`), `bind_invalid_export` (use `bind:this`), `bind_not_bindable` (use `$bindable()`).

**Components**: `component_api_invalid_new` (no `new` in Svelte 5), `component_api_changed` (methods no longer valid).

**Other**: `each_key_duplicate`, `set_context_after_init`, `invalid_snippet` (use optional chaining), `svelte_boundary_reset_onerror` (await `tick()` before reset).