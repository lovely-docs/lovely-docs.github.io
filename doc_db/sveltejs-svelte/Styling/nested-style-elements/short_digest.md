Only one top-level `<style>` tag per component is allowed. Nested `<style>` tags inside elements or logic blocks are inserted as-is without scoping, so they affect the entire DOM.

```svelte
<div>
	<style>
		div { color: red; }
	</style>
</div>
```