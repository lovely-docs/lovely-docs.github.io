## Client Errors

**async_derived_orphan**: Cannot create `$derived(...)` with `await` outside an effect tree. Deriveds run lazily and can be garbage collected, but async deriveds need an effect to call the promise proactively, so they must be created inside another effect.

**bind_invalid_checkbox_value**: Use `bind:checked` instead of `bind:value` for checkbox inputs.

**bind_invalid_export**: Cannot bind to exported properties using `bind:key`. Use `bind:this` to get the component instance, then access the property directly.

**bind_not_bindable**: Cannot bind to non-bindable properties. Mark properties as bindable with `let { key = $bindable() } = $props()`.

**component_api_changed**: Calling methods on component instances is invalid in Svelte 5. See migration guide.

**component_api_invalid_new**: Cannot instantiate components with `new`. Set `compatibility.componentApi` to `4` for legacy support.

**derived_references_self**: Derived values cannot reference themselves recursively.

**each_key_duplicate**: Keyed each blocks must have unique keys.

**effect_in_teardown**: Cannot use runes inside effect cleanup functions.

**effect_in_unowned_derived**: Effects cannot be created inside `$derived` values that weren't themselves created inside an effect.

**effect_orphan**: Runes can only be used inside effects or during component initialization.

**effect_pending_outside_reaction**: `$effect.pending()` only works inside effects or deriveds.

**effect_update_depth_exceeded**: Maximum update depth exceeded, typically when an effect reads and writes the same state. Example: `$effect(() => { count += 1; })` creates an infinite loop. Use `untrack()` to read state without adding it as a dependency if you must write to state in an effect.

**experimental_async_fork**: `fork(...)` requires `experimental.async` compiler option to be `true`.

**flush_sync_in_effect**: Cannot use `flushSync()` inside an effect. Call it after state changes but not during effect execution.

**fork_discarded**: Cannot commit a fork that was already discarded.

**fork_timing**: Cannot create a fork inside an effect or when state changes are pending.

**get_abort_signal_outside_reaction**: `getAbortSignal()` only works inside effects or deriveds.

**hydration_failed**: Failed to hydrate the application.

**invalid_snippet**: Cannot render a snippet that is null or undefined. Use optional chaining: `{@render snippet?.()}`.

**lifecycle_legacy_only**: Legacy lifecycle methods cannot be used in runes mode.

**props_invalid_value**: Cannot bind undefined to a prop that has a fallback value.

**props_rest_readonly**: Rest element properties from `$props()` are readonly.

**rune_outside_svelte**: Runes only work inside `.svelte` and `.svelte.js/ts` files.

**set_context_after_init**: `setContext` must be called during component initialization, not in effects or after await.

**state_descriptors_fixed**: Property descriptors on `$state` objects must have `value` and be `enumerable`, `configurable`, and `writable`.

**state_prototype_fixed**: Cannot set prototype of `$state` objects.

**state_unsafe_mutation**: Cannot update state inside `$derived(...)`, `$inspect(...)`, or template expressions. Solution: make everything derived instead of mixing state and derived values.

**svelte_boundary_reset_onerror**: A `<svelte:boundary>` reset function cannot be called synchronously in the onerror callback. Use `await tick()` before calling reset.

## Server Errors

**await_invalid**: Encountered async work while rendering synchronously. Either await the render result or wrap the await in a `<svelte:boundary>` with a pending snippet.

**html_deprecated**: The `html` property of server render results is deprecated. Use `body` instead.

**lifecycle_function_unavailable**: Methods like `mount` cannot be invoked on the server. Avoid calling them during render.

## Shared Errors

**invalid_default_snippet**: Cannot use `{@render children(...)}` if parent uses `let:` directives. Use named snippets instead.

**invalid_snippet_arguments**: Snippets should only be instantiated via `{@render ...}`.

**lifecycle_outside_component**: Lifecycle methods can only be used during component initialization at the top level of the instance script.

**missing_context**: Context was not set in a parent component. Use `setContext()` in a parent before calling `getContext()` in a child.

**snippet_without_render_tag**: Attempted to render a snippet without `{@render}`. Change `{snippet}` to `{@render snippet()}`.

**store_invalid_shape**: Value is not a store with a `subscribe` method.

**svelte_element_invalid_this_value**: The `this` prop on `<svelte:element>` must be a string if defined.