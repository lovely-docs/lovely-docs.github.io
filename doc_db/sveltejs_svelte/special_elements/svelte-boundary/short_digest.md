## svelte:boundary

Error boundary and async state handler for Svelte components (5.3.0+).

**Properties:**
- `pending` snippet: shown while `await` expressions resolve
- `failed` snippet: rendered on error with `error` and `reset` function
- `onerror` handler: called on error for tracking/logging

**Example:**
```svelte
<svelte:boundary onerror={(e, r) => report(e)}>
	<p>{await data}</p>
	{#snippet pending()}<p>loading...</p>{/snippet}
	{#snippet failed(error, reset)}<button onclick={reset}>retry</button>{/snippet}
</svelte:boundary>
```

**Limitations:** Only catches rendering/effect errors, not event handlers or async callbacks.