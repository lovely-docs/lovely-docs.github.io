## {@render ...} tag

Renders a snippet using the `{@render ...}` tag.

```svelte
{#snippet sum(a, b)}
	<p>{a} + {b} = {a + b}</p>
{/snippet}

{@render sum(1, 2)}
{@render sum(3, 4)}
```

The expression can be an identifier or arbitrary JavaScript expression:

```svelte
{@render (cool ? coolSnippet : lameSnippet)()}
```

### Optional snippets

If a snippet might be undefined (e.g., from a prop), use optional chaining:

```svelte
{@render children?.()}
```

Or use an if block with fallback content:

```svelte
{#if children}
	{@render children()}
{:else}
	<p>fallback content</p>
{/if}
```