## Conditional Rendering with If Blocks

Wrap content in `{#if expression}...{/if}` to conditionally render it based on an expression.

```svelte
{#if answer === 42}
	<p>what was the question?</p>
{/if}
```

Add additional conditions with `{:else if expression}` and optionally end with `{:else}`:

```svelte
{#if porridge.temperature > 100}
	<p>too hot!</p>
{:else if 80 > porridge.temperature}
	<p>too cold!</p>
{:else}
	<p>just right!</p>
{/if}
```

Blocks can wrap elements or text within elements.