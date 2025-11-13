## `<svelte:window>`

Attach event listeners to `window` with automatic cleanup and SSR safety.

```svelte
<svelte:window onkeydown={handleKeydown} />
<svelte:window bind:scrollY={y} />
```

Bindable properties: `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`, `scrollX`, `scrollY`, `online`, `devicePixelRatio`. Only `scrollX`/`scrollY` are writable. Must be at component top level.