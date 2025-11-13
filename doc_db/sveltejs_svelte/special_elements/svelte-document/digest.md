The `<svelte:document>` element allows you to attach event listeners to the `document` object and use actions on it. This is useful for events that don't fire on `window`, such as `visibilitychange`.

Usage:
```svelte
<svelte:document onevent={handler} />
<svelte:document bind:prop={value} />
<svelte:document onvisibilitychange={handleVisibilityChange} use:someAction />
```

The element must appear only at the top level of your component and cannot be inside blocks or elements.

You can bind to these readonly properties:
- `activeElement`
- `fullscreenElement`
- `pointerLockElement`
- `visibilityState`