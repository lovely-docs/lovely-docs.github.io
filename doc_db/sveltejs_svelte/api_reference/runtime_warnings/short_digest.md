## Client Warnings

- **assignment_value_stale**: `??=` evaluates to RHS, not assigned property. Separate statements.
- **await_reactivity_loss**: State after `await` not tracked. Pass as function parameters.
- **await_waterfall**: Create promises first, then await them.
- **console_log_state**: Use `$inspect()` or `$state.snapshot()` instead of logging proxies.
- **hydration_attribute_changed/hydration_html_changed**: Server/client values must match; won't update during hydration.
- **ownership_invalid_mutation**: Use `bind:` or `$bindable` instead of mutating unbound props.
- **state_proxy_equality_mismatch**: `$state()` proxies have different identity: `value === $state(value)` is false.
- **state_proxy_unmount**: Don't pass `$state` proxies to `unmount()`.
- **transition_slide_display**: `slide` requires `display: block/flex/grid`.

## Shared Warnings

- **state_snapshot_uncloneable**: `$state.snapshot()` can't clone DOM elements, returns original.