## $effect

Browser-only functions that run when state updates. Track reactive values synchronously and re-run on dependency changes. Return teardown functions for cleanup.

```svelte
$effect(() => {
    // runs when dependencies change
    // can return cleanup function
});
```

**Lifecycle**: Runs after mount in microtask, batches multiple state changes, teardown runs before re-run and on destroy.

**Dependencies**: Only synchronous reads tracked; async reads (after `await`, `setTimeout`) ignored. Conditional code affects which values are dependencies.

**Variants**: `$effect.pre` (before DOM updates), `$effect.tracking()` (check if in tracking context), `$effect.root()` (manual control).

**Don't use for**: State synchronization—use `$derived` instead. Linking values—use callbacks or function bindings.