Add event listeners and actions to `document`. Bindable readonly properties: `activeElement`, `fullscreenElement`, `pointerLockElement`, `visibilityState`. Must be at component top level.

```svelte
<svelte:document onvisibilitychange={handleVisibilityChange} use:someAction bind:visibilityState={state} />
```