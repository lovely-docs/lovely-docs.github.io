## `<svelte:window>`

Attaches event listeners to `window` with automatic cleanup and SSR safety.

**Event listeners:**
```svelte
<svelte:window onkeydown={handleKeydown} />
```

**Bindable properties:** `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`, `scrollX`, `scrollY`, `online`, `devicePixelRatio`

```svelte
<svelte:window bind:scrollY={y} />
```

**Constraints:** Top-level only. `scrollX`/`scrollY` binding doesn't scroll to initial value.