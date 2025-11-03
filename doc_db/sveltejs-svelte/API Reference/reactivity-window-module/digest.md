The `svelte/reactivity/window` module provides reactive wrappers for window values like `innerWidth` and `innerHeight`. Each export has a `current` property that can be used in reactive contexts (templates, deriveds, effects) without needing `<svelte:window>` bindings or manual event listeners.

```svelte
<script>
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
</script>

<p>{innerWidth.current}x{innerHeight.current}</p>
```