## `<svelte:document>` Element

Allows you to attach event listeners and actions to the `document` object, similar to `<svelte:window>`.

### Usage

Add event listeners to document events:
```svelte
<svelte:document onvisibilitychange={handleVisibilityChange} use:someAction />
```

Bind to document properties:
```svelte
<svelte:document bind:prop={activeElement} />
```

### Bindable Properties

All readonly:
- `activeElement` - currently focused element
- `fullscreenElement` - element in fullscreen mode
- `pointerLockElement` - element with pointer lock
- `visibilityState` - document visibility state

### Rules

- May only appear at the top level of your component
- Must never be inside a block or element
- Useful for events that don't fire on `window`, like `visibilitychange`