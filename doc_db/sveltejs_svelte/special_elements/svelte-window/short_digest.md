## `<svelte:window>`

Attach window event listeners and bind to window properties with automatic cleanup.

**Event listeners:** `<svelte:window onevent={handler} />`

**Bindable properties:** `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`, `scrollX`, `scrollY`, `online`, `devicePixelRatio` (only `scrollX`/`scrollY` are writable)

**Example:**
```svelte
<svelte:window onkeydown={handleKeydown} bind:scrollY={y} />
```

Must be at component top level. Initial scroll values don't trigger scrolling; use `scrollTo()` in `$effect` if needed.