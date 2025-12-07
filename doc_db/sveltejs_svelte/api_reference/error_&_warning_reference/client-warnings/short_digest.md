Reference for 18 client-side warnings in Svelte:

- **assignment_value_stale**: `??=` and similar operators evaluate to RHS, not final state. Separate into two statements.
- **await_reactivity_loss**: State read after `await` in async functions isn't tracked. Pass as parameters instead.
- **await_waterfall**: Multiple `$derived(await ...)` create unnecessary waterfalls. Create promises first, then await.
- **binding_property_non_reactive**: Binding to non-reactive property.
- **console_log_state**: Logging `$state` proxies shows proxy, not value. Use `$inspect()` or `$state.snapshot()`.
- **event_handler_invalid**: Event handler not a function.
- **hydration_attribute_changed**: Attributes like `src` won't update on hydration. Match server/client or force update in `$effect`.
- **hydration_html_changed**: `{@html}` value changes between server/client won't update. Same fix as above.
- **hydration_mismatch**: Server HTML structure doesn't match client.
- **invalid_raw_snippet_render**: `createRawSnippet` render must return single element HTML.
- **legacy_recursive_reactive_block**: Migrated `$:` blocks reading and updating same value may recurse as `$effect`.
- **lifecycle_double_unmount**: Unmounting unmounted component.
- **ownership_invalid_binding**: Child binding not declared in parent. Use `bind:` in parent.
- **ownership_invalid_mutation**: Mutating unbound props discouraged. Use `bind:` or `$bindable`.
- **select_multiple_invalid_value**: `<select multiple>` value must be array, null, or undefined.
- **state_proxy_equality_mismatch**: `$state()` proxies have different identity than original. Compare consistently.
- **state_proxy_unmount**: `unmount()` called with `$state` proxy. Use `$state.raw()` if needed.
- **svelte_boundary_reset_noop**: `<svelte:boundary>` reset only works first call. Don't store reference outside.