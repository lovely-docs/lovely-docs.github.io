## Snippets

Snippets are reusable chunks of markup declared with `{#snippet name()}...{/snippet}` syntax. They can accept parameters with default values and destructuring, but not rest parameters.

### Basic Usage

```svelte
{#snippet figure(image)}
	<figure>
		<img src={image.src} alt={image.caption} />
		<figcaption>{image.caption}</figcaption>
	</figure>
{/snippet}

{#each images as image}
	{@render figure(image)}
{/each}
```

### Scope

Snippets can reference values from their lexical scope (script tag, parent blocks). They're visible to siblings and their children in the same scope. Snippets can reference themselves and each other recursively.

### Passing to Components

Snippets are values and can be passed as props:

```svelte
<Table data={fruits} {header} {row} />
```

Snippets declared directly inside a component implicitly become props on that component. Any non-snippet content inside component tags implicitly becomes the `children` snippet.

### Optional Snippets

Use optional chaining or conditional rendering for optional snippet props:

```svelte
{@render children?.()}
{#if children}{@render children()}{:else}fallback{/if}
```

### Typing

Import `Snippet` from `'svelte'` and use it as a generic type where the type argument is a tuple of parameter types:

```svelte
<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	let { data, row }: { data: T[]; row: Snippet<[T]> } = $props();
</script>
```

### Exporting

Top-level snippets can be exported from `<script module>` if they don't reference non-module script declarations (requires Svelte 5.5.0+).

### Programmatic Creation

Use `createRawSnippet` API for advanced programmatic snippet creation.

### Slots Deprecation

Snippets replace the deprecated Svelte 4 slots feature with more power and flexibility.