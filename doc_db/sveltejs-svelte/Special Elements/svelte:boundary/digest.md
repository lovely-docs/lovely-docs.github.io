## svelte:boundary

Error boundary component that catches errors during rendering, updating, and effect execution within its children. When an error occurs, the boundary's contents are removed.

**Note:** Only catches errors in rendering/updating/effects. Does not catch errors in event handlers, setTimeout, or async work.

### Properties

**`failed` snippet** - Rendered when an error occurs, receives `error` and `reset` function:
```svelte
<svelte:boundary>
	<FlakyComponent />
	{#snippet failed(error, reset)}
		<button onclick={reset}>Try again</button>
	{/snippet}
</svelte:boundary>
```

**`onerror` function** - Called with `error` and `reset` arguments. Useful for error reporting or managing error state outside the boundary:
```svelte
<script>
	let error = $state(null);
	let reset = $state(() => {});

	function onerror(e, r) {
		error = e;
		reset = r;
	}
</script>

<svelte:boundary {onerror}>
	<FlakyComponent />
</svelte:boundary>

{#if error}
	<button onclick={() => {
		error = null;
		reset();
	}}>Try again</button>
{/if}
```

At least one of `failed` or `onerror` must be provided. Errors inside `onerror` are handled by parent boundaries if they exist.