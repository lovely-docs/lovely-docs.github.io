## svelte:boundary

Catches rendering/update/effect errors in children and removes their contents on error.

**`failed` snippet** - Rendered on error with `error` and `reset`:
```svelte
<svelte:boundary>
	<Component />
	{#snippet failed(error, reset)}
		<button onclick={reset}>Retry</button>
	{/snippet}
</svelte:boundary>
```

**`onerror` function** - Called with `error` and `reset` for error reporting or external state management.

Does not catch event handler or async errors. Requires `failed` or `onerror`.