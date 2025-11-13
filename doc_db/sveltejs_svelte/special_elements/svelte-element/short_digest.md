## `<svelte:element>`

Renders a runtime-determined DOM element tag via the `this` prop. Supports properties and event listeners, but only `bind:this` binding. Throws error if void element has children. Use `xmlns` attribute to specify namespace explicitly.

```svelte
<svelte:element this={tag} />
```