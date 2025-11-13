## Client-side Error Reference

Comprehensive list of runtime errors that can occur in Svelte applications:

**Reactivity & State**
- `async_derived_orphan`: Cannot use `await` in `$derived` outside effect tree. Async deriveds require effect context.
- `derived_references_self`: Derived values cannot reference themselves recursively.
- `state_unsafe_mutation`: Cannot update state inside `$derived`, `$inspect`, or template expressions. Use `$effect` for side effects instead.
- `state_descriptors_fixed`: Property descriptors on `$state` objects must have `value` and be `enumerable`, `configurable`, `writable`.
- `state_prototype_fixed`: Cannot set prototype of `$state` object.
- `effect_update_depth_exceeded`: Effect reads and writes same state causing infinite loop. Example: `$effect(() => { count += 1; })` or `$effect(() => { array.push('item'); })`. Use `untrack()` if state mutation is necessary.

**Effects**
- `effect_orphan`: Runes like `$effect` only work inside component initialization or other effects.
- `effect_in_teardown`: Cannot use runes inside effect cleanup functions.
- `effect_in_unowned_derived`: Effects cannot be created inside `$derived` unless the derived itself is in an effect.
- `effect_pending_outside_reaction`: `$effect.pending()` only works inside effects or deriveds.
- `flush_sync_in_effect`: Cannot call `flushSync()` inside an effect (only after state changes).

**Binding**
- `bind_invalid_checkbox_value`: Use `bind:checked` instead of `bind:value` for checkboxes.
- `bind_invalid_export`: Cannot bind to exported properties; use `bind:this` and access properties on instance instead.
- `bind_not_bindable`: Cannot bind to non-bindable properties. Mark as bindable: `let { key = $bindable() } = $props()`.
- `props_invalid_value`: Cannot bind to `undefined` when property has fallback value.
- `props_rest_readonly`: Rest element properties from `$props()` are readonly.

**Components**
- `component_api_changed`: Calling methods on component instances invalid in Svelte 5.
- `component_api_invalid_new`: Cannot instantiate components with `new` in Svelte 5. Set `compatibility.componentApi: 4` for legacy support.

**Loops & Keys**
- `each_key_duplicate`: Keyed each blocks have duplicate keys at specified indexes.

**Context & Lifecycle**
- `set_context_after_init`: `setContext` must be called during component initialization, not in effects or after `await`.
- `lifecycle_legacy_only`: Legacy lifecycle functions cannot be used in runes mode.

**Snippets & Rendering**
- `invalid_snippet`: Cannot render null/undefined snippet; use optional chaining `{@render snippet?.()}`.

**Error Boundaries**
- `svelte_boundary_reset_onerror`: `<svelte:boundary>` reset function cannot be called synchronously in onerror; use `await tick()` first.

**Async & Experimental**
- `experimental_async_fork`: `fork()` requires `experimental.async` compiler option.
- `fork_timing`: Cannot create fork inside effect or when state changes pending.
- `fork_discarded`: Cannot commit already-discarded fork.

**Other**
- `rune_outside_svelte`: Runes only available in `.svelte` and `.svelte.js/ts` files.
- `get_abort_signal_outside_reaction`: `getAbortSignal()` only works inside effects or deriveds.
- `hydration_failed`: Application hydration failed.