## Client Error Reference

Runtime errors in Svelte:

**State & Reactivity**: `async_derived_orphan` (await outside effect), `derived_references_self`, `state_unsafe_mutation` (update in derived/template), `effect_update_depth_exceeded` (infinite loop from reading/writing same state)

**Effects**: `effect_orphan` (outside component init), `effect_in_teardown`, `effect_in_unowned_derived`, `effect_pending_outside_reaction`, `flush_sync_in_effect`

**Binding**: `bind_invalid_checkbox_value` (use bind:checked), `bind_invalid_export` (use bind:this), `bind_not_bindable` (mark with $bindable()), `props_invalid_value`, `props_rest_readonly`

**Components**: `component_api_changed` (Svelte 5), `component_api_invalid_new` (no new keyword)

**Other**: `each_key_duplicate`, `set_context_after_init`, `invalid_snippet`, `svelte_boundary_reset_onerror`, `rune_outside_svelte`, `hydration_failed`