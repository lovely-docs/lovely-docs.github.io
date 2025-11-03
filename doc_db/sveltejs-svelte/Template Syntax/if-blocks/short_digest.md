Conditionally render content with `{#if expression}...{/if}`. Chain conditions with `{:else if expression}` and `{:else}`:

```svelte
{#if porridge.temperature > 100}
	<p>too hot!</p>
{:else if 80 > porridge.temperature}
	<p>too cold!</p>
{:else}
	<p>just right!</p>
{/if}
```