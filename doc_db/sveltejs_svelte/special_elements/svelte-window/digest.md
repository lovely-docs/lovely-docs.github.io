## `<svelte:window>` Element

The `<svelte:window>` element attaches event listeners to the `window` object with automatic cleanup on component destruction and SSR safety.

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
- `scrollX`, `scrollY` (writable - control page scroll position)
- `online` (alias for `window.navigator.onLine`, readonly)
- `devicePixelRatio` (readonly)

```svelte
<svelte:window bind:scrollY={y} />
```

**Constraints:**
- Must appear at the top level of component only (not inside blocks or elements)
- `scrollX` and `scrollY` won't scroll to initial value on mount (use `$effect` with `scrollTo()` if needed)
- All properties except `scrollX`/`scrollY` are readonly