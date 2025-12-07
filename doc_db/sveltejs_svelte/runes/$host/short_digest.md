`$host` rune accesses the host element in custom element components, enabling custom event dispatch:

```svelte
<svelte:options customElement="my-stepper" />
<script>
	function dispatch(type) {
		$host().dispatchEvent(new CustomEvent(type));
	}
</script>
```