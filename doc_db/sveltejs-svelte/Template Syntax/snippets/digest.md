## Snippets

Snippets are reusable chunks of markup declared with `{#snippet name(params)}...{/snippet}`. They can have parameters with default values and destructuring, but not rest parameters.

### Basic Usage

```svelte
{#snippet figure(image)}
	<figure>
		<img src={image.src} alt={image.caption} />
		<figcaption>{image.caption}</figcaption>
	</figure>
{/snippet}

{#each images as image}
	{#if image.href}
		<a href={image.href}>{@render figure(image)}</a>
	{:else}
		{@render figure(image)}
	{/if}
{/each}
```

### Scope

Snippets can reference values from their enclosing scope (script, each blocks, etc). They're visible to siblings and their children in the same lexical scope. Snippets can reference themselves and each other recursively.

### Passing to Components

Snippets are values and can be passed as props:

```svelte
<!-- Explicit props -->
<Table data={fruits} {header} {row} />

<!-- Implicit props - snippets declared inside component become props -->
<Table data={fruits}>
	{#snippet header()}...{/snippet}
	{#snippet row(d)}...{/snippet}
</Table>
```

Any content inside component tags that isn't a snippet declaration implicitly becomes the `children` snippet:

```svelte
<!-- App.svelte -->
<Button>click me</Button>

<!-- Button.svelte -->
<script>
	let { children } = $props();
</script>
<button>{@render children()}</button>
```

### Optional Snippets

Use optional chaining or conditional rendering for optional snippet props:

```svelte
{@render children?.()}

{#if children}
	{@render children()}
{:else}
	fallback content
{/if}
```

### Typing

Import `Snippet` from `'svelte'` and use it as a generic type where the type argument is a tuple of parameter types:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { data, row }: {
		data: any[];
		row: Snippet<[any]>;
	} = $props();
</script>
```

### Exporting

Snippets at the top level can be exported from `<script module>` if they don't reference non-module script declarations:

```svelte
<script module>
	export { add };
</script>

{#snippet add(a, b)}
	{a} + {b} = {a + b}
{/snippet}
```

### Advanced

The `createRawSnippet` API allows programmatic snippet creation for advanced use cases. Snippets replace the deprecated slots feature from Svelte 4.