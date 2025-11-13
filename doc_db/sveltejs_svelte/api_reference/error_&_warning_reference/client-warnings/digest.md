## Client Warnings Reference

### assignment_value_stale
Assignment to a property using the nullish coalescing assignment operator (`??=`) will evaluate to the right-hand side value, not the assigned property. This causes unexpected behavior when chaining operations:

```js
let object = $state({ array: null });
function add() {
	(object.array ??= []).push(object.array.length); // pushes to [], but object.array is a proxy
}
```

Fix by separating into two statements:
```js
object.array ??= [];
object.array.push(object.array.length);
```

### await_reactivity_loss
State read in async functions after an `await` may not be tracked for reactivity. Svelte tracks state read before the `await`, but not state read in called functions:

```js
let a = Promise.resolve(1);
let b = 2;
async function sum() {
	return await a + b; // b is not tracked
}
let total = $derived(await sum());
```

Fix by passing values as parameters:
```js
async function sum(a, b) {
	return await a + b;
}
let total = $derived(await sum(a, b));
```

### await_waterfall
Multiple async deriveds create unnecessary waterfalls when not read immediately after resolution. Create promises first, then await them:

```js
let aPromise = $derived(one());
let bPromise = $derived(two());
let a = $derived(await aPromise);
let b = $derived(await bPromise);
```

### binding_property_non_reactive
Binding to a non-reactive property is not allowed.

### console_log_state
Logging `$state` proxies shows the proxy object, not the value. Use `$inspect()` or `$state.snapshot()` instead.

### event_handler_invalid
Event handler must be a function.

### hydration_attribute_changed
Certain attributes like `src` on `<img>` won't be updated during hydration. Ensure server and client render the same value, or use `svelte-ignore` comment.

### hydration_html_changed
`{@html}` block values that differ between server and client won't be updated during hydration. Ensure values match or use `svelte-ignore`.

### hydration_mismatch
Server-rendered HTML structure doesn't match client-rendered structure, preventing proper hydration.

### invalid_raw_snippet_render
`createRawSnippet` render function must return HTML for a single element.

### legacy_recursive_reactive_block
Migrated `$:` reactive blocks that both access and update the same value may cause recursive updates when converted to `$effect`.

### lifecycle_double_unmount
Attempted to unmount a component that wasn't mounted.

### ownership_invalid_binding
Parent component must use `bind:` when passing bindable props to child, not just property passing.

### ownership_invalid_mutation
Mutating unbound props is discouraged. Use `bind:` or callbacks instead, or mark props as `$bindable`.

### select_multiple_invalid_value
`<select multiple>` value must be an array, not a non-array value.

### state_proxy_equality_mismatch
`$state()` creates proxies with different identity than their values. Equality checks (`===`) will fail. Compare values created the same way or use `$state.raw()`.

### state_proxy_unmount
`unmount()` was called with a state proxy instead of a component. Use `$state.raw()` if the component needs to be reactive.

### svelte_boundary_reset_noop
`<svelte:boundary>` reset function only works the first time it's called.

### transition_slide_display
The `slide` transition doesn't work with `display: inline`, `display: table`, or `display: contents`.