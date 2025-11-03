## `<svelte:document>`

Attach event listeners and actions to `document`. Bind to readonly properties: `activeElement`, `fullscreenElement`, `pointerLockElement`, `visibilityState`.

```svelte
<svelte:document onvisibilitychange={handler} bind:activeElement={el} use:action />
```

Must be at component top level, never inside blocks or elements.