## `<svelte:window>` Element

Adds event listeners to the `window` object with automatic cleanup on component destruction and SSR safety.

**Usage:**
```svelte
<script>
	function handleKeydown(event) {
		alert(`pressed the ${event.key} key`);
	}
</script>

<svelte:window onkeydown={handleKeydown} />
```

**Bindable Properties:**
- `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight` (readonly)
- `scrollX`, `scrollY` (writable)
- `online` (alias for `window.navigator.onLine`, readonly)
- `devicePixelRatio` (readonly)

**Binding Example:**
```svelte
<svelte:window bind:scrollY={y} />
```

**Constraints:**
- Must appear at the top level of component only
- Cannot be inside blocks or elements
- `scrollX` and `scrollY` binding does not scroll to initial value; only subsequent changes trigger scrolling. Use `scrollTo()` in `$effect` if you need to scroll on render.