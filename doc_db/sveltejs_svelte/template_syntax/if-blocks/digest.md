## Conditional Rendering with {#if}

Wrap content in an if block to conditionally render it based on an expression.

**Basic if:**
```svelte
{#if answer === 42}
	<p>what was the question?</p>
{/if}
```

**if with else if and else:**
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