## Client Warnings

**assignment_value_stale**: `??=` operator evaluates to right-hand side, not assigned property. Separate into two statements.

**await_reactivity_loss**: State read after `await` in called functions isn't tracked. Pass values as parameters.

**await_waterfall**: Multiple async deriveds create unnecessary waterfalls. Create promises first, then await.

**binding_property_non_reactive**: Can't bind to non-reactive properties.

**console_log_state**: Use `$inspect()` or `$state.snapshot()` instead of logging `$state` proxies.

**hydration_attribute_changed/hydration_html_changed**: Server/client values must match or use `svelte-ignore`.

**hydration_mismatch**: Server HTML structure doesn't match client structure.

**ownership_invalid_mutation**: Use `bind:` or callbacks instead of mutating unbound props, or mark as `$bindable`.

**state_proxy_equality_mismatch**: `$state()` proxies have different identity than values. Compare consistently or use `$state.raw()`.

**state_proxy_unmount**: Don't pass state proxies to `unmount()`, use `$state.raw()` if needed.

**transition_slide_display**: `slide` transition doesn't work with `display: inline`, `table`, or `contents`.