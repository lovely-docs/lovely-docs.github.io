## Snippets

Reusable markup chunks declared with `{#snippet name(params)}...{/snippet}` and rendered with `{@render name()}`.

**Passing to components:**
```svelte
<!-- Explicit -->
<Table {header} {row} />

<!-- Implicit - snippets inside component become props -->
<Table>
	{#snippet header()}...{/snippet}
	{#snippet row(d)}...{/snippet}
</Table>

<!-- Content becomes children snippet -->
<Button>click me</Button>
```

**Typing:**
```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	let { row }: { row: Snippet<[any]> } = $props();
</script>
```

**Optional snippets:** Use `{@render children?.()}` or `{#if children}` for fallback content.

**Exporting:** Export from `<script module>` if not referencing non-module declarations.