## {@render ...} tag

Renders a snippet. Expression can be an identifier or JavaScript expression:

```svelte
{@render sum(1, 2)}
{@render (cool ? coolSnippet : lameSnippet)()}
```

For optional snippets, use optional chaining or if/else:

```svelte
{@render children?.()}
{#if children}
	{@render children()}
{:else}
	<p>fallback</p>
{/if}
```