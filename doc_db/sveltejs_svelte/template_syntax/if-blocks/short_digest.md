Use `{#if expression}...{/if}` to conditionally render content. Chain conditions with `{:else if expression}` and optionally end with `{:else}`.

```svelte
{#if porridge.temperature > 100}
	<p>too hot!</p>
{:else if 80 > porridge.temperature}
	<p>too cold!</p>
{:else}
	<p>just right!</p>
{/if}
```