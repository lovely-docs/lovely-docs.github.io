## svelte:boundary

A special element that creates error boundaries and handles async state in Svelte components.

### Use Cases

**1. Handle rendering errors with fallback UI:**
```svelte
<svelte:boundary>
	<FlakyComponent />
	{#snippet failed(error, reset)}
		<button onclick={reset}>oops! try again</button>
	{/snippet}
</svelte:boundary>
```

**2. Show pending UI while awaiting async expressions:**
```svelte
<svelte:boundary>
	<p>{await delayed('hello!')}</p>
	{#snippet pending()}
		<p>loading...</p>
	{/snippet}
</svelte:boundary>
```

**3. Track errors with external service:**
```svelte
<svelte:boundary onerror={(error, reset) => report(error)}>
	<FlakyComponent />
</svelte:boundary>
```

**4. Handle errors outside the boundary:**
```svelte
<script>
	let error = $state(null);
	let reset = $state(() => {});
	function onerror(e, r) { error = e; reset = r; }
</script>

<svelte:boundary {onerror}>
	<FlakyComponent />
</svelte:boundary>

{#if error}
	<button onclick={() => { error = null; reset(); }}>try again</button>
{/if}
```

### Properties

- `pending` snippet: shown when boundary is created, remains visible until all `await` expressions resolve. Not shown for subsequent async updates.
- `failed` snippet: rendered when error is thrown, receives `error` and `reset` function. Can be passed explicitly or declared inside the boundary.
- `onerror` handler: called with `error` and `reset` arguments. Errors thrown inside `onerror` propagate to parent boundaries.

### Important Notes

- Only catches errors during rendering and effects, not in event handlers or after `setTimeout`/async work
- When boundary handles an error, existing content is removed
- Available since Svelte 5.3.0